# Lando-Inspired Portfolio Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the portfolio as a 4-page static site (Home / Dev / Founder / Network) with the landonorris.com visual language: cream/olive/neon-lime palette, giant Anton+Fraunces typography, editorial photo grids, GSAP/Lenis scroll motion.

**Architecture:** Plain HTML pages sharing a single new design-system stylesheet (`assets/css/lando-system.css`) and one motion script (`assets/js/motion.js`). Header/footer markup is duplicated per page (accepted trade-off of the no-build approach). All animation is progressive enhancement — pages are fully readable without JS.

**Tech Stack:** Vanilla HTML/CSS/JS. GSAP 3 + ScrollTrigger + Lenis via jsdelivr CDN. Google Fonts: Anton, Fraunces, Archivo, Caveat. Verification via headless Chromium (Playwright from the npx cache) screenshots.

**Spec:** `docs/superpowers/specs/2026-07-10-lando-redesign-design.md`

## Global Constraints

- Palette: cream `#F2F0E9`, dark olive `#23261C`, neon lime `#D6F62F`, olive green `#9DB93B`, ink `#1E2018`. The old emerald `#00b37e` must not appear.
- Fonts: Anton (display caps), Fraunces italic (serif accents), Archivo (body/UI), Caveat (script overlays). One Google Fonts `<link>`, listed in Task 2.
- All copy in **English**. Event names and Brazilian institution names stay as proper nouns (e.g. "Feira do Empreendedor").
- No build step. No npm install into the repo. CDN scripts only (exact URLs in Task 2).
- Every page must render complete content with JS disabled (animations only enhance).
- Contact = `mailto:rodrigoscharp@gmail.com` CTA. No form.
- Local server for verification: `python3 -m http.server 8934` from repo root (start once, leave running; `pkill -f "http.server 8934"` when done).
- Verification screenshots go to the session scratchpad, NOT the repo.
- Commit after each task. Never commit screenshots or `.gitignore` (it is an untracked leftover; leave it).

### Reusable verify command

Task 2 creates `scripts/verify-shot.mjs`. All later verify steps use:

```bash
NODE_PATH=/Users/rodrigoscharp/.npm/_npx/e41f203b7505f1fb/node_modules \
node scripts/verify-shot.mjs <url> <out.png> [viewport-width] [scrollTo-selector]
```

If that NODE_PATH no longer contains playwright, run `npx playwright --version` once (it restores the cache) and retry.

---

### Task 1: Optimize heavy images

Event JPEGs are 0.4–2.6 MB and `munoart.png` is 6.6 MB — too heavy for a photo-dense site.

**Files:**
- Create: `assets/img/opt/*.jpg` (resized copies; originals untouched)

**Interfaces:**
- Produces: optimized images at `assets/img/opt/<name>.jpg`, max dimension 1600px, JPEG quality ~80. Later tasks reference **only** the `opt/` copies for event photos and MUNO art.

- [ ] **Step 1: Create optimized copies with sips (macOS built-in)**

```bash
cd /Users/rodrigoscharp/Dev/Portfolio-Scharp
mkdir -p assets/img/opt
for f in web-summit-rio-2026 tdc-sp-2025 feira-empreendedor-2025 microsoft-debate-ia-2026 smart-cities-curitiba-2026 forum-cidades-inteligentes-2026 tdc-summit-sp-2026 geopixel-sjc-2026; do
  sips -s format jpeg -s formatOptions 80 -Z 1600 "assets/img/$f.jpeg" --out "assets/img/opt/$f.jpg"
done
sips -s format jpeg -s formatOptions 80 -Z 1600 "assets/img/munoart.png" --out "assets/img/opt/munoart.jpg"
sips -s format jpeg -s formatOptions 80 -Z 1600 "assets/img/macbook.png" --out "assets/img/opt/macbook.jpg"
```

- [ ] **Step 2: Verify sizes**

Run: `ls -la assets/img/opt/`
Expected: 10 files, every file well under 500 KB.

- [ ] **Step 3: Commit**

```bash
git add assets/img/opt && git commit -m "add optimized image copies for redesign"
```

---

### Task 2: Design system CSS, motion.js, verify script, and the shared shell (new index.html skeleton)

This task replaces `index.html` with the new shell (header + fullscreen menu + empty `<main>` + footer). Old content stays recoverable via `git show HEAD:index.html`.

**Files:**
- Create: `assets/css/lando-system.css`
- Create: `assets/js/motion.js`
- Create: `scripts/verify-shot.mjs`
- Rewrite: `index.html`

**Interfaces:**
- Produces (used by ALL later tasks):
  - CSS classes: `.section--cream`, `.section--olive`, `.topo`, `.container`, `.headline`, `.hl-line`, `.hl-serif`, `.label`, `.btn-pill`, `.scribble`, `.scribble--underline`, `.scribble--circle`, `.script-overlay`, `.marquee`, `.marquee__track`, `.card-widget`, `.site-header`, `.menu-overlay`, `.site-footer` (full definitions below).
  - JS behaviors bound to attributes: `[data-reveal]` (staggers child `.hl-line`/`.reveal-item`), `[data-parallax="0.1..0.3"]`, `.scribble path` draw-on-scroll, `#menu-toggle` opens `#menu-overlay`.
  - The exact header, menu and footer markup blocks to copy into every page (below).

- [ ] **Step 1: Write `scripts/verify-shot.mjs`**

```js
// Usage: NODE_PATH=<npx-cache>/node_modules node scripts/verify-shot.mjs <url> <out.png> [width] [selector]
import { chromium } from 'playwright';

const [url, out, width = '1440', selector] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: parseInt(width), height: 900 } });
const errors = [];
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', e => errors.push(String(e)));
await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 }).catch(e => console.log('goto:', e.message));
if (selector) { await page.locator(selector).scrollIntoViewIfNeeded(); }
await page.waitForTimeout(800);
await page.screenshot({ path: out });
await browser.close();
console.log('saved', out);
if (errors.length) { console.log('CONSOLE ERRORS:\n' + errors.join('\n')); process.exit(1); }
console.log('no console errors');
```

- [ ] **Step 2: Write `assets/css/lando-system.css`**

