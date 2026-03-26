import type { GameSettings } from "../shared/_game-settings";
import { WINNER_ASSET_THEME } from "./constants";
import { createThemeAssetPath, getThemeAssetsFolder } from "./assets";
import type {
  DrawRenderData,
  GameOverRenderData,
  MemoryGameState,
  PlayerColor,
  WinnerRenderData,
} from "./types";

/**
 * Returns Winner Player from the current DOM/state context.
 * @param state Mutable in-memory game state for the current match.
 * @returns Value of type `PlayerColor`.
 */
function getWinnerPlayer(state: MemoryGameState): PlayerColor {
  if (state.scores.blue > state.scores.orange) {
    return "blue";
  }

  if (state.scores.orange > state.scores.blue) {
    return "orange";
  }

  return state.currentPlayer;
}

/**
 * Returns Winner Player Name from the current DOM/state context.
 * @param player Player color targeted by this operation.
 * @returns Generated string value for rendering or downstream processing.
 */
function getWinnerPlayerName(player: PlayerColor): string {
  return player === "blue" ? "BLUE PLAYER" : "ORANGE PLAYER";
}

/**
 * Returns Gaming Winner Player Name from the current DOM/state context.
 * @param player Player color targeted by this operation.
 * @returns Generated string value for rendering or downstream processing.
 */
function getGamingWinnerPlayerName(player: PlayerColor): string {
  return player === "blue" ? "Blue Player" : "Orange Player";
}

/**
 * Returns Winner Player Image Alt from the current DOM/state context.
 * @param player Player color targeted by this operation.
 * @returns Generated string value for rendering or downstream processing.
 */
function getWinnerPlayerImageAlt(player: PlayerColor): string {
  return player === "blue" ? "Blue player winner icon" : "Orange player winner icon";
}

/**
 * Returns Winner Confetti Source from the current DOM/state context.
 * @param theme Active game theme key.
 * @returns Generated string value for rendering or downstream processing.
 */
function getWinnerConfettiSource(theme: GameSettings["theme"]): string {
  if (theme === "gaming" || theme === "foods") {
    return "";
  }

  return createThemeAssetPath(getThemeAssetsFolder(WINNER_ASSET_THEME), "confetti.png");
}

/**
 * Creates Gaming Winner Render Data from the provided inputs.
 * @param state Mutable in-memory game state for the current match.
 * @param winnerPlayer Winning player color used for labels and assets.
 * @returns Value of type `WinnerRenderData`.
 */
function createGamingWinnerRenderData(state: MemoryGameState, winnerPlayer: PlayerColor): WinnerRenderData {
  const themeFolder = getThemeAssetsFolder(state.settings.theme);
  return {
    confettiSrc: "",
    playerName: getGamingWinnerPlayerName(winnerPlayer),
    playerColor: winnerPlayer,
    playerImageSrc: createThemeAssetPath(themeFolder, "winner-pot.png"),
    playerImageAlt: "Winner trophy",
    pedestalLabel: winnerPlayer === "blue" ? "BLUE" : "ORANGE",
  };
}

/**
 * Returns Winner Image Name from the current DOM/state context.
 * @param winnerPlayer Winning player color used for labels and assets.
 * @returns Generated string value for rendering or downstream processing.
 */
function getWinnerImageName(winnerPlayer: PlayerColor): string {
  return winnerPlayer === "blue" ? "player-icon-blue-large.png" : "player-icon-orange-large.png";
}

/**
 * Creates Default Winner Render Data from the provided inputs.
 * @param state Mutable in-memory game state for the current match.
 * @param winnerPlayer Winning player color used for labels and assets.
 * @returns Value of type `WinnerRenderData`.
 */
function createDefaultWinnerRenderData(state: MemoryGameState, winnerPlayer: PlayerColor): WinnerRenderData {
  const winnerThemeFolder = getThemeAssetsFolder(WINNER_ASSET_THEME);
  return {
    confettiSrc: getWinnerConfettiSource(state.settings.theme),
    playerName: getWinnerPlayerName(winnerPlayer),
    playerColor: winnerPlayer,
    playerImageSrc: createThemeAssetPath(winnerThemeFolder, getWinnerImageName(winnerPlayer)),
    playerImageAlt: getWinnerPlayerImageAlt(winnerPlayer),
  };
}

/**
 * Builds winner-screen render data including theme-specific assets.
 * @param state Mutable in-memory game state for the current match.
 * @returns Value of type `WinnerRenderData`.
 */
export function createWinnerRenderData(state: MemoryGameState): WinnerRenderData {
  const winnerPlayer = getWinnerPlayer(state);
  if (state.settings.theme === "gaming") {
    return createGamingWinnerRenderData(state, winnerPlayer);
  }

  return createDefaultWinnerRenderData(state, winnerPlayer);
}

/**
 * Builds draw-screen render data.
 * @param settings Validated game settings selected on the settings page.
 * @returns Value of type `DrawRenderData`.
 */
export function createDrawRenderData(settings: GameSettings): DrawRenderData {
  return {
    confettiSrc: getWinnerConfettiSource(settings.theme),
  };
}

/**
 * Builds game-over render data from final scores.
 * @param state Mutable in-memory game state for the current match.
 * @returns Value of type `GameOverRenderData`.
 */
export function createGameOverRenderData(state: MemoryGameState): GameOverRenderData {
  return {
    blueIconSrc: state.playerIconSources.blue,
    blueScore: state.scores.blue,
    orangeIconSrc: state.playerIconSources.orange,
    orangeScore: state.scores.orange,
  };
}

/**
 * Checks whether Game Finished is satisfied.
 * @param state Mutable in-memory game state for the current match.
 * @returns `true` when the condition is met; otherwise `false`.
 */
export function isGameFinished(state: MemoryGameState): boolean {
  return state.matchedPairIds.size >= state.totalPairs;
}

/**
 * Checks whether Draw exists or is reached.
 * @param state Mutable in-memory game state for the current match.
 * @returns `true` when the condition is met; otherwise `false`.
 */
export function hasDraw(state: MemoryGameState): boolean {
  return state.scores.blue === state.scores.orange;
}

