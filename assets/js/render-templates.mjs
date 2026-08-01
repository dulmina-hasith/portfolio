/**
 * render-templates.mjs — Shared HTML Rendering Logic
 *
 * MENTOR NOTE:
 * These functions are intentionally "pure" — they take data in, return an
 * HTML string out, and touch nothing else (no `document`, no DOM writes).
 * That's what lets the exact same code run in two completely different
 * environments:
 *
 *   1. The BROWSER, at runtime — main.js imports these and does
 *      `container.innerHTML = renderProjectsHTML(projects)`.
 *   2. NODE, at build time — build.mjs imports these and writes the
 *      returned string directly into the static HTML files before deploy.
 *
 * If you ever need to change how a project card looks, you change it here,
 * once, and both the live site AND the crawler-visible prerendered HTML
 * update together. Do not duplicate this logic anywhere else.
 */

export function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g,
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

export function renderProjectsHTML(projectsList) {
  if (projectsList.length === 0) {
    return `
      <div class="card-body text-muted" style="text-align: center; padding: 40px; grid-column: 1 / -1;">
        <p style="font-size: 0.85rem; margin: 0;">No projects found matching the filter.</p>
      </div>
    `;
  }

  return projectsList.map((project, index) => {
    const tagsHTML = project.techStack
      ? project.techStack.split(',').map(tag => `<span class="project-tag">${escapeHTML(tag.trim())}</span>`).join('')
      : '';

    const githubLink = project.githubUrl
      ? `<a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="project-link">GitHub &nearr;</a>`
      : '';
    const liveLink = project.liveUrl
      ? `<a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="project-link">Live &nearr;</a>`
      : '';
    const certLink = project.certificateUrl
      ? `<a href="${project.certificateUrl}" target="_blank" rel="noopener noreferrer" class="project-link" title="${escapeHTML(project.certificateName)}">
           <span>${escapeHTML(project.certificateName || 'Certificate')}</span> &nearr;
         </a>`
      : '';

    const featuredBadge = project.featured
      ? `<span class="label label-glow" style="font-size: 0.6rem;">Featured</span>`
      : '';

    return `
      <div class="project-item fade-in" style="animation-delay: ${index * 60}ms;">
        <div>
          <div class="flex items-center gap-sm mb-md" style="margin-bottom: 6px;">
            <span class="text-dim" style="font-size: 0.65rem; letter-spacing: 0.1em;">#${index + 1}</span>
            ${featuredBadge}
          </div>
          <h3 class="project-name">${escapeHTML(project.title)}</h3>
          <p class="project-desc">${escapeHTML(project.description)}</p>
          <div class="project-tags">
            ${tagsHTML}
          </div>
        </div>
        <div class="project-links">
          ${githubLink}
          ${liveLink}
          ${certLink}
        </div>
      </div>
    `;
  }).join('');
}

export function renderExperienceHTML(experienceList) {
  if (experienceList.length === 0) {
    return `<div class="card-body text-muted" style="text-align: center;">No experience entries available.</div>`;
  }

  return experienceList.map(exp => `
    <div class="timeline-item">
      <div class="timeline-dot">
        <div class="timeline-dot-circle"></div>
        <div class="timeline-dot-line"></div>
      </div>
      <div class="timeline-body">
        <h3 class="timeline-role" style="margin: 0; font-size: 1.1rem; color: var(--accent);">${escapeHTML(exp.role)}</h3>
        <p class="timeline-company" style="margin: 4px 0 2px; font-weight: 500;">${escapeHTML(exp.company)}</p>
        <p class="timeline-date" style="margin: 0 0 8px; font-size: 0.75rem; color: var(--text-dim);">${escapeHTML(exp.duration)}</p>
        <p class="timeline-desc" style="margin: 0; line-height: 1.6; font-size: 0.85rem;">${escapeHTML(exp.description)}</p>
      </div>
    </div>
  `).join('');
}

export function renderGroupedSkillsHTML(skillsList) {
  if (skillsList.length === 0) {
    return `<div class="card-body text-muted" style="text-align: center;">No technical skills available.</div>`;
  }

  const grouped = {};
  skillsList.forEach(skill => {
    if (!grouped[skill.category]) grouped[skill.category] = [];
    grouped[skill.category].push(skill);
  });

  let html = '';
  for (const category in grouped) {
    const badges = grouped[category].map(s => `<span class="skill-tag">${escapeHTML(s.name)}</span>`).join('');
    html += `
      <div class="skill-group" style="margin-bottom: var(--sp-md);">
        <h3 class="skill-group-title" style="font-size: 0.9rem; letter-spacing: 0.1em; color: var(--accent); text-transform: uppercase; margin-bottom: 8px;">${escapeHTML(category)}</h3>
        <div class="skill-tags">
          ${badges}
        </div>
      </div>
    `;
  }
  return html;
}

