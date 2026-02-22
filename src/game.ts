import "@scss/main.scss";
import { bindExitOverlayActions } from "./components/exit-overlay";
import { gameLayoutTemplate, gameOverTemplate, winnerTemplate } from "./game.templates";
import { navigateTo } from "./shared/_navigation";

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

function getAppElement(): HTMLElement | null {
  return document.querySelector<HTMLElement>("#app");
}

function renderApp(markup: string): void {
  const appElement = getAppElement();
  if (!appElement) {
    return;
  }

  appElement.innerHTML = markup;
}

function bindExitActions(): void {
  const appElement = getAppElement();
  if (!appElement) {
    return;
  }

  bindExitOverlayActions(appElement, () => navigateTo("home"));
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
  bindExitActions();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initGamePage);
} else {
  initGamePage();
}
