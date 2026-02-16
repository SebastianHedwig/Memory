export function gameLayoutTemplate(): string {
  return /*html*/ `
    <main class="game__layout">
      <header class="game__header">
        <div class="game__player-info">
          <div class="game__player-count"></div>
          <div class="game__player-current"></div>
          <button class="game__exit-button button" type="button"></button>
        </div>
      </header>
      <section class="game__board" data-game-board></section>
    </main>`;
}

type WinnerTemplateData = {
  confettiSrc: string;
  playerName: string;
  playerImageSrc: string;
  playerImageAlt: string;
};

export function winnerTemplate(data: WinnerTemplateData): string {
  return /*html*/ `
    <section class="winner">
      <img class="winner__confetti-image" src="${data.confettiSrc}" alt="Bild mit viel Konfetti">
      <span class="winner__title">The Winner is:</span>
      <h2 class="winner__player">${data.playerName}</h2>
      <img class="winner__player-img" src="${data.playerImageSrc}" alt="${data.playerImageAlt}">
      <button class="winner__score-button button" type="button" data-action="go-to-score">Score</button>
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
        <span class="game-over__score-title">Final Score:</span>
        <div class="game-over__scores">
          <div class="game-over__score game-over__score--blue">
            <img class="game-over__score-icon" src="${data.blueIconSrc}" alt="" aria-hidden="true">
            <span class="game-over__score-value">${data.blueScore}</span>
          </div>
          <div class="game-over__score game-over__score--orange">
            <img class="game-over__score-icon" src="${data.orangeIconSrc}" alt="" aria-hidden="true">
            <span class="game-over__score-value">${data.orangeScore}</span>
          </div>
        </div>
        <div class="game-over__actions">
          <button class="game-over__restart-button button" type="button" data-action="play-again">Play again</button>
          <button class="game-over__exit-button button" type="button" data-action="exit-game">Exit game</button>
        </div>
      </div>
    </section>`;
}
