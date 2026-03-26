import { getExitOverlayCopy } from "../components/exit-overlay";
import { memoryCardTemplate, type MemoryCardData } from "../components/memory-card";
import type { GameSettings } from "../shared/_game-settings";
import type { GameLayoutAssets, PlayerColor } from "./types";

const THEME_IMAGE_URL_BY_SOURCE = import.meta.glob("../assets/img/themes/**/*", { eager: true, import: "default" }) as Record<
  string,
  string
>;
const CURRENT_PLAYER_ICON_URL_BY_SOURCE = import.meta.glob("../assets/icons/current-player.png", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const THEME_FOLDER_BY_VALUE: Record<GameSettings["theme"], string> = {
  "code-vibes": "code-vibes",
  "gaming": "gaming-theme",
  "foods": "food-theme",
};

const BOARD_COLUMNS_BY_CARD_COUNT: Record<number, number> = {
  16: 4,
  24: 6,
  36: 6,
};

const THEME_CARD_COUNT_BY_VALUE: Record<GameSettings["theme"], number> = {
  "code-vibes": 18,
  "gaming": 18,
  "foods": 18,
};

/**
 * Returns Theme Assets Folder from the current DOM/state context.
 * @param theme Active game theme key.
 * @returns Generated string value for rendering or downstream processing.
 */
export function getThemeAssetsFolder(theme: GameSettings["theme"]): string {
  return THEME_FOLDER_BY_VALUE[theme];
}

/**
 * Creates Theme Asset Path from the provided inputs.
 * @param themeFolder Theme folder name inside the assets path.
 * @param fileName File name inside the theme asset folder.
 * @returns Generated string value for rendering or downstream processing.
 */
export function createThemeAssetPath(themeFolder: string, fileName: string): string {
  const sourcePath = `../assets/img/themes/${themeFolder}/${fileName}`;
  return THEME_IMAGE_URL_BY_SOURCE[sourcePath] ?? "";
}

/**
 * Returns Current Player Icon from the current DOM/state context.
 * @param player Player color targeted by this operation.
 * @param blueIconSrc Image path for the blue player icon.
 * @param orangeIconSrc Image path for the orange player icon.
 * @returns Generated string value for rendering or downstream processing.
 */
function getCurrentPlayerIcon(player: PlayerColor, blueIconSrc: string, orangeIconSrc: string): string {
  return player === "orange" ? orangeIconSrc : blueIconSrc;
}

/**
 * Returns Static Current Player Icon from the current DOM/state context.
 * @returns Generated string value for rendering or downstream processing.
 */
export function getStaticCurrentPlayerIcon(): string {
  return CURRENT_PLAYER_ICON_URL_BY_SOURCE["../assets/icons/current-player.png"] ?? "";
}

/**
 * Returns Initial Current Player Icon from the current DOM/state context.
 * @param settings Validated game settings selected on the settings page.
 * @param blueIconSrc Image path for the blue player icon.
 * @param orangeIconSrc Image path for the orange player icon.
 * @returns Generated string value for rendering or downstream processing.
 */
function getInitialCurrentPlayerIcon(settings: GameSettings, blueIconSrc: string, orangeIconSrc: string): string {
  if (settings.theme === "code-vibes") {
    return getCurrentPlayerIcon(settings.player, blueIconSrc, orangeIconSrc);
  }

  return getStaticCurrentPlayerIcon();
}

/**
 * Returns Exit Button Label from the current DOM/state context.
 * @param theme Active game theme key.
 * @returns Generated string value for rendering or downstream processing.
 */
function getExitButtonLabel(theme: GameSettings["theme"]): string {
  return theme === "foods" ? "EXIT game" : "Exit game";
}

/**
 * Returns Game Layout Assets from the current DOM/state context.
 * @param settings Validated game settings selected on the settings page.
 * @returns Value of type `GameLayoutAssets`.
 */
export function getGameLayoutAssets(settings: GameSettings): GameLayoutAssets {
  const themeFolder = getThemeAssetsFolder(settings.theme);
  const blueIconSrc = createThemeAssetPath(themeFolder, "player-icon-blue.png");
  const orangeIconSrc = createThemeAssetPath(themeFolder, "player-icon-orange.png");
  const exitButtonIconSrc = createThemeAssetPath(themeFolder, "exit-btn-icon.png");
  return {
    blueIconSrc,
    orangeIconSrc,
    currentPlayerIconSrc: getInitialCurrentPlayerIcon(settings, blueIconSrc, orangeIconSrc),
    exitButtonIconSrc,
    exitButtonLabel: getExitButtonLabel(settings.theme),
    exitOverlayCopy: getExitOverlayCopy(settings.theme),
  };
}

/**
 * Returns Player Icon Sources from the current DOM/state context.
 * @param settings Validated game settings selected on the settings page.
 * @returns Record mapping with computed values.
 */
export function getPlayerIconSources(settings: GameSettings): Record<PlayerColor, string> {
  const themeFolder = getThemeAssetsFolder(settings.theme);
  return {
    blue: createThemeAssetPath(themeFolder, "player-icon-blue.png"),
    orange: createThemeAssetPath(themeFolder, "player-icon-orange.png"),
  };
}

/**
 * Applies the active theme via `data-theme` on the body element.
 * @param theme Active game theme key.
 * @returns No return value; this function works via side effects.
 */
export function applyGameTheme(theme: GameSettings["theme"]): void {
  document.body.dataset.theme = theme;
}

/**
 * Returns Board Element from the current DOM/state context.
 * @returns Resolved `HTMLElement`, or `null` when no matching element can be resolved.
 */
function getBoardElement(): HTMLElement | null {
  return document.querySelector<HTMLElement>("[data-game-board]") ?? document.querySelector<HTMLElement>(".game__board");
}

/**
 * Returns Board Column Count from the current DOM/state context.
 * @param cardCount Total number of cards used for layout or stack calculations.
 * @returns Computed numeric value.
 */
function getBoardColumnCount(cardCount: number): number {
  return BOARD_COLUMNS_BY_CARD_COUNT[cardCount] ?? 4;
}

/**
 * Returns Theme Card Count from the current DOM/state context.
 * @param theme Active game theme key.
 * @returns Computed numeric value.
 */
function getThemeCardCount(theme: GameSettings["theme"]): number {
  return THEME_CARD_COUNT_BY_VALUE[theme];
}

/**
 * Creates Card File Name from the provided inputs.
 * @param index Eingabewert, der in diesem Verarbeitungsschritt verwendet wird.
 * @returns Generated string value for rendering or downstream processing.
 */
function createCardFileName(index: number): string {
  return `card-${String(index).padStart(3, "0")}.png`;
}

/**
 * Creates Theme Card Face Sources from the provided inputs.
 * @param settings Validated game settings selected on the settings page.
 * @returns Array containing generated results.
 */
function createThemeCardFaceSources(settings: GameSettings): string[] {
  const themeFolder = getThemeAssetsFolder(settings.theme);
  const cardCount = getThemeCardCount(settings.theme);
  return Array.from({ length: cardCount }, (_, index) => {
    return createThemeAssetPath(themeFolder, `cards/${createCardFileName(index + 1)}`);
  });
}

/**
 * Creates Theme Card Cover Source from the provided inputs.
 * @param settings Validated game settings selected on the settings page.
 * @returns Generated string value for rendering or downstream processing.
 */
function createThemeCardCoverSource(settings: GameSettings): string {
  const themeFolder = getThemeAssetsFolder(settings.theme);
  return createThemeAssetPath(themeFolder, "cards/card-cover.png");
}

function shuffleList<T>(items: T[]): T[] {
  const nextItems = [...items];
  for (let index = nextItems.length - 1; index > 0; index--) {
    const targetIndex = Math.floor(Math.random() * (index + 1));
    const currentItem = nextItems[index];
    nextItems[index] = nextItems[targetIndex];
    nextItems[targetIndex] = currentItem;
  }

  return nextItems;
}

/**
 * Returns Random Card Faces from the current DOM/state context.
 * @param sources Collection of available image sources.
 * @param pairCount Number of pairs required for the board.
 * @returns Array containing generated results.
 */
function getRandomCardFaces(sources: string[], pairCount: number): string[] {
  return shuffleList(sources).slice(0, pairCount);
}

/**
 * Creates Card Pair from the provided inputs.
 * @param faceSrc Image path for the card front face.
 * @param coverSrc Image path for the shared card back.
 * @param pairIndex Zero-based pair index.
 * @returns Array containing generated results.
 */
function createCardPair(faceSrc: string, coverSrc: string, pairIndex: number): MemoryCardData[] {
  const pairId = `pair-${pairIndex + 1}`;
  return [
    { id: `${pairId}-a`, pairId, coverSrc, faceSrc },
    { id: `${pairId}-b`, pairId, coverSrc, faceSrc },
  ];
}

/**
 * Creates Memory Deck from the provided inputs.
 * @param settings Validated game settings selected on the settings page.
 * @returns Array containing generated results.
 */
function createMemoryDeck(settings: GameSettings): MemoryCardData[] {
  const coverSrc = createThemeCardCoverSource(settings);
  const faceSources = createThemeCardFaceSources(settings);
  const requestedPairCount = Math.floor(settings.boardSize / 2);
  const pairCount = Math.min(requestedPairCount, faceSources.length);
  const selectedFaces = getRandomCardFaces(faceSources, pairCount);
  const cardPairs = selectedFaces.flatMap((faceSrc, pairIndex) => {
    return createCardPair(faceSrc, coverSrc, pairIndex);
  });

  return shuffleList(cardPairs);
}

/**
 * Clears Player Stacks and related transient state.
 * @returns No return value; this function works via side effects.
 */
function clearPlayerStacks(): void {
  const stackElements = document.querySelectorAll<HTMLElement>("[data-player-stack]");
  stackElements.forEach((stackElement) => {
    stackElement.innerHTML = "";
  });
}

/**
 * Renders board markup, applies board vars, and returns the deck.
 * @param settings Validated game settings selected on the settings page.
 * @returns Array containing generated results.
 */
export function renderMemoryBoard(settings: GameSettings): MemoryCardData[] {
  const boardElement = getBoardElement();
  const deck = createMemoryDeck(settings);
  if (!boardElement) {
    return deck;
  }

  boardElement.style.setProperty("--game-board-columns", String(getBoardColumnCount(settings.boardSize)));
  boardElement.innerHTML = deck.map((card) => memoryCardTemplate(card)).join("");
  clearPlayerStacks();
  return deck;
}

