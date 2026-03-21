import "@scss/main.scss";
import { bindExitOverlayActions } from "./components/exit-overlay";
import { gameLayoutTemplate, gameOverTemplate, winnerTemplate } from "./game.templates";
import { readGameSettings, type GameSettings } from "./shared/_game-settings";
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

interface GameLayoutAssets {
  blueIconSrc: string;
  orangeIconSrc: string;
  currentPlayerIconSrc: string;
  exitButtonIconSrc: string;
}

const themeFolderByValue: Record<GameSettings["theme"], string> = {
  "code-vibes": "code-vibes",
  gaming: "gaming-theme",
  foods: "food-theme",
};

function getThemeAssetsFolder(theme: GameSettings["theme"]): string {
  return themeFolderByValue[theme];
}

function createThemeAssetPath(themeFolder: string, fileName: string): string {
  return `./src/assets/img/themes/${themeFolder}/${fileName}`;
}

function getCurrentPlayerIcon(settings: GameSettings, blueIconSrc: string, orangeIconSrc: string): string {
  return settings.player === "orange" ? orangeIconSrc : blueIconSrc;
}

function getGameLayoutAssets(): GameLayoutAssets {
  const settings = readGameSettings();
  const themeFolder = getThemeAssetsFolder(settings.theme);
  const blueIconSrc = createThemeAssetPath(themeFolder, "player-icon-blue.png");
  const orangeIconSrc = createThemeAssetPath(themeFolder, "player-icon-orange.png");
  const exitButtonIconSrc = createThemeAssetPath(themeFolder, "exit-btn-icon.png");

  return {
    blueIconSrc,
    orangeIconSrc,
    currentPlayerIconSrc: getCurrentPlayerIcon(settings, blueIconSrc, orangeIconSrc),
    exitButtonIconSrc,
  };
}

function applyGameTheme(theme: GameSettings["theme"]): void {
  document.body.dataset.theme = theme;
}

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
      renderApp(gameLayoutTemplate(getGameLayoutAssets()));
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
  applyGameTheme(readGameSettings().theme);
  renderScreen({ screen: "game" });
  bindExitActions();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initGamePage);
} else {
  initGamePage();
}
