# Portfolio Redesign — landonorris.com-inspired

**Date:** 2026-07-10
**Status:** Approved by Rodrigo (visual identity, page structure, motion, tech plan)

## Goal

Rebuild the portfolio with the visual language of landonorris.com — giant mixed typography, cream/olive/neon-lime palette, editorial photo layouts, scroll-driven motion — while remaining unmistakably a professional portfolio (developer + founder + public-sector tech director), not an athlete fan site.

## Constraints

- Static site, no build step. Deploys to Vercel exactly as today.
- Vanilla HTML/CSS/JS. Animation libraries (GSAP, ScrollTrigger, Lenis) via CDN.
- All content in **English**.
- Reuse existing photos in `assets/img/` (event photos, speaker cutout, logos).
- Old `index.html`/`styles.css` are replaced; git history is the rollback path.

## Visual Identity

### Palette

| Role | Color |
|---|---|
| Light section background | Cream `#F2F0E9` |
| Dark section background | Dark olive `#23261C` |
| Accent (buttons, scribbles, highlight labels) | Neon lime `#D6F62F` |
| Serif accent words on dark | Olive green `#9DB93B` |
| Text on cream | Near-black `#1E2018` |
| Text on olive | Cream `#F2F0E9` |

The current emerald `#00b37e` is retired.

### Typography (Google Fonts)

- **Anton** — condensed bold, ALL-CAPS giant headlines (the dominant voice).
- **Fraunces** (high-contrast, italic) — editorial serif for accent words *inside* headlines (the "WINS"/"LEGACY" treatment).
- **Archivo** — body text, labels, UI, small caps labels with letter-spacing.
- **Caveat** — large handwritten script overlay words (the "Collabs" treatment).

### Texture & graphic details

- Subtle topographic contour-line SVG pattern behind every section (dark lines on cream, light lines on olive).
- Neon SVG scribbles: hand-drawn underlines/circles over headline words, animated (draw-on) when scrolled into view.
- Pill buttons: neon lime background, black text, slight rounding. Hamburger icon in a rounded square.
- Rodrigo's stylized signature as an SVG graphic in the footer.
- Small uppercase photo captions: "RIO DE JANEIRO, 2026" style (Archivo, letter-spaced).

## Page Structure

Four pages sharing header + footer markup (duplicated per file — accepted trade-off of the no-build approach).

### Header (all pages)

Logo "RODRIGO SCHARP" stacked at left. At right: neon pill button "GET IN TOUCH" (mailto) + hamburger opening a fullscreen olive overlay with giant Anton nav links (HOME / DEV / FOUNDER / NETWORK) and social links.

### `index.html` — Home

1. **Hero** — Giant "RODRIGO SCHARP" name, speaker cutout photo (`scharp-speaker.png`) with parallax. Corner card widget (Lando's "NEXT RACE" style) showing current roles: "C-LEVEL — UBATUBA CITY HALL / FOUNDER — MUNO".
2. **Manifesto** — Full-viewport headline. Working copy: *"BUILDING PRODUCTS, SHIPPING CODE, LEADING **INNOVATION**. DEFINING A **LEGACY** IN TECH — ON AND OFF THE KEYBOARD."* Accent words in Fraunces italic (green on dark). All headline copy in this spec is working copy — finalized during implementation following this pattern (caps grotesque + serif accent words), reviewed by Rodrigo at visual review.
3. **DEV / FOUNDER split** — the ON TRACK / OFF TRACK treatment: two giant typographic blocks side by side, one with a neon scribble overlay, each with a one-line description and link to its page.
4. **NETWORK teaser** — 2–3 event photos scattered editorially with captions, link to `network.html`.
5. **Partners** — "PARTNERS & CLIENTS" headline with Caveat "Collabs" script overlay + infinite marquee of partner/client logos (Ubatuba City Hall, Prescon, Bitwise, GitHub, SEBRAE, Microsoft, ...). Logos already in `assets/img/` are used as images; the rest render as typographic wordmarks (Archivo bold) — no new logo assets are sourced.

### `dev.html` — DEV (predominantly dark)

- Intro headline.
- Skills as a graphic grid (Java, Spring Boot, AWS, Docker, MySQL, Git, TypeScript).
- Experience as an editorial timeline (Ubatuba City Hall, MUNO, Prescon, Bitwise).
- **Projects gallery** — the helmet-gallery treatment: dark cards in a grid, each project (BETO IA, MUNO, etc.) with name + year label in lime.
- Education (UNICSUL, Rocketseat).

### `founder.html` — FOUNDER

- MUNO story in editorial format (headline + photos + narrative).
- The C-Level / Director of Technology and Innovation role at Ubatuba.
- Other ventures/brand work (MUNO FOOD etc. from current Portfolio section).

### `network.html` — NETWORK

- Giant opening headline.
- Full editorial scattered photo grid of all 8 events (Web Summit Rio, TDC SP, Feira do Empreendedor, Microsoft AI debate, Smart Cities Curitiba, Fórum de Cidades Digitais, TDC Summit SP, EU GEOPIXEL), asymmetric placement, per-photo parallax, uppercase location/year captions.

### Footer (all pages)

Olive rounded card inset in a cream frame. Giant statement *"ALWAYS **BUILDING**."* with signature SVG. Columns: Pages / Follow On (LinkedIn, Instagram, GitHub). Neon "GET IN TOUCH" mailto button. Partner logo marquee strip. Copyright line.

The current contact form is **removed** (it has no backend; `action=""`). Contact = mailto CTA + social links.

## Motion

- **Lenis** smooth scrolling (CDN).
- **GSAP + ScrollTrigger** (CDN):
  - Headlines reveal line-by-line (translate-up + fade, staggered).
  - Photos: individual parallax speeds; scale-in on entry.
  - Scribble SVGs draw themselves (stroke-dashoffset) on entry.
  - Section transitions between cream and olive backgrounds.
- Infinite CSS marquee for partner logos.
- Hover: photo scale (1.05), scribble underline on links, micro-bounce on neon buttons.
- Fullscreen menu: overlay slides in, nav links stagger.
- `prefers-reduced-motion`: all animation collapses to simple fades; Lenis disabled.

## Files

```
index.html          (rewritten)
dev.html            (new)
founder.html        (new)
network.html        (new)
assets/css/lando-system.css   (new design system; styles.css + 3d-effects.css retired)
assets/js/motion.js           (Lenis init, GSAP animations, menu, marquee)
assets/img/...                (existing photos reused)
```

CDN dependencies: GSAP core, ScrollTrigger, Lenis. Google Fonts: Anton, Fraunces, Archivo, Caveat.

## Responsive

Editorial multi-column layouts collapse to single column on mobile. Headline sizes fluid via `clamp()`. Scattered photo grids become a staggered vertical flow. Menu is the same fullscreen overlay at all sizes.

## Error handling / graceful degradation

- If CDN scripts fail, the site remains fully readable: all animation is progressive enhancement (content visible without JS; reveals use a `.js` class gate).
- Images: explicit `width`/`height`/`object-fit` to prevent layout shift.

## Testing

- Visual verification per page via headless Chromium screenshots (desktop 1440px + mobile 390px).
- Console error check on every page.
- Lighthouse sanity pass (performance of large images — event JPEGs may need resizing/compression during implementation).
- `prefers-reduced-motion` spot check.

## Out of scope

- Blog, CMS, store, bilingual toggle.
- Backend for contact form.
- New photography/asset production beyond SVG textures and scribbles.