```css
/* ===== LANDO SYSTEM — design tokens ===== */
:root {
  --cream: #F2F0E9;
  --olive: #23261C;
  --lime: #D6F62F;
  --green: #9DB93B;
  --ink: #1E2018;
  --font-display: 'Anton', sans-serif;
  --font-serif: 'Fraunces', serif;
  --font-body: 'Archivo', sans-serif;
  --font-script: 'Caveat', cursive;
  --header-h: 5.5rem;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }
body {
  font-family: var(--font-body);
  background: var(--cream);
  color: var(--ink);
  line-height: 1.5;
  overflow-x: hidden;
}
img { max-width: 100%; display: block; }
a { color: inherit; text-decoration: none; }
ul { list-style: none; }

/* ===== layout ===== */
.container { width: min(100% - 3rem, 1360px); margin-inline: auto; }
.section { position: relative; padding: clamp(4rem, 10vw, 8rem) 0; overflow: hidden; }
.section--cream { background: var(--cream); color: var(--ink); }
.section--olive { background: var(--olive); color: var(--cream); }

/* topographic texture */
.topo::before {
  content: '';
  position: absolute; inset: 0;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='1200' viewBox='0 0 1200 1200' fill='none'%3E%3Cg stroke='%231E2018' stroke-width='1.5'%3E%3Cpath d='M-100 300 C 150 120, 420 480, 700 320 S 1150 80, 1350 260'/%3E%3Cpath d='M-100 380 C 160 200, 430 560, 710 400 S 1160 160, 1350 340'/%3E%3Cpath d='M-80 900 C 200 700, 500 1100, 800 920 S 1200 720, 1350 900'/%3E%3Cpath d='M-80 980 C 210 780, 510 1180, 810 1000 S 1210 800, 1350 980'/%3E%3Cellipse cx='250' cy='650' rx='180' ry='90' transform='rotate(-15 250 650)'/%3E%3Cellipse cx='250' cy='650' rx='120' ry='55' transform='rotate(-15 250 650)'/%3E%3Cellipse cx='980' cy='520' rx='150' ry='75' transform='rotate(20 980 520)'/%3E%3Cellipse cx='980' cy='520' rx='95' ry='42' transform='rotate(20 980 520)'/%3E%3C/g%3E%3C/svg%3E");
  background-size: 1200px 1200px;
  opacity: 0.05;
}
.section--olive.topo::before { filter: invert(1); opacity: 0.07; }

/* ===== typography ===== */
.headline {
  font-family: var(--font-display);
  font-weight: 400;
  text-transform: uppercase;
  line-height: 0.98;
  letter-spacing: 0.01em;
}
.headline--xl { font-size: clamp(3rem, 9vw, 8.5rem); }
.headline--lg { font-size: clamp(2.4rem, 6.5vw, 6rem); }
.headline--md { font-size: clamp(1.8rem, 4vw, 3.5rem); }
.hl-line { display: block; }
.hl-serif {
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: 400;
  letter-spacing: 0;
}
.section--olive .hl-serif { color: var(--green); }
.section--cream .hl-serif { color: var(--olive); }
.hl-lime { color: var(--lime); }

.label {
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.22em;
}
.label--lime { color: var(--lime); }
.lead { font-size: clamp(1rem, 1.4vw, 1.2rem); max-width: 34em; }

/* ===== buttons ===== */
.btn-pill {
  display: inline-flex; align-items: center; gap: 0.5rem;
  background: var(--lime); color: var(--ink);
  font-family: var(--font-body); font-weight: 700; font-size: 0.8rem;
  text-transform: uppercase; letter-spacing: 0.06em;
  padding: 0.9rem 1.6rem; border-radius: 0.9rem; border: none; cursor: pointer;
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.btn-pill:hover { transform: scale(1.05) rotate(-1deg); }

/* ===== scribbles ===== */
.scribble { display: block; overflow: visible; }
.scribble path {
  fill: none; stroke: var(--lime); stroke-width: 7;
  stroke-linecap: round; stroke-linejoin: round;
  stroke-dasharray: 1; stroke-dashoffset: 0; /* JS sets 1 then animates to 0 */
}
.script-overlay {
  font-family: var(--font-script); font-weight: 700;
  color: var(--lime); line-height: 1;
  pointer-events: none;
  text-transform: none;
}

/* ===== header ===== */
.site-header {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  display: flex; align-items: center; justify-content: space-between;
  padding: 1.1rem clamp(1rem, 3vw, 2.5rem);
  mix-blend-mode: normal;
}
.site-logo {
  font-family: var(--font-display); font-size: 1.25rem; line-height: 0.95;
  text-transform: uppercase; letter-spacing: 0.02em;
}
.site-logo span { display: block; }
.site-header__actions { display: flex; gap: 0.6rem; align-items: center; }
.menu-btn {
  width: 3.1rem; height: 3.1rem; border-radius: 0.9rem;
  background: var(--cream); border: 1px solid rgba(30, 32, 24, 0.25);
  display: grid; place-items: center; cursor: pointer;
}
.menu-btn span { display: block; width: 1.1rem; height: 2px; background: var(--ink); position: relative; }
.menu-btn span::before { content: ''; position: absolute; top: -6px; right: 0; width: 0.75rem; height: 2px; background: var(--ink); }

/* header inverts on dark hero */
.header-on-dark .site-logo, .header-on-dark { color: var(--cream); }

/* ===== fullscreen menu ===== */
.menu-overlay {
  position: fixed; inset: 0; z-index: 200;
  background: var(--olive); color: var(--cream);
  display: flex; flex-direction: column; justify-content: center;
  padding: clamp(1.5rem, 5vw, 4rem);
  visibility: hidden; opacity: 0;
  transition: opacity 0.4s ease, visibility 0s linear 0.4s;
}
.menu-overlay.open { visibility: visible; opacity: 1; transition: opacity 0.4s ease; }
.menu-overlay__close {
  position: absolute; top: 1.1rem; right: clamp(1rem, 3vw, 2.5rem);
  background: var(--lime); border: none; border-radius: 0.9rem;
  width: 3.1rem; height: 3.1rem; font-size: 1.3rem; cursor: pointer; color: var(--ink);
  font-family: var(--font-body); font-weight: 700;
}
.menu-overlay nav a {
  font-family: var(--font-display); text-transform: uppercase;
  font-size: clamp(3rem, 9vw, 6.5rem); line-height: 1.05; display: block;
  transform: translateY(30px); opacity: 0; transition: transform 0.5s ease, opacity 0.5s ease, color 0.2s;
}
.menu-overlay.open nav a { transform: none; opacity: 1; }
.menu-overlay.open nav a:nth-child(2) { transition-delay: 0.06s; }
.menu-overlay.open nav a:nth-child(3) { transition-delay: 0.12s; }
.menu-overlay.open nav a:nth-child(4) { transition-delay: 0.18s; }
.menu-overlay nav a:hover { color: var(--lime); }
.menu-overlay__socials { margin-top: 3rem; display: flex; gap: 1.6rem; }
.menu-overlay__socials a { font-size: 0.8rem; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; }
.menu-overlay__socials a:hover { color: var(--lime); }

/* ===== card widget (hero corner card) ===== */
.card-widget {
  border: 1px solid rgba(30, 32, 24, 0.3); border-radius: 0.8rem;
  padding: 1.1rem; width: 12rem; text-align: center;
  background: color-mix(in srgb, var(--cream) 82%, transparent);
  backdrop-filter: blur(4px);
}
.card-widget hr { border: none; border-top: 1px solid rgba(30, 32, 24, 0.3); margin: 0.7rem 0; }
.card-widget .label { font-size: 0.6rem; }
.card-widget strong { font-size: 0.75rem; letter-spacing: 0.1em; display: block; margin-top: 0.25rem; }

/* ===== marquee ===== */
.marquee { overflow: hidden; white-space: nowrap; }
.marquee__track { display: inline-flex; align-items: center; gap: 4.5rem; padding-right: 4.5rem; animation: marquee 32s linear infinite; }
@keyframes marquee { to { transform: translateX(-100%); } }
.marquee__item { font-family: var(--font-body); font-weight: 700; font-size: 1.5rem; letter-spacing: 0.04em; opacity: 0.75; }
.marquee__item img { height: 2.6rem; width: auto; filter: grayscale(1); border-radius: 0.4rem; }
@media (prefers-reduced-motion: reduce) { .marquee__track { animation: none; } }

/* ===== footer ===== */
.footer-frame { background: var(--cream); padding: clamp(0.8rem, 2vw, 1.4rem); }
.site-footer {
  background: var(--olive); color: var(--cream);
  border-radius: 1.6rem; position: relative; overflow: hidden;
  padding: clamp(3rem, 7vw, 6rem) clamp(1.5rem, 4vw, 4rem) clamp(1.5rem, 3vw, 2.5rem);
  text-align: center;
}
.site-footer .signature {
  font-family: var(--font-script); font-size: clamp(2.2rem, 4vw, 3.4rem);
  color: var(--lime); transform: rotate(-4deg); display: inline-block; margin-bottom: -1rem;
}
.site-footer__statement { font-size: clamp(2.6rem, 7vw, 6rem); }
.site-footer__cols {
  display: flex; justify-content: center; gap: clamp(3rem, 10vw, 10rem);
  margin: clamp(2.5rem, 5vw, 4rem) 0; text-align: center;
}
.site-footer__cols .label { opacity: 0.55; display: block; margin-bottom: 0.9rem; }
.site-footer__cols a {
  font-family: var(--font-display); text-transform: uppercase;
  font-size: clamp(1.2rem, 2vw, 1.7rem); display: block; line-height: 1.35;
}
.site-footer__cols a:hover { color: var(--lime); }
.site-footer__cta { margin-bottom: 3rem; }
.site-footer__legal {
  display: flex; justify-content: space-between; align-items: center;
  font-size: 0.72rem; opacity: 0.7; margin-top: 2rem; flex-wrap: wrap; gap: 0.5rem;
}

/* ===== photo helpers ===== */
.photo-card { position: relative; }
.photo-card img { width: 100%; height: 100%; object-fit: cover; }
.photo-card .label { display: block; margin-bottom: 0.5rem; }
.img-hover { overflow: hidden; }
.img-hover img { transition: transform 0.6s ease; }
.img-hover:hover img { transform: scale(1.05); }

/* ===== responsive ===== */
@media (max-width: 768px) {
  .site-footer__cols { flex-direction: column; gap: 2rem; }
  .card-widget { display: none; }
}
```

