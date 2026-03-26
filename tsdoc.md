# TypeScript Documentation (TSDoc)

## Purpose
This file documents the TypeScript structure of the Memory project and defines the TSDoc style used in the codebase.

## Entry Points
- `src/home.ts`: Home screen bootstrap and navigation to settings.
- `src/settings.ts`: Settings form rendering, validation, preview handling, and game-settings persistence.
- `src/game.ts`: Game page orchestration (screen flow, winner/draw/game-over transitions, bindings).

## Game Module Structure
- `src/game/types.ts`: Shared game types and render-state contracts.
- `src/game/constants.ts`: Timing and flow constants used by gameplay logic.
- `src/game/assets.ts`: Theme asset resolution and board/deck creation.
- `src/game/screen.ts`: App mount rendering and screen transition helpers.
- `src/game/ui-state.ts`: Score and current-player UI synchronization.
- `src/game/outcome.ts`: Winner/draw/game-over render data creation.
- `src/game/board-dom.ts`: Board/card DOM lookup and card state class updates.
- `src/game/board-collect.ts`: Matched-card collection and flight-to-stack animation.
- `src/game/board-controller.ts`: Core board interaction flow (selection, match/mismatch handling).

## Core Runtime Flow
1. `src/settings.ts` builds and stores `GameSettings`.
2. `src/game.ts` reads settings and applies theme/assets.
3. `src/game/assets.ts` renders board and deck.
4. `src/game/board-controller.ts` handles card interaction loop.
5. `src/game/outcome.ts` provides winner/draw/game-over data.
6. `src/game/screen.ts` transitions between game screens.

## TSDoc Conventions
- Every function has a summary line that explains intent, not just the function name.
- Use `@param` for all parameters with contextual meaning.
- Use `@returns` for explicit return semantics, including `null` or async behavior.
- Keep comments short, concrete, and behavior-focused.
- Keep wording in English across all `.ts` files.

## Update Rule
When moving logic to new helper files, update this file so architecture and flow remain accurate.