export function renderSkillsMarqueeHTML(skillsList) {
  if (skillsList.length === 0) {
    return `<span class="text-muted">No skills available.</span>`;
  }

  const badges = skillsList.map(skill => {
    const icon = skill.iconClass ? `<i class="${skill.iconClass}" aria-hidden="true" style="margin-right: 6px;"></i>` : '';
    return `
      <div class="skill-badge">
        ${icon}
        <span>${escapeHTML(skill.name)}</span>
      </div>
    `;
  }).join('');

  // Duplicated for continuous scroll loop — same behavior as the original client render
  return badges + badges;
}

export function renderAcademicHTML(academicList) {
  if (academicList.length === 0) {
    return `
      <div class="card" style="text-align: center; padding: 20px;">
        <p class="text-muted">No academic entries found.</p>
      </div>
    `;
  }

  return academicList.map(item => {
    const tagBadges = item.tags
      ? item.tags.split(',').map(t => `<span class="project-tag">${escapeHTML(t.trim())}</span>`).join('')
      : '';
    const linkHTML = item.link
      ? `<a href="${item.link}" target="_blank" rel="noopener noreferrer" class="project-link">Read / View ↗</a>`
      : '';

    return `
      <div class="card" style="margin-bottom: 16px;">
        <div class="card-body">
          <p style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-dim); margin: 0 0 6px 0;">
            ${escapeHTML(item.type)} · ${escapeHTML(item.institution)} · ${escapeHTML(item.year)} · ${escapeHTML(item.field)}
          </p>
          <h3 style="font-family: var(--font-display); font-size: 1.1rem; margin: 8px 0; color: var(--text-light); line-height: 1.4;">
            ${escapeHTML(item.title)}
          </h3>
          <p class="text-muted" style="font-size: 0.85rem; line-height: 1.7; margin: 0 0 12px 0;">
            ${escapeHTML(item.description)}
          </p>
          <div class="flex flex-wrap gap-sm" style="margin-bottom: 12px;">
            ${tagBadges}
          </div>
          ${linkHTML}
        </div>
      </div>
    `;
  }).join('');
}

export function renderCertificatesHTML(certsList) {
  if (certsList.length === 0) {
    return `
      <div class="empty-state" style="color: var(--text-muted); text-align: center; padding: var(--sp-md); border: 1px dashed var(--border); border-radius: var(--radius-md); grid-column: 1 / -1;">
        No certificates available.
      </div>
    `;
  }

  return certsList.map(cert => {
    const badgeLabel = cert.status === 'ACQUIRED' ? 'Acquired (Verified)' : 'Pending (In Progress)';
    const statusClass = cert.status === 'ACQUIRED' ? 'status-acquired' : 'status-pending';

    if (cert.verificationUrl) {
      return `
        <div class="cert-card-wrapper">
          <a href="${cert.verificationUrl}" target="_blank" rel="noopener noreferrer" class="cert-card clickable ${statusClass}">
            <div class="cert-header">
              <span class="cert-issuer">${escapeHTML(cert.issuer)}</span>
              <span class="cert-badge">${badgeLabel}</span>
            </div>
            <h3 class="cert-title">${escapeHTML(cert.title)}</h3>
            <div class="cert-verify-label">
              Verify Credential <span class="arrow">→</span>
            </div>
          </a>
        </div>
      `;
    } else {
      return `
        <div class="cert-card-wrapper">
          <div class="cert-card ${statusClass}">
            <div class="cert-header">
              <span class="cert-issuer">${escapeHTML(cert.issuer)}</span>
              <span class="cert-badge">${badgeLabel}</span>
            </div>
            <h3 class="cert-title">${escapeHTML(cert.title)}</h3>
          </div>
        </div>
      `;
    }
  }).join('');
}

export function renderLabsHTML(labsList) {
  if (labsList.length === 0) {
    return `
      <div class="empty-state" style="color: var(--text-muted); text-align: center; padding: var(--sp-md); border: 1px dashed var(--border); border-radius: var(--radius-md); grid-column: 1 / -1;">
        No learning labs available.
      </div>
    `;
  }

  return labsList.map(lab => {
    const iconClass = lab.iconClass || 'devicon-kalilinux-original colored';
    return `
      <div class="lab-card-wrapper">
        <a href="${lab.profileUrl}" target="_blank" rel="noopener noreferrer" class="lab-card clickable">
          <div class="lab-header">
            <div class="lab-platform-info">
              <i class="${iconClass} lab-icon" aria-hidden="true"></i>
              <span class="lab-name">${escapeHTML(lab.name)}</span>
            </div>
            <span class="lab-badge">Active Profile</span>
          </div>
          <div class="lab-progress-section">
            <div class="lab-progress-label">PROGRESS / STATUS</div>
            <div class="lab-progress-value">${escapeHTML(lab.progress)}</div>
          </div>
          <div class="lab-profile-label">
            View Public Profile <span class="arrow">→</span>
          </div>
        </a>
      </div>
    `;
  }).join('');
}