- [ ] **Step 3: Write `assets/js/motion.js`**

```js
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';

  /* menu */
  const overlay = document.getElementById('menu-overlay');
  const openBtn = document.getElementById('menu-toggle');
  const closeBtn = document.getElementById('menu-close');
  if (overlay && openBtn && closeBtn) {
    openBtn.addEventListener('click', () => overlay.classList.add('open'));
    closeBtn.addEventListener('click', () => overlay.classList.remove('open'));
    overlay.querySelectorAll('nav a').forEach(a =>
      a.addEventListener('click', () => overlay.classList.remove('open')));
  }

  if (reduced || !hasGsap) return; // content is fully visible without motion

  gsap.registerPlugin(ScrollTrigger);

  /* smooth scroll */
  if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis();
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  /* headline / item reveals */
  document.querySelectorAll('[data-reveal]').forEach(el => {
    const items = el.querySelectorAll('.hl-line, .reveal-item');
    if (!items.length) return;
    gsap.from(items, {
      yPercent: 60, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.09,
      scrollTrigger: { trigger: el, start: 'top 82%' }
    });
  });

  /* parallax */
  document.querySelectorAll('[data-parallax]').forEach(el => {
    const speed = parseFloat(el.dataset.parallax) || 0.15;
    gsap.to(el, {
      yPercent: -speed * 100, ease: 'none',
      scrollTrigger: { trigger: el.parentElement, scrub: true }
    });
  });

  /* scribble draw-on */
  document.querySelectorAll('.scribble path').forEach(p => {
    gsap.fromTo(p, { strokeDashoffset: 1 }, {
      strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut',
      scrollTrigger: { trigger: p.closest('svg'), start: 'top 85%' }
    });
  });
})();
```

- [ ] **Step 4: Rewrite `index.html` as the shared shell**

The `<head>`, header, menu overlay and footer below are THE canonical blocks — Tasks 5–7 copy them verbatim into the other pages (only the `<title>` and the "(current page)" nav highlight change).

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Anton&family=Archivo:wght@400;500;600;700&family=Caveat:wght@600;700&family=Fraunces:ital,opsz,wght@1,9..144,400;1,9..144,500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/css/lando-system.css">
  <link rel="icon" type="image/png" href="assets/img/rodrigo_2.png">
  <title>Rodrigo Scharp — Developer & Founder</title>
</head>

<body>
  <header class="site-header">
    <a href="index.html" class="site-logo"><span>Rodrigo</span><span>Scharp</span></a>
    <div class="site-header__actions">
      <a href="mailto:rodrigoscharp@gmail.com" class="btn-pill">Get in touch</a>
      <button class="menu-btn" id="menu-toggle" aria-label="Open menu"><span></span></button>
    </div>
  </header>

  <div class="menu-overlay" id="menu-overlay">
    <button class="menu-overlay__close" id="menu-close" aria-label="Close menu">✕</button>
    <nav>
      <a href="index.html">Home</a>
      <a href="dev.html">Dev</a>
      <a href="founder.html">Founder</a>
      <a href="network.html">Network</a>
    </nav>
    <div class="menu-overlay__socials">
      <a href="https://www.linkedin.com/in/rodrigo-scharp-8728a7277" target="_blank" rel="noopener noreferrer">LinkedIn</a>
      <a href="https://www.instagram.com/rodrigoscharp" target="_blank" rel="noopener noreferrer">Instagram</a>
      <a href="https://github.com/rodrigoscharp" target="_blank" rel="noopener noreferrer">GitHub</a>
    </div>
  </div>

  <main>
    <!-- sections land here in Tasks 3-4 -->
  </main>

  <div class="footer-frame">
    <footer class="site-footer topo">
      <span class="signature">Rodrigo Scharp</span>
      <h2 class="headline site-footer__statement" data-reveal>
        <span class="hl-line">Always <em class="hl-serif">building</em>.</span>
      </h2>

      <div class="site-footer__cols">
        <div>
          <span class="label">Pages</span>
          <a href="index.html">Home</a>
          <a href="dev.html">Dev</a>
          <a href="founder.html">Founder</a>
          <a href="network.html">Network</a>
        </div>
        <div>
          <span class="label">Follow on</span>
          <a href="https://www.linkedin.com/in/rodrigo-scharp-8728a7277" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="https://www.instagram.com/rodrigoscharp" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="https://github.com/rodrigoscharp" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
      </div>

      <div class="site-footer__cta">
        <a href="mailto:rodrigoscharp@gmail.com" class="btn-pill">Business enquiries ↗</a>
      </div>

      <div class="site-footer__legal">
        <span>© 2026 Rodrigo Scharp. All rights reserved.</span>
        <span>Ubatuba — São Paulo, Brazil</span>
      </div>
    </footer>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/lenis@1.3.11/dist/lenis.min.js"></script>
  <script src="assets/js/motion.js"></script>
</body>

</html>
```

- [ ] **Step 5: Verify**

```bash
python3 -m http.server 8934 &   # if not already running
NODE_PATH=/Users/rodrigoscharp/.npm/_npx/e41f203b7505f1fb/node_modules \
node scripts/verify-shot.mjs http://localhost:8934/index.html /private/tmp/claude-501/-Users-rodrigoscharp-Dev-Portfolio-Scharp/20177dff-deec-4940-8641-cd3fc54aaab2/scratchpad/t2-shell.png
```

Read the screenshot. Expected: cream page; "RODRIGO SCHARP" stacked logo top-left in Anton; lime "GET IN TOUCH" pill + menu button top-right; olive rounded footer card with lime script signature, giant "ALWAYS building." statement, Pages/Follow-on columns, business-enquiries pill. "no console errors" printed. Also screenshot with the menu open is NOT automatable via this script — manually check by adding `#` temporarily is unnecessary; menu gets visually checked in Task 8.

- [ ] **Step 6: Commit**

```bash
git add index.html assets/css/lando-system.css assets/js/motion.js scripts/verify-shot.mjs
git commit -m "feat: lando design system, motion script and shared shell"
```

---

### Task 3: Home — hero, role widget, manifesto

**Files:**
- Modify: `index.html` (inside `<main>`)
- Modify: `assets/css/lando-system.css` (append page-section styles)

**Interfaces:**
- Consumes: Task 2 classes/attributes.
- Produces: home sections `#hero`, `#manifesto`.

