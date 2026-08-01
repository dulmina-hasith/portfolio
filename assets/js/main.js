/**
 * main.js — Client-Side Application Controller
 *
 * MENTOR ARCHITECTURE LESSON (updated):
 * The actual card/timeline/badge HTML is no longer generated in this file.
 * It now lives in render-templates.mjs and is imported below, so the exact
 * same rendering logic is shared with build.mjs (the Node script that
 * prerenders this content into static HTML at deploy time for SEO).
 *
 * IMPORTANT: because this file now uses `import`, the <script> tag loading
 * it must be updated to `<script type="module" src="assets/js/main.js"></script>`
 * in index.html, projects.html, about.html, and contact.html.
 *
 * BROWSER SECURITY & OFFLINE-FIRST EXCELLENCE:
 * Standard fetch() operations fail when opening static pages via the 'file://'
 * protocol due to the browser's Same-Origin Policy (CORS). To ensure recruiters
 * can double-click index.html locally and see all your data, we implement a
 * dual-mode system: we try to fetch JSON, and fallback to pre-baked local data
 * if the fetch fails.
 */

import {
  renderProjectsHTML,
  renderExperienceHTML,
  renderGroupedSkillsHTML,
  renderSkillsMarqueeHTML,
  renderAcademicHTML,
  renderCertificatesHTML,
  renderLabsHTML
} from './render-templates.mjs';

