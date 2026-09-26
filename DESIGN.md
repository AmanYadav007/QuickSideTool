# QuickSideTool design system

Dark green theme. Tokens live in `src/index.css` (`:root`); Tailwind mirrors
the palette in `tailwind.config.js`. Components use the semantic tokens
(`text-[var(--color-text-muted)]`), never raw hex.

## Palette

| Brand name        | Hex       | Role (token)                                   |
|-------------------|-----------|------------------------------------------------|
| Rich Black        | `#021B1A` | Page background (`--color-bg`), text on green (`--color-on-primary`) |
| Dark Green        | `#032221` | Bands, secondary buttons, upload zones (`--color-bg-alt`) |
| Pine              | `#06302B` | Cards and tool tiles (`--color-bg-card`)       |
| Basil             | `#0B453A` | Borders (`--color-border`)                     |
| Forest            | `#095544` | Selected / tinted surfaces, icon chips (`--color-primary-light`) |
| Frog              | `#17876D` | Hover and emphasis borders (`--color-border-strong`) |
| Bangladesh Green  | `#03624C` | Illustration and gradient depth only           |
| Mint              | `#2FA98C` | Illustration only                              |
| Mountain Meadow   | `#2CC295` | Primary hover (`--color-primary-hover`)        |
| Caribbean Green   | `#00DF81` | Primary actions, links, focus, success (`--color-primary`) |
| Anti-Flash White  | `#F1F7F6` | Body text and headings (`--color-text`)        |
| Pistachio         | `#AACBC4` | Secondary text (`--color-text-muted`)          |
| Stone             | `#707D7D` | Disabled states and dividers only              |

Outside the palette, for status only: error `#FF6B6B`, warning `#F5B942`,
and small hint text `#849896` (`--color-text-light`, a Stone/Pistachio mix).

## Contrast rules

- Text on Caribbean Green is always Rich Black. White on it is 1.6:1.
- Stone is not a text colour: it is 3.4:1 on Pine. Use `--color-text-light`.
- Caribbean text is fine on every dark surface (8:1 or better) and on
  Forest (4.96:1), but not on Bangladesh Green (4.16:1).

## Typography

Brand face: **Axiforma** in three weights only.

| Weight          | Use                                     |
|-----------------|-----------------------------------------|
| Regular 400     | Body copy, descriptions                 |
| Medium 500      | Labels, subheadings (`.h3`), nav        |
| Semi Bold 600   | Headings (`.h1`, `.h2`), buttons, titles |

No bold (700) or heavier. Axiforma is a commercial font, so the app ships
**Poppins** (the closest free match, bundled via `@fontsource/poppins` so it
works offline in the extension). To switch once you have a web licence:
add the Axiforma `.woff2` files with `@font-face` rules and put `"Axiforma"`
first in `--font-sans` in `src/index.css` and `fontFamily.sans` in
`tailwind.config.js`.

## Components

- **Primary button** (`.btn-primary`): Caribbean Green, Rich Black Semi Bold
  text, pill radius; hover Mountain Meadow.
- **Secondary button** (`.btn-secondary`): Dark Green, Basil border; hover
  Pine with a Frog border.
- **Card** (`.card`): Rich Black or Pine surface, Basil border, 16px radius.
- **Upload zone** (`.upload-zone`): Dark Green with a dashed Frog border;
  Caribbean border on hover/drag.
- **Selected option**: Forest background, Caribbean border or text.
- **Tool icon chip**: Forest square, Caribbean icon.

## Logo

Caribbean Green rounded panel with Rich Black side-rail and document
(`src/components/Logo.jsx`, `public/logo.svg`). The extension PNGs in
`public/icon*.png` are rendered from `logo.svg`.

## Don'ts

- No blues, purples or slate greys, and no gradients on buttons or text.
- No Tailwind opacity modifiers on `var()` colours
  (`bg-[var(--color-bg)]/90`): Tailwind 3 silently drops them. Use the
  palette names instead (`bg-brand-rich-black/90`) or a tint token
  (`--color-error-bg`).
