# Landing page da mentoria — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Entregar `mentoria.html` — uma landing page de venda da mentoria, em português, com identidade visual própria, CTA de WhatsApp e todo o texto em placeholders marcados.

**Architecture:** Site estático sem build. A LP é uma página autossuficiente com CSS e JS próprios (`assets/css/mentoria.css`, `assets/js/mentoria.js`) que **não** carregam `lando-system.css` nem `motion.js`. As 5 páginas do portfólio só ganham um link novo no menu e no footer. GSAP, ScrollTrigger e Lenis vêm do mesmo CDN já usado no site.

**Tech Stack:** HTML5, CSS3 (custom properties, sem framework), JavaScript vanilla, GSAP 3.13 + ScrollTrigger, Lenis 1.3.11, Google Fonts (Instrument Serif, Inter), Playwright para screenshots de verificação.

**Spec:** `docs/superpowers/specs/2026-08-25-mentoria-lp-design.md`

## Global Constraints

- **Idioma:** todo texto visível em português do Brasil.
- **Isolamento:** `mentoria.html` não referencia `assets/css/lando-system.css` nem `assets/js/motion.js`. Nenhum arquivo do portfólio é alterado, exceto para acrescentar o link "Mentoria".
- **Prefixo de classe:** componentes da LP usam prefixo `m-` (`.m-hero`, `.m-card`). Utilitários sem prefixo (`.wrap`, `.sec`, `.btn`, `.display`, `.lead`, `.eyebrow`, `.reveal`) vivem só neste CSS.
- **Reveals:** sempre `gsap.fromTo(...)`, nunca `gsap.from(...)`. `from()` recaptura o estado no `ScrollTrigger.refresh()` e congela os elementos deslocados.
- **ScrollTrigger start:** usar `start: 'top bottom'` nos reveals. `clamp(...)` quebra no scroll 0 e percentuais como `top 88%` podem passar do `maxScroll` em elementos no fim da página.
- **Placeholders:** todo texto de venda entre colchetes e em caixa alta — `[PROMESSA PRINCIPAL]`, `[R$ X.XXX]`, `[NUMERO_WHATSAPP]`. Nada de texto de venda inventado que possa ir ao ar por engano.
- **CTA:** todos os botões apontam para `https://wa.me/[NUMERO_WHATSAPP]?text=Oi%20Rodrigo!%20Quero%20saber%20mais%20sobre%20a%20mentoria.` com `target="_blank" rel="noopener noreferrer"` e um atributo `data-cta` identificando a origem.
- **Tokens de cor exatos:** `--bg: #0F0E0C`, `--fg: #F4F1EA`, `--surface: #F4F1EA`, `--surface-fg: #16150F`, `--accent: #E8A33D`, `--accent-ink: #16150F`, `--sage: #7C8B6F`.
- **Acessibilidade:** uma única `<h1>` (no hero), demais seções em `<h2>`, foco visível em tudo que é interativo, `prefers-reduced-motion` respeitado.
- **Commits:** um commit por task, mensagem em português, prefixo `feat:` / `fix:` / `docs:`.

## Como testar (este repositório não tem test runner)

Não existe framework de teste aqui. O ciclo de teste de cada task é **servir a página, tirar screenshot e conferir que o console está limpo**:

```bash
# 1. Servidor (deixe rodando em outro terminal, uma vez só)
npm run dev            # serve na porta 5500

# 2. Screenshot + checagem de erros de console
NODE_PATH=/Users/rodrigoscharp/.npm/_npx/e41f203b7505f1fb/node_modules \
  node scripts/verify-shot.cjs http://localhost:5500/mentoria.html /tmp/mentoria.png 1440

# argumentos: <url> <arquivo-de-saida.png> [largura] [seletor-para-scroll]
```

O script sai com código 1 e imprime `CONSOLE ERRORS:` se houver qualquer erro de console. Playwright **não** está instalado no repositório — vive naquele caminho do cache do npx.

Sempre verifique nas duas larguras: **390** (mobile) e **1440** (desktop). E sempre veja o hero no scroll 0 **e** uma seção rolada — bugs de reveal do GSAP só aparecem em um dos dois estados.

## Estrutura de arquivos

| Arquivo | Responsabilidade |
|---|---|
| `mentoria.html` | Marcação da LP inteira, 13 blocos na ordem da spec |
| `assets/css/mentoria.css` | Reset, tokens, utilitários e todos os componentes `m-*` |
| `assets/js/mentoria.js` | `initMotion()` (Lenis + reveals) e `initStickyCta()` |
| `index.html`, `dev.html`, `founder.html`, `network.html`, `services.html` | Uma linha nova no menu overlay e uma na coluna "Pages" do footer |

---

### Task 1: Fundação — shell, tokens, utilitários, motion

Entrega uma página escura vazia com header/footer próprios, tipografia carregada, grão de fundo e o motor de reveals funcionando. Nenhuma seção de venda ainda.

**Files:**
- Create: `mentoria.html`
- Create: `assets/css/mentoria.css`
- Create: `assets/js/mentoria.js`

**Interfaces:**
- Consumes: nada.
- Produces: utilitários `.wrap`, `.sec`, `.sec--light`, `.display`, `.display--xl`, `.display--lg`, `.lead`, `.eyebrow`, `.btn`, `.btn--lg`, `.btn--ghost`, `.reveal`; contrato de reveal — um contêiner com `data-reveal` anima seus descendentes `.reveal` em stagger; classe `has-motion` no `<html>` quando há motion permitido.

- [ ] **Step 1: Criar `assets/css/mentoria.css` com reset, tokens e utilitários**

