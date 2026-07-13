# Corporate & public sector projects section — design

**Date:** 2026-07-13
**Status:** approved pending user review

## Goal

Add the corporate/institutional systems Rodrigo built to the portfolio, clearly
separated from the personal GitHub projects, so the site works as a résumé of
professional work.

## What changes

A new section, **"Corporate & public sector"**, added to **both** `index.html`
and `dev.html`, immediately after the existing "Selected projects" section.

- Same visual treatment as sibling sections: `section section--olive topo`.
- Headline follows the house style: `Corporate & <em class="hl-serif">public sector</em>`
  inside `headline headline--lg` with `hl-line` spans and `data-reveal`.
- Cards laid out with the existing `projects-grid` class (already used in
  `dev.html`) — **no new CSS**.
- On `index.html` the existing horizontal pinned gallery is untouched; the new
  section is a plain static grid below it.

## Cards

Cards are **non-clickable**: `<div class="project-card reveal-item">` instead of
`<a>` (these are internal systems with no public URL). Same inner structure as
existing cards: `label` (year — client), `h3` (official name in Portuguese),
`p` (description in English), `tags`.

Ordered reverse-chronologically:

| # | Title (PT) | Label | Tags | Description (EN) |
|---|---|---|---|---|
| 1 | Sistema de Gestão APAE | 2026 — APAE | TypeScript | Complete management system with Finance, Pedagogical, HR and Administrative modules. |
| 2 | Portal do PPA | 2025 — Ubatuba City Hall | Java 25, Spring | Public portal for the city's multi-year plan (Plano Plurianual) — planning transparency and citizen participation. |
| 3 | Portal de Intervenção Pública | 2024 — Ubatuba City Hall | Java 25, Spring | Platform for registering, managing and tracking public urban interventions across the city. |
| 4 | Sistema de Contratos e Licitações | 2024 — Ubatuba City Hall | Java, Spring | End-to-end management of public contracts and bidding processes — lifecycle, deadlines and compliance. |

## Error handling / edge cases

- `project-card` hover styles must not imply clickability on the new `div`
  cards; if the CSS applies a pointer cursor via the class (not the tag),
  override inline or verify it comes from the `<a>` element.
- Reveal animations: cards use `reveal-item` inside a `data-reveal` container,
  matching the pattern that already works site-wide (start `top bottom` fix
  from 2026-07-11 applies).

## Verification

Serve locally, screenshot the new section on both pages at settled state
(intro curtain takes ~3 s), confirm: grid renders, reveals fire, no console
errors, cards show no link cursor.

## Out of scope

- No changes to the personal projects gallery, nav, or other sections.
- No new CSS beyond what exists.