// =========================================================================
// LOCAL STATIC FALLBACK DATA (For file:// local viewing)
// =========================================================================
const FALLBACK_DATA = {
  projects: [
    {
      "id": 5,
      "title": "NexusCore-SLIATE",
      "description": "Building Technical Culture Beyond the Classroom Student-led technical community focused on Software Engineering, Cybersecurity, Open Source, Git, AI, Linux, and collaborative development.",
      "techStack": "Founder & Community Technical Lead",
      "githubUrl": "https://github.com/NexusCore-SLIATE",
      "liveUrl": "https://www.nexuscore.webredirect.org/",
      "featured": true,
      "certificateName": "",
      "certificateUrl": ""
    },
    {
      "id": 4,
      "title": "SentinelX",
      "description": "A real-time Linux host intrusion detection system and security log auditor. Monitors authentication logs (/var/log/auth.log) for brute-force attacks, scans, and privilege escalation indicators, displaying events on an active dashboard with automatic alerting.",
      "techStack": "Python, Tkinter, Regular Expressions, Linux Security, Multi-threading",
      "githubUrl": "https://github.com/dulmina-hasith/SentinelX",
      "liveUrl": "",
      "featured": true,
      "certificateName": "",
      "certificateUrl": ""
    },
    {
      "id": 3,
      "title": "CTF Exploit Scripts & Writeups",
      "description": "Complete solutions, analysis, and custom automated bash tools for OverTheWire Bandit wargame levels 1 to 34. Showcases practical skills in file filtering, base64/hex transcoding, SSH key manipulation, process listening, and privilege escalation.",
      "techStack": "Bash, Python, Linux Administration, Cryptography, SSH",
      "githubUrl": "https://github.com/dulmina-hasith/OTW-Bandit-Solutions",
      "liveUrl": "https://overthewire.org/wargames/bandit/",
      "featured": true,
      "certificateName": "OverTheWire Bandit Completed",
      "certificateUrl": ""
    },
    {
      "id": 2,
      "title": "Retro Chess Engine",
      "description": "Browser-based chess game featuring a minimax AI with alpha-beta pruning. Supports three difficulty levels. Built with a custom flying-piece animation system and a retro aesthetic — fully playable in the browser with no dependencies.",
      "techStack": "JavaScript, HTML/CSS, Minimax AI",
      "githubUrl": "https://github.com/dulmina-hasith/retro_chess",
      "liveUrl": "https://dulmina-hasith.github.io/retro_chess/",
      "featured": false,
      "certificateName": "",
      "certificateUrl": ""
    },
    {
      "id": 1,
      "title": "GenAI-Inventory",
      "description": "A full-stack smart inventory management system built using Java JSP/Servlets with a Python Flask AI microservice and MySQL backend. The system handles authentication, inventory tracking, sales management, and reporting, while the AI layer provides restocking recommendations and sales trend analysis through REST APIs.",
      "techStack": "Java (JSP/Servlets), Python+(Flask API), MySQL",
      "githubUrl": "https://github.com/dulmina-hasith/GenAI-Inventory",
      "liveUrl": "",
      "featured": true,
      "certificateName": "",
      "certificateUrl": ""
    }
  ],
  skills: [
    { "id": 1, "name": "Frontend Development (HTML/CSS/JavaScript)", "category": "WEB DEVELOPMENT", "iconClass": "devicon-html5-plain" },
    { "id": 2, "name": "React Frontend Development", "category": "WEB DEVELOPMENT", "iconClass": "devicon-react-original" },
    { "id": 3, "name": "Backend Development (Java / Spring Boot)", "category": "BACKEND ENGINEERING", "iconClass": "devicon-java-plain" },
    { "id": 4, "name": "Backend Development (C#)", "category": "BACKEND ENGINEERING", "iconClass": "devicon-csharp-plain" },
    { "id": 5, "name": "Python Programming & Automation", "category": "PROGRAMMING", "iconClass": "devicon-python-plain" },
    { "id": 6, "name": "Database Design & Management (MySQL / MongoDB)", "category": "DATABASES", "iconClass": "devicon-mysql-plain" },
    { "id": 7, "name": "REST API Development & Integration", "category": "BACKEND ENGINEERING", "iconClass": "devicon-nodejs-plain" },
    { "id": 8, "name": "Git Version Control & Collaboration", "category": "DEVELOPER TOOLS", "iconClass": "devicon-git-plain" },
    { "id": 9, "name": "Linux Command Line & System Operations", "category": "SYSTEMS ENGINEERING", "iconClass": "devicon-linux-plain" },
    { "id": 10, "name": "Docker Containerization", "category": "DEVOPS", "iconClass": "devicon-docker-plain" },
    { "id": 11, "name": "Secure Network Analysis (Nmap / Wireshark)", "category": "CYBERSECURITY", "iconClass": "devicon-kalilinux-plain" },
    { "id": 12, "name": "Web Application Security Fundamentals", "category": "CYBERSECURITY", "iconClass": "devicon-shield-plain" }
  ],
  experience: [
    { "id": 5, "role": "Founder & Lead Developer", "company": "NexusCore", "duration": "2026 — Present", "description": "Leading the design and development of NexusCore, a scalable software platform from concept to deployment. Responsible for system architecture, backend services, frontend development, authentication, database engineering, DevOps, and ongoing feature development." },
    { "id": 4, "role": "Security Projects Developer", "company": "Personal & GitHub Projects", "duration": "2026 — Present", "description": "Developing SentinelX, a Linux-based real-time intrusion detection and log monitoring tool. The system uses automated log parsing and anomaly detection to surface suspicious activity and present it through a clean GUI interface." },
    { "id": 3, "role": "Cybersecurity Trainee", "company": "TryHackMe & Hack The Box (Self-directed)", "duration": "2025 — Present", "description": " Engaging in structured hands-on labs covering penetration testing, vulnerability assessment, privilege escalation, and digital forensics. Automating reconnaissance workflows using Python and Bash. Completed OverTheWire Bandit wargame series." },
    { "id": 2, "role": "IT Lab Assistant", "company": "Sri Lanka Institute of Advanced Technological Education (SLAITE)/Badulla", "duration": "2024 — Present", "description": "Responsible for maintaining and supporting over 30+ computer systems in a structured academic lab environment. Ensured system availability, troubleshooting hardware/software issues, and assisting users with technical operations. Gained hands-on experience in system stability, diagnostics, and basic network support." },
    { "id": 1, "role": "IT Lab Assistant", "company": "B/Dharmapala Maha Vidyalaya/Bandarawela", "duration": "2019 — 2022", "description": "Supported daily ICT lab operations including system setup, maintenance, and student assistance during practical sessions. Assisted in troubleshooting basic hardware and software issues and ensured smooth lab functionality during academic use." }
  ],
  certificates: [],
  labplatforms: [
    { "id": 1, "name": "TryHackMe", "profileUrl": "https://tryhackme.com/p/dulmina3343", "progress": "Rank Top 65% [APPRENTICE]", "iconClass": "devicon-googlecloud-plain" },
    { "id": 2, "name": "HackTheBox", "profileUrl": "https://profile.hackthebox.com/profile/019eb5dd-c783-721a-acbf-fd4cd3803db5", "progress": "Rank: Beginner · 3 Active Machines Solved", "iconClass": "devicon-kalilinux-original" },
    { "id": 3, "name": "OverTheWire", "profileUrl": "https://github.com/dulmina-hasith/ctf-exploit-scripts-writeups", "progress": "Bandit Level 25 completed", "iconClass": "devicon-ssh-original" },
    { "id": 4, "name": "pwn.college", "profileUrl": "https://github.com/dulmina-hasith/ctf-exploit-scripts-writeups", "progress": "Start Here - 50%", "iconClass": "devicon-babylonjs-plain colored" }
  ],
  academic: [
    { "id": 2, "title": "ATI-Badulla Web Portal (Java JSP/Servlet-Based CMS System)", "description": "Full-stack academic web application using Java Servlets and JSP with MySQL integration. Public-facing institutional website and secure admin dashboard with dynamic notices, image gallery management, course publishing, student results, and session-based authentication.", "institution": "SLIATE", "year": "2026", "field": "Full-Stack Java Web Development", "type": "Academic Project", "tags": "Java Servlets, JSP, MySQL, JDBC, Apache Tomcat, Bootstrap 5, MVC Architecture", "link": "https://github.com/dulmina-hasith/ATI-Badulla-Portal" },
    { "id": 1, "title": "Exploring Research Trends and Innovations in Explainable Artificial Intelligence (XAI) for Oncology Medical Imaging", "description": "A systematic literature review analysing six high-impact studies on XAI in cancer diagnostics. Covers Vision Mamba architectures, Knowledge Distillation, SHAP-based explainability, and multimodal prognostic modelling.", "institution": "SLIATE", "year": "2024", "field": "Artificial Intelligence", "type": "Research Paper", "tags": "XAI, Deep Learning, Medical Imaging, Literature Review", "link": "https://drive.google.com/file/d/1YvdVs6-kiWfzJdpDk3RUKuTLSV9aVV7G/view?usp=drive_link" }
  ]
};

