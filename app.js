/* ============================================
   THE AI SANITY PLAN — Course Preview App
   ============================================ */

// Module definitions
const MODULES = {
  module_1: {
    num: '1',
    title: 'Foundation — What AI Actually Is (and Isn\'t)',
    shortTitle: 'Foundation',
    desc: 'How AI tools work, what they\'re good at, and the 80/20 rule that makes them useful for your business.',
    img: 'assets/artwork/module_1_foundation_v2.png',
    path: 'everyone',
    files: { beginner: 'content/module_1.md', intermediate: 'content/module_1.md' }
  },
  module_2: {
    num: '2',
    title: 'Your First Real AI Skills',
    shortTitle: 'First Skills (Beginner)',
    desc: 'Writing prompts that work, AI for email, content, research, operations, and avoiding common mistakes.',
    img: 'assets/artwork/module_2_beginner_v2.png',
    path: 'beginner',
    files: { beginner: 'content/module_2_beginner.md' }
  },
  module_3: {
    num: '3',
    title: 'Building AI Systems',
    shortTitle: 'AI Systems (Intermediate)',
    desc: 'Advanced prompting, workflow thinking, tool selection, quality control, and introduction to automation.',
    img: 'assets/artwork/module_3_intermediate_v2.png',
    path: 'intermediate',
    files: { intermediate: 'content/module_3_intermediate.md' }
  },
  module_4: {
    num: '4',
    title: 'AI in Your Business',
    shortTitle: 'Business AI',
    desc: 'Professional services, operations, marketing & sales, and financial tasks — practical applications you can use today.',
    img: 'assets/artwork/module_4_business_v2.png',
    path: 'both',
    files: { beginner: 'content/module_4_beginner.md', intermediate: 'content/module_4_intermediate.md' }
  },
  module_5: {
    num: '5',
    title: 'AI in Your Personal Life',
    shortTitle: 'Personal AI',
    desc: 'Productivity, family writing, learning, and personal growth — AI beyond the office.',
    img: 'assets/artwork/module_5_personal_v2.png',
    path: 'both',
    files: { beginner: 'content/module_5_beginner.md', intermediate: 'content/module_5_intermediate.md' }
  },
  module_6: {
    num: '6',
    title: 'AI for Fun & Creativity',
    shortTitle: 'Fun & Creative',
    desc: 'Creative projects, hobbies, entertainment — the reward module for having fun with AI.',
    img: 'assets/artwork/module_6_fun_v2.png',
    path: 'both',
    files: { beginner: 'content/module_6_beginner.md', intermediate: 'content/module_6_intermediate.md' }
  },
  module_7: {
    num: '7',
    title: 'Tools & Templates',
    shortTitle: 'Toolkit',
    desc: 'Your complete reference kit — prompt templates, tool guides, quality checklists, and implementation plans.',
    img: 'assets/artwork/module_7_tools_v2.png',
    path: 'both',
    files: { beginner: 'content/module_7_beginner.md', intermediate: 'content/module_7_intermediate.md' }
  },
  glossary: {
    num: 'G',
    title: 'AI Glossary',
    shortTitle: 'Glossary',
    desc: 'A plain-language guide to the AI terms you\'ll actually encounter — no jargon explained with more jargon.',
    img: null,
    path: 'everyone',
    files: { beginner: 'content/glossary.md', intermediate: 'content/glossary.md' }
  }
};

// State
let currentPath = 'beginner';
let currentPage = 'index';
let contentCache = {};
let lessonCache = {};

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // Check hash
  const hash = window.location.hash.slice(1);
  if (hash) {
    const parts = hash.split('/');
    if (parts[0] === 'intermediate' || parts[0] === 'beginner') {
      currentPath = parts[0];
      currentPage = parts[1] || 'index';
    } else {
      currentPage = parts[0] || 'index';
    }
  }
  
  updatePathUI();
  buildNav();
  navigate(currentPage);
});

window.addEventListener('hashchange', () => {
  const hash = window.location.hash.slice(1);
  if (hash) {
    const parts = hash.split('/');
    if (parts[0] === 'intermediate' || parts[0] === 'beginner') {
      if (parts[0] !== currentPath) {
        currentPath = parts[0];
        updatePathUI();
        buildNav();
      }
      currentPage = parts[1] || 'index';
    } else {
      currentPage = parts[0] || 'index';
    }
  } else {
    currentPage = 'index';
  }
  navigate(currentPage);
});