```css
/* ===== MENTORIA — sistema próprio. Não depende de lando-system.css ===== */
:root {
  --bg: #0F0E0C;
  --fg: #F4F1EA;
  --surface: #F4F1EA;
  --surface-fg: #16150F;
  --accent: #E8A33D;
  --accent-ink: #16150F;
  --sage: #7C8B6F;
  --muted: rgba(244, 241, 234, .62);
  --muted-ink: rgba(22, 21, 15, .68);
  --line: rgba(244, 241, 234, .14);
  --line-ink: rgba(22, 21, 15, .14);
  --font-display: 'Instrument Serif', Georgia, serif;
  --font-body: 'Inter', system-ui, -apple-system, sans-serif;
  --wrap: 1120px;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }

body {
  font-family: var(--font-body);
  background: var(--bg);
  color: var(--fg);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}
img { max-width: 100%; display: block; }
a { color: inherit; text-decoration: none; }
ul { list-style: none; }

/* grão sobre a página inteira — estático, não anima */
body::after {
  content: '';
  position: fixed; inset: 0; z-index: 2;
  pointer-events: none; opacity: .045;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E");
}

/* ===== layout ===== */
.wrap { width: min(100% - 2.5rem, var(--wrap)); margin-inline: auto; }
.sec { position: relative; padding: clamp(3.5rem, 9vw, 7.5rem) 0; }
.sec--light { background: var(--surface); color: var(--surface-fg); }
.sec__head { max-width: 42ch; margin-bottom: clamp(2rem, 4vw, 3.25rem); }
.sec__head .lead { margin-top: 1rem; }

/* ===== tipografia ===== */
.display {
  font-family: var(--font-display);
  font-weight: 400; line-height: 1.04; letter-spacing: -.015em;
}
.display--xl { font-size: clamp(2.6rem, 7.2vw, 5rem); }
.display--lg { font-size: clamp(1.9rem, 4.4vw, 3.1rem); }
.display em { font-style: italic; color: var(--accent); }
.lead { font-size: clamp(1.02rem, 1.5vw, 1.25rem); color: var(--muted); max-width: 60ch; }
.sec--light .lead { color: var(--muted-ink); }
.eyebrow {
  display: inline-block;
  font-size: .78rem; font-weight: 600;
  letter-spacing: .16em; text-transform: uppercase;
  color: var(--accent);
}
.sec--light .eyebrow { color: #8A6120; } /* âmbar escurecido para passar AA no claro */

/* ===== botões ===== */
.btn {
  display: inline-flex; align-items: center; gap: .55rem;
  background: var(--accent); color: var(--accent-ink);
  font-family: var(--font-body); font-weight: 600; font-size: 1rem;
  padding: 1rem 1.75rem; border-radius: 999px; border: 0; cursor: pointer;
  transition: transform .25s ease, filter .25s ease;
}
.btn:hover { transform: translateY(-2px); filter: brightness(1.08); }
.btn--lg { padding: 1.15rem 2.25rem; font-size: 1.08rem; }
.btn--ghost {
  background: transparent; color: var(--fg);
  border: 1px solid var(--line);
}
.sec--light .btn--ghost { color: var(--surface-fg); border-color: var(--line-ink); }

a:focus-visible, .btn:focus-visible, summary:focus-visible, button:focus-visible {
  outline: 2px solid var(--accent); outline-offset: 3px;
}
@media (prefers-reduced-motion: reduce) {
  .btn { transition: none; }
  .btn:hover { transform: none; }
}

/* ===== reveals — só escondem quando há motion ===== */
.has-motion .reveal { opacity: 0; }

/* ===== header ===== */
.m-header {
  position: absolute; top: 0; left: 0; right: 0; z-index: 5;
  display: flex; align-items: center; justify-content: space-between;
  padding: 1.5rem clamp(1.25rem, 4vw, 3rem);
}
.m-header__logo { font-family: var(--font-display); font-size: 1.35rem; letter-spacing: -.01em; }
.m-header .btn { padding: .7rem 1.25rem; font-size: .9rem; }
@media (max-width: 640px) { .m-header .btn { display: none; } }

/* ===== footer ===== */
.m-footer {
  border-top: 1px solid var(--line);
  padding: clamp(2.5rem, 5vw, 4rem) 0 calc(clamp(2.5rem, 5vw, 4rem) + env(safe-area-inset-bottom));
  font-size: .92rem; color: var(--muted);
}
.m-footer__grid { display: flex; flex-wrap: wrap; gap: 1.25rem 2.5rem; align-items: baseline; }
.m-footer__name { font-family: var(--font-display); font-size: 1.5rem; color: var(--fg); margin-right: auto; }
.m-footer a:hover { color: var(--accent); }
.m-footer__legal { margin-top: 2rem; font-size: .82rem; opacity: .7; }
@media (max-width: 899px) { .m-footer { padding-bottom: 7rem; } } /* espaço para o CTA sticky */
```

- [ ] **Step 2: Criar `assets/js/mentoria.js`**

```js
/* ===== MENTORIA — motion e CTA sticky. Independente de motion.js ===== */
(() => {
  'use strict';

  // Reveals. Só rodam quando o <head> marcou has-motion e o GSAP carregou.
  function initMotion() {
    if (!document.documentElement.classList.contains('has-motion')) return;
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      // GSAP não carregou (CDN fora do ar): revela tudo para não deixar a página em branco.
      document.documentElement.classList.remove('has-motion');
      return;
    }
    gsap.registerPlugin(ScrollTrigger);

    if (typeof Lenis !== 'undefined') {
      const lenis = new Lenis({ duration: 1.05, smoothWheel: true });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(t => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    }

    // SEMPRE fromTo: from() recaptura o estado no refresh e congela os itens deslocados.
    document.querySelectorAll('[data-reveal]').forEach(block => {
      const items = block.querySelectorAll('.reveal');
      if (!items.length) return;
      gsap.fromTo(items,
        { y: 28, opacity: 0 },
        {
          y: 0, opacity: 1, duration: .8, ease: 'power3.out', stagger: .07,
          scrollTrigger: { trigger: block, start: 'top bottom' }
        });
    });
  }

  // CTA sticky do mobile. Usa IntersectionObserver para funcionar mesmo sem GSAP
  // e com prefers-reduced-motion ligado.
  function initStickyCta() {
    const sticky = document.getElementById('m-sticky');
    const hero = document.getElementById('hero');
    const oferta = document.getElementById('oferta');
    if (!sticky || !hero || !oferta || !('IntersectionObserver' in window)) return;

    let heroOut = false, ofertaIn = false;
    const sync = () => sticky.classList.toggle('is-on', heroOut && !ofertaIn);

    new IntersectionObserver(([e]) => { heroOut = !e.isIntersecting; sync(); }).observe(hero);
    new IntersectionObserver(([e]) => { ofertaIn = e.isIntersecting; sync(); }).observe(oferta);
  }

  initMotion();
  initStickyCta();
})();
```

- [ ] **Step 3: Criar `mentoria.html` com o shell**

Note o script inline no `<head>`: ele marca `has-motion` antes da primeira pintura, evitando que o conteúdo pisque visível e depois suma.

```html
<!DOCTYPE html>
<html lang="pt-BR">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mentoria — Rodrigo Scharp</title>
  <meta name="description" content="[DESCRIÇÃO DA MENTORIA EM UMA FRASE — aparece no Google e no preview de link]">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/css/mentoria.css">
  <link rel="icon" type="image/png" href="assets/img/favicon.png">
  <link rel="apple-touch-icon" href="assets/img/favicon.png">
  <script>
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.classList.add('has-motion');
    }
  </script>
</head>

<body>
  <header class="m-header">
    <a href="index.html" class="m-header__logo">Rodrigo Scharp</a>
    <a class="btn" data-cta="header" target="_blank" rel="noopener noreferrer"
       href="https://wa.me/[NUMERO_WHATSAPP]?text=Oi%20Rodrigo!%20Quero%20saber%20mais%20sobre%20a%20mentoria.">Quero participar</a>
  </header>

  <main>
    <!-- as seções entram aqui, tasks 2 a 8 -->
  </main>

  <footer class="m-footer">
    <div class="wrap">
      <div class="m-footer__grid">
        <span class="m-footer__name">Rodrigo Scharp</span>
        <a target="_blank" rel="noopener noreferrer"
           href="https://wa.me/[NUMERO_WHATSAPP]?text=Oi%20Rodrigo!%20Quero%20saber%20mais%20sobre%20a%20mentoria.">WhatsApp</a>
        <a href="mailto:rodrigoscharp@gmail.com">rodrigoscharp@gmail.com</a>
        <a href="index.html">Portfólio</a>
      </div>
      <div class="m-footer__legal">© 2026 Rodrigo Scharp. Todos os direitos reservados.</div>
    </div>
  </footer>

  <script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/lenis@1.3.11/dist/lenis.min.js"></script>
  <script src="assets/js/mentoria.js"></script>
</body>

</html>
```

- [ ] **Step 4: Subir o servidor e verificar**

```bash
npm run dev &   # se ainda não estiver rodando
NODE_PATH=/Users/rodrigoscharp/.npm/_npx/e41f203b7505f1fb/node_modules \
  node scripts/verify-shot.cjs http://localhost:5500/mentoria.html /tmp/m-01-shell.png 1440
```

Esperado: `no console errors`. Na imagem: fundo quase preto, "Rodrigo Scharp" em serifa no topo à esquerda, botão âmbar à direita, footer com os links. Sem nenhum resquício de creme/lime/Anton do portfólio.

- [ ] **Step 5: Confirmar o isolamento**

```bash
grep -c "lando-system\|motion.js" mentoria.html
```

Esperado: `0`. Se for maior que zero, a página está puxando o sistema do portfólio — corrija antes de commitar.

- [ ] **Step 6: Commit**

```bash
git add mentoria.html assets/css/mentoria.css assets/js/mentoria.js
git commit -m "feat: cria fundação da landing page da mentoria"
```

---

### Task 2: Hero e CTA sticky

**Files:**
- Modify: `mentoria.html` (dentro de `<main>`)
- Modify: `assets/css/mentoria.css` (acrescentar ao fim)

