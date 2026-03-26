import "@scss/main.scss";
import { bindExitOverlayActions } from "./components/exit-overlay";
import { bindBoardActions } from "./game/board-controller";
import { WINNER_AUTO_ADVANCE_MS, WINNER_CONTINUE_UNLOCK_MS, WINNER_FLOW_INIT_DELAY_MS } from "./game/constants";
import { applyGameTheme, getGameLayoutAssets, renderMemoryBoard } from "./game/assets";
import { createDrawRenderData, createGameOverRenderData, createWinnerRenderData, hasDraw } from "./game/outcome";
import { getAppElement, renderScreen, renderScreenWithTransition } from "./game/screen";
import type { MemoryGameState, ScreenRenderState } from "./game/types";
import { createMemoryGameState, renderCurrentPlayer, renderScores } from "./game/ui-state";
import { readGameSettings } from "./shared/_game-settings";
import { navigateTo } from "./shared/_navigation";

let memoryGameState: MemoryGameState | null = null;
let winnerCanContinue = false;
let winnerContinueTimeoutId: number | null = null;
let winnerAutoAdvanceTimeoutId: number | null = null;
let winnerClickCleanup: (() => void) | null = null;

/**
 * Binds event handlers for Exit Actions.
 * @returns No return value; this function works via side effects.
 */
function bindExitActions(): void {
  const appElement = getAppElement();
  if (!appElement) {
    return;
  }

  bindExitOverlayActions(appElement, () => navigateTo("home"));
}

/**
 * Finds the closest actionable element from the event target using `data-action`.
 * @param target Original event target used for DOM lookup.
 * @returns Resolved `HTMLElement`, or `null` when no matching element can be resolved.
 */
function getActionTarget(target: EventTarget | null): HTMLElement | null {
  if (!(target instanceof HTMLElement)) {
    return null;
  }

  return target.closest<HTMLElement>("[data-action]");
}

/**
 * Reads the action value from the resolved action element.
 * @param target Original event target used for DOM lookup.
 * @returns Value of type `string`, or `null` when no valid value can be resolved.
 */
function getActionValue(target: EventTarget | null): string | null {
  const actionTarget = getActionTarget(target);
  return actionTarget?.dataset.action ?? null;
}

/**
 * Executes global game-page actions such as navigation.
 * @param action Action name read from a `data-action` attribute.
 * @returns No return value; this function works via side effects.
 */
function handleGamePageAction(action: string): void {
  if (action === "play-again") {
    navigateTo("settings");
    return;
  }

  if (action === "exit-game") {
    navigateTo("home");
  }
}

/**
 * Handles events for Game Page Click.
 * @param event DOM event triggered by the current user interaction.
 * @returns No return value; this function works via side effects.
 */
function onGamePageClick(event: MouseEvent): void {
  const action = getActionValue(event.target);
  if (!action) {
    return;
  }

  handleGamePageAction(action);
}

/**
 * Binds event handlers for Game Page Actions.
 * @returns No return value; this function works via side effects.
 */
function bindGamePageActions(): void {
  const appElement = getAppElement();
  if (!appElement) {
    return;
  }

  appElement.addEventListener("click", onGamePageClick);
}

/**
 * Returns Winner Screen Element from the current DOM/state context.
 * @returns Resolved `HTMLElement`, or `null` when no matching element can be resolved.
 */
function getWinnerScreenElement(): HTMLElement | null {
  return document.querySelector<HTMLElement>("[data-winner-screen]");
}

/**
 * Returns Winner Continue Element from the current DOM/state context.
 * @returns Resolved `HTMLElement`, or `null` when no matching element can be resolved.
 */
function getWinnerContinueElement(): HTMLElement | null {
  return document.querySelector<HTMLElement>("[data-winner-continue]");
}

/**
 * Clears Winner Continue Timer and related transient state.
 * @returns No return value; this function works via side effects.
 */
function clearWinnerContinueTimer(): void {
  if (winnerContinueTimeoutId === null) {
    return;
  }

  window.clearTimeout(winnerContinueTimeoutId);
  winnerContinueTimeoutId = null;
}

/**
 * Clears Winner Auto Timer and related transient state.
 * @returns No return value; this function works via side effects.
 */
function clearWinnerAutoTimer(): void {
  if (winnerAutoAdvanceTimeoutId === null) {
    return;
  }

  window.clearTimeout(winnerAutoAdvanceTimeoutId);
  winnerAutoAdvanceTimeoutId = null;
}

/**
 * Clears Winner Click Handler and related transient state.
 * @returns No return value; this function works via side effects.
 */
function clearWinnerClickHandler(): void {
  if (!winnerClickCleanup) {
    return;
  }

  winnerClickCleanup();
  winnerClickCleanup = null;
}

