/**
 * Modular Portfolio JavaScript Architecture
 * - Interactive CV PDF Viewer & Download Modal
 * - Android Gboard/IME Keyboard Buffer & Reverse Text Fix
 * - Network-Aware Theme Preloader
 * - On-Demand Dynamic Data Engine & Local Caching
 * - Theme Switcher & Mobile Menu Modules
 * - Linux Terminal CLI Engine
 */

// -------------------------------------------------------------
// 1. Data Store & Dynamic Engine
// -------------------------------------------------------------
const DataEngine = (() => {
  const LOCAL_STORAGE_KEY = 'syrus_portfolio_cache_v2';

  const portfolioData = {
    projects: [
      {
        id: 'login-system',
        title: 'Student Login System',
        category: 'Campus Management System',
        badgeColor: 'cyan',
        repoUrl: 'https://github.com/DevSyrizz/login-system',
        shortDesc: 'An internal database management solution engineered to record, track, and manage student entry/exit logs with clean access authentication.',
        techStack: 'SQL • Database Logic • C++',
        details: 'Features optimized relational table schemas, parameterized SQL query execution to prevent injection vulnerabilities, and low-latency student lookup routines.'
      },
      {
        id: 'agent-harness',
        title: 'Agent Harness',
        category: 'Agent Runtime',
        badgeColor: 'emerald',
        repoUrl: 'https://github.com/DevSyrizz/agent-harnizz',
        shortDesc: 'A lightweight, extensible local agent harness designed to run, orchestrate, and evaluate autonomous software workflows on local system environments.',
        techStack: 'Rust • Systems • AI Automation',
        details: 'Engineered in Rust for zero-cost abstractions, low memory footprint, and reliable local LLM tool dispatch loops with thread-safe execution bounds.'
      }
    ]
  };

  const initData = () => {
    if (!localStorage.getItem(LOCAL_STORAGE_KEY)) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(portfolioData));
    }
  };

  const getProjects = () => {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    return cached ? JSON.parse(cached).projects : portfolioData.projects;
  };

  const renderProjects = () => {
    const container = document.getElementById('projects-container');
    if (!container) return;

    const projects = getProjects();
    container.innerHTML = projects.map(proj => `
      <div class="p-6 rounded-xl bg-white dark:bg-[#16191e] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between space-y-4 hover:border-cyan-500/50">
        <div class="space-y-3">
          <div class="flex items-center justify-between gap-2">
            <span class="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-${proj.badgeColor}-500/10 text-${proj.badgeColor}-400 border border-${proj.badgeColor}-500/20">${proj.category}</span>
            <a href="${proj.repoUrl}" target="_blank" rel="noopener" class="text-slate-400 hover:text-cyan-400 text-lg transition-colors" title="View Source"><i class="fab fa-github"></i></a>
          </div>
          <h4 class="text-lg font-bold text-slate-900 dark:text-white">${proj.title}</h4>
          <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">${proj.shortDesc}</p>
        </div>
        <div class="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs font-mono text-slate-500">
          <span>${proj.techStack}</span>
          <button onclick="openProjectModal('${proj.id}')" class="text-cyan-400 hover:underline font-semibold flex items-center gap-1">
            Details <i class="fas fa-arrow-right text-[10px]"></i>
          </button>
        </div>
      </div>
    `).join('');
  };

  return { initData, getProjects, renderProjects };
})();

// Modal Helpers for Projects
function openProjectModal(projectId) {
  const modal = document.getElementById('project-modal');
  const modalContent = document.getElementById('modal-content');
  const projects = DataEngine.getProjects();
  const project = projects.find(p => p.id === projectId);

  if (project && modal && modalContent) {
    modalContent.innerHTML = `
      <div class="inline-block px-2.5 py-0.5 rounded text-xs font-mono bg-cyan-500/10 text-cyan-400 font-semibold border border-cyan-500/20">${project.category}</div>
      <h3 class="text-xl font-bold text-slate-900 dark:text-white">${project.title}</h3>
      <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">${project.shortDesc}</p>
      <div class="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 text-xs font-mono space-y-1 text-slate-700 dark:text-slate-300">
        <span class="text-cyan-400 font-bold block">[System Details]</span>
        <p>${project.details}</p>
      </div>
      <div class="pt-2 flex justify-between items-center text-xs font-mono">
        <span class="text-slate-500">${project.techStack}</span>
        <a href="${project.repoUrl}" target="_blank" rel="noopener" class="px-4 py-2 rounded bg-cyan-400 hover:bg-cyan-500 text-slate-950 font-bold transition-all inline-flex items-center gap-1">
          GitHub Repo <i class="fas fa-external-link-alt text-[10px]"></i>
        </a>
      </div>
    `;
    modal.classList.remove('hidden');
  }
}

