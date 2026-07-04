# Design

Visual system for the bookshelf. The voice is a **quiet library**: warm ink-and-paper chrome, editorial serif accents, and book covers carrying all the color. Tokens live in [src/index.css](src/index.css).

## Color

Two rooms, equal craft: light (day library) and dark (evening library). Both are warm-tinted — no pure grays, no cool blacks.

### Light (default)

| Token | Value | Role |
| --- | --- | --- |
| `--bg-primary` | `#faf8f5` | Page background (warm paper-white) |
| `--bg-secondary` / `--card-bg` | `#ffffff` | Cards, controls |
| `--text-primary` | `#221e1a` | Warm ink — headings, active pill |
| `--text-secondary` | `#524c45` | Body, authors (8.0:1) |
| `--text-tertiary` | `#6f675e` | Footnotes, metadata (5.2:1) |
| `--border-color` | `rgba(63, 44, 26, 0.1)` | Hairline borders |
| `--accent-color` | `#2f4b7c` | Ink blue — focus rings, selection, loader |

### Dark

Same roles: bg `#131110`, card `#211e1b`, ink `#f3efe9` / `#b5aca1` / `#8a8177`, accent `#7e9bd4`. All body-size text ≥ 4.5:1.

### Book pages (`--page-*`)

The modal interior is themed as paper: `--page-face/mid/edge` (page gradient), `--page-ink-strong/ink/muted/faint` (text ramp), `--page-rule`, `--page-seam-*` (spine shadow), `--cover-back-*`, `--modal-btn-*`. Light = paper in daylight; dark = paper by lamplight. Never hardcode colors inside the modal — extend these tokens.

### Book color (`--book-color`)

Each book's accent, set per-card/modal from data. **Always mix toward ink for text** — e.g. `color-mix(in srgb, var(--book-color) 55%, var(--text-primary))` — so any cover color stays readable in both themes.

## Typography

- `--font-display`: **Cormorant Garamond** — masthead, titles, section heads, quotes, empty/loading states. Italic = the site's aside voice (subtitle, bylines, quotes).
- `--font-body`: **Outfit** — everything else. Small-caps labels: 600 weight, 0.08–0.12em tracking.
- Quotes are set in display italic with hanging opening quotation marks (curly quotes in markup, `text-indent: -0.45em`).
- `text-wrap: balance` on titles, `text-wrap: pretty` on prose.

## Depth & surfaces

- Warm-tinted layered shadows via tokens: `--shadow-card(-hover)` for cards, `--shadow-book(-hover)` for compact "spines on a shelf" view. Dark theme swaps to black-based shadows.
- Cards: 12px radius, hairline border (`--border-hairline` = 0.5px on retina), resting shadow; hover lifts `translateY(-6px)` with `cubic-bezier(0.22, 1, 0.36, 1)` — no bounce, no scale.

## Motion

- The **book lift-and-open modal animation is sacred** (BookModal.css keyframes; phases driven by JS timeouts, not animationend — keep it that way).
- Entrances: opacity + small y-rise, `[0.16, 1, 0.3, 1]` ease, staggered for lists.
- Hover effects only inside `@media (hover: hover)`. Transitions name explicit properties — never `transition: all`.
- Reduced motion: global CSS kill-switch in index.css + `MotionConfig reducedMotion="user"` in main.jsx. Any new animation must survive both (i.e., end state must be the visible state).

## Interaction

- Focus: 2px accent outline, offset 2–3px, on every interactive element (global `:focus-visible`).
- Touch: 44px targets via `@media (pointer: coarse)`; tooltips disabled on touch.
- Active filter pill: solid ink (`--text-primary` bg, `--bg-primary` text) — chrome stays monochrome; the accent blue is reserved for focus/selection/links.

## Bans (project-specific)

- No gradient text, no side-stripe accents, no white-text-on-book-color chips (contrast varies by book).
- No new fonts; no cool grays; no decoration the covers can carry themselves.
