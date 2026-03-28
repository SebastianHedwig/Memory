# Memory Game

Browser-based 2-player memory game with three themes, configurable board size, and a dynamic screen flow between gameplay, winner/draw, and game-over screens.

## Features
- 3 themes: `code-vibes`, `gaming`, `foods`
- Board sizes: `16`, `24`, or `36` cards
- Selectable starting player: `blue` or `orange`
- Theme-specific assets, colors, and UI details
- Dynamic screen rendering: `board`, `winner`, `draw`, `gameOver`
- Exit overlay with theme-specific copy and styling
- Match logic with score tracking, turn switching, and game-end states
- Additional pages: `Legal Notice` and `Privacy Policy`
- Contact links on legal pages via `mailto:` and `tel:`

## Tech Stack
- TypeScript
- Vite
- SCSS (organized into `abstracts`, `base`, `components`, `pages`, `themes`)

## Requirements
- Node.js (recommended: current LTS)
- npm

## Setup
```bash
npm install
```

## NPM Scripts
```bash
npm run dev
npm run build
npm run preview
npm run docs:typedoc
```

## Pages
- `index.html` -> Home
- `settings.html` -> Settings
- `game.html` -> Game page (board, winner/draw, and game-over are rendered dynamically)
- `legal-notice.html` -> Legal Notice
- `privacy-policy.html` -> Privacy Policy

## Deployment (FTP)
- Upload only the contents of `dist/`.
- `vite.config.ts` currently uses `base: "/memory/"`.
- This matches deployments under a URL like:
  - `https://your-domain.tld/memory/index.html`
- If the project is deployed under a different subpath, adjust `base` and rebuild.

## TypeDoc
- TypeDoc is configured locally (`typedoc` as a dev dependency).
- Config file: `typedoc.json`
- Generated output: `.typedoc/`
- The generated docs are ignored via `.gitignore` and are not committed.
- Update docs:
```bash
npm run docs:typedoc
```

## Project Structure (Short Overview)
```text
src/
  components/          # Reusable UI building blocks (e.g. exit-overlay, memory-card)
  game/                # Core game logic (assets, board, outcome, screen, state, types)
  scss/                # Styling organized by responsibility
  shared/              # Shared utilities (navigation, game-settings)
  game.ts              # Game page entry point
  game.templates.ts    # Screen templates
  home.ts              # Home entry point
  legal-notice.ts      # Legal Notice entry point
  privacy-policy.ts    # Privacy Policy entry point
  settings.ts          # Settings entry point
  settings.templates.ts
```

## Documentation
- `tsdoc.md` contains the TypeScript architecture overview and TSDoc conventions used in the project.