/**
 * Clears Winner Flow and related transient state.
 * @returns No return value; this function works via side effects.
 */
function clearWinnerFlow(): void {
  winnerCanContinue = false;
  clearWinnerContinueTimer();
  clearWinnerAutoTimer();
  clearWinnerClickHandler();
}

/**
 * Executes Reveal Winner Continue Hint for the current flow.
 * @returns No return value; this function works via side effects.
 */
function revealWinnerContinueHint(): void {
  const winnerContinueElement = getWinnerContinueElement();
  if (winnerContinueElement) {
    winnerContinueElement.classList.remove("winner__continue--pending");
  }

  winnerCanContinue = true;
}

/**
 * Renders Game Over Screen into the UI.
 * @param state Mutable in-memory game state for the current match.
 * @returns No return value; this function works via side effects.
 */
function renderGameOverScreen(state: MemoryGameState): void {
  const nextScreenState: ScreenRenderState = {
    screen: "gameOver",
    data: createGameOverRenderData(state),
  };
  renderScreenWithTransition(nextScreenState);
}

/**
 * Advances Winner To Game Over to the next step.
 * @param state Mutable in-memory game state for the current match.
 * @returns No return value; this function works via side effects.
 */
function advanceWinnerToGameOver(state: MemoryGameState): void {
  clearWinnerFlow();
  renderGameOverScreen(state);
}

/**
 * Binds event handlers for Winner Click Advance.
 * @param state Mutable in-memory game state for the current match.
 * @returns No return value; this function works via side effects.
 */
function bindWinnerClickAdvance(state: MemoryGameState): void {
  const winnerScreenElement = getWinnerScreenElement();
  if (!winnerScreenElement) {
    return;
  }

  const onWinnerClick = (): void => {
    if (!winnerCanContinue) {
      return;
    }

    advanceWinnerToGameOver(state);
  };

  winnerScreenElement.addEventListener("click", onWinnerClick);
  winnerClickCleanup = () => winnerScreenElement.removeEventListener("click", onWinnerClick);
}

/**
 * Starts Winner Progression flow.
 * @param state Mutable in-memory game state for the current match.
 * @returns No return value; this function works via side effects.
 */
function startWinnerProgression(state: MemoryGameState): void {
  clearWinnerFlow();
  bindWinnerClickAdvance(state);
  winnerContinueTimeoutId = window.setTimeout(revealWinnerContinueHint, WINNER_CONTINUE_UNLOCK_MS);
  winnerAutoAdvanceTimeoutId = window.setTimeout(() => advanceWinnerToGameOver(state), WINNER_AUTO_ADVANCE_MS);
}

/**
 * Determines whether the next screen should be `winner` or `draw`.
 * @param state Mutable in-memory game state for the current match.
 * @returns Value of type `ScreenRenderState`.
 */
function getWinnerScreenState(state: MemoryGameState): ScreenRenderState {
  if (hasDraw(state)) {
    return {
      screen: "draw",
      data: createDrawRenderData(state.settings),
    };
  }

  return {
    screen: "winner",
    data: createWinnerRenderData(state),
  };
}

/**
 * Renders Winner Screen into the UI.
 * @param state Mutable in-memory game state for the current match.
 * @returns No return value; this function works via side effects.
 */
function renderWinnerScreen(state: MemoryGameState): void {
  renderScreenWithTransition(getWinnerScreenState(state));
  window.setTimeout(() => startWinnerProgression(state), WINNER_FLOW_INIT_DELAY_MS);
}

/**
 * Initializes Ialize Memory Game for first use.
 * @param state Mutable in-memory game state for the current match.
 * @returns No return value; this function works via side effects.
 */
function initializeMemoryGame(state: MemoryGameState): void {
  memoryGameState = state;
  renderScores(state);
  renderCurrentPlayer(state);
}

/**
 * Binds event handlers for Gameplay.
 * @param state Mutable in-memory game state for the current match.
 * @returns No return value; this function works via side effects.
 */
function bindGameplay(state: MemoryGameState): void {
  bindBoardActions(state, {
    onScoresChanged: renderScores,
    onCurrentPlayerChanged: renderCurrentPlayer,
    onGameFinished: renderWinnerScreen,
  });
}

/**
 * Initializes Game Page for first use.
 * @returns No return value; this function works via side effects.
 */
function initGamePage(): void {
  clearWinnerFlow();
  const settings = readGameSettings();
  applyGameTheme(settings.theme);
  renderScreen({ screen: "game", data: getGameLayoutAssets(settings) });
  const deck = renderMemoryBoard(settings);
  const gameState = createMemoryGameState(settings, deck);
  initializeMemoryGame(gameState);
  bindGameplay(gameState);
  bindExitActions();
  bindGamePageActions();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initGamePage);
} else {
  initGamePage();
}