**Interfaces:**
- Consumes: `.wrap`, `.display--xl`, `.lead`, `.eyebrow`, `.btn--lg`, `.reveal`, `data-reveal` da Task 1; `initStickyCta()` procura `#hero`, `#oferta` e `#m-sticky`.
- Produces: `<section id="hero">` e `<div id="m-sticky">` — a Task 7 cria `#oferta`, que o sticky também observa. Até a Task 7 existir, o sticky simplesmente não aparece (o guard do JS exige os três elementos).

- [ ] **Step 1: Acrescentar o hero dentro de `<main>` em `mentoria.html`**

```html
    <!-- 1 — HERO -->
    <section class="sec m-hero" id="hero" data-reveal>
      <div class="m-hero__glow" aria-hidden="true"></div>
      <div class="wrap m-hero__inner">
        <span class="eyebrow reveal">[NOME DA MENTORIA]</span>
        <h1 class="display display--xl reveal">
          [PROMESSA PRINCIPAL — o resultado concreto, <em>em uma frase</em>]
        </h1>
        <p class="lead reveal">[SUBHEADLINE — pra quem é, em quanto tempo e como. Duas linhas no máximo.]</p>
        <div class="m-hero__cta reveal">
          <a class="btn btn--lg" data-cta="hero" target="_blank" rel="noopener noreferrer"
             href="https://wa.me/[NUMERO_WHATSAPP]?text=Oi%20Rodrigo!%20Quero%20saber%20mais%20sobre%20a%20mentoria.">Quero uma vaga ↗</a>
          <span class="m-hero__cta-note">[VAGAS LIMITADAS / PRÓXIMA TURMA EM XX]</span>
        </div>
        <ul class="m-hero__proof reveal">
          <li><strong>[NÚMERO]</strong><span>[o que o número prova]</span></li>
          <li><strong>[NÚMERO]</strong><span>[o que o número prova]</span></li>
          <li><strong>[NÚMERO]</strong><span>[o que o número prova]</span></li>
        </ul>
      </div>
    </section>
```

- [ ] **Step 2: Acrescentar o CTA sticky logo antes de `</body>`, depois do `<footer>`**

```html
  <div class="m-sticky" id="m-sticky">
    <a class="btn" data-cta="sticky" target="_blank" rel="noopener noreferrer"
       href="https://wa.me/[NUMERO_WHATSAPP]?text=Oi%20Rodrigo!%20Quero%20saber%20mais%20sobre%20a%20mentoria.">Quero uma vaga ↗</a>
  </div>
```

- [ ] **Step 3: Acrescentar o CSS do hero e do sticky ao fim de `assets/css/mentoria.css`**

```css
/* ===== hero ===== */
.m-hero { min-height: 100svh; display: flex; align-items: center; overflow: hidden; }
.m-hero__inner { position: relative; z-index: 1; padding-top: 5rem; }
.m-hero__glow {
  position: absolute; z-index: 0;
  top: -20%; left: 50%; translate: -50% 0;
  width: min(120vw, 1100px); aspect-ratio: 1;
  background: radial-gradient(circle, rgba(232, 163, 61, .20) 0%, rgba(232, 163, 61, 0) 62%);
  pointer-events: none;
}
.m-hero h1 { margin: 1.25rem 0 1.5rem; max-width: 17ch; }
.m-hero__cta { display: flex; flex-wrap: wrap; align-items: center; gap: 1rem 1.5rem; margin-top: 2.5rem; }
.m-hero__cta-note { font-size: .88rem; color: var(--muted); }
.m-hero__proof {
  display: flex; flex-wrap: wrap; gap: 2.5rem;
  margin-top: clamp(2.5rem, 5vw, 4rem);
  padding-top: 2rem; border-top: 1px solid var(--line);
}
.m-hero__proof li { display: flex; flex-direction: column; gap: .25rem; }
.m-hero__proof strong {
  font-family: var(--font-display); font-weight: 400;
  font-size: clamp(1.8rem, 3.2vw, 2.5rem); color: var(--accent); line-height: 1;
}
.m-hero__proof span { font-size: .86rem; color: var(--muted); max-width: 18ch; }
@media (max-width: 640px) {
  .m-hero__proof { gap: 1.5rem 2rem; }
  .m-hero__proof li { min-width: 40%; }
}

/* ===== CTA sticky (mobile) ===== */
.m-sticky {
  position: fixed; z-index: 20;
  left: 0; right: 0; bottom: 0;
  padding: .85rem 1.25rem calc(.85rem + env(safe-area-inset-bottom));
  background: rgba(15, 14, 12, .92);
  backdrop-filter: blur(10px);
  border-top: 1px solid var(--line);
  display: none;
  translate: 0 110%;
  transition: translate .35s cubic-bezier(.65, .05, 0, 1);
}
.m-sticky .btn { width: 100%; justify-content: center; }
.m-sticky.is-on { translate: 0 0; }
@media (max-width: 899px) { .m-sticky { display: block; } }
@media (prefers-reduced-motion: reduce) { .m-sticky { transition: none; } }
```

- [ ] **Step 4: Verificar desktop, scroll 0**

```bash
NODE_PATH=/Users/rodrigoscharp/.npm/_npx/e41f203b7505f1fb/node_modules \
  node scripts/verify-shot.cjs http://localhost:5500/mentoria.html /tmp/m-02-hero-1440.png 1440
```

Esperado: `no console errors`; hero ocupando a tela, halo âmbar atrás do título, headline visível (opacidade 1 — se estiver invisível, o reveal não disparou no scroll 0: confira que o `start` é `'top bottom'`).

- [ ] **Step 5: Verificar mobile**

```bash
NODE_PATH=/Users/rodrigoscharp/.npm/_npx/e41f203b7505f1fb/node_modules \
  node scripts/verify-shot.cjs http://localhost:5500/mentoria.html /tmp/m-02-hero-390.png 390
```

Esperado: headline sem estourar a largura, os 3 números em duas linhas, nenhum scroll horizontal. O CTA sticky **não** deve aparecer ainda (só liga quando `#oferta` existir, na Task 7).

- [ ] **Step 6: Commit**

```bash
git add mentoria.html assets/css/mentoria.css
git commit -m "feat: adiciona hero e CTA sticky da LP da mentoria"
```

---

### Task 3: Prova social e "é pra você se…"

**Files:**
- Modify: `mentoria.html` (dentro de `<main>`, depois do `#hero`)
- Modify: `assets/css/mentoria.css` (acrescentar ao fim)

**Interfaces:**
- Consumes: `.wrap`, `.sec`, `.sec__head`, `.display--lg`, `.eyebrow`, `.lead`, `.reveal`, `data-reveal`.
- Produces: `.m-marquee` (faixa infinita em CSS puro, sem JS) e `.m-grid` + `.m-card` — o grid e o card genéricos reutilizados nas Tasks 5 e 6.

- [ ] **Step 1: Acrescentar as duas seções em `mentoria.html`, depois do `#hero`**

O `<ul>` do marquee é duplicado de propósito: a animação desloca 50% da faixa, então a segunda cópia entra na tela no exato instante em que a primeira sai. `aria-hidden` na cópia evita que o leitor de tela leia tudo duas vezes.

```html
    <!-- 2 — PROVA SOCIAL -->
    <section class="m-marquee" id="prova" aria-label="Onde já estive">
      <div class="m-marquee__track">
        <ul class="m-marquee__row">
          <li>[PROVA 1]</li><li>[PROVA 2]</li><li>[PROVA 3]</li>
          <li>[PROVA 4]</li><li>[PROVA 5]</li><li>[PROVA 6]</li>
        </ul>
        <ul class="m-marquee__row" aria-hidden="true">
          <li>[PROVA 1]</li><li>[PROVA 2]</li><li>[PROVA 3]</li>
          <li>[PROVA 4]</li><li>[PROVA 5]</li><li>[PROVA 6]</li>
        </ul>
      </div>
    </section>

    <!-- 3 — É PRA VOCÊ SE… -->
    <section class="sec" id="dores" data-reveal>
      <div class="wrap">
        <div class="sec__head">
          <span class="eyebrow reveal">Diagnóstico</span>
          <h2 class="display display--lg reveal">Isso aqui é <em>pra você</em> se…</h2>
        </div>
        <div class="m-grid m-grid--2">
          <article class="m-card reveal">
            <span class="m-card__num">01</span>
            <p>“[DOR 1 — escrita na primeira pessoa, do jeito que a pessoa fala consigo mesma]”</p>
          </article>
          <article class="m-card reveal">
            <span class="m-card__num">02</span>
            <p>“[DOR 2]”</p>
          </article>
          <article class="m-card reveal">
            <span class="m-card__num">03</span>
            <p>“[DOR 3]”</p>
          </article>
          <article class="m-card reveal">
            <span class="m-card__num">04</span>
            <p>“[DOR 4]”</p>
          </article>
        </div>
        <p class="lead m-note reveal">[FRASE DE VIRADA — algo como “se você marcou dois desses, a mentoria resolve exatamente isso”.]</p>
      </div>
    </section>
```