// =========================================================================
// DATA FETCH HELPER
// =========================================================================
async function loadData(endpoint, fallbackKey) {
  try {
    const response = await fetch(`data/${endpoint}`);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn(`Fetch failed for 'data/${endpoint}' (possibly file:// protocol or offline). Falling back to static data.`, error);
    return FALLBACK_DATA[fallbackKey];
  }
}

// =========================================================================
// APPLICATION INITIALIZATION
// =========================================================================
document.addEventListener('DOMContentLoaded', async () => {
  initMobileNav();
  checkContactSuccessParam();
  initEmailClipboard();
  initContactFormValidation();
  await renderPageData();
});

// =========================================================================
// UI CONTROLLERS
// =========================================================================
function initMobileNav() {
  const navToggle = document.getElementById('nav-toggle');
  const navLinks  = document.getElementById('nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen.toString());
    });

    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', (e) => {
      if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

function checkContactSuccessParam() {
  const urlParams = new URLSearchParams(window.location.search);
  const successAlert = document.getElementById('success-alert');
  if (successAlert && urlParams.get('success') === 'true') {
    successAlert.style.display = 'block';
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}

function initEmailClipboard() {
  const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
  emailLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      if (navigator.clipboard) {
        e.preventDefault();
        const email = link.href.replace('mailto:', '');

        navigator.clipboard.writeText(email).then(() => {
          const original = link.innerHTML;
          link.innerHTML = 'Copied!';
          link.style.color = 'var(--success)';

          setTimeout(() => {
            link.innerHTML = original;
            link.style.color = '';
          }, 1800);
        }).catch(() => {
          window.location.href = link.href;
        });
      }
    });
  });
}

function initContactFormValidation() {
  const form = document.getElementById('contact-email-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    let isValid = true;

    form.querySelectorAll('.field-error').forEach(el => el.remove());
    form.querySelectorAll('.form-input').forEach(el => el.classList.remove('error'));

    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const subject = document.getElementById('subject');
    const message = document.getElementById('message');

    if (name && !name.value.trim()) {
      showError(name, 'Full Name is required');
      isValid = false;
    }

    if (email) {
      const emailValue = email.value.trim();
      if (!emailValue) {
        showError(email, 'Email address is required');
        isValid = false;
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailValue)) {
          showError(email, 'Please enter a valid email address');
          isValid = false;
        }
      }
    }

    if (subject && !subject.value.trim()) {
      showError(subject, 'Subject is required');
      isValid = false;
    }

    if (message && !message.value.trim()) {
      showError(message, 'Message is required');
      isValid = false;
    }

    if (!isValid) {
      e.preventDefault();
    }
  });

  function showError(inputElement, errorMessage) {
    inputElement.classList.add('error');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = errorMessage;
    inputElement.parentNode.appendChild(errorDiv);
  }
}