- [ ] **Step 1: Append hero + manifesto CSS to `lando-system.css`**

```css
/* ===== home: hero ===== */
.hero {
  min-height: 100svh; display: grid; place-items: center;
  position: relative; padding-top: var(--header-h);
}
.hero__stage { position: relative; display: grid; place-items: center; width: 100%; }
.hero__name {
  font-size: clamp(4rem, 13vw, 12.5rem); text-align: center;
  position: relative; z-index: 1;
}
.hero__img {
  width: clamp(240px, 30vw, 430px); margin-top: clamp(-3rem, -6vw, -6rem);
  position: relative; z-index: 2;
}
.hero__widget { position: absolute; left: clamp(1rem, 3vw, 2.5rem); bottom: 2rem; z-index: 3; }
.hero__scroll-hint { position: absolute; right: clamp(1rem, 3vw, 2.5rem); bottom: 2rem; }

/* ===== home: manifesto ===== */
.manifesto { text-align: center; }
.manifesto .headline { max-width: 24ch; margin-inline: auto; }
```

- [ ] **Step 2: Add hero + manifesto markup inside `<main>` of `index.html`**

```html
    <!-- HERO -->
    <section class="hero section--cream topo" id="hero">
      <div class="hero__stage">
        <h1 class="hero__name headline" data-reveal>
          <span class="hl-line">Rodrigo</span>
          <span class="hl-line">Scharp</span>
        </h1>
        <img src="assets/img/scharp-speaker.png" alt="Rodrigo Scharp" class="hero__img" data-parallax="0.12">
      </div>

      <div class="card-widget hero__widget">
        <span class="label">Currently</span>
        <strong>C-LEVEL — UBATUBA CITY HALL</strong>
        <hr>
        <span class="label">And also</span>
        <strong>FOUNDER — MUNO</strong>
      </div>

      <span class="label hero__scroll-hint">Scroll ↓</span>
    </section>

    <!-- MANIFESTO -->
    <section class="section section--olive topo manifesto" id="manifesto">
      <div class="container">
        <h2 class="headline headline--lg" data-reveal>
          <span class="hl-line">Building products,</span>
          <span class="hl-line">shipping code, leading</span>
          <span class="hl-line"><em class="hl-serif">innovation</em>. Defining</span>
          <span class="hl-line">a <em class="hl-serif">legacy</em> in tech —</span>
          <span class="hl-line">on and off the keyboard.</span>
        </h2>
      </div>
    </section>
```

- [ ] **Step 3: Verify**

```bash
NODE_PATH=/Users/rodrigoscharp/.npm/_npx/e41f203b7505f1fb/node_modules \
node scripts/verify-shot.mjs http://localhost:8934/index.html /private/tmp/claude-501/-Users-rodrigoscharp-Dev-Portfolio-Scharp/20177dff-deec-4940-8641-cd3fc54aaab2/scratchpad/t3-hero.png
NODE_PATH=/Users/rodrigoscharp/.npm/_npx/e41f203b7505f1fb/node_modules \
node scripts/verify-shot.mjs http://localhost:8934/index.html /private/tmp/claude-501/-Users-rodrigoscharp-Dev-Portfolio-Scharp/20177dff-deec-4940-8641-cd3fc54aaab2/scratchpad/t3-manifesto.png 1440 '#manifesto'
```

Read both screenshots. Expected: giant "RODRIGO / SCHARP" over the speaker photo, role widget bottom-left; manifesto full-width olive with serif "innovation"/"legacy" in green italic. No console errors.

- [ ] **Step 4: Commit**

```bash
git add index.html assets/css/lando-system.css
git commit -m "feat: home hero and manifesto"
```

---

### Task 4: Home — DEV/FOUNDER split, network teaser, partners marquee

**Files:**
- Modify: `index.html` (after `#manifesto`)
- Modify: `assets/css/lando-system.css` (append)

**Interfaces:**
- Consumes: Tasks 1–2 outputs.
- Produces: sections `#split`, `#network-teaser`, `#partners`. Completes `index.html`.

- [ ] **Step 1: Append CSS**

```css
/* ===== home: dev/founder split ===== */
.split { }
.split__grid { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(2rem, 5vw, 5rem); align-items: start; }
.split__half { position: relative; }
.split__half .headline { position: relative; display: inline-block; }
.split__half .scribble--circle { position: absolute; inset: -12% -10%; width: 120%; height: 124%; }
.split__half p { margin: 1.2rem 0 1.4rem; max-width: 30em; }
.split__link { font-weight: 700; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.12em; border-bottom: 3px solid var(--lime); padding-bottom: 0.2rem; }
@media (max-width: 768px) { .split__grid { grid-template-columns: 1fr; } }

/* ===== home: network teaser ===== */
.teaser__grid { display: grid; grid-template-columns: repeat(12, 1fr); gap: 1rem; margin-top: 3rem; }
.teaser__grid .photo-card:nth-child(1) { grid-column: 1 / span 4; }
.teaser__grid .photo-card:nth-child(2) { grid-column: 6 / span 3; margin-top: 4rem; }
.teaser__grid .photo-card:nth-child(3) { grid-column: 10 / span 3; margin-top: 1.5rem; }
.teaser__grid img { aspect-ratio: 4 / 5; }
@media (max-width: 768px) {
  .teaser__grid { grid-template-columns: 1fr 1fr; }
  .teaser__grid .photo-card:nth-child(n) { grid-column: auto; margin-top: 0; }
}

/* ===== home: partners ===== */
.partners__head { position: relative; margin-bottom: 3.5rem; }
.partners__head .script-overlay { position: absolute; left: 8%; top: -35%; font-size: clamp(4rem, 12vw, 10rem); transform: rotate(-8deg); z-index: 2; }
```

- [ ] **Step 2: Add markup after `#manifesto` in `index.html`**