- [ ] **Step 2: Acrescentar o CSS ao fim de `assets/css/mentoria.css`**

```css
/* ===== marquee de prova social ===== */
.m-marquee {
  position: relative; overflow: hidden;
  padding: 1.5rem 0;
  border-block: 1px solid var(--line);
  background: rgba(244, 241, 234, .03);
}
.m-marquee__track { display: flex; width: max-content; animation: m-scroll 38s linear infinite; }
.m-marquee__row { display: flex; }
.m-marquee__row li {
  display: flex; align-items: center;
  padding-inline: clamp(1.5rem, 4vw, 3rem);
  font-size: clamp(.95rem, 1.4vw, 1.15rem);
  font-weight: 500; color: var(--muted); white-space: nowrap;
}
.m-marquee__row li::after { content: '•'; margin-left: clamp(1.5rem, 4vw, 3rem); color: var(--accent); }
@keyframes m-scroll { to { transform: translateX(-50%); } }
@media (prefers-reduced-motion: reduce) { .m-marquee__track { animation: none; } }

/* ===== grid e card genéricos ===== */
.m-grid { display: grid; gap: 1.25rem; }
.m-grid--2 { grid-template-columns: repeat(2, 1fr); }
.m-grid--3 { grid-template-columns: repeat(3, 1fr); }
@media (max-width: 899px) { .m-grid--3 { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 640px) { .m-grid--2, .m-grid--3 { grid-template-columns: 1fr; } }

.m-card {
  padding: clamp(1.5rem, 2.5vw, 2rem);
  border: 1px solid var(--line); border-radius: 1.25rem;
  background: rgba(244, 241, 234, .028);
  display: flex; flex-direction: column; gap: .9rem;
}
.m-card__num {
  font-family: var(--font-display); font-size: 1.5rem;
  color: var(--accent); line-height: 1;
}
.m-card p { font-size: 1.02rem; }
.m-card h3 { font-family: var(--font-display); font-weight: 400; font-size: 1.5rem; line-height: 1.15; }
.sec--light .m-card { border-color: var(--line-ink); background: rgba(22, 21, 15, .03); }

.m-note { margin-top: clamp(2rem, 4vw, 3rem); }
```

- [ ] **Step 3: Verificar a seção de dores rolada, em desktop**

O quarto argumento do script é um seletor: ele rola até o elemento antes do screenshot.

```bash
NODE_PATH=/Users/rodrigoscharp/.npm/_npx/e41f203b7505f1fb/node_modules \
  node scripts/verify-shot.cjs http://localhost:5500/mentoria.html /tmp/m-03-dores-1440.png 1440 "#dores"
```

Esperado: `no console errors`; 4 cards em 2×2, todos com opacidade cheia e **alinhados na base do card** — se o último card aparecer deslocado uns 60% para baixo do próprio slot, o reveal usou `from()` em vez de `fromTo()`. Corrija no `mentoria.js`.

- [ ] **Step 4: Verificar em mobile**

```bash
NODE_PATH=/Users/rodrigoscharp/.npm/_npx/e41f203b7505f1fb/node_modules \
  node scripts/verify-shot.cjs http://localhost:5500/mentoria.html /tmp/m-03-dores-390.png 390 "#dores"
```

Esperado: cards em coluna única, marquee sem provocar scroll horizontal na página.

- [ ] **Step 5: Commit**

```bash
git add mentoria.html assets/css/mentoria.css
git commit -m "feat: adiciona prova social e seção de dores na LP da mentoria"
```

---

### Task 4: Transformação e "quem sou eu"

**Files:**
- Modify: `mentoria.html`
- Modify: `assets/css/mentoria.css`

**Interfaces:**
- Consumes: `.wrap`, `.sec`, `.sec__head`, `.display--lg`, `.eyebrow`, `.lead`, `.btn--ghost`, `.reveal`.
- Produces: `.m-versus` (comparação antes/depois) e `.m-about` (autoridade com foto).

- [ ] **Step 1: Acrescentar as duas seções em `mentoria.html`, depois de `#dores`**

A foto usa `assets/img/rodrigo_about.jpeg`, que já existe no repositório.

```html
    <!-- 4 — A TRANSFORMAÇÃO -->
    <section class="sec" id="transformacao" data-reveal>
      <div class="wrap">
        <div class="sec__head">
          <span class="eyebrow reveal">A virada</span>
          <h2 class="display display--lg reveal">De onde você está <em>para onde dá</em> pra chegar</h2>
        </div>
        <div class="m-versus">
          <div class="m-versus__col m-versus__col--before reveal">
            <h3>Hoje</h3>
            <ul>
              <li>[SITUAÇÃO ATUAL 1]</li>
              <li>[SITUAÇÃO ATUAL 2]</li>
              <li>[SITUAÇÃO ATUAL 3]</li>
              <li>[SITUAÇÃO ATUAL 4]</li>
            </ul>
          </div>
          <div class="m-versus__col m-versus__col--after reveal">
            <h3>Depois da mentoria</h3>
            <ul>
              <li>[RESULTADO 1]</li>
              <li>[RESULTADO 2]</li>
              <li>[RESULTADO 3]</li>
              <li>[RESULTADO 4]</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- 5 — QUEM SOU EU -->
    <section class="sec" id="sobre" data-reveal>
      <div class="wrap m-about">
        <div class="m-about__media reveal">
          <img src="assets/img/rodrigo_about.jpeg" alt="Rodrigo Scharp" width="640" height="800" loading="lazy">
        </div>
        <div class="m-about__body">
          <span class="eyebrow reveal">Quem vai te acompanhar</span>
          <h2 class="display display--lg reveal">Rodrigo <em>Scharp</em></h2>
          <p class="lead reveal">[BIO — 3 a 4 linhas conectando sua trajetória à promessa da mentoria. Não conte sua vida: conte o que te credencia a entregar exatamente esse resultado.]</p>
          <ul class="m-about__creds reveal">
            <li>[CREDENCIAL 1]</li>
            <li>[CREDENCIAL 2]</li>
            <li>[CREDENCIAL 3]</li>
          </ul>
          <a class="btn btn--ghost reveal" href="index.html">Ver meu portfólio ↗</a>
        </div>
      </div>
    </section>
```

- [ ] **Step 2: Acrescentar o CSS ao fim de `assets/css/mentoria.css`**