function closeProjectModal() {
  const modal = document.getElementById('project-modal');
  if (modal) modal.classList.add('hidden');
}

// Modal Helpers for Exporting CV PDF
function openCvModal() {
  const modal = document.getElementById('cv-modal');
  const iframe = document.getElementById('cv-iframe');
  if (modal) {
    modal.classList.remove('hidden');
    if (iframe && (!iframe.src || iframe.src.endsWith('#'))) {
      iframe.src = 'cv.pdf';
    }
  }
}

function closeCvModal() {
  const modal = document.getElementById('cv-modal');
  if (modal) modal.classList.add('hidden');
}

function openEmailContact() {
  const emailAddress = 'devsyrizz@gmail.com';
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(emailAddress)}`;
  window.location.href = gmailUrl;
}

// Global Keyboard Shortcut: ESC key closes open modals
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeCvModal();
    closeProjectModal();
  }
});

// Close CV modal when clicking backdrop
document.getElementById('cv-modal')?.addEventListener('click', (e) => {
  if (e.target.id === 'cv-modal') {
    closeCvModal();
  }
});

// -------------------------------------------------------------
// 2. Network & Bandwidth Preloader Module
// -------------------------------------------------------------
const NetworkModule = (() => {
  const preloader = document.getElementById('terminal-preloader');
  const loaderBar = document.getElementById('loader-bar');
  const loaderPercent = document.getElementById('loader-percent');
  const preloaderLogs = document.getElementById('preloader-logs');
  const warningMsg = document.getElementById('network-warning');
  const offlineBanner = document.getElementById('offline-banner');

  let progress = 0;

  const updateProgress = (targetPercent, logText) => {
    progress = Math.max(progress, targetPercent);
    if (loaderBar) loaderBar.style.width = `${progress}%`;
    if (loaderPercent) loaderPercent.textContent = `${progress}%`;
    if (logText && preloaderLogs) {
      const p = document.createElement('p');
      p.textContent = logText;
      preloaderLogs.appendChild(p);
    }
  };

  const handleOfflineStatus = () => {
    if (!navigator.onLine && offlineBanner) {
      offlineBanner.classList.remove('hidden');
    } else if (navigator.onLine && offlineBanner) {
      offlineBanner.classList.add('hidden');
    }
  };

  const init = () => {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection && (connection.saveData || connection.effectiveType.includes('2g') || connection.effectiveType.includes('3g'))) {
      if (warningMsg) warningMsg.classList.remove('hidden');
    }

    setTimeout(() => updateProgress(35, '[RES] Assets and stylesheets loaded.'), 150);
    setTimeout(() => updateProgress(70, '[DATA] Local storage cache synchronized.'), 350);

    window.addEventListener('online', handleOfflineStatus);
    window.addEventListener('offline', handleOfflineStatus);
    handleOfflineStatus();

    window.addEventListener('load', () => {
      updateProgress(100, '[SYS] Syrus Portfolio operational.');
      setTimeout(() => {
        if (preloader) preloader.classList.add('loaded');
      }, 400);
    });

    setTimeout(() => {
      if (preloader && !preloader.classList.contains('loaded')) {
        updateProgress(100, '[WARN] Forced boot timeout reached.');
        preloader.classList.add('loaded');
      }
    }, 4000);
  };

  return { init };
})();

// -------------------------------------------------------------
// 3. Theme Controller Module
// -------------------------------------------------------------
const ThemeModule = (() => {
  const toggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');

  const init = () => {
    if (!toggleBtn || !themeIcon) return;

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark');
      themeIcon.className = 'fas fa-sun text-amber-500';
    } else {
      document.documentElement.classList.add('dark');
      themeIcon.className = 'fas fa-moon';
    }

    toggleBtn.addEventListener('click', () => {
      const isDark = document.documentElement.classList.contains('dark');
      if (isDark) {
        document.documentElement.classList.remove('dark');
        themeIcon.className = 'fas fa-sun text-amber-500';
        localStorage.setItem('theme', 'light');
      } else {
        document.documentElement.classList.add('dark');
        themeIcon.className = 'fas fa-moon';
        localStorage.setItem('theme', 'dark');
      }
    });
  };

  return { init };
})();

// -------------------------------------------------------------
// 4. Mobile Nav Module
// -------------------------------------------------------------
const MobileNavModule = (() => {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const menuIcon = document.getElementById('mobile-menu-icon');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  const init = () => {
    if (!menuBtn || !mobileMenu) return;

    menuBtn.addEventListener('click', () => {
      const isHidden = mobileMenu.classList.contains('hidden');
      if (isHidden) {
        mobileMenu.classList.remove('hidden');
        menuIcon.className = 'fas fa-times text-lg';
        menuBtn.setAttribute('aria-expanded', 'true');
      } else {
        mobileMenu.classList.add('hidden');
        menuIcon.className = 'fas fa-bars text-lg';
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        menuIcon.className = 'fas fa-bars text-lg';
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  };

  return { init };
})();

// -------------------------------------------------------------
// 5. Skills Matrix Module
// -------------------------------------------------------------
function filterSkills(category, event) {
  const cards = document.querySelectorAll('.skill-card');
  const buttons = document.querySelectorAll('.skill-tab');

  buttons.forEach(btn => {
    btn.classList.remove('bg-cyan-400', 'text-slate-950');
    btn.classList.add('bg-slate-100', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-300');
  });

  if (event && event.currentTarget) {
    event.currentTarget.classList.remove('bg-slate-100', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-300');
    event.currentTarget.classList.add('bg-cyan-400', 'text-slate-950');
  }

  cards.forEach(card => {
    if (category === 'all' || card.getAttribute('data-category') === category) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

// -------------------------------------------------------------
// 6. Linux Terminal CLI Engine
// -------------------------------------------------------------
const TerminalModule = (() => {
  const contentElem = document.getElementById('foot-terminal-content');
  const typedElem = document.getElementById('foot-typed-command');
  const inputElem = document.getElementById('terminal-input');
  const bodyElem = document.getElementById('foot-terminal-body');

  let isTyping = false;
  let sequenceIndex = 0;
  let isComposing = false;

  const demoSequence = [
    { cmd: 'whoami', output: '<span class="text-cyan-400 font-bold">Syrus (Yash Jangid)</span> — AI/ML & Cybersecurity Engineer' },
    { cmd: 'cat profile.json', output: `<pre class="text-gruvbox-fg text-xs font-mono">{
  <span class="text-gruvbox-yellow">"officialName"</span>: <span class="text-cyan-400">"Yash Jangid"</span>,
  <span class="text-gruvbox-yellow">"preferredName"</span>: <span class="text-cyan-400">"Syrus"</span>,
  <span class="text-gruvbox-yellow">"focus"</span>: [<span class="text-gruvbox-green">"Fresher AI/ML Engineer"</span>, <span class="text-gruvbox-green">"Cyber Security Person"</span>],
  <span class="text-gruvbox-yellow">"tech"</span>: [<span class="text-gruvbox-aqua">"C/C++"</span>, <span class="text-gruvbox-aqua">"Rust"</span>, <span class="text-gruvbox-aqua">"Dear ImGui"</span>, <span class="text-gruvbox-aqua">"SQL"</span>]
}</pre>` }
  ];

  const appendLine = (promptText, outputHtml) => {
    if (!contentElem || !bodyElem) return;

    const container = document.createElement('div');
    container.className = 'space-y-1';
    
    const promptLine = document.createElement('div');
    promptLine.innerHTML = `<span class="text-gruvbox-fg font-bold">[syrus@archlinux ~]$</span> <span class="text-gruvbox-fg font-medium">${promptText}</span>`;
    
    const responseLine = document.createElement('div');
    responseLine.className = 'pl-2 text-gruvbox-fg whitespace-pre-wrap';

    if (typeof outputHtml === 'string' && /<[^>]+>/.test(outputHtml)) {
      responseLine.innerHTML = outputHtml;
    } else {
      responseLine.textContent = outputHtml;
    }

    container.appendChild(promptLine);
    container.appendChild(responseLine);
    contentElem.appendChild(container);

    bodyElem.scrollTop = bodyElem.scrollHeight;
  };

  const runDemoSequence = () => {
    if (sequenceIndex >= demoSequence.length) {
      enableInteractiveMode();
      return;
    }

    const item = demoSequence[sequenceIndex];
    let charIdx = 0;
    if (typedElem) typedElem.textContent = '';
    isTyping = true;

    const typeInterval = setInterval(() => {
      if (charIdx < item.cmd.length) {
        if (typedElem) typedElem.textContent += item.cmd.charAt(charIdx);
        charIdx++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => {
          appendLine(item.cmd, item.output);
          if (typedElem) typedElem.textContent = '';
          sequenceIndex++;
          setTimeout(runDemoSequence, 400);
        }, 250);
      }
    }, 60);
  };

  const resetAndroidInputBuffer = () => {
    if (!inputElem) return;
    inputElem.value = '';
    if (typedElem) typedElem.textContent = '';
    inputElem.blur();
    setTimeout(() => inputElem.focus(), 20);
  };

  const enableInteractiveMode = () => {
    isTyping = false;
    const cursor = document.getElementById('foot-cursor');
    if (cursor) cursor.classList.add('foot-blink');

    if (bodyElem && inputElem) {
      bodyElem.addEventListener('click', () => inputElem.focus());

      inputElem.addEventListener('compositionstart', () => { isComposing = true; });
      inputElem.addEventListener('compositionend', (e) => { 
        isComposing = false; 
        if (typedElem) typedElem.textContent = e.target.value;
      });

      inputElem.addEventListener('input', (e) => {
        if (typedElem) typedElem.textContent = e.target.value;
      });

      inputElem.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.keyCode === 13) {
          e.preventDefault();
          const command = inputElem.value.trim();
          executeCommand(command);
          resetAndroidInputBuffer();
        }
      });
    }
  };

  const executeCommand = (cmd) => {
    if (!cmd) return;

    const clean = cmd.toLowerCase().trim();
    let response = '';

    switch (clean) {
      case 'help':
        response = `<div class="text-xs space-y-1 text-gruvbox-fgDim">
          <div><span class="text-cyan-400 font-bold">whoami</span> — Overview of bio & target roles</div>
          <div><span class="text-cyan-400 font-bold">skills</span> — Technical languages & databases</div>
          <div><span class="text-cyan-400 font-bold">projects</span> — Key repositories summary</div>
          <div><span class="text-cyan-400 font-bold">contact</span> — Email & social links</div>
          <div><span class="text-cyan-400 font-bold">cv</span> — Open PDF CV Viewer</div>
          <div><span class="text-cyan-400 font-bold">clear</span> — Clear screen output</div>
        </div>`;
        break;
      case 'whoami':
        response = `<span class="text-cyan-400 font-bold">Syrus (Yash Jangid)</span> — Fresher AI/ML Engineer & Cyber Security Enthusiast`;
        break;
      case 'skills':
        response = `Languages: C, C++, Rust, Java, SQL\nUI: Dear ImGui\nDBs: SQLite, PostgreSQL, Oracle DB`;
        break;
      case 'projects':
        response = `1. Student Login System (https://github.com/DevSyrizz/login-system)\n2. Agent Harness (https://github.com/DevSyrizz/agent-harnizz)`;
        break;
      case 'contact':
        response = `Email: devsyrizz@gmail.com\nGitHub: https://github.com/DevSyrizz`;
        break;
      case 'cv':
        openCvModal();
        response = `<span class="text-cyan-400">Opening Curriculum Vitae viewer...</span>`;
        break;
      case 'clear':
        if (contentElem) contentElem.innerHTML = '';
        return;
      default:
        response = `<span class="text-gruvbox-red">foot: command not found: ${cmd}</span>. Type <span class="text-cyan-400 font-bold">help</span> for available commands.`;
    }

    appendLine(cmd, response);
  };

  const runQuickCommand = (cmd) => {
    if (isTyping) return;
    executeCommand(cmd);
    resetAndroidInputBuffer();
  };

  const init = () => {
    setTimeout(runDemoSequence, 300);
  };

  return { init, runQuickCommand };
})();

function runQuickCommand(cmd) {
  TerminalModule.runQuickCommand(cmd);
}

// Global Initialization
document.addEventListener('DOMContentLoaded', () => {
  NetworkModule.init();
  DataEngine.initData();
  DataEngine.renderProjects();
  ThemeModule.init();
  MobileNavModule.init();
  TerminalModule.init();
});