import { drawTemplate, gameLayoutTemplate, gameOverTemplate, winnerTemplate } from "../game.templates";
import { SCREEN_LEAVE_ANIMATION_MS } from "./constants";
import type { ScreenRenderState } from "./types";

/**
 * Applies Screen State to the current UI context.
 * @param screen Target screen identifier.
 * @returns No return value; this function works via side effects.
 */
function applyScreenState(screen: ScreenRenderState["screen"]): void {
  if (screen === "gameOver") {
    document.body.dataset.screen = "game-over";
    return;
  }

  document.body.dataset.screen = screen;
}

/**
 * Returns App Element from the current DOM/state context.
 * @returns Resolved `HTMLElement`, or `null` when no matching element can be resolved.
 */
export function getAppElement(): HTMLElement | null {
  return document.querySelector<HTMLElement>("#app");
}

/**
 * Renders App into the UI.
 * @param markup HTML markup string written into the app mount.
 * @returns No return value; this function works via side effects.
 */
function renderApp(markup: string): void {
  const appElement = getAppElement();
  if (!appElement) {
    return;
  }

  appElement.innerHTML = markup;
}

/**
 * Returns Screen Markup from the current DOM/state context.
 * @param state Mutable in-memory game state for the current match.
 * @returns Generated string value for rendering or downstream processing.
 */
function getScreenMarkup(state: ScreenRenderState): string {
  switch (state.screen) {
    case "game":
      return gameLayoutTemplate(state.data);
    case "winner":
      return winnerTemplate(state.data);
    case "draw":
      return drawTemplate(state.data);
    case "gameOver":
      return gameOverTemplate(state.data);
    default:
      return "";
  }
}

/**
 * Renders Screen into the UI.
 * @param state Mutable in-memory game state for the current match.
 * @returns No return value; this function works via side effects.
 */
export function renderScreen(state: ScreenRenderState): void {
  applyScreenState(state.screen);
  renderApp(getScreenMarkup(state));
}

/**
 * Returns Current Screen Element from the current DOM/state context.
 * @returns Resolved `HTMLElement`, or `null` when no matching element can be resolved.
 */
function getCurrentScreenElement(): HTMLElement | null {
  const appElement = getAppElement();
  if (!appElement) {
    return null;
  }

  return appElement.firstElementChild instanceof HTMLElement ? appElement.firstElementChild : null;
}

/**
 * Executes Prepare Entering Screen for the current flow.
 * @param element Eingabewert, der in diesem Verarbeitungsschritt verwendet wird.
 * @returns No return value; this function works via side effects.
 */
function prepareEnteringScreen(element: HTMLElement): void {
  element.classList.add("screen-transition-enter");
  requestAnimationFrame(() => {
    element.classList.add("is-visible");
  });
}

/**
 * Renders And Prepare Entering Screen into the UI.
 * @param state Mutable in-memory game state for the current match.
 * @returns No return value; this function works via side effects.
 */
function renderAndPrepareEnteringScreen(state: ScreenRenderState): void {
  renderScreen(state);
  const nextScreenElement = getCurrentScreenElement();
  if (nextScreenElement) {
    prepareEnteringScreen(nextScreenElement);
  }
}

/**
 * Executes Animate Leaving Screen And Render for the current flow.
 * @param currentScreenElement Currently visible screen container element.
 * @param state Mutable in-memory game state for the current match.
 * @returns No return value; this function works via side effects.
 */
function animateLeavingScreenAndRender(currentScreenElement: HTMLElement, state: ScreenRenderState): void {
  currentScreenElement.classList.add("screen-transition-leave");
  window.setTimeout(() => {
    renderAndPrepareEnteringScreen(state);
  }, SCREEN_LEAVE_ANIMATION_MS);
}

/**
 * Renders the target screen using leave/enter transitions.
 * @param state Mutable in-memory game state for the current match.
 * @returns No return value; this function works via side effects.
 */
export function renderScreenWithTransition(state: ScreenRenderState): void {
  const currentScreenElement = getCurrentScreenElement();
  if (!currentScreenElement) {
    renderAndPrepareEnteringScreen(state);
    return;
  }

  animateLeavingScreenAndRender(currentScreenElement, state);
}