```css
/* ===== transformação ===== */
.m-versus { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.25rem; }
@media (max-width: 640px) { .m-versus { grid-template-columns: 1fr; } }
.m-versus__col { padding: clamp(1.5rem, 3vw, 2.25rem); border-radius: 1.25rem; border: 1px solid var(--line); }
.m-versus__col h3 {
  font-family: var(--font-display); font-weight: 400; font-size: 1.6rem;
  margin-bottom: 1.25rem; padding-bottom: 1rem; border-bottom: 1px solid var(--line);
}
.m-versus__col li { display: flex; gap: .75rem; padding: .65rem 0; font-size: 1.02rem; }
.m-versus__col li::before { flex: none; font-weight: 600; }
.m-versus__col--before { background: rgba(244, 241, 234, .02); color: var(--muted); }
.m-versus__col--before li::before { content: '✗'; color: rgba(244, 241, 234, .45); }
.m-versus__col--after { background: rgba(124, 139, 111, .10); border-color: rgba(124, 139, 111, .38); }
.m-versus__col--after li::before { content: '✓'; color: var(--sage); }

/* ===== quem sou eu ===== */
.m-about { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: clamp(2rem, 5vw, 4rem); align-items: center; }
@media (max-width: 899px) { .m-about { grid-template-columns: 1fr; } }
.m-about__media { border-radius: 1.5rem; overflow: hidden; border: 1px solid var(--line); }
.m-about__media img { width: 100%; height: 100%; object-fit: cover; aspect-ratio: 4 / 5; }
.m-about__body h2 { margin: 1rem 0 1.25rem; }
.m-about__creds { margin: 1.75rem 0; display: flex; flex-direction: column; gap: .6rem; }
.m-about__creds li { display: flex; gap: .7rem; font-size: 1rem; color: var(--muted); }
.m-about__creds li::before { content: '—'; color: var(--accent); }
```

- [ ] **Step 3: Verificar as duas seções**

```bash
NODE_PATH=/Users/rodrigoscharp/.npm/_npx/e41f203b7505f1fb/node_modules \
  node scripts/verify-shot.cjs http://localhost:5500/mentoria.html /tmp/m-04-versus-1440.png 1440 "#transformacao"
NODE_PATH=/Users/rodrigoscharp/.npm/_npx/e41f203b7505f1fb/node_modules \
  node scripts/verify-shot.cjs http://localhost:5500/mentoria.html /tmp/m-04-sobre-390.png 390 "#sobre"
```

Esperado: `no console errors` nas duas; coluna "Depois" com fundo esverdeado e ✓ em sálvia; em 390px a foto aparece acima do texto e não distorce (aspect-ratio 4/5 preservado).

- [ ] **Step 4: Commit**

```bash
git add mentoria.html assets/css/mentoria.css
git commit -m "feat: adiciona transformação e autoridade na LP da mentoria"
```

---

### Task 5: Como funciona e pilares

**Files:**
- Modify: `mentoria.html`
- Modify: `assets/css/mentoria.css`

**Interfaces:**
- Consumes: `.wrap`, `.sec`, `.sec__head`, `.display--lg`, `.eyebrow`, `.lead`, `.m-grid--3`, `.m-card`, `.reveal`.
- Produces: `.m-steps` (timeline vertical numerada).

- [ ] **Step 1: Acrescentar as duas seções em `mentoria.html`, depois de `#sobre`**

```html
    <!-- 6 — COMO FUNCIONA -->
    <section class="sec" id="funciona" data-reveal>
      <div class="wrap">
        <div class="sec__head">
          <span class="eyebrow reveal">O formato</span>
          <h2 class="display display--lg reveal">Como a mentoria <em>funciona</em></h2>
          <p class="lead reveal">[UMA FRASE sobre o ritmo: quantos encontros, com que frequência, por quanto tempo.]</p>
        </div>
        <ol class="m-steps">
          <li class="m-steps__item reveal">
            <span class="m-steps__num">01</span>
            <div>
              <h3>[ETAPA 1 — TÍTULO]</h3>
              <p>[O que acontece nessa etapa e o que a pessoa sai tendo.]</p>
            </div>
          </li>
          <li class="m-steps__item reveal">
            <span class="m-steps__num">02</span>
            <div>
              <h3>[ETAPA 2 — TÍTULO]</h3>
              <p>[O que acontece nessa etapa e o que a pessoa sai tendo.]</p>
            </div>
          </li>
          <li class="m-steps__item reveal">
            <span class="m-steps__num">03</span>
            <div>
              <h3>[ETAPA 3 — TÍTULO]</h3>
              <p>[O que acontece nessa etapa e o que a pessoa sai tendo.]</p>
            </div>
          </li>
          <li class="m-steps__item reveal">
            <span class="m-steps__num">04</span>
            <div>
              <h3>[ETAPA 4 — TÍTULO]</h3>
              <p>[O que acontece nessa etapa e o que a pessoa sai tendo.]</p>
            </div>
          </li>
        </ol>
      </div>
    </section>

    <!-- 7 — O QUE VOCÊ VAI DOMINAR -->
    <section class="sec" id="pilares" data-reveal>
      <div class="wrap">
        <div class="sec__head">
          <span class="eyebrow reveal">Conteúdo</span>
          <h2 class="display display--lg reveal">O que você vai <em>dominar</em></h2>
        </div>
        <div class="m-grid m-grid--3">
          <article class="m-card reveal">
            <span class="m-card__num">01</span>
            <h3>[PILAR 1 — TÍTULO]</h3>
            <p>[Uma ou duas linhas sobre o que a pessoa aprende aqui.]</p>
          </article>
          <article class="m-card reveal">
            <span class="m-card__num">02</span>
            <h3>[PILAR 2 — TÍTULO]</h3>
            <p>[Uma ou duas linhas sobre o que a pessoa aprende aqui.]</p>
          </article>
          <article class="m-card reveal">
            <span class="m-card__num">03</span>
            <h3>[PILAR 3 — TÍTULO]</h3>
            <p>[Uma ou duas linhas sobre o que a pessoa aprende aqui.]</p>
          </article>
          <article class="m-card reveal">
            <span class="m-card__num">04</span>
            <h3>[PILAR 4 — TÍTULO]</h3>
            <p>[Uma ou duas linhas sobre o que a pessoa aprende aqui.]</p>
          </article>
          <article class="m-card reveal">
            <span class="m-card__num">05</span>
            <h3>[PILAR 5 — TÍTULO]</h3>
            <p>[Uma ou duas linhas sobre o que a pessoa aprende aqui.]</p>
          </article>
          <article class="m-card reveal">
            <span class="m-card__num">06</span>
            <h3>[PILAR 6 — TÍTULO]</h3>
            <p>[Uma ou duas linhas sobre o que a pessoa aprende aqui.]</p>
          </article>
        </div>
      </div>
    </section>
```

- [ ] **Step 2: Acrescentar o CSS ao fim de `assets/css/mentoria.css`**

```css
/* ===== como funciona ===== */
.m-steps { display: flex; flex-direction: column; }
.m-steps__item {
  display: grid; grid-template-columns: auto 1fr;
  gap: clamp(1.25rem, 3vw, 2.5rem);
  padding: clamp(1.5rem, 3vw, 2.25rem) 0;
  border-top: 1px solid var(--line);
}
.m-steps__item:last-child { border-bottom: 1px solid var(--line); }
.m-steps__num {
  font-family: var(--font-display); font-weight: 400;
  font-size: clamp(1.6rem, 3vw, 2.4rem); line-height: 1;
  color: var(--accent); min-width: 2.5ch;
}
.m-steps__item h3 {
  font-family: var(--font-display); font-weight: 400;
  font-size: clamp(1.35rem, 2.4vw, 1.9rem); line-height: 1.15; margin-bottom: .5rem;
}
.m-steps__item p { color: var(--muted); max-width: 62ch; }
```

- [ ] **Step 3: Verificar**

```bash
NODE_PATH=/Users/rodrigoscharp/.npm/_npx/e41f203b7505f1fb/node_modules \
  node scripts/verify-shot.cjs http://localhost:5500/mentoria.html /tmp/m-05-funciona-1440.png 1440 "#funciona"
NODE_PATH=/Users/rodrigoscharp/.npm/_npx/e41f203b7505f1fb/node_modules \
  node scripts/verify-shot.cjs http://localhost:5500/mentoria.html /tmp/m-05-pilares-390.png 390 "#pilares"
```

Esperado: `no console errors`; a timeline com números âmbar alinhados à esquerda e linhas divisórias contínuas; os 6 pilares em coluna única no mobile, nenhum card cortado pela metade.

- [ ] **Step 4: Commit**

```bash
git add mentoria.html assets/css/mentoria.css
git commit -m "feat: adiciona formato e pilares da mentoria na LP"
```