```html
    <!-- DEV / FOUNDER SPLIT -->
    <section class="section section--cream topo split" id="split">
      <div class="container split__grid">
        <div class="split__half" data-reveal>
          <h2 class="headline headline--xl hl-line">Dev
            <svg class="scribble scribble--circle" viewBox="0 0 320 120" aria-hidden="true">
              <path d="M160 14 C 60 10, 12 38, 14 62 C 16 92, 96 112, 178 106 C 262 100, 310 74, 304 48 C 298 20, 220 6, 140 12" pathLength="1"/>
            </svg>
          </h2>
          <p class="lead reveal-item">Backend engineering with Java & Spring Boot, cloud, and open source. Skills, experience and selected projects.</p>
          <a href="dev.html" class="split__link reveal-item">Enter the dev side →</a>
        </div>
        <div class="split__half" data-reveal>
          <h2 class="headline headline--xl hl-line"><em class="hl-serif">Founder</em></h2>
          <p class="lead reveal-item">Building MUNO, leading technology and innovation for the city of Ubatuba, and everything entrepreneurship.</p>
          <a href="founder.html" class="split__link reveal-item">Enter the founder side →</a>
        </div>
      </div>
    </section>

    <!-- NETWORK TEASER -->
    <section class="section section--olive topo" id="network-teaser">
      <div class="container">
        <h2 class="headline headline--lg" data-reveal>
          <span class="hl-line">Out <em class="hl-serif">there</em>,</span>
          <span class="hl-line">on the circuit.</span>
        </h2>
        <div class="teaser__grid">
          <figure class="photo-card img-hover" data-parallax="0.1">
            <figcaption class="label label--lime">Rio de Janeiro, 2026</figcaption>
            <img src="assets/img/opt/web-summit-rio-2026.jpg" alt="Web Summit Rio" loading="lazy">
          </figure>
          <figure class="photo-card img-hover" data-parallax="0.2">
            <figcaption class="label label--lime">Microsoft Office, 2026</figcaption>
            <img src="assets/img/opt/microsoft-debate-ia-2026.jpg" alt="AI debate at Microsoft" loading="lazy">
          </figure>
          <figure class="photo-card img-hover" data-parallax="0.15">
            <figcaption class="label label--lime">Curitiba, 2026</figcaption>
            <img src="assets/img/opt/smart-cities-curitiba-2026.jpg" alt="Smart Cities Curitiba" loading="lazy">
          </figure>
        </div>
        <p style="margin-top:2.5rem"><a href="network.html" class="btn-pill">See all events</a></p>
      </div>
    </section>

    <!-- PARTNERS -->
    <section class="section section--cream topo" id="partners">
      <div class="container">
        <div class="partners__head" data-reveal>
          <h2 class="headline headline--lg">
            <span class="hl-line">Partners</span>
            <span class="hl-line"><em class="hl-serif">&amp; clients</em></span>
          </h2>
          <span class="script-overlay">Collabs</span>
        </div>
      </div>
      <div class="marquee" aria-label="Partners and clients">
        <div class="marquee__track">
          <span class="marquee__item"><img src="assets/img/logo prefeitura.jpeg" alt="Ubatuba City Hall"></span>
          <span class="marquee__item">GITHUB</span>
          <span class="marquee__item"><img src="assets/img/logo prescon.jpeg" alt="Prescon"></span>
          <span class="marquee__item">SEBRAE</span>
          <span class="marquee__item"><img src="assets/img/logo_bitwise-removebg-preview.png" alt="Bitwise"></span>
          <span class="marquee__item">MICROSOFT</span>
          <span class="marquee__item"><img src="assets/img/logo muno.jpeg" alt="MUNO"></span>
          <span class="marquee__item"><img src="assets/img/rocketseat.jpeg" alt="Rocketseat"></span>
        </div>
        <div class="marquee__track" aria-hidden="true">
          <span class="marquee__item"><img src="assets/img/logo prefeitura.jpeg" alt=""></span>
          <span class="marquee__item">GITHUB</span>
          <span class="marquee__item"><img src="assets/img/logo prescon.jpeg" alt=""></span>
          <span class="marquee__item">SEBRAE</span>
          <span class="marquee__item"><img src="assets/img/logo_bitwise-removebg-preview.png" alt=""></span>
          <span class="marquee__item">MICROSOFT</span>
          <span class="marquee__item"><img src="assets/img/logo muno.jpeg" alt=""></span>
          <span class="marquee__item"><img src="assets/img/rocketseat.jpeg" alt=""></span>
        </div>
      </div>
    </section>
```

- [ ] **Step 3: Verify**

```bash
NODE_PATH=/Users/rodrigoscharp/.npm/_npx/e41f203b7505f1fb/node_modules \
node scripts/verify-shot.mjs http://localhost:8934/index.html /private/tmp/claude-501/-Users-rodrigoscharp-Dev-Portfolio-Scharp/20177dff-deec-4940-8641-cd3fc54aaab2/scratchpad/t4-split.png 1440 '#split'
NODE_PATH=/Users/rodrigoscharp/.npm/_npx/e41f203b7505f1fb/node_modules \
node scripts/verify-shot.mjs http://localhost:8934/index.html /private/tmp/claude-501/-Users-rodrigoscharp-Dev-Portfolio-Scharp/20177dff-deec-4940-8641-cd3fc54aaab2/scratchpad/t4-partners.png 1440 '#partners'
```

Read screenshots. Expected: DEV with lime circle scribble + serif "Founder" side-by-side; scattered 3-photo teaser on olive; "PARTNERS & clients" with big lime "Collabs" script + logo marquee. No console errors.

- [ ] **Step 4: Commit**

```bash
git add index.html assets/css/lando-system.css
git commit -m "feat: home split, network teaser and partners marquee"
```

---

### Task 5: dev.html

**Files:**
- Create: `dev.html`
- Modify: `assets/css/lando-system.css` (append)

**Interfaces:**
- Consumes: shell blocks from Task 2 (copy verbatim; set `<title>Rodrigo Scharp — Dev</title>`), design-system classes.
- Produces: complete `dev.html`.

- [ ] **Step 1: Append CSS**

```css
/* ===== dev page ===== */
.skills-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 1rem; margin-top: 3rem; }
.skill-tile {
  border: 1px solid rgba(242, 240, 233, 0.25); border-radius: 0.8rem;
  padding: 1.6rem 1.2rem; font-family: var(--font-display); text-transform: uppercase;
  font-size: 1.15rem; transition: background 0.25s, color 0.25s;
}
.skill-tile:hover { background: var(--lime); color: var(--ink); }

.xp-list { margin-top: 3rem; }
.xp-item {
  display: grid; grid-template-columns: 8rem 1fr; gap: 1.5rem;
  padding: 2rem 0; border-top: 1px solid rgba(30, 32, 24, 0.2); align-items: baseline;
}
.xp-item h3 { font-family: var(--font-display); font-size: clamp(1.3rem, 2.4vw, 2rem); text-transform: uppercase; }
.xp-item .xp-company { font-family: var(--font-serif); font-style: italic; font-size: 1.1rem; }
.xp-item p { margin-top: 0.6rem; max-width: 46em; }
@media (max-width: 640px) { .xp-item { grid-template-columns: 1fr; gap: 0.4rem; } }

.projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(270px, 1fr)); gap: 1.2rem; margin-top: 3rem; }
.project-card {
  border: 1px solid rgba(242, 240, 233, 0.2); border-radius: 0.9rem;
  padding: 1.8rem 1.5rem; display: flex; flex-direction: column; gap: 0.8rem;
  transition: border-color 0.25s, transform 0.25s;
}
.project-card:hover { border-color: var(--lime); transform: translateY(-4px); }
.project-card h3 { font-family: var(--font-display); font-size: 1.5rem; text-transform: uppercase; }
.project-card .label { color: var(--lime); }
.project-card p { font-size: 0.9rem; opacity: 0.85; flex: 1; }
.project-card .tags { display: flex; flex-wrap: wrap; gap: 0.4rem; }
.project-card .tags span {
  font-size: 0.62rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em;
  border: 1px solid rgba(242, 240, 233, 0.35); border-radius: 99px; padding: 0.25rem 0.6rem;
}
```

- [ ] **Step 2: Create `dev.html`**

Copy the Task 2 shell (`<head>` with `<title>Rodrigo Scharp — Dev</title>`, header, menu overlay, footer, scripts) and use this `<main>`:

```html
  <main>
    <!-- DEV HERO -->
    <section class="hero section--olive topo" id="dev-hero" style="min-height:70svh">
      <div class="container">
        <span class="label label--lime">01 — The dev side</span>
        <h1 class="headline headline--xl" data-reveal style="margin-top:1rem">
          <span class="hl-line">Shipping <em class="hl-serif">code</em></span>
          <span class="hl-line">that scales.</span>
        </h1>
      </div>
    </section>

    <!-- SKILLS -->
    <section class="section section--olive topo" id="skills">
      <div class="container" data-reveal>
        <span class="label label--lime">Technical stack</span>
        <div class="skills-grid">
          <div class="skill-tile reveal-item">Java</div>
          <div class="skill-tile reveal-item">Spring Boot</div>
          <div class="skill-tile reveal-item">AWS Cloud</div>
          <div class="skill-tile reveal-item">Docker</div>
          <div class="skill-tile reveal-item">MySQL</div>
          <div class="skill-tile reveal-item">Git</div>
          <div class="skill-tile reveal-item">TypeScript</div>
        </div>
      </div>
    </section>

    <!-- EXPERIENCE -->
    <section class="section section--cream topo" id="experience">
      <div class="container">
        <h2 class="headline headline--lg" data-reveal><span class="hl-line">Experience</span></h2>
        <div class="xp-list">
          <div class="xp-item" data-reveal>
            <span class="label reveal-item">2026 — Now</span>
            <div class="reveal-item">
              <h3>C-Level Director of Technology & Innovation</h3>
              <span class="xp-company">Ubatuba City Hall</span>
              <p>Leading the city's technology and innovation strategy while working hands-on as a Java developer, driving the modernization of public digital services.</p>
            </div>
          </div>
          <div class="xp-item" data-reveal>
            <span class="label reveal-item">2025 — Now</span>
            <div class="reveal-item">
              <h3>Founder</h3>
              <span class="xp-company">MUNO APP</span>
              <p>Founded and lead MUNO APP from the ground up, building the product, brand and operations of a food tech startup focused on community-driven meal delivery.</p>
            </div>
          </div>
          <div class="xp-item" data-reveal>
            <span class="label reveal-item">2025 — 2026</span>
            <div class="reveal-item">
              <h3>Java Developer & Consultant</h3>
              <span class="xp-company">Prescon Assessoria</span>
              <p>Delivered Java-based software solutions and technical consulting, providing development and support for client systems.</p>
            </div>
          </div>
          <div class="xp-item" data-reveal>
            <span class="label reveal-item">2023 — 2025</span>
            <div class="reveal-item">
              <h3>Software Developer</h3>
              <span class="xp-company">Bitwise Software Solutions</span>
              <p>Designed and built backend systems with Java and Spring Boot, contributing to scalable software solutions for Bitwise's clients.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- PROJECTS (helmet-gallery treatment) -->
    <section class="section section--olive topo" id="projects">
      <div class="container">
        <h2 class="headline headline--lg" data-reveal>
          <span class="hl-line">Selected <em class="hl-serif">projects</em></span>
        </h2>
        <div class="projects-grid" data-reveal>
          <a class="project-card reveal-item" href="https://github.com/rodrigoscharp/HelpNote_-IA" target="_blank" rel="noopener noreferrer">
            <span class="label">2025</span>
            <h3>HelpNote IA</h3>
            <p>AI-powered assistant that turns lecture and event audio into organized notes — automatic transcription, keywords and enriched summaries.</p>
            <div class="tags"><span>Java</span><span>Spring Boot</span><span>PostgreSQL</span><span>LLM</span></div>
          </a>
          <a class="project-card reveal-item" href="https://github.com/rodrigoscharp/Athena-Matching-Engine" target="_blank" rel="noopener noreferrer">
            <span class="label">2025</span>
            <h3>Athena Matching Engine</h3>
            <p>Production-grade order matching system for financial markets. 100k+ orders/sec with sub-100µs p99 latency using lock-free concurrency.</p>
            <div class="tags"><span>Java 21</span><span>Kafka</span><span>Redis</span><span>gRPC</span></div>
          </a>
          <a class="project-card reveal-item" href="https://github.com/rodrigoscharp/BETO-IA" target="_blank" rel="noopener noreferrer">
            <span class="label">2025</span>
            <h3>BETO IA</h3>
            <p>Self-hosted personal AI assistant with voice control, Spotify, Google Calendar and GitHub integrations — no third-party subscriptions.</p>
            <div class="tags"><span>Next.js 14</span><span>TypeScript</span><span>Groq LLM</span><span>Supabase</span></div>
          </a>
          <a class="project-card reveal-item" href="https://github.com/rodrigoscharp/WalletCore" target="_blank" rel="noopener noreferrer">
            <span class="label">2025</span>
            <h3>WalletCore</h3>
            <p>Digital wallet REST API handling fund transfers, double-entry ledger accounting and JWT auth — built for security, consistency and resilience.</p>
            <div class="tags"><span>Java 21</span><span>Spring Boot 3</span><span>PostgreSQL</span><span>RabbitMQ</span></div>
          </a>
        </div>
      </div>
    </section>

    <!-- EDUCATION -->
    <section class="section section--cream topo" id="education">
      <div class="container">
        <h2 class="headline headline--lg" data-reveal><span class="hl-line"><em class="hl-serif">Education</em></span></h2>
        <div class="xp-list">
          <div class="xp-item" data-reveal>
            <span class="label reveal-item">2024 — 2025</span>
            <div class="reveal-item">
              <h3>Java + Spring Boot</h3>
              <span class="xp-company">Rocketseat Specialist Course</span>
            </div>
          </div>
          <div class="xp-item" data-reveal>
            <span class="label reveal-item">2023 — 2025</span>
            <div class="reveal-item">
              <h3>Systems Analysis and Development</h3>
              <span class="xp-company">UNICSUL — Cruzeiro do Sul University</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
```

- [ ] **Step 3: Verify**

```bash
NODE_PATH=/Users/rodrigoscharp/.npm/_npx/e41f203b7505f1fb/node_modules \
node scripts/verify-shot.mjs http://localhost:8934/dev.html /private/tmp/claude-501/-Users-rodrigoscharp-Dev-Portfolio-Scharp/20177dff-deec-4940-8641-cd3fc54aaab2/scratchpad/t5-dev-top.png
NODE_PATH=/Users/rodrigoscharp/.npm/_npx/e41f203b7505f1fb/node_modules \
node scripts/verify-shot.mjs http://localhost:8934/dev.html /private/tmp/claude-501/-Users-rodrigoscharp-Dev-Portfolio-Scharp/20177dff-deec-4940-8641-cd3fc54aaab2/scratchpad/t5-dev-projects.png 1440 '#projects'
```

Read screenshots. Expected: olive hero "SHIPPING code THAT SCALES.", skill tiles, cream experience list, dark project cards with lime year labels. No console errors.

- [ ] **Step 4: Commit**

```bash
git add dev.html assets/css/lando-system.css
git commit -m "feat: dev page"
```

---

### Task 6: founder.html

**Files:**
- Create: `founder.html`
- Modify: `assets/css/lando-system.css` (append)

**Interfaces:**
- Consumes: shell from Task 2 (`<title>Rodrigo Scharp — Founder</title>`), classes; `assets/img/opt/munoart.jpg`, `assets/img/opt/macbook.jpg` from Task 1.
- Produces: complete `founder.html`.

- [ ] **Step 1: Append CSS**

```css
/* ===== founder page ===== */
.story { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: clamp(2rem, 5vw, 5rem); align-items: center; margin-top: 3rem; }
.story__img { border-radius: 1rem; overflow: hidden; }
.story__img img { aspect-ratio: 4 / 3; width: 100%; object-fit: cover; }
@media (max-width: 768px) { .story { grid-template-columns: 1fr; } }

.venture-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.2rem; margin-top: 3rem; }
.venture-card {
  border: 1px solid rgba(30, 32, 24, 0.25); border-radius: 0.9rem; padding: 1.8rem 1.5rem;
  display: flex; flex-direction: column; gap: 0.8rem; background: rgba(255, 255, 255, 0.35);
}
.venture-card h3 { font-family: var(--font-display); font-size: 1.5rem; text-transform: uppercase; }
.venture-card .label { color: var(--olive); opacity: 0.7; }
.venture-card .tags { display: flex; flex-wrap: wrap; gap: 0.4rem; }
.venture-card .tags span {
  font-size: 0.62rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em;
  border: 1px solid rgba(30, 32, 24, 0.35); border-radius: 99px; padding: 0.25rem 0.6rem;
}
```

- [ ] **Step 2: Create `founder.html`** (shell + this `<main>`)

