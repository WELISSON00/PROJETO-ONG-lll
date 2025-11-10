/* js/script.js – Menu + Tema (compatível com SPA) */
(function () {
  "use strict";

  const qs = (id) => document.getElementById(id);

  // Reinicializa sempre que o header existir (SPA pode recriar)
  function initMenu() {
    const menuBtn = qs("menuToggle");
    const siteNav = qs("siteNav");
    if (!menuBtn || !siteNav) return;

    // Para evitar duplicar eventos em SPA
    menuBtn.replaceWith(menuBtn.cloneNode(true));
    siteNav.replaceWith(siteNav.cloneNode(true));

    const btn = qs("menuToggle");
    const nav = qs("siteNav");

    function openNav() {
      nav.classList.add("open");
      btn.classList.add("is-open");
      btn.setAttribute("aria-expanded", "true");
    }

    function closeNav() {
      nav.classList.remove("open");
      btn.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
    }

    function toggleNav() {
      nav.classList.contains("open") ? closeNav() : openNav();
    }

    // Clique no botão
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleNav();
    });

    // Clicou em link dentro do menu → fechar
    nav.addEventListener("click", (e) => {
      if (e.target.closest("a")) closeNav();
    });

    // Clicou fora → fecha
    document.addEventListener("click", (e) => {
      if (!nav.contains(e.target) && !btn.contains(e.target)) closeNav();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) closeNav();
    });
  }

  function initTheme() {
    const themeBtn = qs("toggleTheme");
    if (!themeBtn) return;

    const html = document.documentElement;

    const saved = localStorage.getItem("theme");
    const startTheme = saved || "dark";

    html.dataset.theme = startTheme;
    themeBtn.textContent = startTheme === "dark" ? "☀️" : "🌙";

    themeBtn.onclick = () => {
      const current = html.dataset.theme;
      const next = current === "light" ? "dark" : "light";
      html.dataset.theme = next;
      localStorage.setItem("theme", next);
      themeBtn.textContent = next === "dark" ? "☀️" : "🌙";
    };
  }

  // Primeira inicialização
  document.addEventListener("DOMContentLoaded", () => {
    initMenu();
    initTheme();
  });

  // SPA recarrega conteúdo, então reinicializa elementos sempre
  document.addEventListener("spa-navigate", () => {
    setTimeout(() => {
      initMenu();
      initTheme();
    }, 10);
  });

})();
