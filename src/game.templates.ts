import { exitOverlayTemplate, type ExitOverlayCopy } from "./components/exit-overlay";

interface GameLayoutTemplateData {
  blueIconSrc: string;
  orangeIconSrc: string;
  currentPlayerIconSrc: string;
  exitButtonIconSrc: string;
  exitButtonLabel: string;
  exitOverlayCopy: ExitOverlayCopy;
}

export function gameLayoutTemplate(data: GameLayoutTemplateData): string {
  return /*html*/ `
    <main class="game__layout">
      <header class="game__header">
        <div class="game__player-info">
          <div class="game__player-count">
            <div class="game__player-count-inner player-Blue">
              <img class="game__player-count-icon" src="${data.blueIconSrc}" alt="Blue Player Icon">
              <span class="game__player-count-value" data-player-score="blue">0</span>
            </div>
              <div class="game__player-count-inner player-Orange">
                <img class="game__player-count-icon" src="${data.orangeIconSrc}" alt="Orange Player Icon">
                <span class="game__player-count-value" data-player-score="orange">0</span>
              </div>
          </div>
          <div class="game__player-current">
            <span class="game__player-current-label">Current Player:</span>
            <div class="game__player-current-badge" data-current-player-badge>
              <img class="game__player-current-icon" src="${data.currentPlayerIconSrc}" alt="Current Player Icon" data-current-player-icon>
            </div>
          </div>
          <button
            class="game__exit-button button button--secondary"
            type="button"
            data-action="open-exit-overlay"
            aria-haspopup="dialog"
            aria-controls="game-exit-overlay">
            <img class="game__exit-button-icon button__icon" src="${data.exitButtonIconSrc}" alt="" aria-hidden="true">
            <span class="game__exit-button-label">${data.exitButtonLabel}</span>
          </button>
        </div>
      </header>
      <section class="game__table">
        <aside class="game__player-stack game__player-stack--blue" data-player-stack="blue" aria-label="Blue matched cards"></aside>
        <section class="game__board" data-game-board></section>
        <aside class="game__player-stack game__player-stack--orange" data-player-stack="orange" aria-label="Orange matched cards"></aside>
      </section>
      ${exitOverlayTemplate(data.exitOverlayCopy)}
    </main>`;
}

type WinnerTemplateData = {
  confettiSrc: string;
  playerName: string;
  playerColor: "blue" | "orange";
  playerImageSrc: string;
  playerImageAlt: string;
  pedestalLabel?: string;
};

type DrawTemplateData = {
  confettiSrc: string;
};

export function winnerTemplate(data: WinnerTemplateData): string {
  return /*html*/ `
    <section class="winner" data-winner-screen>
      ${data.confettiSrc ? `<img class="winner__confetti-image" src="${data.confettiSrc}" alt="Bild mit viel Konfetti">` : ""}
      <span class="winner__title">The winner is</span>
      <h2 class="winner__player winner__player--${data.playerColor}">${data.playerName}</h2>
      <div class="winner__player-media">
        <img class="winner__player-img" src="${data.playerImageSrc}" alt="${data.playerImageAlt}">
        ${data.pedestalLabel ? `<span class="winner__pedestal-label">${data.pedestalLabel}</span>` : ""}
      </div>
      <p class="winner__continue winner__continue--pending" data-winner-continue>Click to continue</p>
    </section>`;
}

export function drawTemplate(data: DrawTemplateData): string {
  return /*html*/ `
    <section class="winner" data-winner-screen>
      ${data.confettiSrc ? `<img class="winner__confetti-image" src="${data.confettiSrc}" alt="Bild mit viel Konfetti">` : ""}
      <h2 class="winner__draw-title">DRAW</h2>
      <p class="winner__continue winner__continue--pending" data-winner-continue>Click to continue</p>
    </section>`;
}

type GameOverTemplateData = {
  blueIconSrc: string;
  blueScore: number;
  orangeIconSrc: string;
  orangeScore: number;
};

export function gameOverTemplate(data: GameOverTemplateData): string {
  return /*html*/ `
    <section class="game-over" aria-labelledby="game-over-title">
      <h1 class="game-over__title" id="game-over-title">Game Over</h1>
      <div class="game-over__score-box">
        <span class="game-over__score-title">Final score</span>
        <div class="game-over__scores">
          <div class="game-over__score game-over__score--blue">
            <img class="game-over__score-icon" src="${data.blueIconSrc}" alt="" aria-hidden="true">
            <span class="game-over__score-value">
              <span class="game-over__score-label">Blue</span>
              <span class="game-over__score-number">${data.blueScore}</span>
            </span>
          </div>
          <div class="game-over__score game-over__score--orange">
            <img class="game-over__score-icon" src="${data.orangeIconSrc}" alt="" aria-hidden="true">
            <span class="game-over__score-value">
              <span class="game-over__score-label">Orange</span>
              <span class="game-over__score-number">${data.orangeScore}</span>
            </span>
          </div>
        </div>
        <div class="game-over__actions">
          <button class="game-over__restart-button button" type="button" data-action="play-again">Play again</button>
          <button class="game-over__exit-button button" type="button" data-action="exit-game">Exit game</button>
        </div>
      </div>
    </section>`;
}