// ============================================
// PATH TOGGLE
// ============================================

function setPath(path) {
  currentPath = path;
  updatePathUI();
  buildNav();
  
  // If viewing a module that doesn't exist on this path, go to index
  if (currentPage !== 'index') {
    const mod = MODULES[currentPage];
    if (mod) {
      if (mod.path === 'beginner' && path === 'intermediate') {
        navigate('index');
        return;
      }
      if (mod.path === 'intermediate' && path === 'beginner') {
        navigate('index');
        return;
      }
    }
  }
  
  // Re-navigate to refresh content for the new path
  navigate(currentPage);
}

function updatePathUI() {
  document.getElementById('btn-beginner').classList.toggle('active', currentPath === 'beginner');
  document.getElementById('btn-intermediate').classList.toggle('active', currentPath === 'intermediate');
  document.getElementById('path-slider').classList.toggle('intermediate', currentPath === 'intermediate');
  
  const tag = document.getElementById('topbar-path-label');
  tag.textContent = currentPath === 'beginner' ? 'Beginner Path' : 'Intermediate Path';
  tag.style.background = currentPath === 'beginner' ? 'var(--accent-teal-bg)' : 'var(--accent-purple-bg)';
  tag.style.color = currentPath === 'beginner' ? 'var(--accent-teal)' : 'var(--accent-purple)';
  tag.style.borderColor = currentPath === 'beginner' ? 'var(--accent-teal-border)' : 'var(--accent-purple-border)';
}

// ============================================
// NAVIGATION
// ============================================

function getVisibleModules() {
  return Object.entries(MODULES).filter(([key, mod]) => {
    if (mod.path === 'everyone' || mod.path === 'both') return true;
    return mod.path === currentPath;
  });
}

function buildNav() {
  const nav = document.getElementById('sidebar-nav');
  const visible = getVisibleModules();
  
  let html = '';
  
  // Home link
  html += `
    <div class="nav-section">
      <button class="nav-module-btn ${currentPage === 'index' ? 'active' : ''}" onclick="navigate('index')">
        <span class="nav-module-num">
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M3 10l7-7 7 7M5 8.5V17h4v-4h2v4h4V8.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </span>
        <span class="nav-module-label">Course Overview</span>
      </button>
    </div>
  `;
  
  visible.forEach(([key, mod]) => {
    const isActive = currentPage === key;
    const lessons = lessonCache[key + '_' + currentPath] || [];
    
    html += `
      <div class="nav-section">
        <button class="nav-module-btn ${isActive ? 'active' : ''}" onclick="navigate('${key}')">
          <span class="nav-module-num">${mod.num}</span>
          <span class="nav-module-label">${mod.shortTitle}</span>
        </button>
        <div class="nav-lessons ${isActive ? 'expanded' : ''}" id="nav-lessons-${key}">
          ${lessons.map((l, i) => `
            <a class="nav-lesson-link" onclick="scrollToLesson('${l.id}')">${l.title}</a>
          `).join('')}
        </div>
      </div>
    `;
  });
  
  nav.innerHTML = html;
}

function navigate(page) {
  currentPage = page;
  window.location.hash = `${currentPath}/${page}`;
  
  if (page === 'index') {
    renderIndex();
  } else {
    renderModule(page);
  }
  
  buildNav();
  window.scrollTo(0, 0);
  
  // Close mobile sidebar
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-overlay').classList.remove('visible');
}

function scrollToLesson(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebar-overlay').classList.toggle('visible');
}

// ============================================
// INDEX PAGE
// ============================================

