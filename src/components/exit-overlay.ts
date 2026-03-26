type GameTheme = "code-vibes" | "gaming" | "foods";

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
    continueLabel: "No, back to game",
    confirmLabel: "Exit game",
  },
};

export function getExitOverlayCopy(theme: GameTheme): ExitOverlayCopy {
  return exitOverlayCopyByTheme[theme];
}

export function exitOverlayTemplate(copy: ExitOverlayCopy): string {
  return /*html*/ `
    <section class="game__exit-overlay" id="game-exit-overlay" data-game-exit-overlay hidden>
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

function getExitOverlay(): HTMLElement | null {
  return document.querySelector<HTMLElement>("[data-game-exit-overlay]");
}

function setExitOverlayVisibility(isVisible: boolean): void {
  const overlay = getExitOverlay();
  if (!overlay) {
    return;
  }

  overlay.hidden = !isVisible;
}

function getActionElement(target: EventTarget | null): HTMLElement | null {
  if (!(target instanceof HTMLElement)) {
    return null;
  }

  return target.closest<HTMLElement>("[data-action]");
}

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

export function bindExitOverlayActions(rootElement: HTMLElement, onExitGame: () => void): void {
  rootElement.addEventListener("click", (event: MouseEvent) => onExitOverlayClick(event, onExitGame));
}