---

### Task 6: O que está incluso e depoimentos

**Files:**
- Modify: `mentoria.html`
- Modify: `assets/css/mentoria.css`

**Interfaces:**
- Consumes: `.wrap`, `.sec`, `.sec__head`, `.display--lg`, `.eyebrow`, `.m-grid--3`, `.reveal`.
- Produces: `.m-includes` (checklist com valor por item) e `.m-quote` (cards de depoimento).

A seção de depoimentos é entregue **com o atributo `hidden`**. Depoimento inventado é o maior risco de uma página de venda: a seção só entra no ar quando existirem depoimentos reais. O comentário no HTML explica como ligar.

- [ ] **Step 1: Acrescentar as duas seções em `mentoria.html`, depois de `#pilares`**

```html
    <!-- 8 — O QUE ESTÁ INCLUSO -->
    <section class="sec" id="incluso" data-reveal>
      <div class="wrap">
        <div class="sec__head">
          <span class="eyebrow reveal">Entregáveis</span>
          <h2 class="display display--lg reveal">O que está <em>incluso</em></h2>
        </div>
        <ul class="m-includes">
          <li class="m-includes__item reveal">
            <div><h3>[ITEM 1]</h3><p>[O que é, em uma linha.]</p></div>
            <span class="m-includes__value">[R$ XXX]</span>
          </li>
          <li class="m-includes__item reveal">
            <div><h3>[ITEM 2]</h3><p>[O que é, em uma linha.]</p></div>
            <span class="m-includes__value">[R$ XXX]</span>
          </li>
          <li class="m-includes__item reveal">
            <div><h3>[ITEM 3]</h3><p>[O que é, em uma linha.]</p></div>
            <span class="m-includes__value">[R$ XXX]</span>
          </li>
          <li class="m-includes__item m-includes__item--bonus reveal">
            <div><h3>Bônus — [BÔNUS 1]</h3><p>[O que é, em uma linha.]</p></div>
            <span class="m-includes__value">[R$ XXX]</span>
          </li>
        </ul>
        <p class="m-includes__total reveal">Valor somado: <strong>[R$ X.XXX]</strong> — [FRASE sobre o que você cobra em vez disso]</p>
      </div>
    </section>

    <!-- 9 — DEPOIMENTOS
         Está oculto de propósito. Para publicar: remova o atributo hidden
         abaixo e troque os placeholders por depoimentos reais, com nome e
         resultado verdadeiros. Não publique esta seção com texto inventado. -->
    <section class="sec" id="depoimentos" data-reveal hidden>
      <div class="wrap">
        <div class="sec__head">
          <span class="eyebrow reveal">Resultados</span>
          <h2 class="display display--lg reveal">Quem já <em>passou por aqui</em></h2>
        </div>
        <div class="m-grid m-grid--3">
          <figure class="m-quote reveal">
            <blockquote>“[DEPOIMENTO 1 — o resultado concreto que a pessoa teve.]”</blockquote>
            <figcaption>
              <img src="assets/img/[FOTO-1.jpg]" alt="" width="56" height="56" loading="lazy">
              <span><strong>[NOME 1]</strong>[CARGO / RESULTADO]</span>
            </figcaption>
          </figure>
          <figure class="m-quote reveal">
            <blockquote>“[DEPOIMENTO 2 — o resultado concreto que a pessoa teve.]”</blockquote>
            <figcaption>
              <img src="assets/img/[FOTO-2.jpg]" alt="" width="56" height="56" loading="lazy">
              <span><strong>[NOME 2]</strong>[CARGO / RESULTADO]</span>
            </figcaption>
          </figure>
          <figure class="m-quote reveal">
            <blockquote>“[DEPOIMENTO 3 — o resultado concreto que a pessoa teve.]”</blockquote>
            <figcaption>
              <img src="assets/img/[FOTO-3.jpg]" alt="" width="56" height="56" loading="lazy">
              <span><strong>[NOME 3]</strong>[CARGO / RESULTADO]</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
```

- [ ] **Step 2: Acrescentar o CSS ao fim de `assets/css/mentoria.css`**

```css
/* ===== o que está incluso ===== */
.m-includes { display: flex; flex-direction: column; }
.m-includes__item {
  display: flex; align-items: baseline; justify-content: flex-start;
  gap: 1.5rem; padding: 1.4rem 0; border-top: 1px solid var(--line);
}
.m-includes__item:last-of-type { border-bottom: 1px solid var(--line); }
.m-includes__item h3 { font-size: 1.12rem; font-weight: 600; margin-bottom: .3rem; }
.m-includes__item p { color: var(--muted); font-size: .98rem; max-width: 58ch; }
.m-includes__item::before { content: '✓'; color: var(--sage); font-weight: 600; margin-right: 1rem; }
.m-includes__item--bonus h3 { color: var(--accent); }
.m-includes__value { flex: none; font-family: var(--font-display); font-size: 1.2rem; color: var(--muted); margin-left: auto; }
.m-includes__total { margin-top: 1.75rem; color: var(--muted); }
.m-includes__total strong { color: var(--fg); }
@media (max-width: 640px) {
  .m-includes__item { flex-direction: column; align-items: flex-start; gap: .5rem; }
  .m-includes__value { margin-left: 0; }
}

/* ===== depoimentos ===== */
.m-quote {
  padding: clamp(1.5rem, 2.5vw, 2rem);
  border: 1px solid var(--line); border-radius: 1.25rem;
  background: rgba(244, 241, 234, .028);
  display: flex; flex-direction: column; gap: 1.5rem;
}
.m-quote blockquote { font-size: 1.05rem; line-height: 1.6; }
.m-quote figcaption { display: flex; align-items: center; gap: .85rem; margin-top: auto; }
.m-quote figcaption img { width: 56px; height: 56px; border-radius: 50%; object-fit: cover; }
.m-quote figcaption span { display: flex; flex-direction: column; font-size: .9rem; color: var(--muted); }
.m-quote figcaption strong { color: var(--fg); font-size: 1rem; }
```

- [ ] **Step 3: Verificar**

```bash
NODE_PATH=/Users/rodrigoscharp/.npm/_npx/e41f203b7505f1fb/node_modules \
  node scripts/verify-shot.cjs http://localhost:5500/mentoria.html /tmp/m-06-incluso-1440.png 1440 "#incluso"
```

Esperado: `no console errors`; a lista com ✓ em sálvia à esquerda e o valor à direita; **a seção de depoimentos não deve aparecer em lugar nenhum** (está `hidden`). Se ela aparecer, algum CSS está sobrescrevendo `display` no elemento — `hidden` perde para qualquer `display` explícito.

- [ ] **Step 4: Conferir que o `hidden` está valendo**

```bash
grep -n 'id="depoimentos"' mentoria.html
```

Esperado: a linha contém `hidden`.

- [ ] **Step 5: Commit**

```bash
git add mentoria.html assets/css/mentoria.css
git commit -m "feat: adiciona entregáveis e estrutura de depoimentos na LP"
```

---

### Task 7: Oferta e FAQ

O bloco de decisão. As duas seções vão em faixa clara (`.sec--light`) para contrastar com o resto da página e destacar o momento da compra.

**Files:**
- Modify: `mentoria.html`
- Modify: `assets/css/mentoria.css`

**Interfaces:**
- Consumes: `.wrap`, `.sec--light`, `.display--lg`, `.eyebrow`, `.btn--lg`, `.reveal`.
- Produces: `<section id="oferta">` — a partir daqui o `initStickyCta()` da Task 1 tem os três elementos de que precisa e o CTA sticky passa a funcionar. Também produz `.m-offer` e `.m-faq`.

- [ ] **Step 1: Acrescentar as duas seções em `mentoria.html`, depois de `#depoimentos`**

O FAQ usa `<details>`/`<summary>` nativos: teclado e leitor de tela funcionam sem uma linha de JavaScript.