function renderIndex() {
  const area = document.getElementById('content-area');
  const visible = getVisibleModules().filter(([k]) => k !== 'glossary');
  const glossary = MODULES.glossary;
  
  const pathLabel = currentPath === 'beginner' ? 'Beginner' : 'Intermediate';
  const pathColor = currentPath === 'beginner' ? 'teal' : 'purple';
  
  let html = `
    <div class="overview-hero fade-in">
      <div class="overview-path-badge">
        <svg viewBox="0 0 16 16" fill="none"><path d="M2 8h12M10 4l4 4-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        ${pathLabel} Path
      </div>
      <h1>The <span>AI Sanity Plan</span></h1>
      <p>Your complete course for mastering AI in business and life — built for experienced professionals who want real results, not hype.</p>
    </div>
    
    <div class="module-grid fade-in">
  `;
  
  visible.forEach(([key, mod]) => {
    const lessonCount = getLessonCountEstimate(key);
    const pathBadge = mod.path === 'everyone' ? 'Everyone' : 
                      mod.path === 'both' ? `${pathLabel} Version` : 
                      `${pathLabel} Only`;
    
    html += `
      <div class="module-card" onclick="navigate('${key}')">
        ${mod.img ? `<img src="${mod.img}" alt="${mod.title}" class="module-card-img" loading="lazy">` : ''}
        <div class="module-card-body">
          <div class="module-card-num">Module ${mod.num}</div>
          <div class="module-card-title">${mod.title}</div>
          <div class="module-card-desc">${mod.desc}</div>
          <div class="module-card-lessons">
            <svg viewBox="0 0 16 16" fill="none"><path d="M2 4h12M2 8h8M2 12h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            ${lessonCount} lessons · ${pathBadge}
          </div>
        </div>
      </div>
    `;
  });
  
  // Glossary card
  html += `
    <div class="module-card" onclick="navigate('glossary')">
      <div style="width:100%;aspect-ratio:16/10;background:linear-gradient(135deg,var(--bg-tertiary),var(--bg-card-hover));display:flex;align-items:center;justify-content:center;">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <rect x="12" y="8" width="40" height="48" rx="4" stroke="var(--accent-teal)" stroke-width="2"/>
          <path d="M22 20h20M22 28h16M22 36h12M22 44h18" stroke="var(--accent-teal-dim)" stroke-width="1.5" stroke-linecap="round"/>
          <circle cx="48" cy="48" r="10" fill="var(--bg-primary)" stroke="var(--accent-teal)" stroke-width="2"/>
          <text x="48" y="53" text-anchor="middle" fill="var(--accent-teal)" font-size="14" font-weight="bold">A</text>
        </svg>
      </div>
      <div class="module-card-body">
        <div class="module-card-num">Reference</div>
        <div class="module-card-title">AI Glossary</div>
        <div class="module-card-desc">${glossary.desc}</div>
        <div class="module-card-lessons">
          <svg viewBox="0 0 16 16" fill="none"><path d="M2 4h12M2 8h8M2 12h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          A–Z terms · Everyone
        </div>
      </div>
    </div>
  `;
  
  html += '</div>';
  area.innerHTML = html;
}

function getLessonCountEstimate(key) {
  const counts = {
    module_1: 4, module_2: 6, module_3: 6,
    module_4: 4, module_5: 3, module_6: 3, module_7: 7
  };
  return counts[key] || 4;
}

// ============================================
// MODULE RENDERING
// ============================================

async function renderModule(moduleKey) {
  const mod = MODULES[moduleKey];
  if (!mod) { navigate('index'); return; }
  
  const area = document.getElementById('content-area');
  area.innerHTML = '<div class="loading-spinner"><div class="spinner"></div></div>';
  
  const file = mod.files[currentPath] || mod.files.beginner || mod.files.intermediate;
  if (!file) { navigate('index'); return; }
  
  try {
    const cacheKey = file;
    let markdown;
    if (contentCache[cacheKey]) {
      markdown = contentCache[cacheKey];
    } else {
      const resp = await fetch(file);
      markdown = await resp.text();
      contentCache[cacheKey] = markdown;
    }
    
    // Parse lessons for nav
    const lessons = extractLessons(markdown, moduleKey);
    lessonCache[moduleKey + '_' + currentPath] = lessons;
    buildNav();
    
    // Render
    const rendered = renderMarkdown(markdown, moduleKey);
    
    const pathBadgeClass = mod.path === 'everyone' ? 'everyone' : currentPath;
    const pathBadgeText = mod.path === 'everyone' ? 'Everyone' : 
                          currentPath === 'beginner' ? 'Beginner Path' : 'Intermediate Path';
    
    // Build navigation buttons
    const visibleMods = getVisibleModules();
    const currentIdx = visibleMods.findIndex(([k]) => k === moduleKey);
    const prevMod = currentIdx > 0 ? visibleMods[currentIdx - 1] : null;
    const nextMod = currentIdx < visibleMods.length - 1 ? visibleMods[currentIdx + 1] : null;
    
    let navButtons = '<div class="module-nav-buttons">';
    if (prevMod) {
      navButtons += `<a class="nav-btn" onclick="navigate('${prevMod[0]}')">
        <svg viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        ${prevMod[1].shortTitle}
      </a>`;
    } else {
      navButtons += `<a class="nav-btn" onclick="navigate('index')">
        <svg viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        Overview
      </a>`;
    }
    if (nextMod) {
      navButtons += `<a class="nav-btn" onclick="navigate('${nextMod[0]}')">
        ${nextMod[1].shortTitle}
        <svg viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </a>`;
    }
    navButtons += '</div>';
    
    area.innerHTML = `
      <div class="module-header fade-in">
        ${mod.img ? `<img src="${mod.img}" alt="${mod.title}" class="module-header-img">` : ''}
        <span class="path-badge ${pathBadgeClass}">${pathBadgeText}</span>
        <h1>Module ${mod.num}: ${mod.title}</h1>
      </div>
      <div class="md-content fade-in">
        ${rendered}
      </div>
      ${navButtons}
    `;
    
  } catch(e) {
    console.error('Error loading module:', e);
    area.innerHTML = `<div style="padding:40px;text-align:center;color:var(--text-muted);">
      <p>Error loading content. Please try again.</p>
      <a class="nav-btn" onclick="navigate('index')" style="margin-top:20px;display:inline-flex;">Back to Overview</a>
    </div>`;
  }
}