/**
 * Main Controller for Loading and Rendering Page Components
 * NOTE: all HTML generation now delegates to render-templates.mjs
 */
async function renderPageData() {
  const totalProjectsStat = document.getElementById('total-projects-stat');
  const projectsTotalCount = document.getElementById('projects-total-count');

  const projects = await loadData('projects.json', 'projects');
  const skills = await loadData('skills.json', 'skills');
  const experience = await loadData('experience.json', 'experience');
  const certificates = await loadData('certificates.json', 'certificates');
  const labPlatforms = await loadData('labplatforms.json', 'labplatforms');
  const academic = await loadData('academic.json', 'academic');

  if (totalProjectsStat) totalProjectsStat.textContent = projects.length;
  if (projectsTotalCount) projectsTotalCount.textContent = projects.length;

  // --- Home Page (index.html) ---
  const featuredGrid = document.getElementById('featured-projects-grid');
  if (featuredGrid) {
    const featuredProjects = projects.filter(p => p.featured);
    featuredGrid.innerHTML = renderProjectsHTML(featuredProjects);
  }

  const expTimeline = document.getElementById('experience-timeline');
  if (expTimeline) {
    expTimeline.innerHTML = renderExperienceHTML(experience);
  }

  // --- Projects Page (projects.html) ---
  const projectsListContainer = document.getElementById('projects-list-container');
  const countBadge = document.getElementById('projects-list-count-badge');
  if (projectsListContainer) {
    if (countBadge) countBadge.textContent = `${projects.length} total`;

    const searchInput = document.getElementById('project-search');
    const filterFeatured = document.getElementById('project-filter-featured');
    const sortSelect = document.getElementById('project-sort');

    const updateProjectsUI = () => {
      let filtered = [...projects];

      if (searchInput && searchInput.value.trim() !== "") {
        const query = searchInput.value.toLowerCase().trim();
        filtered = filtered.filter(p =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.techStack.toLowerCase().includes(query)
        );
      }

      if (filterFeatured && filterFeatured.value === "featured") {
        filtered = filtered.filter(p => p.featured);
      }

      if (sortSelect) {
        const sortBy = sortSelect.value;
        if (sortBy === "title-az") {
          filtered.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortBy === "title-za") {
          filtered.sort((a, b) => b.title.localeCompare(a.title));
        } else {
          filtered.sort((a, b) => a.id - b.id);
        }
      }

      projectsListContainer.innerHTML = renderProjectsHTML(filtered);
      if (countBadge) countBadge.textContent = `${filtered.length} total`;
    };

    if (searchInput) searchInput.addEventListener('input', updateProjectsUI);
    if (filterFeatured) filterFeatured.addEventListener('change', updateProjectsUI);
    if (sortSelect) sortSelect.addEventListener('change', updateProjectsUI);

    updateProjectsUI();
  }

  const academicContainer = document.getElementById('academic-list-container');
  if (academicContainer) {
    academicContainer.innerHTML = renderAcademicHTML(academic);
  }

  const marqueeTrack = document.getElementById('skills-marquee-track');
  if (marqueeTrack) {
    marqueeTrack.innerHTML = renderSkillsMarqueeHTML(skills);
  }

  // --- About Page (about.html) ---
  const groupedSkillsContainer = document.getElementById('grouped-skills-container');
  if (groupedSkillsContainer) {
    groupedSkillsContainer.innerHTML = renderGroupedSkillsHTML(skills);
  }

  const certContainer = document.getElementById('cert-grid-container');
  if (certContainer) {
    certContainer.innerHTML = renderCertificatesHTML(certificates);
  }

  const labContainer = document.getElementById('lab-grid-container');
  if (labContainer) {
    labContainer.innerHTML = renderLabsHTML(labPlatforms);
  }

  initScrollSpy();
}

// =========================================================================
// DOM HELPER UTILITIES
// =========================================================================
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const sidebarLinks = document.querySelectorAll('.sidebar-nav-link[href^="#"]');

  if (sections.length > 0 && sidebarLinks.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            sidebarLinks.forEach(link => {
              link.classList.toggle(
                'active',
                link.getAttribute('href') === `#${id}`
              );
            });
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '-60px 0px 0px 0px'
      }
    );

    sections.forEach(section => observer.observe(section));
  }
}