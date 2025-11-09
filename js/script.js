(() => {
  'use strict';

  // --- Utilitários DOM -------------------------------------------------------
  const $ = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));

  // --- Template engine simples ----------------------------------------------
  function renderTemplate(tpl, data = {}) {
    return tpl.replace(/{{\\s*([\\w.]+)\\s*}}/g, (_, key) => {
      const parts = key.split('.');
      let v = data;
      for (const p of parts) {
        if (v == null) return '';
        v = v[p];
      }
      return v ?? '';
    });
  }

  // --- SPA Router ------------------------------------------------------------
  const router = (() => {
    async function load(url, addToHistory = true) {
      try {
        const res = await fetch(url, { cache: 'no-cache' });
        if (!res.ok) throw new Error('Erro ao carregar ' + url);
        const text = await res.text();
        const doc = new DOMParser().parseFromString(text, 'text/html');
        const newMain = doc.querySelector('main');
        if (!newMain) throw new Error('Página sem <main>');
        const main = document.querySelector('main');
        main.replaceWith(newMain);
        if (addToHistory) history.pushState({ url }, '', url);
        initHooks();
      } catch (err) {
        console.error(err);
        showToast('Erro ao carregar a página.');
      }
    }

    function interceptLinks() {
      document.body.addEventListener('click', e => {
        const a = e.target.closest('a');
        if (!a) return;
        const href = a.getAttribute('href');
        if (!href || href.startsWith('http') || href.startsWith('#') || a.target === '_blank')
          return;
        e.preventDefault();
        load(href);
      });

      window.addEventListener('popstate', e => {
        const state = e.state;
        if (state && state.url) load(state.url, false);
        else load(location.pathname, false);
      });
    }

    return { load, interceptLinks };
  })();

  // --- Tema claro/escuro -----------------------------------------------------
  const theme = (() => {
    const key = 'ong_avanca_theme';
    const get = () => localStorage.getItem(key) || 'dark';
    const apply = t => {
      document.documentElement.setAttribute('data-theme', t);
      document.body.setAttribute('data-theme', t);
    };
    const set = t => {
      localStorage.setItem(key, t);
      apply(t);
      updateBtn();
    };
    const toggle = () => set(get() === 'dark' ? 'light' : 'dark');
    const updateBtn = () => {
      $$('#toggleTheme').forEach(btn => {
        btn.textContent = get() === 'dark' ? '☀️' : '🌙';
      });
    };
    const init = () => {
      apply(get());
      updateBtn();
      document.addEventListener('click', e => {
        if (e.target && e.target.id === 'toggleTheme') toggle();
      });
    };
    return { init };
  })();

 function ensureMobileMenu() {
  const nav = document.getElementById('siteNav');
  const headerWrap = document.querySelector('.nav-wrapper');
  if (!nav || !headerWrap) return;

  // cria botão hamburger se não existir
  let btn = document.getElementById('mobileMenuToggle');
  if (!btn) {
    btn = document.createElement('button');
    btn.id = 'mobileMenuToggle';
    btn.className = 'mobile-menu-btn';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Abrir menu');
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = '☰';
    document.body.appendChild(btn);
  }

  // create submenu toggles (so they work on touch)
  document.querySelectorAll('.has-sub > .sub-toggle').forEach(toggle => {
    // ensure accessible attributes
    const subId = toggle.getAttribute('aria-controls');
    const sub = document.getElementById(subId);
    if (!sub) return;

    toggle.addEventListener('click', (e) => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      if (expanded) {
        sub.hidden = true;
      } else {
        sub.hidden = false;
      }
    });
  });

  // open/close helpers
  const openMenu = () => {
    nav.classList.add('open');
    btn.classList.add('open');
    btn.innerHTML = '✖';
    btn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
  };
  const closeMenu = () => {
    nav.classList.remove('open');
    btn.classList.remove('open');
    btn.innerHTML = '☰';
    btn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');

    // fechar submenus
    document.querySelectorAll('.has-sub > .sub-toggle').forEach(t => {
      t.setAttribute('aria-expanded', 'false');
      const id = t.getAttribute('aria-controls');
      const sub = document.getElementById(id);
      if (sub) sub.hidden = true;
    });
  };

  // click handler on burger
  btn.removeEventListener('click', btn._handler);
  btn._handler = () => (nav.classList.contains('open') ? closeMenu() : openMenu());
  btn.addEventListener('click', btn._handler);

  // close when clicking a nav link (preserves SPA intercept)
  document.body.removeEventListener('click', document.body._navClickHandler);
  document.body._navClickHandler = (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    if (nav.contains(a)) {
      // if link has a hash only (in-page) let it, otherwise close menu
      closeMenu();
    }
  };
  document.body.addEventListener('click', document.body._navClickHandler);

  // close on ESC
  window.removeEventListener('keydown', window._menuEscHandler);
  window._menuEscHandler = (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) closeMenu();
  };
  window.addEventListener('keydown', window._menuEscHandler);

  // ensure initial state
  document.querySelectorAll('.has-sub > .sub-toggle').forEach(t => {
    const sid = t.getAttribute('aria-controls');
    const sub = document.getElementById(sid);
    if (sub) sub.hidden = true;
  });
}


  // --- Toast simples ---------------------------------------------------------
  function showToast(msg, timeout = 3000) {
    let el = document.getElementById('globalToast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'globalToast';
      Object.assign(el.style, {
        position: 'fixed',
        right: '16px',
        bottom: '16px',
        background: 'var(--surface)',
        color: 'var(--text)',
        padding: '10px 16px',
        borderRadius: '8px',
        boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
        zIndex: 9999,
        transition: 'opacity 0.4s'
      });
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.style.opacity = '1';
    setTimeout(() => (el.style.opacity = '0'), timeout);
  }

  // --- Validação de formulário -----------------------------------------------
  const formModule = (() => {
    const KEY = 'ong_avanca_cadastros';

    function initForm() {
      const form = document.getElementById('cadastroFormFull');
      if (!form) return;

      form.addEventListener('submit', e => {
        e.preventDefault();
        if (!validate(form)) return;
        const data = Object.fromEntries(new FormData(form).entries());
        data.timestamp = new Date().toISOString();
        save(data);
        showToast('Cadastro enviado com sucesso!');
        form.reset();
      });
    }

    function validate(form) {
      let ok = true;
      const nome = form.querySelector('#nome');
      const email = form.querySelector('#email');
      const interesse = form.querySelector('#interesse');

      form.querySelectorAll('.invalid').forEach(f => f.classList.remove('invalid'));

      if (!nome.value.trim()) {
        nome.classList.add('invalid');
        showToast('Informe seu nome');
        ok = false;
      }
      if (!/^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/.test(email.value)) {
        email.classList.add('invalid');
        showToast('E-mail inválido');
        ok = false;
      }
      if (!interesse.value) {
        interesse.classList.add('invalid');
        showToast('Selecione um interesse');
        ok = false;
      }
      return ok;
    }

    function save(data) {
      const arr = JSON.parse(localStorage.getItem(KEY) || '[]');
      arr.unshift(data);
      localStorage.setItem(KEY, JSON.stringify(arr));
      console.log('Cadastro salvo:', data);
    }

    return { initForm };
  })();

  // --- Projetos no index -----------------------------------------------------
  function renderProjectsPreview() {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;
    const projects = [
      { title: 'Educação Solidária', img: 'img/library.jpg', desc: 'Apoio pedagógico e cursos profissionalizantes.' },
      { title: 'Alimentando Esperanças', img: 'img/january-2020.jpg', desc: 'Distribuição de cestas básicas e refeições semanais.' },
      { title: 'Saúde para Todos', img: 'img/injecting-heart.jpg', desc: 'Atendimentos médicos em comunidades.' }
    ];
    const cardTpl = `
      <article class="project-card">
        <img src="{{img}}" alt="{{title}}">
        <h3>{{title}}</h3>
        <p>{{desc}}</p>
        <a class="btn btn-outline" href="projetos.html">Saiba mais</a>
      </article>`;
    grid.innerHTML = projects.map(p => renderTemplate(cardTpl, p)).join('');
  }

  // --- Hooks após troca de página --------------------------------------------
  function initHooks() {
    ensureMobileMenu();
    formModule.initForm();
    theme.init();
    renderProjectsPreview();
  }

  // --- Inicialização ---------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    router.interceptLinks();
    initHooks();
    history.replaceState({ url: location.pathname }, '', location.pathname);
  });
})();
/* ================= MENU GERAL ================= */
.nav-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
}

#siteNav ul {
  list-style: none;
  display: flex;
  gap: 24px;
  margin: 0;
  padding: 0;
}

#siteNav a {
  text-decoration: none;
  color: var(--text, #fff);
  font-weight: 500;
  transition: color 0.2s;
}

#siteNav a:hover,
#siteNav a.active {
  color: var(--accent, #f39c12);
}

/* ================= BOTÃO MENU MOBILE ================= */
.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  font-size: 30px;
  color: var(--text, #fff);
  cursor: pointer;
  padding: 6px 10px;
  z-index: 1001;
}

/* ================= RESPONSIVO (MOBILE) ================= */
@media (max-width: 768px) {
  .mobile-menu-btn {
    display: block;
  }

  #siteNav {
    position: fixed;
    top: 0;
    right: -100%;
    height: 100vh;
    width: 70%;
    background: var(--surface, #111);
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 80px 20px;
    transition: right 0.3s ease;
    z-index: 1000;
  }

  #siteNav.open {
    right: 0;
  }

  #siteNav ul {
    flex-direction: column;
    gap: 20px;
  }

  #siteNav a {
    font-size: 18px;
    color: #fff;
  }

  .header-actions {
    display: none; /* opcional: esconde o botão de tema dentro do menu */
  }
}
