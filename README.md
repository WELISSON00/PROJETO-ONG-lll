# ONG AVANÇA — Entrega III  
## Interatividade e Funcionalidades (JavaScript)

### 📘 Introdução
Este projeto foi desenvolvido como parte da **Entrega III** da disciplina de **Desenvolvimento Web**, com foco na implementação de **interatividade e funcionalidades dinâmicas** utilizando **JavaScript moderno (ES6)**.  

A proposta é transformar o site estático da ONG AVANÇA em uma aplicação **dinâmica, interativa e funcional**, simulando um ambiente real de uma organização não governamental.

---

### 🎯 Objetivos da Entrega
1. Implementar **manipulação do DOM** com JavaScript.
2. Criar um **sistema básico de Single Page Application (SPA)** ou navegação dinâmica.
3. Utilizar **templates JavaScript** para renderizar conteúdo.
4. Adicionar **verificação de consistência** de dados em formulários.
5. Incorporar **armazenamento local (localStorage)** para persistência.
6. Adicionar **interatividade visual** (tema claro/escuro, menu responsivo, etc.).

---

### 🧱 Estrutura do Projeto

/ong-avanca
│
├── index.html # Página inicial da ONG
├── projetos.html # Página com lista de projetos sociais
├── cadastro.html # Página de cadastro de voluntários/doadores
│
├── css/
│ ├── style.css # Estilos gerais do site
│ └── menu-fix.css # Ajuste visual e responsividade do menu
│
├── js/
│ └── script.js # JavaScript modular com interatividade principal
│
└── README.md # Documento explicativo da entrega



---

### ⚙️ Funcionalidades Implementadas

#### 🧭 1. Menu Responsivo (DOM + Eventos)
- Exibição automática do botão **☰ (hambúrguer)** em telas pequenas.  
- Ao clicar, o menu abre e fecha suavemente.  
- Fecha automaticamente ao clicar fora ou em um link do menu.  
- Atributos de acessibilidade (`aria-expanded`) atualizados dinamicamente.

#### 🌗 2. Tema Claro/Escuro (LocalStorage)
- Alternância entre **modo claro** e **modo escuro** clicando no botão ☀️/🌙.  
- O tema escolhido é **salvo no navegador** (`localStorage`), mantendo-se entre visitas.

#### 🧾 3. Validação de Formulário
- Campos obrigatórios com **validação de preenchimento e formato** (nome, e-mail, interesse).  
- Exibição de mensagens específicas ao usuário em caso de erro.  
- Verificação de duplicidade de e-mail usando `localStorage`.  
- Após envio válido, o cadastro é salvo e o formulário é resetado.

#### 🧩 4. Manipulação de DOM e Templates
- Renderização dinâmica dos cards de projetos na página “Projetos”.  
- Cada projeto possui botão de **edição de imagem**, que interage com o DOM e salva alterações no `localStorage`.

#### 💾 5. Armazenamento Local
- Dados de cadastro e imagens editadas ficam armazenados no navegador (`localStorage`).  
- O usuário pode atualizar ou reabrir o site sem perder suas alterações.

---

### 💡 Tecnologias Utilizadas
- **HTML5** — Estrutura semântica das páginas.  
- **CSS3** — Design responsivo, gradientes e temas.  
- **JavaScript (ES6)** — Manipulação do DOM, eventos e persistência local.  
- **LocalStorage API** — Salvamento de dados e preferências do usuário.  

---

### 🧩 Modularização do Código
O código JavaScript foi estruturado de forma modular:
- Funções independentes para **menu móvel**, **tema**, **validação** e **renderização**.  
- Uso de **funções autoexecutáveis (IIFE)** para evitar conflitos globais.  
- Padrão de inicialização unificado no evento `DOMContentLoaded`.

---

### 🔍 Testes Realizados
1. Teste de abertura e fechamento do menu em diferentes tamanhos de tela.  
2. Alternância entre tema claro e escuro.  
3. Validação de formulário (campos vazios, e-mail inválido, duplicado).  
4. Persistência de dados entre recarregamentos.  
5. Compatibilidade com navegadores modernos (Chrome, Edge, Firefox).  

---

### 🧠 Conclusão
O projeto **ONG AVANÇA — Entrega III** atinge todos os objetivos propostos:
- Implementa **interatividade real com JavaScript**;  
- Possui **validação funcional de formulários**;  
- Utiliza **armazenamento local**;  
- Adota **boas práticas de acessibilidade e responsividade**;  
- Demonstra domínio em **manipulação do DOM e eventos**.

---

### 👨‍💻 Autor
**Nome:** Welisson Carvalho 
**Curso:** ADS  
**Data:** Novembro de 2025  
**Instituição:** Cruzeiro do Sul
