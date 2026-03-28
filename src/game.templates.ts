import { exitOverlayTemplate, type ExitOverlayCopy } from "./components/exit-overlay";

interface GameLayoutTemplateData {
  blueIconSrc: string;
  orangeIconSrc: string;
  currentPlayerIconSrc: string;
  exitButtonIconSrc: string;
  exitButtonLabel: string;
  exitOverlayCopy: ExitOverlayCopy;
}

/**
 * Executes Game Player Count Template for the current flow.
 * @param data Input value used in this processing step.
 * @returns Generated string value for rendering or downstream processing.
 */
function gamePlayerCountTemplate(data: GameLayoutTemplateData): string {
  return /*html*/ `
    <div class="game__player-count">
      <div class="game__player-count-inner player-Blue">
        <img class="game__player-count-icon" src="${data.blueIconSrc}" alt="Blue Player Icon">
        <span class="game__player-count-value" data-player-score="blue">0</span>
      </div>
      <div class="game__player-count-inner player-Orange">
        <img class="game__player-count-icon" src="${data.orangeIconSrc}" alt="Orange Player Icon">
        <span class="game__player-count-value" data-player-score="orange">0</span>
      </div>
    </div>`;
}

/**
 * Executes Game Current Player Template for the current flow.
 * @param currentPlayerIconSrc Image path for the current-player icon.
 * @returns Generated string value for rendering or downstream processing.
 */
function gameCurrentPlayerTemplate(currentPlayerIconSrc: string): string {
  return /*html*/ `
    <div class="game__player-current">
      <span class="game__player-current-label">Current Player:</span>
      <div class="game__player-current-badge" data-current-player-badge>
        <img class="game__player-current-icon" src="${currentPlayerIconSrc}" alt="Current Player Icon" data-current-player-icon>
      </div>
    </div>`;
}

/**
 * Executes Game Exit Button Template for the current flow.
 * @param exitButtonIconSrc Image path for the exit-button icon.
 * @param exitButtonLabel Theme-specific text label for the exit button.
 * @returns Generated string value for rendering or downstream processing.
 */
function gameExitButtonTemplate(exitButtonIconSrc: string, exitButtonLabel: string): string {
  return /*html*/ `
    <button
      class="game__exit-button button button--secondary"
      type="button"
      data-action="open-exit-overlay"
      aria-haspopup="dialog"
      aria-controls="game-exit-overlay">
      <img class="game__exit-button-icon button__icon" src="${exitButtonIconSrc}" alt="" aria-hidden="true">
      <span class="game__exit-button-label">${exitButtonLabel}</span>
    </button>`;
}

/**
 * Executes Game Board Table Template for the current flow.
 * @returns Generated string value for rendering or downstream processing.
 */
function gameBoardTableTemplate(): string {
  return /*html*/ `
    <div class="game__table">
      <aside class="game__player-stack game__player-stack--blue" data-player-stack="blue" aria-label="Blue matched cards"></aside>
      <section class="game__board" data-game-board aria-label="Memory game board"></section>
      <aside class="game__player-stack game__player-stack--orange" data-player-stack="orange" aria-label="Orange matched cards"></aside>
    </div>`;
}

/**
 * Executes Game Layout Template for the current flow.
 * @param data Input value used in this processing step.
 * @returns Generated string value for rendering or downstream processing.
 */
export function gameLayoutTemplate(data: GameLayoutTemplateData): string {
  return /*html*/ `
    <main class="game__layout notranslate" translate="no">
      <header class="game__header">
        <div class="game__player-info">
          ${gamePlayerCountTemplate(data)}
          ${gameCurrentPlayerTemplate(data.currentPlayerIconSrc)}
          ${gameExitButtonTemplate(data.exitButtonIconSrc, data.exitButtonLabel)}
        </div>
      </header>
      ${gameBoardTableTemplate()}
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

/**
 * Executes Winner Template for the current flow.
 * @param data Input value used in this processing step.
 * @returns Generated string value for rendering or downstream processing.
 */
export function winnerTemplate(data: WinnerTemplateData): string {
  return /*html*/ `
    <section class="winner notranslate" data-winner-screen aria-labelledby="winner-title" translate="no">
      ${data.confettiSrc ? `<img class="winner__confetti-image" src="${data.confettiSrc}" alt="Confetti decoration">` : ""}
      <h1 class="winner__title" id="winner-title">The winner is</h1>
      <h2 class="winner__player winner__player--${data.playerColor}">${data.playerName}</h2>
      <div class="winner__player-media">
        <img class="winner__player-img" src="${data.playerImageSrc}" alt="${data.playerImageAlt}">
        ${data.pedestalLabel ? `<span class="winner__pedestal-label">${data.pedestalLabel}</span>` : ""}
      </div>
      <p class="winner__continue winner__continue--pending" data-winner-continue>Click to continue</p>
    </section>`;
}

/**
 * Executes Draw Template for the current flow.
 * @param data Input value used in this processing step.
 * @returns Generated string value for rendering or downstream processing.
 */
export function drawTemplate(data: DrawTemplateData): string {
  return /*html*/ `
    <section class="winner notranslate" data-winner-screen aria-labelledby="draw-title" translate="no">
      ${data.confettiSrc ? `<img class="winner__confetti-image" src="${data.confettiSrc}" alt="Confetti decoration">` : ""}
      <h1 class="winner__draw-title" id="draw-title">DRAW</h1>
      <p class="winner__continue winner__continue--pending" data-winner-continue>Click to continue</p>
    </section>`;
}

type GameOverTemplateData = {
  blueIconSrc: string;
  blueScore: number;
  orangeIconSrc: string;
  orangeScore: number;
};

/**
 * Executes Game Over Score Template for the current flow.
 * @param color Input value used in this processing step.
 * @param iconSrc Image path for an icon asset.
 * @param score Input value used in this processing step.
 * @returns Generated string value for rendering or downstream processing.
 */
function gameOverScoreTemplate(color: "blue" | "orange", iconSrc: string, score: number): string {
  const label = color === "blue" ? "Blue" : "Orange";
  return /*html*/ `
    <div class="game-over__score game-over__score--${color}">
      <img class="game-over__score-icon" src="${iconSrc}" alt="" aria-hidden="true">
      <span class="game-over__score-value">
        <span class="game-over__score-label">${label}</span>
        <span class="game-over__score-number">${score}</span>
      </span>
    </div>`;
}

/**
 * Executes Game Over Actions Template for the current flow.
 * @returns Generated string value for rendering or downstream processing.
 */
function gameOverActionsTemplate(): string {
  return /*html*/ `
    <div class="game-over__actions">
      <button class="game-over__restart-button button" type="button" data-action="play-again">Play again</button>
      <button class="game-over__exit-button button" type="button" data-action="exit-game">Exit game</button>
    </div>`;
}

/**
 * Executes Game Over Template for the current flow.
 * @param data Input value used in this processing step.
 * @returns Generated string value for rendering or downstream processing.
 */
export function gameOverTemplate(data: GameOverTemplateData): string {
  return /*html*/ `
    <section class="game-over notranslate" aria-labelledby="game-over-title" translate="no">
      <h1 class="game-over__title" id="game-over-title">Game Over</h1>
      <div class="game-over__score-box">
        <h2 class="game-over__score-title">Final score</h2>
        <div class="game-over__scores">
          ${gameOverScoreTemplate("blue", data.blueIconSrc, data.blueScore)}
          ${gameOverScoreTemplate("orange", data.orangeIconSrc, data.orangeScore)}
        </div>
        ${gameOverActionsTemplate()}
      </div>
    </section>`;
}