```html
  <main>
    <!-- FOUNDER HERO -->
    <section class="hero section--cream topo" id="founder-hero" style="min-height:70svh">
      <div class="container">
        <span class="label">02 — The founder side</span>
        <h1 class="headline headline--xl" data-reveal style="margin-top:1rem">
          <span class="hl-line">Building</span>
          <span class="hl-line"><em class="hl-serif">Muno</em> &amp; beyond.</span>
        </h1>
      </div>
    </section>

    <!-- MUNO STORY -->
    <section class="section section--olive topo" id="muno">
      <div class="container">
        <span class="label label--lime">Founder & CEO — since Feb 2025</span>
        <div class="story">
          <div data-reveal>
            <h2 class="headline headline--lg"><span class="hl-line">MUNO</span></h2>
            <p class="lead reveal-item" style="margin-top:1.2rem">Founded and led from the ground up: product, brand and operations of a food tech startup focused on community-driven meal delivery. Fresh, community-centered meals with a modern, tech-driven approach.</p>
          </div>
          <div class="story__img img-hover" data-parallax="0.1">
            <img src="assets/img/opt/munoart.jpg" alt="MUNO brand art" loading="lazy">
          </div>
        </div>
      </div>
    </section>

    <!-- PUBLIC SECTOR -->
    <section class="section section--cream topo" id="public">
      <div class="container">
        <div class="story">
          <div class="story__img img-hover" data-parallax="0.1">
            <img src="assets/img/opt/smart-cities-curitiba-2026.jpg" alt="Smart Cities Curitiba" loading="lazy">
          </div>
          <div data-reveal>
            <span class="label reveal-item">2026 — Now</span>
            <h2 class="headline headline--md hl-line" style="margin-top:0.8rem">Leading <em class="hl-serif">innovation</em> for a whole city.</h2>
            <p class="lead reveal-item" style="margin-top:1.2rem">As C-Level Director of Technology and Innovation Management at Ubatuba City Hall, leading the city's technology strategy and the modernization of public digital services — hands-on.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- VENTURES -->
    <section class="section section--cream topo" id="ventures" style="padding-top:0">
      <div class="container">
        <h2 class="headline headline--lg" data-reveal><span class="hl-line">Ventures <em class="hl-serif">& brands</em></span></h2>
        <div class="venture-grid" data-reveal>
          <div class="venture-card reveal-item">
            <span class="label">Founder & CEO</span>
            <h3>MUNO FOOD</h3>
            <p>Food tech startup focused on delivering fresh, community-centered meals with a modern tech-driven approach.</p>
            <div class="tags"><span>Food Tech</span><span>Startup</span><span>Leadership</span></div>
          </div>
          <div class="venture-card reveal-item">
            <span class="label">Partner</span>
            <h3>Rocketseat</h3>
            <p>Education partner — tech education platform focused on programming. Use code SCHARP for a discount.</p>
            <div class="tags"><span>Education</span><span>Partnership</span></div>
          </div>
          <div class="venture-card reveal-item">
            <span class="label">Speaker & Guest</span>
            <h3>Tech Events</h3>
            <p>Web Summit Rio, TDC, Smart Cities and more — representing MUNO and Ubatuba across Brazil's tech circuit.</p>
            <div class="tags"><span>Speaking</span><span>Network</span></div>
          </div>
        </div>
      </div>
    </section>
  </main>
```

- [ ] **Step 3: Verify**

```bash
NODE_PATH=/Users/rodrigoscharp/.npm/_npx/e41f203b7505f1fb/node_modules \
node scripts/verify-shot.mjs http://localhost:8934/founder.html /private/tmp/claude-501/-Users-rodrigoscharp-Dev-Portfolio-Scharp/20177dff-deec-4940-8641-cd3fc54aaab2/scratchpad/t6-founder.png
NODE_PATH=/Users/rodrigoscharp/.npm/_npx/e41f203b7505f1fb/node_modules \
node scripts/verify-shot.mjs http://localhost:8934/founder.html /private/tmp/claude-501/-Users-rodrigoscharp-Dev-Portfolio-Scharp/20177dff-deec-4940-8641-cd3fc54aaab2/scratchpad/t6-ventures.png 1440 '#ventures'
```

Read screenshots. Expected: cream hero with serif "Muno"; olive MUNO story with art image; public-sector block; venture cards. No console errors.

- [ ] **Step 4: Commit**

```bash
git add founder.html assets/css/lando-system.css
git commit -m "feat: founder page"
```

---

### Task 7: network.html — editorial event grid

**Files:**
- Create: `network.html`
- Modify: `assets/css/lando-system.css` (append)

**Interfaces:**
- Consumes: shell from Task 2 (`<title>Rodrigo Scharp — Network</title>`); `assets/img/opt/*.jpg` from Task 1.
- Produces: complete `network.html`.

- [ ] **Step 1: Append CSS**

```css
/* ===== network page ===== */
.net-grid { display: grid; grid-template-columns: repeat(12, 1fr); gap: 1.2rem; margin-top: 4rem; }
.net-item { display: flex; flex-direction: column; gap: 0.6rem; }
.net-item img { aspect-ratio: 4 / 5; border-radius: 0.6rem; }
.net-item h3 { font-family: var(--font-display); font-size: 1.3rem; text-transform: uppercase; }
.net-item p { font-size: 0.85rem; opacity: 0.85; max-width: 30em; }
.net-item:nth-child(8n+1) { grid-column: 1 / span 4; }
.net-item:nth-child(8n+2) { grid-column: 7 / span 3; margin-top: 6rem; }
.net-item:nth-child(8n+3) { grid-column: 10 / span 3; margin-top: 2rem; }
.net-item:nth-child(8n+4) { grid-column: 2 / span 3; margin-top: 3rem; }
.net-item:nth-child(8n+5) { grid-column: 6 / span 4; margin-top: 7rem; }
.net-item:nth-child(8n+6) { grid-column: 1 / span 3; margin-top: 2rem; }
.net-item:nth-child(8n+7) { grid-column: 5 / span 3; margin-top: 5rem; }
.net-item:nth-child(8n+8) { grid-column: 9 / span 4; margin-top: 1rem; }
@media (max-width: 768px) {
  .net-grid { grid-template-columns: 1fr 1fr; gap: 1.5rem 1rem; }
  .net-item:nth-child(n) { grid-column: auto; margin-top: 0; }
}
```

