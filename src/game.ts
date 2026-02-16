import "@scss/main.scss";
import { gameLayoutTemplate, gameOverTemplate, winnerTemplate } from "./game.templates";

type WinnerRenderData = {
  confettiSrc: string;
  playerName: string;
  playerImageSrc: string;
  playerImageAlt: string;
};

type GameOverRenderData = {
  blueIconSrc: string;
  blueScore: number;
  orangeIconSrc: string;
  orangeScore: number;
};

type ScreenRenderState =
  | { screen: "game" }
  | { screen: "winner"; data: WinnerRenderData }
  | { screen: "gameOver"; data: GameOverRenderData };

function renderApp(markup: string): void {
  const appElement = document.querySelector<HTMLElement>("#app");
  if (!appElement) {
    return;
  }

  appElement.innerHTML = markup;
}

function renderScreen(state: ScreenRenderState): void {
  switch (state.screen) {
    case "game":
      renderApp(gameLayoutTemplate());
      return;
    case "winner":
      renderApp(winnerTemplate(state.data));
      return;
    case "gameOver":
      renderApp(gameOverTemplate(state.data));
      return;
    default:
      return;
  }
}

function initGamePage(): void {
  renderScreen({ screen: "game" });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initGamePage);
} else {
  initGamePage();
}
