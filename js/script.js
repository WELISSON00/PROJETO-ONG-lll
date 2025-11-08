// js/script.js - shared functions: theme, form validation, projects render
(function(){
  // theme
  const THEME_KEY = 'ong_avanca_theme';
  const themeBtn = document.getElementById('toggleTheme') || document.getElementById('theme-toggle');
  const body = document.body;
  const saved = localStorage.getItem(THEME_KEY) || 'dark';
  body.setAttribute('data-theme', saved);
  if(themeBtn) themeBtn.textContent = saved === 'dark' ? '☀️' : '🌙';
  if(themeBtn) themeBtn.addEventListener('click', ()=>{
    const next = body.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    body.setAttribute('data-theme', next);
    localStorage.setItem(THEME_KEY, next);
    themeBtn.textContent = next === 'dark' ? '☀️' : '🌙';
  });

  // Projects data and render for projetos.html
  const PROJECTS = [
    {id:'p1', title:'Educação Solidária', desc:'Apoio pedagógico e cursos profissionalizantes', img:'img/library.jpg'},
    {id:'p2', title:'Alimentando Esperanças', desc:'Distribuição de cestas básicas e refeições semanais', img:'img/january-2020.jpg'},
    {id:'p3', title:'Saúde para Todos', desc:'Atendimentos gratuitos em comunidades', img:'img/injecting-heart.jpg'}
  ];
  function renderProjectsGrid(){
    const grid = document.getElementById('projects-grid');
    if(!grid) return;
    grid.innerHTML = PROJECTS.map(p=>`
      <article class="project-card">
        <img src="${p.img}" alt="${p.title}">
        <div class="card-body">
          <h3>${p.title}</h3>
          <p>${p.desc}</p>
          <div class="card-actions">
            <a href="cadastro.html" class="btn btn-primary small">Participar</a>
            <button class="btn btn-outline small" data-fav="${p.id}">Favoritar</button>
          </div>
        </div>
      </article>
    `).join('');
    grid.querySelectorAll('[data-fav]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const id = btn.getAttribute('data-fav');
        const favs = JSON.parse(localStorage.getItem('favs')||'[]');
        if(!favs.includes(id)) favs.push(id);
        localStorage.setItem('favs', JSON.stringify(favs));
        btn.textContent = 'Favoritado ✓';
        btn.disabled = true;
      });
    });
  }

  // Form validation for cadastro.html
  const form = document.getElementById('cadastroForm') || document.getElementById('cadastroFormFull');
  if(form){
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const nome = form.querySelector('#nome')?.value.trim() || '';
      const email = form.querySelector('#email')?.value.trim() || '';
      const telefone = form.querySelector('#telefone')?.value.trim() || '';
      const interesse = form.querySelector('#interesse')?.value || '';
      const mensagem = form.querySelector('#mensagem')?.value.trim() || form.querySelector('#mensagem2')?.value.trim() || '';
      const msgEl = document.getElementById('formMsg') || (()=>{ const d=document.createElement('div'); d.id='formMsg'; form.appendChild(d); return d; })();
      let errors = [];
      if(nome.length < 3) errors.push('Nome com ao menos 3 caracteres.');
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('E-mail inválido.');
      if(telefone && !/^\(?\d{2}\)?\s?\d{4,5}-\d{4}$/.test(telefone)) errors.push('Telefone inválido (ex: (11) 91234-5678).');
      if(!interesse) errors.push('Selecione uma área de interesse.');

      if(errors.length){
        msgEl.innerHTML = errors.map(x=>`<div class="error">${x}</div>`).join('');
        msgEl.scrollIntoView({behavior:'smooth'});
        return;
      }
      const entry = {nome,email,telefone,interesse,mensagem,at:new Date().toISOString()};
      const arr = JSON.parse(localStorage.getItem('registrations')||'[]');
      arr.unshift(entry);
      localStorage.setItem('registrations', JSON.stringify(arr));
      msgEl.innerHTML = '<div class="success">Cadastro realizado com sucesso! Obrigado.</div>';
      form.reset();
    });
    // clear button if exists
    const clearBtn = document.getElementById('clearData');
    if(clearBtn) clearBtn.addEventListener('click', ()=>{
      localStorage.removeItem('registrations'); localStorage.removeItem('favs');
      const msgEl = document.getElementById('formMsg'); if(msgEl) msgEl.innerHTML = '<div class="success">Dados locais limpos.</div>';
    });
  }

  // Run renderProjectsGrid on projetos.html load
  document.addEventListener('DOMContentLoaded', ()=> renderProjectsGrid());
})();