- [ ] **Step 2: Create `network.html`** (shell + this `<main>`; note the hero is olive so use `header-on-dark` on `<header class="site-header header-on-dark">`... **correction:** header styling is global; keep the default header — hero below is olive but header text must stay readable, so this page's hero is CREAM, grid section olive. Use exactly the markup below.)

```html
  <main>
    <!-- NETWORK HERO -->
    <section class="hero section--cream topo" id="network-hero" style="min-height:60svh">
      <div class="container">
        <span class="label">03 — Network</span>
        <h1 class="headline headline--xl" data-reveal style="margin-top:1rem">
          <span class="hl-line">On the</span>
          <span class="hl-line"><em class="hl-serif">circuit</em>.</span>
        </h1>
        <p class="lead" style="margin-top:1.5rem">Conferences, summits and forums across Brazil — as founder, developer and public-sector tech director.</p>
      </div>
    </section>

    <!-- EVENT GRID -->
    <section class="section section--olive topo" id="events">
      <div class="container">
        <div class="net-grid">
          <figure class="net-item photo-card img-hover" data-parallax="0.12">
            <img src="assets/img/opt/web-summit-rio-2026.jpg" alt="Web Summit Rio" loading="lazy">
            <figcaption class="label label--lime">Rio de Janeiro, June 2026</figcaption>
            <h3>Web Summit Rio</h3>
            <p>Attended at GitHub's invitation, representing MUNO as Founder.</p>
          </figure>
          <figure class="net-item photo-card img-hover" data-parallax="0.2">
            <img src="assets/img/opt/geopixel-sjc-2026.jpg" alt="EU GEOPIXEL" loading="lazy">
            <figcaption class="label label--lime">São José dos Campos, May 2026</figcaption>
            <h3>EU GEOPIXEL</h3>
            <p>Debating georeferencing success cases in Brazilian cities.</p>
          </figure>
          <figure class="net-item photo-card img-hover" data-parallax="0.16">
            <img src="assets/img/opt/tdc-summit-sp-2026.jpg" alt="TDC Summit SP" loading="lazy">
            <figcaption class="label label--lime">São Paulo, April 2026</figcaption>
            <h3>TDC Summit SP</h3>
            <p>As Director of Technology and Innovation of Ubatuba.</p>
          </figure>
          <figure class="net-item photo-card img-hover" data-parallax="0.1">
            <img src="assets/img/opt/forum-cidades-inteligentes-2026.jpg" alt="Fórum de Cidades Digitais e Inteligentes" loading="lazy">
            <figcaption class="label label--lime">Pindamonhangaba, April 2026</figcaption>
            <h3>Fórum de Cidades Digitais</h3>
            <p>Invited as Ubatuba's Director of Technology to the smart-cities forum.</p>
          </figure>
          <figure class="net-item photo-card img-hover" data-parallax="0.18">
            <img src="assets/img/opt/smart-cities-curitiba-2026.jpg" alt="Smart Cities Curitiba" loading="lazy">
            <figcaption class="label label--lime">Curitiba, March 2026</figcaption>
            <h3>Smart Cities</h3>
            <p>As C-Level Director of Technology, alongside Ubatuba's Secretary of Technology.</p>
          </figure>
          <figure class="net-item photo-card img-hover" data-parallax="0.14">
            <img src="assets/img/opt/microsoft-debate-ia-2026.jpg" alt="AI debate at Microsoft" loading="lazy">
            <figcaption class="label label--lime">Microsoft Office, February 2026</figcaption>
            <h3>AI Debate at Microsoft</h3>
            <p>A debate on Artificial Intelligence at Microsoft's office.</p>
          </figure>
          <figure class="net-item photo-card img-hover" data-parallax="0.1">
            <img src="assets/img/opt/feira-empreendedor-2025.jpg" alt="Feira do Empreendedor" loading="lazy">
            <figcaption class="label label--lime">São Paulo, October 2025</figcaption>
            <h3>Feira do Empreendedor</h3>
            <p>Attended at SEBRAE's invitation.</p>
          </figure>
          <figure class="net-item photo-card img-hover" data-parallax="0.16">
            <img src="assets/img/opt/tdc-sp-2025.jpg" alt="TDC São Paulo" loading="lazy">
            <figcaption class="label label--lime">São Paulo, September 2025</figcaption>
            <h3>TDC São Paulo</h3>
            <p>The Developer's Conference, representing Prescon Assessoria as Junior Java Developer.</p>
          </figure>
        </div>
      </div>
    </section>
  </main>
```

- [ ] **Step 3: Verify**

```bash
NODE_PATH=/Users/rodrigoscharp/.npm/_npx/e41f203b7505f1fb/node_modules \
node scripts/verify-shot.mjs http://localhost:8934/network.html /private/tmp/claude-501/-Users-rodrigoscharp-Dev-Portfolio-Scharp/20177dff-deec-4940-8641-cd3fc54aaab2/scratchpad/t7-network.png 1440 '#events'
```

Read screenshot. Expected: asymmetric scattered photo grid on olive, lime captions, Anton event names. No console errors.

- [ ] **Step 4: Commit**

```bash
git add network.html assets/css/lando-system.css
git commit -m "feat: network page with editorial event grid"
```

---

### Task 8: Cleanup, responsive pass, final QA

**Files:**
- Delete: `assets/css/styles.css`, `assets/css/3d-effects.css`, `assets/js/main.js`, `assets/js/3d-effects.js` (after confirming nothing references them)
- Modify: any file needing responsive/visual fixes found during QA

- [ ] **Step 1: Confirm old assets are unreferenced, then remove**

```bash
grep -rl "styles.css\|3d-effects\|assets/js/main.js" index.html dev.html founder.html network.html
```
Expected: no output. Then:
```bash
git rm assets/css/styles.css assets/css/3d-effects.css assets/js/main.js assets/js/3d-effects.js
```

- [ ] **Step 2: Mobile screenshots (390px) of all four pages**

```bash
for p in index dev founder network; do
  NODE_PATH=/Users/rodrigoscharp/.npm/_npx/e41f203b7505f1fb/node_modules \
  node scripts/verify-shot.mjs http://localhost:8934/$p.html /private/tmp/claude-501/-Users-rodrigoscharp-Dev-Portfolio-Scharp/20177dff-deec-4940-8641-cd3fc54aaab2/scratchpad/t8-$p-mobile.png 390
done
```

Read all four. Expected: single-column layouts, no horizontal overflow, readable headline sizes. Fix any issues found (typical: headline overflow → reduce clamp() max; grid items overlapping → check media queries).

- [ ] **Step 3: Desktop full-page re-check of all four pages**

Same loop at width 1440. Read all four; verify no console errors, all images load (no broken image icons).

- [ ] **Step 4: Menu overlay check**

Temporarily verify by screenshot after clicking: add to verify-shot? Simpler manual check —

```bash
NODE_PATH=/Users/rodrigoscharp/.npm/_npx/e41f203b7505f1fb/node_modules node -e "
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto('http://localhost:8934/index.html', { waitUntil: 'networkidle' });
  await p.click('#menu-toggle'); await p.waitForTimeout(700);
  await p.screenshot({ path: '/private/tmp/claude-501/-Users-rodrigoscharp-Dev-Portfolio-Scharp/20177dff-deec-4940-8641-cd3fc54aaab2/scratchpad/t8-menu.png' });
  await b.close();
})();"
```

Read it. Expected: fullscreen olive overlay, giant nav links, socials row.

- [ ] **Step 5: Reduced-motion sanity check**

```bash
NODE_PATH=/Users/rodrigoscharp/.npm/_npx/e41f203b7505f1fb/node_modules node -e "
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  await p.goto('http://localhost:8934/index.html', { waitUntil: 'networkidle' });
  await p.locator('#partners').scrollIntoViewIfNeeded(); await p.waitForTimeout(500);
  await p.screenshot({ path: '/private/tmp/claude-501/-Users-rodrigoscharp-Dev-Portfolio-Scharp/20177dff-deec-4940-8641-cd3fc54aaab2/scratchpad/t8-reduced.png' });
  await b.close();
})();"
```

Read it. Expected: all content fully visible (nothing stuck hidden by animation initial states).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: remove legacy assets, responsive and QA fixes"
```

- [ ] **Step 7: Report to Rodrigo with desktop screenshots of all 4 pages; offer to push**

Do NOT push without asking.

---

## Self-Review Notes

- Spec coverage: identity (Task 2 CSS), 4 pages (Tasks 2–7), motion (Task 2 JS + data attributes used in every page), footer/menu (Task 2), marquee (Task 4), mailto contact (shell), reduced-motion + no-JS degradation (motion.js early-return + Task 8 check), image perf (Task 1), responsive (clamp/media queries + Task 8 pass). Old-asset retirement (Task 8).
- Signature is Caveat text, not a custom SVG path — accepted simplification of the spec's "signature as SVG graphic" (same visual effect; noted for the visual review).
- Type consistency: class names cross-checked between CSS (Task 2/5/6/7 appends) and all page markup; `data-reveal`/`data-parallax`/`.scribble path` contract defined once in Task 2 and only consumed later.
