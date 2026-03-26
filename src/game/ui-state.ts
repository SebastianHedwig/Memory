import type { MemoryCardData } from "../components/memory-card";
import type { GameSettings } from "../shared/_game-settings";
import { getPlayerIconSources, getStaticCurrentPlayerIcon } from "./assets";
import type { MemoryGameState, PlayerColor } from "./types";

/**
 * Creates Scores from the provided inputs.
 * @returns Record mapping with computed values.
 */
function createScores(): Record<PlayerColor, number> {
  return { blue: 0, orange: 0 };
}

/**
 * Creates Cards By ID from the provided inputs.
 * @param deck Shuffled card deck for the current game.
 * @returns Value of type `Map<string, MemoryCardData>`.
 */
function createCardsById(deck: MemoryCardData[]): Map<string, MemoryCardData> {
  return new Map(deck.map((card) => [card.id, card]));
}

/**
 * Creates the initial runtime state for a new memory match.
 * @param settings Validated game settings selected on the settings page.
 * @param deck Shuffled card deck for the current game.
 * @returns Value of type `MemoryGameState`.
 */
export function createMemoryGameState(settings: GameSettings, deck: MemoryCardData[]): MemoryGameState {
  return {
    settings,
    currentPlayer: settings.player,
    scores: createScores(),
    revealedCardIds: [],
    matchedPairIds: new Set<string>(),
    cardsById: createCardsById(deck),
    totalPairs: Math.floor(deck.length / 2),
    isBoardLocked: false,
    playerIconSources: getPlayerIconSources(settings),
    currentPlayerIconSrc: getStaticCurrentPlayerIcon(),
  };
}

/**
 * Executes Player Label for the current flow.
 * @param player Player color targeted by this operation.
 * @returns Generated string value for rendering or downstream processing.
 */
function playerLabel(player: PlayerColor): string {
  return player === "blue" ? "Blue" : "Orange";
}

/**
 * Returns Score Label from the current DOM/state context.
 * @param state Mutable in-memory game state for the current match.
 * @param player Player color targeted by this operation.
 * @returns Generated string value for rendering or downstream processing.
 */
function getScoreLabel(state: MemoryGameState, player: PlayerColor): string {
  const score = state.scores[player];
  if (state.settings.theme === "code-vibes") {
    return `${playerLabel(player)} ${score}`;
  }

  return String(score);
}

/**
 * Returns Score Element from the current DOM/state context.
 * @param player Player color targeted by this operation.
 * @returns Resolved `HTMLElement`, or `null` when no matching element can be resolved.
 */
function getScoreElement(player: PlayerColor): HTMLElement | null {
  return document.querySelector<HTMLElement>(`[data-player-score="${player}"]`);
}

/**
 * Updates both score fields in the header.
 * @param state Mutable in-memory game state for the current match.
 * @returns No return value; this function works via side effects.
 */
export function renderScores(state: MemoryGameState): void {
  const blueScoreElement = getScoreElement("blue");
  if (blueScoreElement) {
    blueScoreElement.textContent = getScoreLabel(state, "blue");
  }

  const orangeScoreElement = getScoreElement("orange");
  if (orangeScoreElement) {
    orangeScoreElement.textContent = getScoreLabel(state, "orange");
  }
}

/**
 * Returns Current Player Icon Element from the current DOM/state context.
 * @returns Resolved `HTMLImageElement`, or `null` when no matching element can be resolved.
 */
function getCurrentPlayerIconElement(): HTMLImageElement | null {
  return document.querySelector<HTMLImageElement>("[data-current-player-icon]");
}

/**
 * Returns Current Player Badge Element from the current DOM/state context.
 * @returns Resolved `HTMLElement`, or `null` when no matching element can be resolved.
 */
function getCurrentPlayerBadgeElement(): HTMLElement | null {
  return document.querySelector<HTMLElement>("[data-current-player-badge]");
}

/**
 * Synchronizes current-player badge and icon with state.
 * @param state Mutable in-memory game state for the current match.
 * @returns No return value; this function works via side effects.
 */
export function renderCurrentPlayer(state: MemoryGameState): void {
  const currentPlayerIconElement = getCurrentPlayerIconElement();
  if (currentPlayerIconElement) {
    currentPlayerIconElement.src =
      state.settings.theme === "code-vibes"
        ? state.playerIconSources[state.currentPlayer]
        : state.currentPlayerIconSrc;
  }

  const currentPlayerBadgeElement = getCurrentPlayerBadgeElement();
  if (currentPlayerBadgeElement) {
    currentPlayerBadgeElement.dataset.player = state.currentPlayer;
  }
}

