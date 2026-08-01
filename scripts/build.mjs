/**
 * build.mjs — Prerender Build Script
 *
 * MENTOR NOTE:
 * Runs in CI (GitHub Actions), BEFORE the Pages artifact is uploaded.
 * It reads the same data/*.json files main.js fetches at runtime, and
 * writes the same HTML (via the shared render-templates.mjs functions)
 * directly into index.html / projects.html / about.html — mutating the
 * files in the CI checkout only, never committed back to the repo.
 *
 * Result: crawlers see real content on first pass. Browsers still run
 * main.js afterward for interactivity (search/filter/sort) — it just
 * re-renders over content that was never actually empty to begin with.
 *
 * ASSUMPTION: this script runs with CWD = repo root (i.e. the folder
 * that directly contains index.html, data/, assets/). Confirm this
 * matches your actual repo layout before wiring it into deploy.yml.
 */

import fs from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';
import {
  renderProjectsHTML,
  renderExperienceHTML,
  renderGroupedSkillsHTML,
  renderSkillsMarqueeHTML,
  renderAcademicHTML,
  renderCertificatesHTML,
  renderLabsHTML
} from '../assets/js/render-templates.mjs';

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, 'data');

function loadJSON(name) {
  return JSON.parse(fs.readFileSync(path.join(DATA_DIR, name), 'utf8'));
}

const projects = loadJSON('projects.json');
const skills = loadJSON('skills.json');
const experience = loadJSON('experience.json');
const certificates = loadJSON('certificates.json');
const labPlatforms = loadJSON('labplatforms.json');
const academic = loadJSON('academic.json');

/**
 * Loads an HTML file, replaces the innerHTML of each given selector,
 * writes it back in place.
 */
function injectInto(filePath, replacements) {
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠ Skipped (not found): ${filePath}`);
    return;
  }

  const html = fs.readFileSync(filePath, 'utf8');
  const $ = cheerio.load(html, { decodeEntities: false });

  for (const [selector, content] of Object.entries(replacements)) {
    const el = $(selector);
    if (el.length === 0) {
      console.warn(`  ⚠ Selector not found in ${path.basename(filePath)}: ${selector}`);
      continue;
    }
    el.html(content);
  }

  fs.writeFileSync(filePath, $.html());
  console.log(`✔ Prerendered ${path.basename(filePath)}`);
}

/**
 * Appends a SoftwareSourceCode ItemList JSON-LD block into <head>,
 * so search engines get structured data for each project — not just
 * the top-level Person schema you already have.
 */
function injectProjectSchema(filePath, projectsList) {
  if (!fs.existsSync(filePath)) return;

  const html = fs.readFileSync(filePath, 'utf8');
  const $ = cheerio.load(html, { decodeEntities: false });

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": projectsList.map((p, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "item": {
        "@type": "SoftwareSourceCode",
        "name": p.title,
        "description": p.description,
        "programmingLanguage": p.techStack,
        "codeRepository": p.githubUrl || undefined,
        "url": p.liveUrl || p.githubUrl || undefined
      }
    }))
  };

  $('head').append(`\n  <script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n  </script>\n`);
  fs.writeFileSync(filePath, $.html());
  console.log(`✔ Injected project JSON-LD into ${path.basename(filePath)}`);
}

// -------------------------------------------------------------------------
// index.html
// -------------------------------------------------------------------------
injectInto(path.join(ROOT, 'index.html'), {
  '#featured-projects-grid': renderProjectsHTML(projects.filter(p => p.featured)),
  '#experience-timeline': renderExperienceHTML(experience),
  '#total-projects-stat': String(projects.length),
});

// -------------------------------------------------------------------------
// projects.html
// -------------------------------------------------------------------------
injectInto(path.join(ROOT, 'projects.html'), {
  '#projects-list-container': renderProjectsHTML(projects),
  '#academic-list-container': renderAcademicHTML(academic),
  '#skills-marquee-track': renderSkillsMarqueeHTML(skills),
  '#projects-list-count-badge': `${projects.length} total`,
  '#projects-total-count': String(projects.length),
});
injectProjectSchema(path.join(ROOT, 'projects.html'), projects);

// -------------------------------------------------------------------------
// about.html
// -------------------------------------------------------------------------
injectInto(path.join(ROOT, 'about.html'), {
  '#grouped-skills-container': renderGroupedSkillsHTML(skills),
  '#cert-grid-container': renderCertificatesHTML(certificates),
  '#lab-grid-container': renderLabsHTML(labPlatforms),
});

console.log('\nBuild complete — static HTML now contains real content for crawlers.');
