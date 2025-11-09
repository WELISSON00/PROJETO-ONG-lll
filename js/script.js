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

  // --- MENU MOBILE corrigido (compatível com <ul><li><a>) -------------------
  function ensureMobileMenu() {
    if (!document.getElementById('mobileMenuToggle')) {
      const header = document.querySelector('.nav-wrapper');
      if (!header) return;

      const btn = document.createElement('button');
      btn.id = 'mobileMenuToggle';
      btn.className = 'mobile-menu-btn';
      btn.setAttribute('aria-label', 'Abrir menu');
      btn.innerHTML = '☰';
      header.insertBefore(btn, header.firstChild);

      const nav = document.getElementById('siteNav');

      // Abre/fecha o menu ao clicar no botão
      btn.addEventListener('click', () => {
        if (!nav) return;
        nav.classList.toggle('open');
        btn.classList.toggle('open');
        btn.innerHTML = btn.classList.contains('open') ? '✖' : '☰';
      });

      // Fecha o menu ao clicar em um link dentro de <ul>
      document.body.addEventListener('click', e => {
        if (!nav) return;
        const link = e.target.closest('a');
        if (link && nav.contains(link)) {
          nav.classList.remove('open');
          btn.classList.remove('open');
          btn.innerHTML = '☰';
        }
      });
    }
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