// ============================================
// LESSON EXTRACTION
// ============================================

function extractLessons(markdown, moduleKey) {
  const lessons = [];
  const lines = markdown.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    // Match # Lesson X.X: or # SECTION X.X: or ## Quiz or ## The Aha Move
    let match;
    
    match = line.match(/^#\s+(?:Lesson\s+)(\d+\.\d+):?\s*(.+)/i);
    if (match) {
      const id = 'lesson-' + match[1].replace('.', '-');
      lessons.push({ id, title: `Lesson ${match[1]}: ${match[2].trim()}` });
      continue;
    }
    
    match = line.match(/^#\s+SECTION\s+(\d+\.\d+(?:\/\d+\.\d+)?)\s*[:(]\s*(.+)/i);
    if (match) {
      const id = 'section-' + match[1].replace(/[./]/g, '-');
      lessons.push({ id, title: `Section ${match[1]}: ${match[2].replace(/\)$/, '').trim()}` });
      continue;
    }
    
    if (line.match(/^#+\s+.*Quiz/i) && !line.match(/^###/)) {
      const id = 'quiz-' + lessons.length;
      const title = line.replace(/^#+\s+/, '').replace(/[🎯📝]/g, '').trim();
      lessons.push({ id, title: title || 'Quiz' });
      continue;
    }
    
    if (line.match(/^##\s+🎯\s*The Aha Move/i)) {
      lessons.push({ id: 'aha-move', title: '🎯 The Aha Move' });
    }
  }
  
  return lessons;
}

// ============================================
// MARKDOWN RENDERING
// ============================================

function renderMarkdown(markdown, moduleKey) {
  // Configure marked
  marked.setOptions({
    gfm: true,
    breaks: false,
    headerIds: true,
  });
  
  // Pre-process: remove the first module title line (we show it in the header)
  let processed = markdown;
  const firstLineMatch = processed.match(/^#\s+(?:MODULE|Module)\s+\d.+\n/i);
  if (firstLineMatch) {
    processed = processed.slice(firstLineMatch[0].length);
  }
  
  // Render markdown
  let html = marked.parse(processed);
  
  // Post-process: style callout blockquotes
  html = processCallouts(html);
  
  // Post-process: style quizzes
  html = processQuizzes(html);
  
  // Post-process: style 15-minute wins (h2)
  html = processFifteenMinWins(html);
  
  // Post-process: style Aha Move sections
  html = processAhaMove(html);
  
  // Add IDs to lesson headers for scrolling
  html = addLessonIds(html);
  
  return html;
}

function processCallouts(html) {
  // Process blockquotes that contain specific callout patterns
  const div = document.createElement('div');
  div.innerHTML = html;
  
  const blockquotes = div.querySelectorAll('blockquote');
  blockquotes.forEach(bq => {
    const text = bq.textContent;
    const innerHTML = bq.innerHTML;
    
    if (text.match(/🗣️?\s*AI Ron Says/i) || text.match(/AI Ron Says/i)) {
      bq.className = 'callout-ai-ron-says';
      bq.innerHTML = `<div class="callout-label">🗣️ AI Ron Says</div>` + 
        innerHTML.replace(/<strong>🗣️?\s*AI Ron Says:?<\/strong>/gi, '')
                 .replace(/<strong>\s*AI Ron Says:?<\/strong>/gi, '')
                 .replace(/^<p>\s*"?\s*/, '<p>').trim();
    }
    else if (text.match(/👉?\s*AI Ron Recommends/i) || text.match(/AI Ron Recommends/i)) {
      bq.className = 'callout-ai-ron-recommends';
      bq.innerHTML = `<div class="callout-label">👉 AI Ron Recommends</div>` + 
        innerHTML.replace(/<strong>👉?\s*AI Ron Recommends:?<\/strong>/gi, '')
                 .replace(/<strong>\s*AI Ron Recommends:?<\/strong>/gi, '')
                 .replace(/^<p>\s*"?\s*/, '<p>').trim();
    }
    else if (text.match(/⚖️?\s*AI Ron'?s Rule/i) || text.match(/AI Ron'?s Rule/i)) {
      bq.className = 'callout-ai-rons-rule';
      bq.innerHTML = `<div class="callout-label">⚖️ AI Ron's Rule</div>` + 
        innerHTML.replace(/<strong>⚖️?\s*AI Ron'?s Rule:?<\/strong>/gi, '')
                 .replace(/<strong>\s*AI Ron'?s Rule:?<\/strong>/gi, '')
                 .replace(/^<p>\s*"?\s*/, '<p>').trim();
    }
    else if (text.match(/15-Minute Win/i) || text.match(/15‑Minute Win/i)) {
      bq.className = 'callout-15-min-win';
      bq.innerHTML = `<div class="callout-label">⏱ 15-Minute Win</div>` + 
        innerHTML.replace(/<strong>15-Minute Win:?[^<]*<\/strong>/gi, '')
                 .replace(/^<p>\s*"?\s*/, '<p>').trim();
    }
    else if (text.match(/⏱\s*Time Saved/i) || text.match(/Time Saved/i)) {
      bq.className = 'callout-time-saved';
      bq.innerHTML = `<div class="callout-label">⏱ Time Saved</div>` + 
        innerHTML.replace(/<strong>⏱?\s*Time Saved:?<\/strong>/gi, '')
                 .replace(/^<p>\s*"?\s*/, '<p>').trim();
    }
  });
  
  return div.innerHTML;
}

function processQuizzes(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  
  // Find quiz h2/h3 headers
  const headers = div.querySelectorAll('h2, h3');
  headers.forEach(header => {
    if (!header.textContent.match(/^\s*Quiz/i) && !header.textContent.match(/Module \d+ Quiz/i)) return;
    
    // Collect all siblings until the next h1/h2 or hr
    const quizElements = [];
    let el = header.nextElementSibling;
    while (el && !el.matches('h1, h2, hr')) {
      // Skip if it's an h3 that's not quiz related
      if (el.matches('h2')) break;
      quizElements.push(el);
      el = el.nextElementSibling;
    }
    
    // Parse quiz questions from collected elements
    const questions = parseQuizQuestions(quizElements);
    
    if (questions.length === 0) return;
    
    // Build quiz HTML
    const quizId = 'quiz-' + Math.random().toString(36).slice(2, 8);
    let quizHtml = `<div class="quiz-section" id="${quizId}"><h2>${header.textContent}</h2>`;
    
    questions.forEach((q, qi) => {
      quizHtml += `<div class="quiz-question">
        <div class="quiz-question-text">${q.text}</div>
        <div class="quiz-options">`;
      
      q.options.forEach((opt, oi) => {
        const letter = String.fromCharCode(65 + oi);
        quizHtml += `
          <div class="quiz-option ${opt.correct ? 'correct' : ''}">
            <span class="option-letter">${opt.correct ? '✓' : letter}</span>
            <span class="option-text">${opt.text}</span>
            <svg class="check-icon" width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M4 9l3.5 3.5L14 5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>`;
      });
      
      quizHtml += '</div>';
      
      if (q.explanation) {
        quizHtml += `<div class="quiz-explanation">${q.explanation}</div>`;
      }
      
      quizHtml += '</div>';
    });
    
    quizHtml += '</div>';
    
    // Replace header and elements
    const quizWrapper = document.createElement('div');
    quizWrapper.innerHTML = quizHtml;
    
    // Remove original elements
    quizElements.forEach(el => el.remove());
    header.replaceWith(quizWrapper.firstElementChild);
  });
  
  return div.innerHTML;
}

function parseQuizQuestions(elements) {
  const questions = [];
  let currentQ = null;
  
  elements.forEach(el => {
    const text = el.textContent.trim();
    const html = el.innerHTML;
    
    // Question: starts with **N. or is a <strong> numbered item
    const qMatch = text.match(/^\*?\*?(\d+)\.\s*(.+?)(?:\*?\*?)$/);
    if (el.tagName === 'P' && (html.includes('<strong>') && text.match(/^\d+\./))) {
      if (currentQ) questions.push(currentQ);
      const cleanText = html.replace(/<\/?strong>/g, '').replace(/^\d+\.\s*/, '');
      currentQ = { text: cleanText, options: [], explanation: '' };
      return;
    }
    
    // Options: list items with A) B) C) D) or - A) etc
    if (el.tagName === 'UL' && currentQ) {
      const items = el.querySelectorAll('li');
      items.forEach(li => {
        let optText = li.textContent.trim();
        const isCorrect = optText.includes('✓') || optText.includes('✔');
        optText = optText.replace(/^[A-D]\)\s*/, '').replace(/\s*[✓✔]\s*$/, '').trim();
        currentQ.options.push({ text: optText, correct: isCorrect });
      });
      return;
    }
    
    // Explanation: italic paragraph starting with "Why"
    if (el.tagName === 'P' && currentQ && (text.startsWith('Why ') || text.startsWith('*Why'))) {
      currentQ.explanation = text.replace(/^\*?\s*/, '').replace(/\*?\s*$/, '');
      return;
    }
  });
  
  if (currentQ && currentQ.options.length > 0) questions.push(currentQ);
  
  return questions;
}

function processFifteenMinWins(html) {
  // Look for ## 15-Minute Win sections and wrap them
  const div = document.createElement('div');
  div.innerHTML = html;
  
  const headers = div.querySelectorAll('h2');
  headers.forEach(header => {
    if (!header.textContent.match(/15-Minute Win|15‑Minute Win/i)) return;
    
    // Collect elements until next h1/h2
    const elements = [];
    let el = header.nextElementSibling;
    while (el && !el.matches('h1, h2')) {
      elements.push(el);
      el = el.nextElementSibling;
    }
    
    const wrapper = document.createElement('div');
    wrapper.className = 'fifteen-min-win';
    
    // Move elements into wrapper
    elements.forEach(child => wrapper.appendChild(child.cloneNode(true)));
    
    // Remove originals
    elements.forEach(child => child.remove());
    
    // Replace header with wrapper
    header.replaceWith(wrapper);
  });
  
  return div.innerHTML;
}

function processAhaMove(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  
  const headers = div.querySelectorAll('h2');
  headers.forEach(header => {
    if (!header.textContent.match(/Aha Move/i)) return;
    
    // Collect elements until next h1 or hr
    const elements = [];
    let el = header.nextElementSibling;
    while (el && !el.matches('h1, hr')) {
      elements.push(el);
      el = el.nextElementSibling;
    }
    
    const wrapper = document.createElement('div');
    wrapper.className = 'aha-move-section';
    wrapper.id = 'aha-move';
    wrapper.innerHTML = `
      <div class="aha-move-header">
        <img src="assets/artwork/aha_move_badge.png" alt="Aha Move" class="aha-move-badge-img">
        <div>
          <div class="aha-move-title">The Aha Move</div>
          <div class="aha-move-subtitle">Your hands-on challenge for this module</div>
        </div>
      </div>
    `;
    
    elements.forEach(child => wrapper.appendChild(child.cloneNode(true)));
    elements.forEach(child => child.remove());
    header.replaceWith(wrapper);
  });
  
  return div.innerHTML;
}

function addLessonIds(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  
  const headers = div.querySelectorAll('h1, h2');
  headers.forEach(header => {
    const text = header.textContent;
    
    let match = text.match(/Lesson\s+(\d+\.\d+)/i);
    if (match) {
      header.id = 'lesson-' + match[1].replace('.', '-');
      return;
    }
    
    match = text.match(/SECTION\s+(\d+\.\d+(?:\/\d+\.\d+)?)/i);
    if (match) {
      header.id = 'section-' + match[1].replace(/[./]/g, '-');
      return;
    }
  });
  
  return div.innerHTML;
}
