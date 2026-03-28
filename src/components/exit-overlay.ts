type GameTheme = "code-vibes" | "gaming" | "foods";
const EXIT_OVERLAY_CLOSE_MS = 420;
const EXIT_OVERLAY_CLOSING_CLASS = "is-closing";
let exitOverlayHideTimerId: number | null = null;

export interface ExitOverlayCopy {
  title: string;
  continueLabel: string;
  confirmLabel: string;
}

const exitOverlayCopyByTheme: Record<GameTheme, ExitOverlayCopy> = {
  "code-vibes": {
    title: "Are you sure you want to quit the game?",
    continueLabel: "Back to game",
    confirmLabel: "Exit game",
  },
  gaming: {
    title: "Are you sure you want to quit the game?",
    continueLabel: "No, back to game",
    confirmLabel: "Yes, quit game",
  },
  foods: {
    title: "Are you sure you want to quit the game?",
    continueLabel: "NO, BACK TO game",
    confirmLabel: "EXIT game",
  },
};

/**
 * Returns Exit Overlay Copy from the current DOM/state context.
 * @param theme Active game theme key.
 * @returns Value of type `ExitOverlayCopy`.
 */
export function getExitOverlayCopy(theme: GameTheme): ExitOverlayCopy {
  return exitOverlayCopyByTheme[theme];
}

/**
 * Executes Exit Overlay Template for the current flow.
 * @param copy Theme-specific copy texts for the exit overlay.
 * @returns Generated string value for rendering or downstream processing.
 */
export function exitOverlayTemplate(copy: ExitOverlayCopy): string {
  return /*html*/ `
    <section class="game__exit-overlay notranslate" id="game-exit-overlay" data-game-exit-overlay translate="no" hidden>
      <button class="game__exit-overlay-backdrop" type="button" data-action="close-exit-overlay" aria-label="Close exit dialog"></button>
      <div class="game__exit-dialog" role="dialog" aria-modal="true" aria-labelledby="game-exit-title">
        <h3 class="game__exit-title" id="game-exit-title">${copy.title}</h3>
        <div class="game__exit-actions">
          <button class="game__exit-continue button" type="button" data-action="close-exit-overlay">${copy.continueLabel}</button>
          <button class="game__exit-confirm button button--secondary" type="button" data-action="exit-game">${copy.confirmLabel}</button>
        </div>
      </div>
    </section>`;
}

/**
 * Returns Exit Overlay from the current DOM/state context.
 * @returns Resolved `HTMLElement`, or `null` when no matching element can be resolved.
 */
function getExitOverlay(): HTMLElement | null {
  return document.querySelector<HTMLElement>("[data-game-exit-overlay]");
}

/**
 * Clears Exit Overlay Hide Timer and related transient state.
 * @returns No return value; this function works via side effects.
 */
function clearExitOverlayHideTimer(): void {
  if (exitOverlayHideTimerId === null) {
    return;
  }

  window.clearTimeout(exitOverlayHideTimerId);
  exitOverlayHideTimerId = null;
}

/**
 * Returns Overlay Close Delay from the current DOM/state context.
 * @returns Computed numeric value.
 */
function getOverlayCloseDelay(): number {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : EXIT_OVERLAY_CLOSE_MS;
}

/**
 * Executes Hide Overlay Immediately for the current flow.
 * @param overlay Input value used in this processing step.
 * @returns No return value; this function works via side effects.
 */
function hideOverlayImmediately(overlay: HTMLElement): void {
  overlay.hidden = true;
  overlay.classList.remove(EXIT_OVERLAY_CLOSING_CLASS);
}

/**
 * Executes Show Overlay for the current flow.
 * @param overlay Input value used in this processing step.
 * @returns No return value; this function works via side effects.
 */
function showOverlay(overlay: HTMLElement): void {
  clearExitOverlayHideTimer();
  overlay.classList.remove(EXIT_OVERLAY_CLOSING_CLASS);
  overlay.hidden = false;
}

/**
 * Executes Hide Overlay With Animation for the current flow.
 * @param overlay Input value used in this processing step.
 * @returns No return value; this function works via side effects.
 */
function hideOverlayWithAnimation(overlay: HTMLElement): void {
  if (overlay.hidden) {
    return;
  }

  clearExitOverlayHideTimer();
  const closeDelay = getOverlayCloseDelay();
  if (closeDelay === 0) {
    hideOverlayImmediately(overlay);
    return;
  }

  overlay.classList.add(EXIT_OVERLAY_CLOSING_CLASS);
  exitOverlayHideTimerId = window.setTimeout(() => {
    exitOverlayHideTimerId = null;
    hideOverlayImmediately(overlay);
  }, closeDelay);
}

/**
 * Updates Exit Overlay Visibility on the target element or state.
 * @param isVisible Controls whether the overlay should be visible.
 * @returns No return value; this function works via side effects.
 */
function setExitOverlayVisibility(isVisible: boolean): void {
  const overlay = getExitOverlay();
  if (!overlay) {
    return;
  }

  if (isVisible) {
    showOverlay(overlay);
    return;
  }

  hideOverlayWithAnimation(overlay);
}

/**
 * Returns Action Element from the current DOM/state context.
 * @param target Original event target used for DOM lookup.
 * @returns Resolved `HTMLElement`, or `null` when no matching element can be resolved.
 */
function getActionElement(target: EventTarget | null): HTMLElement | null {
  if (!(target instanceof HTMLElement)) {
    return null;
  }

  return target.closest<HTMLElement>("[data-action]");
}

/**
 * Handles Exit Overlay Action and triggers follow-up actions.
 * @param action Action name read from a `data-action` attribute.
 * @param onExitGame Callback executed when the game should be exited.
 * @returns No return value; this function works via side effects.
 */
function handleExitOverlayAction(action: string, onExitGame: () => void): void {
  if (action === "open-exit-overlay") {
    setExitOverlayVisibility(true);
    return;
  }

  if (action === "close-exit-overlay") {
    setExitOverlayVisibility(false);
    return;
  }

  if (action === "exit-game") {
    onExitGame();
  }
}

/**
 * Handles events for Exit Overlay Click.
 * @param event DOM event triggered by the current user interaction.
 * @param onExitGame Callback executed when the game should be exited.
 * @returns No return value; this function works via side effects.
 */
function onExitOverlayClick(event: MouseEvent, onExitGame: () => void): void {
  const actionElement = getActionElement(event.target);
  if (!actionElement) {
    return;
  }

  const action = actionElement.dataset.action;
  if (!action) {
    return;
  }

  handleExitOverlayAction(action, onExitGame);
}

/**
 * Binds event handlers for Exit Overlay Actions.
 * @param rootElement DOM element read or updated in this step.
 * @param onExitGame Callback executed when the game should be exited.
 * @returns No return value; this function works via side effects.
 */
export function bindExitOverlayActions(rootElement: HTMLElement, onExitGame: () => void): void {
  rootElement.addEventListener("click", (event: MouseEvent) => onExitOverlayClick(event, onExitGame));
}

