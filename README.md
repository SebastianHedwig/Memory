# Memory Game

Ein browserbasiertes 2-Spieler-Memory mit mehreren Themes, dynamischem Board und Screen-Flow zwischen Game, Winner/Draw und Game Over.

## Features
- 3 Themes: `code-vibes`, `gaming`, `foods`
- Einstellbares Board: `16`, `24` oder `36` Karten
- Wählbarer Startspieler: `blue` oder `orange`
- Dynamisches Rendern der Screens (`game`, `winner`, `draw`, `gameOver`)
- Exit-Overlay mit Theme-spezifischer Gestaltung
- Karten-Match-Logik inkl. Punktestand und Spielerwechsel

## Tech Stack
- TypeScript
- Vite
- SCSS (strukturierte Ordner für `base`, `components`, `pages`, `themes`)

## Voraussetzungen
- Node.js (empfohlen: aktuelle LTS)
- npm

## Installation
```bash
npm install
```

## Entwicklung starten
```bash
npm run dev
```

## Production Build
```bash
npm run build
```

## Preview Build
```bash
npm run preview
```

## Seiten
- `index.html` -> Home
- `settings.html` -> Settings
- `game.html` -> Spiel inkl. Winner/Draw/Game Over Rendering
- `privacy-policy.html`, `legal-notice.html`

## Projektstruktur (Kurzüberblick)
```text
src/
  components/        # Wiederverwendbare UI-Bausteine (z. B. overlay, memory-card)
  game/              # Game-Logik (board, assets, outcome, screen, ui-state, types)
  scss/              # Styles nach Verantwortungsbereichen
  shared/            # Gemeinsame Utilities (navigation, game-settings)
  home.ts
  settings.ts
  game.ts
```

## Wichtige Doku-Datei
- `tsdoc.md` enthält den Überblick über TypeScript-Architektur und TSDoc-Konventionen.