```html
    <!-- 10 — OFERTA -->
    <section class="sec sec--light" id="oferta" data-reveal>
      <div class="wrap">
        <div class="sec__head">
          <span class="eyebrow reveal">A oferta</span>
          <h2 class="display display--lg reveal">Entre para a <em>[NOME DA MENTORIA]</em></h2>
        </div>
        <div class="m-offer reveal">
          <div class="m-offer__body">
            <h3>[NOME DO PLANO]</h3>
            <p class="m-offer__sub">[Uma linha sobre o que o plano entrega.]</p>
            <ul class="m-offer__list">
              <li>[ENTREGÁVEL 1]</li>
              <li>[ENTREGÁVEL 2]</li>
              <li>[ENTREGÁVEL 3]</li>
              <li>[ENTREGÁVEL 4]</li>
              <li>[ENTREGÁVEL 5]</li>
            </ul>
          </div>
          <div class="m-offer__price">
            <span class="m-offer__from">De <s>[R$ X.XXX]</s> por</span>
            <span class="m-offer__amount">[R$ X.XXX]</span>
            <span class="m-offer__terms">ou [X]× de [R$ XXX]</span>
            <a class="btn btn--lg" data-cta="oferta" target="_blank" rel="noopener noreferrer"
               href="https://wa.me/[NUMERO_WHATSAPP]?text=Oi%20Rodrigo!%20Quero%20saber%20mais%20sobre%20a%20mentoria.">Garantir minha vaga ↗</a>
            <p class="m-offer__guarantee">[GARANTIA — ex: 7 dias para pedir reembolso, sem perguntas.]</p>
            <p class="m-offer__scarcity">[VAGAS — ex: apenas X vagas nesta turma.]</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 11 — FAQ -->
    <section class="sec sec--light" id="faq" data-reveal style="padding-top:0">
      <div class="wrap">
        <div class="sec__head">
          <span class="eyebrow reveal">Dúvidas</span>
          <h2 class="display display--lg reveal">Perguntas <em>frequentes</em></h2>
        </div>
        <div class="m-faq">
          <details class="m-faq__item reveal">
            <summary>[PERGUNTA 1 — a objeção de preço]</summary>
            <p>[RESPOSTA 1]</p>
          </details>
          <details class="m-faq__item reveal">
            <summary>[PERGUNTA 2 — a objeção de tempo]</summary>
            <p>[RESPOSTA 2]</p>
          </details>
          <details class="m-faq__item reveal">
            <summary>[PERGUNTA 3 — "serve pro meu nível?"]</summary>
            <p>[RESPOSTA 3]</p>
          </details>
          <details class="m-faq__item reveal">
            <summary>[PERGUNTA 4 — como são os encontros]</summary>
            <p>[RESPOSTA 4]</p>
          </details>
          <details class="m-faq__item reveal">
            <summary>[PERGUNTA 5 — o que acontece se eu não gostar]</summary>
            <p>[RESPOSTA 5]</p>
          </details>
          <details class="m-faq__item reveal">
            <summary>[PERGUNTA 6 — como faço para entrar]</summary>
            <p>[RESPOSTA 6]</p>
          </details>
        </div>
      </div>
    </section>
```

- [ ] **Step 2: Acrescentar o CSS ao fim de `assets/css/mentoria.css`**

```css
/* ===== oferta ===== */
.m-offer {
  display: grid; grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
  gap: clamp(1.5rem, 4vw, 3rem);
  padding: clamp(1.75rem, 3.5vw, 3rem);
  border: 1px solid var(--line-ink); border-radius: 1.5rem;
  background: #FFFDF7;
}
@media (max-width: 899px) { .m-offer { grid-template-columns: 1fr; } }
.m-offer__body h3 { font-family: var(--font-display); font-weight: 400; font-size: clamp(1.7rem, 3vw, 2.3rem); }
.m-offer__sub { color: var(--muted-ink); margin: .5rem 0 1.75rem; }
.m-offer__list { display: flex; flex-direction: column; gap: .8rem; }
.m-offer__list li { display: flex; gap: .75rem; font-size: 1.02rem; }
.m-offer__list li::before { content: '✓'; color: #5F7050; font-weight: 700; }
.m-offer__price {
  display: flex; flex-direction: column; align-items: flex-start; gap: .35rem;
  padding: clamp(1.5rem, 3vw, 2rem);
  border-radius: 1.25rem; background: var(--surface-fg); color: var(--surface);
}
.m-offer__from { font-size: .9rem; color: rgba(244, 241, 234, .6); }
.m-offer__amount { font-family: var(--font-display); font-size: clamp(2.4rem, 5vw, 3.4rem); line-height: 1.05; color: var(--accent); }
.m-offer__terms { font-size: .98rem; color: rgba(244, 241, 234, .75); margin-bottom: 1.5rem; }
.m-offer__price .btn { width: 100%; justify-content: center; }
.m-offer__guarantee { font-size: .88rem; color: rgba(244, 241, 234, .75); margin-top: 1rem; }
.m-offer__scarcity { font-size: .88rem; color: var(--accent); font-weight: 500; }

/* ===== FAQ ===== */
.m-faq { max-width: 820px; }
.m-faq__item { border-top: 1px solid var(--line-ink); }
.m-faq__item:last-child { border-bottom: 1px solid var(--line-ink); }
.m-faq__item summary {
  display: flex; align-items: center; justify-content: space-between; gap: 1.5rem;
  padding: 1.35rem 0; cursor: pointer; list-style: none;
  font-size: clamp(1.02rem, 1.6vw, 1.15rem); font-weight: 500;
}
.m-faq__item summary::-webkit-details-marker { display: none; }
.m-faq__item summary::after {
  content: '+'; flex: none;
  font-family: var(--font-display); font-size: 1.6rem; line-height: 1; color: #8A6120;
  transition: rotate .3s ease;
}
.m-faq__item[open] summary::after { rotate: 45deg; }
.m-faq__item p { padding-bottom: 1.5rem; color: var(--muted-ink); max-width: 68ch; }
@media (prefers-reduced-motion: reduce) { .m-faq__item summary::after { transition: none; } }
```

- [ ] **Step 3: Verificar a oferta no desktop**

```bash
NODE_PATH=/Users/rodrigoscharp/.npm/_npx/e41f203b7505f1fb/node_modules \
  node scripts/verify-shot.cjs http://localhost:5500/mentoria.html /tmp/m-07-oferta-1440.png 1440 "#oferta"
```

Esperado: `no console errors`; faixa clara clara e evidente contra as seções escuras, card de preço escuro com o valor em âmbar, botão de largura cheia.

- [ ] **Step 4: Verificar o CTA sticky, que agora deve funcionar**

```bash
NODE_PATH=/Users/rodrigoscharp/.npm/_npx/e41f203b7505f1fb/node_modules \
  node scripts/verify-shot.cjs http://localhost:5500/mentoria.html /tmp/m-07-sticky-390.png 390 "#funciona"
```

Esperado: a barra âmbar fixa aparece no rodapé da imagem (já passamos do hero e ainda não chegamos na oferta). Depois:

```bash
NODE_PATH=/Users/rodrigoscharp/.npm/_npx/e41f203b7505f1fb/node_modules \
  node scripts/verify-shot.cjs http://localhost:5500/mentoria.html /tmp/m-07-sticky-off-390.png 390 "#oferta"
```

Esperado: a barra **some** — dentro da oferta ela não deve competir com o CTA principal. Se continuar aparecendo, confira os dois `IntersectionObserver` em `initStickyCta()`.

- [ ] **Step 5: Commit**

```bash
git add mentoria.html assets/css/mentoria.css
git commit -m "feat: adiciona bloco de oferta e FAQ na LP da mentoria"
```

---

### Task 8: CTA final e link "Mentoria" no site

**Files:**
- Modify: `mentoria.html`
- Modify: `assets/css/mentoria.css`
- Modify: `index.html`, `dev.html`, `founder.html`, `network.html`, `services.html`

**Interfaces:**
- Consumes: `.wrap`, `.display--xl`, `.btn--lg`, `.reveal`.
- Produces: nada consumido depois.

