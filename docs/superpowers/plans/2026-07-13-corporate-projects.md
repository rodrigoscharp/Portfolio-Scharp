# Corporate & Public Sector Projects Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "Corporate & public sector" section with 4 non-clickable project cards to `index.html` and `dev.html`, right after each page's "Selected projects" section.

**Architecture:** Pure content addition — a new `<section>` per page reusing existing classes (`section section--olive topo`, `projects-grid`, `project-card`, `reveal-item`). No CSS or JS changes. Cards are `<div>` (not `<a>`) because these internal systems have no public URL; verified that `cursor: pointer` comes from the `<a>` element, not the `.project-card` class, so no override is needed.

**Tech Stack:** Static HTML, existing `lando-system.css`, GSAP reveal pattern already wired to `data-reveal`/`reveal-item`.

## Global Constraints

- Site copy is in English; project names stay in Portuguese (official names) — per spec.
- Card order (reverse-chronological): APAE 2026 → PPA 2025 → Intervenção 2024 → Contratos 2024.
- No new CSS. No changes to the personal projects gallery, nav, or other sections.
- There is no test suite. Verification = serve with `python3 -m http.server` + screenshot script (allow ~4 s for the intro curtain before screenshotting).
- Commit after each task (repo convention: one commit per feat/fix, message in PT, `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>` trailer).

## Shared card markup

Both tasks insert this exact section body (identical in the two files):

```html
    <!-- CORPORATE & PUBLIC SECTOR -->
    <section class="section section--olive topo" id="corporate">
      <div class="container">
        <h2 class="headline headline--lg" data-reveal>
          <span class="hl-line">Corporate &amp; <em class="hl-serif">public sector</em></span>
        </h2>
        <div class="projects-grid" data-reveal>
          <div class="project-card reveal-item">
            <span class="label">2026 — APAE</span>
            <h3>Sistema de Gestão APAE</h3>
            <p>Complete management system with Finance, Pedagogical, HR and Administrative modules.</p>
            <div class="tags"><span>TypeScript</span></div>
          </div>
          <div class="project-card reveal-item">
            <span class="label">2025 — Ubatuba City Hall</span>
            <h3>Portal do PPA</h3>
            <p>Public portal for the city's multi-year plan (Plano Plurianual) — planning transparency and citizen participation.</p>
            <div class="tags"><span>Java 25</span><span>Spring</span></div>
          </div>
          <div class="project-card reveal-item">
            <span class="label">2024 — Ubatuba City Hall</span>
            <h3>Portal de Intervenção Pública</h3>
            <p>Platform for registering, managing and tracking public urban interventions across the city.</p>
            <div class="tags"><span>Java 25</span><span>Spring</span></div>
          </div>
          <div class="project-card reveal-item">
            <span class="label">2024 — Ubatuba City Hall</span>
            <h3>Sistema de Contratos e Licitações</h3>
            <p>End-to-end management of public contracts and bidding processes — lifecycle, deadlines and compliance.</p>
            <div class="tags"><span>Java</span><span>Spring</span></div>
          </div>
        </div>
      </div>
    </section>
```

---

### Task 1: Section on index.html

**Files:**
- Modify: `index.html` (insert after the projects section that closes at ~line 296, right before `<!-- FOUNDER -->`)

**Interfaces:**
- Consumes: existing classes from `assets/css/lando-system.css` and the reveal JS already loaded by the page.
- Produces: `section#corporate` on the home page.

- [ ] **Step 1: Insert the section**

In `index.html`, find the end of the projects section:

```html
        </div>
      </div>
    </section>

    <!-- FOUNDER -->
```

Insert the **Shared card markup** block (above) between `</section>` and `<!-- FOUNDER -->`, keeping a blank line on each side.

- [ ] **Step 2: Serve and screenshot**

```bash
python3 -m http.server 8741  # from repo root, background — skip if already running
NODE_PATH=/Users/rodrigoscharp/.npm/_npx/e41f203b7505f1fb/node_modules node -e '
const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const errs = [];
  p.on("console", m => { if (m.type() === "error") errs.push(m.text()); });
  p.on("pageerror", e => errs.push(String(e)));
  await p.goto("http://localhost:8741/index.html", { waitUntil: "networkidle" });
  await p.waitForTimeout(4000);
  await p.locator("#corporate").scrollIntoViewIfNeeded();
  await p.waitForTimeout(2000);
  await p.screenshot({ path: "/private/tmp/claude-501/-Users-rodrigoscharp-Dev-Portfolio-Scharp/393a6f6b-2172-47c1-b2ca-675381eb95e3/scratchpad/index-corporate.png" });
  await b.close();
  console.log(errs.length ? "CONSOLE ERRORS:\n" + errs.join("\n") : "no console errors");
})();'
```

Expected: `no console errors`.

- [ ] **Step 3: Look at the screenshot**

Open `index-corporate.png` and confirm: headline "CORPORATE & public sector" rendered, 4 cards visible (not stuck at opacity 0), correct titles/years/tags, olive background with topo texture.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: seção Corporate & public sector na home

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: Section on dev.html

**Files:**
- Modify: `dev.html` (insert after the projects section that closes at ~line 143, right before `<!-- EDUCATION -->`)

**Interfaces:**
- Consumes: same classes/JS as Task 1.
- Produces: `section#corporate` on the Dev page.

- [ ] **Step 1: Insert the section**

In `dev.html`, find the end of the projects section:

```html
        </div>
      </div>
    </section>

    <!-- EDUCATION -->
```

Insert the **Shared card markup** block between `</section>` and `<!-- EDUCATION -->`, keeping a blank line on each side.

- [ ] **Step 2: Serve and screenshot**

Same command as Task 1 Step 2, replacing the URL with `http://localhost:8741/dev.html` and the output path with `.../scratchpad/dev-corporate.png`.

Expected: `no console errors`.

- [ ] **Step 3: Look at the screenshot**

Open `dev-corporate.png` and confirm the same checks as Task 1 Step 3.

- [ ] **Step 4: Commit**

```bash
git add dev.html
git commit -m "feat: seção Corporate & public sector na página Dev

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```
