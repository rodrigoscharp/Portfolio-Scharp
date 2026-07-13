# Certifications card deck — design

**Date:** 2026-07-13
**Status:** approved pending user review

## Goal

Replace the growing vertical list of courses/certificates inside the Education
section with a horizontal, drag-open "card deck" — a distinct new interaction
pattern (not reused from the pinned Selected/Corporate galleries or the
free-drifting experience timeline) that scales to future additions without
growing the page's vertical height.

## What changes

The existing Education section splits into two parts, on **both**
`index.html` (section--olive) and `dev.html` (section--cream):

1. **Certifications deck** — a horizontal, drag-driven fan of cards holding
   the 5 courses/certificates.
2. **Degree highlight** — the university degree (UNICSUL), pulled out of the
   deck into its own larger, visually distinct block (not a list item, not a
   deck card).

### Content mapping

| # | Year | Title | Institution | Credential link |
|---|------|-------|-------------|------------------|
| 1 | 2026 | Gen AI Agents: Transform Your Organization | Google Cloud | yes |
| 2 | 2026 | Claude Code in Action | Anthropic | yes |
| 3 | 2026 | AI Fluency: Frameworks & Foundations | Anthropic | yes |
| 4 | 2025 | Official Practice Question Set: AWS Certified Cloud Practitioner (CLF-C02) | Amazon Web Services | yes |
| 5 | 2024 — 2025 | Java + Spring Boot | Rocketseat Specialist Course | no |

Degree highlight (outside the deck): "Systems Analysis and Development",
UNICSUL — Cruzeiro do Sul University, 2023 — 2025.

## Interaction design

Validated with the user via visual mockups before writing this spec:

- **Closed/rest state**: the 5 cards sit tightly overlapped, each with its own
  fixed fan rotation angle (a "hand of cards" look — option **A** from the
  mockups), plus a small per-card vertical offset paired with that rotation.
- **Opening**: the user drags horizontally (mouse-drag or native touch swipe)
  — as drag progress goes from 0 to 1, the *spacing* between cards
  interpolates from "tightly overlapped" to "fully separated, each fully
  readable." **Rotation and vertical offset stay constant per card** through
  the whole drag (option **2** from the mockups) — only horizontal spacing
  changes.
- **No scroll-vertical pin**: unlike the Selected/Corporate galleries, this
  component never pins the page. It is driven purely by the user's own
  horizontal drag/scroll on the component itself.
- **No idle auto-drift**: unlike the experience timeline, the deck never
  moves on its own. It stays closed until the user actively drags it —
  reinforcing the "closed deck you open" metaphor, and deliberately
  differentiating this section from the timeline's continuous drift.

### Technical approach

- A container `.cert-deck` with native `overflow-x: auto`, hidden scrollbar,
  `cursor: grab`/`grabbing`, and the same mouse-drag-to-scroll pointer
  handlers already used by `.timeline` (so desktop mouse-drag works; touch
  devices get free native scrolling with zero extra JS).
- Inside, a `.cert-deck__stage` holds:
  - An invisible `.cert-deck__spacer` sized to establish the scrollable
    range (drag distance) the deck needs to fully open.
  - The `.cert-card` elements, positioned `absolute`, each with an inline
    `transform` recomputed on the container's native `scroll` event.
- On every `scroll` event, JS reads `container.scrollLeft / maxScrollLeft` to
  get a progress value in `[0, 1]`, then for each card `i` sets:
  - `translateX`: interpolated between a "closed offset" (small, causing
    overlap) and an "open offset" (`i * (cardWidth + gap)`, causing full
    separation) using `progress`.
  - `rotate` and `translateY`: fixed per card, **not** touched by `progress`.
- **Scales to N cards automatically**: fan angle per card is computed as
  `(i - (N-1)/2) * angleStep`, where `angleStep = maxSpread / (N-1)` and
  `maxSpread` is a constant ceiling (so adding a 6th or 7th certificate
  doesn't blow up the fan spread — it just tightens `angleStep`). The total
  drag distance (`.cert-deck__spacer` width) is likewise computed from the
  live card count, mirroring how `.projects-track`'s `dist()` is computed
  from `scrollWidth` today — no hardcoded card count anywhere.
- A small `label label--lime` hint ("Drag to open →") sits near the heading,
  matching the site's existing hint convention (e.g. "Keep scrolling →").

**Reference values from the validated mockup** (starting point for the
implementer, tunable to taste — the load-bearing requirement is the
behavior: rotation/Y fixed, only X spacing interpolates with drag progress):
- `angleStep ≈ 6deg` at 4 cards, i.e. `maxSpread ≈ angleStep * (N-1)` scaled
  so total fan spread stays visually similar as N grows (for N=5:
  `angleStep ≈ 4.5deg`, angles roughly `-9, -4.5, 0, 4.5, 9`).
- Per-card `translateY ≈ abs(angle) * 0.6px` (subtle lift on the more-rotated
  outer cards, approximating the mockup's `0,6 / 26,2 / 52,4 / 78,10` offsets).
- Closed-state X offset per card: small, tight overlap (~26px between
  consecutive cards in the mockup, cards ~190-210px wide).
- Open-state X offset per card: `i * (cardWidth + gap)`, fully separated.

### Visual treatment

- `.cert-card` gets a **solid fill** (`background: var(--ink); color:
  var(--cream);`) regardless of the section's own theme (olive or cream) —
  unlike `.project-card`, which is just an outlined box on the section
  background. A filled card face plus drop shadow is what sells the "physical
  stacked card" look on both section backgrounds.
- Card content mirrors the existing `.xp-item` fields: year label, `h3`
  title, `.xp-company` (serif italic), optional `.xp-credential` link.

## Error handling / edge cases

- Degree highlight block must not accidentally inherit `.xp-item`'s
  border-top list styling now that it's alone — needs its own visual
  treatment (larger block, more breathing room), not a bare list row.
- `maxScrollLeft` must be recomputed on resize (mirroring
  `invalidateOnRefresh` used elsewhere), so rotating a phone or resizing a
  desktop window doesn't leave the deck's progress calculation stale.
- On very narrow viewports, drag must still work via native touch scroll
  even if the pointer-drag JS (mouse-only) is inactive — same guarantee the
  timeline already relies on.

## Verification

Serve locally, then for both `index.html` and `dev.html`:
- Desktop: simulate mouse-drag across the full range, screenshot closed and
  fully-open states, confirm all 5 cards become fully readable with no
  clipping at the section edges.
- Mobile: simulate a real touch swipe across the full range, same checks.
- No console errors either page.

## Out of scope

- No changes to the Selected/Corporate galleries or the experience timeline.
- No new certificates added beyond the 5 listed above (future additions are
  a content change, not a design change, thanks to the scaling approach
  above).
