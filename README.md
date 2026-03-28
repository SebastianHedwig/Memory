# Memory Game

Browserbasiertes 2-Spieler-Memory mit drei Themes, konfigurierbarer Boardgröße und dynamischem Screen-Flow zwischen Spiel, Winner/Draw und Game Over.

## Features
- 3 Themes: `code-vibes`, `gaming`, `foods`
- Boardgrößen: `16`, `24` oder `36` Karten
- Startspieler wählbar: `blue` oder `orange`
- Theme-spezifische Assets, Farben und UI-Details
- Dynamisches Rendern der Screens: `board`, `winner`, `draw`, `gameOver`
- Exit-Overlay mit Theme-spezifischem Text und Styling
- Match-Logik inkl. Punktestand, Spielerwechsel und Endzustand
- Zusätzliche Seiten: `Legal Notice` und `Privacy Policy`

## Tech Stack
- TypeScript
- Vite
- SCSS (aufgeteilt nach `abstracts`, `base`, `components`, `pages`, `themes`)

## Voraussetzungen
- Node.js (empfohlen: aktuelle LTS)
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

## Seiten
- `index.html` -> Home
- `settings.html` -> Settings
- `game.html` -> Spielseite (Board, Winner/Draw, Game Over werden dynamisch gerendert)
- `legal-notice.html` -> Legal Notice
- `privacy-policy.html` -> Privacy Policy

## Deployment (FTP)
- Für den Upload wird nur der Inhalt aus `dist/` benötigt.
- In `vite.config.ts` ist aktuell `base: "/memory/"` gesetzt.
- Das passt für Deployments unter einer URL wie:
  - `https://deine-domain.tld/memory/index.html`
- Wenn das Projekt in einem anderen Unterpfad liegt, muss `base` angepasst und neu gebaut werden.

## TypeDoc
- TypeDoc ist lokal eingerichtet (`typedoc` als Dev-Dependency).
- Konfiguration: `typedoc.json`
- Generierter Output: `.typedoc/`
- Der Doku-Output ist in `.gitignore` eingetragen und wird nicht mit ins Repository aufgenommen.

## Projektstruktur (Kurzüberblick)
```text
src/
  components/          # Wiederverwendbare UI-Bausteine (z. B. exit-overlay, memory-card)
  game/                # Kernlogik (assets, board, outcome, screen, state, types)
  scss/                # Styling nach Verantwortungsbereichen
  shared/              # Gemeinsame Utilities (navigation, game-settings)
  game.ts              # Einstiegspunkt Spielseite
  game.templates.ts    # Screen-Templates
  home.ts              # Einstiegspunkt Home
  legal-notice.ts      # Einstiegspunkt Legal Notice
  privacy-policy.ts    # Einstiegspunkt Privacy Policy
  settings.ts          # Einstiegspunkt Settings
  settings.templates.ts
```

## Dokumentation
- `tsdoc.md` enthält den Überblick zur TypeScript-Architektur und den verwendeten TSDoc-Konventionen.