- [ ] **Step 1: Acrescentar o CTA final em `mentoria.html`, depois de `#faq` e antes de `</main>`**

```html
    <!-- 12 — CTA FINAL -->
    <section class="sec m-final" id="cta-final" data-reveal>
      <div class="wrap m-final__inner">
        <h2 class="display display--xl reveal">[CHAMADA FINAL — <em>curta e direta</em>]</h2>
        <p class="lead reveal">[UMA FRASE fechando: o custo de continuar como está.]</p>
        <a class="btn btn--lg reveal" data-cta="final" target="_blank" rel="noopener noreferrer"
           href="https://wa.me/[NUMERO_WHATSAPP]?text=Oi%20Rodrigo!%20Quero%20saber%20mais%20sobre%20a%20mentoria.">Falar com o Rodrigo no WhatsApp ↗</a>
        <p class="m-final__note reveal">[VAGAS LIMITADAS / PRÓXIMA TURMA EM XX]</p>
      </div>
    </section>
```

- [ ] **Step 2: Acrescentar o CSS ao fim de `assets/css/mentoria.css`**

```css
/* ===== CTA final ===== */
.m-final { position: relative; overflow: hidden; text-align: center; }
.m-final::before {
  content: ''; position: absolute; inset: 0; z-index: 0;
  background: radial-gradient(ellipse at 50% 100%, rgba(232, 163, 61, .18) 0%, rgba(232, 163, 61, 0) 60%);
  pointer-events: none;
}
.m-final__inner { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; gap: 1.5rem; }
.m-final__inner h2 { max-width: 16ch; }
.m-final__inner .lead { text-align: center; }
.m-final__note { font-size: .9rem; color: var(--accent); font-weight: 500; }
```

- [ ] **Step 3: Acrescentar o link "Mentoria" nas 5 páginas do portfólio**

Cada página tem exatamente duas ocorrências do link de Services — uma no menu overlay, outra na coluna "Pages" do footer. O comando insere o novo link logo depois de cada uma, preservando a indentação:

```bash
perl -0pi -e 's|( *)<a href="services\.html">Services</a>|$1<a href="services.html">Services</a>\n$1<a href="mentoria.html">Mentoria</a>|g' \
  index.html dev.html founder.html network.html services.html
```

- [ ] **Step 4: Conferir que o link entrou duas vezes em cada página**

```bash
grep -c 'href="mentoria.html"' index.html dev.html founder.html network.html services.html
```

Esperado: `2` em todas as cinco.

- [ ] **Step 5: Conferir que nada mais mudou no portfólio**

```bash
git diff --stat
```

Esperado: nas 5 páginas do portfólio, `2 ++` em cada uma (só inserções). Qualquer remoção ali é um erro do `perl` — reverta com `git checkout -- <arquivo>` e refaça.

- [ ] **Step 6: Verificar a LP e uma página do portfólio**

```bash
NODE_PATH=/Users/rodrigoscharp/.npm/_npx/e41f203b7505f1fb/node_modules \
  node scripts/verify-shot.cjs http://localhost:5500/mentoria.html /tmp/m-08-final-1440.png 1440 "#cta-final"
NODE_PATH=/Users/rodrigoscharp/.npm/_npx/e41f203b7505f1fb/node_modules \
  node scripts/verify-shot.cjs http://localhost:5500/index.html /tmp/m-08-index-1440.png 1440
```

Esperado: `no console errors` nos dois; a home continua igual, com a identidade creme/oliva intacta.

- [ ] **Step 7: Commit**

```bash
git add mentoria.html assets/css/mentoria.css index.html dev.html founder.html network.html services.html
git commit -m "feat: adiciona CTA final e link da mentoria no menu do site"
```

---

### Task 9: Passe final de qualidade

**Files:**
- Modify: `assets/css/mentoria.css` (só se algo falhar)
- Modify: `mentoria.html` (só se algo falhar)

**Interfaces:**
- Consumes: tudo das tasks anteriores.
- Produces: nada.

- [ ] **Step 1: Página inteira nas duas larguras**

```bash
NODE_PATH=/Users/rodrigoscharp/.npm/_npx/e41f203b7505f1fb/node_modules \
  node scripts/verify-shot.cjs http://localhost:5500/mentoria.html /tmp/m-09-full-1440.png 1440
NODE_PATH=/Users/rodrigoscharp/.npm/_npx/e41f203b7505f1fb/node_modules \
  node scripts/verify-shot.cjs http://localhost:5500/mentoria.html /tmp/m-09-full-390.png 390
```

Esperado: `no console errors` nos dois.

- [ ] **Step 2: Conferir ausência de scroll horizontal**

Rode no console do navegador (ou adapte o script):

```js
document.documentElement.scrollWidth <= window.innerWidth
```

Esperado: `true` em 390px e em 1440px. Se der `false`, o culpado costuma ser o marquee ou o halo do hero — ambos precisam do `overflow: hidden` no ancestral.

- [ ] **Step 3: Conferir que nenhum reveal ficou congelado**

Depois de rolar a página até o fim, no console:

```js
[...document.querySelectorAll('.reveal')]
  .filter(el => getComputedStyle(el).opacity !== '1'
             || Math.abs(new DOMMatrix(getComputedStyle(el).transform).m42) > 1)
  .length
```

Esperado: `0`. Qualquer resultado maior significa que algum reveal recapturou o estado — confira que **todos** usam `fromTo` e `start: 'top bottom'`.

- [ ] **Step 4: Conferir os CTAs**

```bash
grep -o 'data-cta="[a-z]*"' mentoria.html | sort | uniq -c
grep -c 'wa.me/\[NUMERO_WHATSAPP\]' mentoria.html
```

Esperado: cinco origens distintas (`header`, `hero`, `oferta`, `final`, `sticky`) e o mesmo número de links `wa.me` — 6, contando o link do footer, que não tem `data-cta`.

- [ ] **Step 5: Conferir contraste AA**

Verifique com o DevTools (aba Accessibility) os pares críticos:

| Par | Onde | Mínimo |
|---|---|---|
| `#E8A33D` sobre `#0F0E0C` | eyebrow, números do hero | 4.5:1 |
| `#16150F` sobre `#E8A33D` | texto dos botões | 4.5:1 |
| `#8A6120` sobre `#F4F1EA` | eyebrow nas faixas claras | 4.5:1 |
| `rgba(244,241,234,.62)` sobre `#0F0E0C` | texto de apoio | 4.5:1 |

Se algum par reprovar, escureça o âmbar de apoio (nunca o `--accent` dos botões, que é a identidade) até passar.

- [ ] **Step 6: Conferir `prefers-reduced-motion`**

No DevTools, Rendering → Emulate CSS media feature `prefers-reduced-motion: reduce`, e recarregue.

Esperado: todo o conteúdo visível de imediato (nenhum `.reveal` invisível — a classe `has-motion` não deve nem existir no `<html>`), marquee parado, CTA sticky ainda funcionando ao rolar.

- [ ] **Step 7: Conferir o isolamento uma última vez**

```bash
grep -rn "mentoria" assets/css/lando-system.css assets/js/motion.js | wc -l
grep -c "lando-system\|assets/js/motion.js" mentoria.html
```

Esperado: `0` nos dois. Os dois sistemas não se conhecem.

- [ ] **Step 8: Commit dos ajustes, se houver**

```bash
git add -A
git commit -m "fix: ajustes de acessibilidade e responsivo na LP da mentoria"
```

Se nada precisou de ajuste, pule este passo — não faça commit vazio.

---

## O que fica para depois

Nada disso está no plano, e é intencional:

- Preencher os placeholders com o tema real da mentoria (promessa, dores, pilares, preço, FAQ).
- Substituir `[NUMERO_WHATSAPP]` pelo número real, no formato internacional sem sinais: `5511999999999`.
- Ligar a seção de depoimentos quando houver depoimentos reais.
- Analytics, pixel de anúncio, formulário de captura, checkout.
- Versão em inglês da LP.
