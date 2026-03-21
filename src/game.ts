import "@scss/main.scss";
import { bindExitOverlayActions, getExitOverlayCopy, type ExitOverlayCopy } from "./components/exit-overlay";
import { memoryCardTemplate, type MemoryCardData } from "./components/memory-card";
import { gameLayoutTemplate, gameOverTemplate, winnerTemplate } from "./game.templates";
import { readGameSettings, type GameSettings } from "./shared/_game-settings";
import { navigateTo } from "./shared/_navigation";

type PlayerColor = "blue" | "orange";

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
  | { screen: "game"; data: GameLayoutAssets }
  | { screen: "winner"; data: WinnerRenderData }
  | { screen: "gameOver"; data: GameOverRenderData };

interface GameLayoutAssets {
  blueIconSrc: string;
  orangeIconSrc: string;
  currentPlayerIconSrc: string;
  exitButtonIconSrc: string;
  exitOverlayCopy: ExitOverlayCopy;
}

interface MemoryGameState {
  settings: GameSettings;
  currentPlayer: PlayerColor;
  scores: Record<PlayerColor, number>;
  revealedCardIds: string[];
  matchedPairIds: Set<string>;
  cardsById: Map<string, MemoryCardData>;
  totalPairs: number;
  isBoardLocked: boolean;
  playerIconSources: Record<PlayerColor, string>;
  currentPlayerIconSrc: string;
}

const themeFolderByValue: Record<GameSettings["theme"], string> = {
  "code-vibes": "code-vibes",
  "gaming": "gaming-theme",
  "foods": "food-theme",
};

const boardColumnsByCardCount: Record<number, number> = {
  16: 4,
  24: 6,
  36: 6,
};

const themeCardCountByValue: Record<GameSettings["theme"], number> = {
  "code-vibes": 18,
  "gaming": 18,
  "foods": 18,
};

const MATCH_BORDER_DRAW_MS = 950;
const MATCH_BORDER_HOLD_MS = 260;
const MATCH_COLLECT_DELAY_MS = MATCH_BORDER_DRAW_MS + MATCH_BORDER_HOLD_MS;
const MISMATCH_FLIP_DELAY_MS = 700;
const CARD_FLY_DURATION_MS = 760;
const STACK_PILE_CARD_LIMIT = 16;

let memoryGameState: MemoryGameState | null = null;

function getThemeAssetsFolder(theme: GameSettings["theme"]): string {
  return themeFolderByValue[theme];
}

function createThemeAssetPath(themeFolder: string, fileName: string): string {
  return `./src/assets/img/themes/${themeFolder}/${fileName}`;
}

function getCurrentPlayerIcon(player: PlayerColor, blueIconSrc: string, orangeIconSrc: string): string {
  return player === "orange" ? orangeIconSrc : blueIconSrc;
}

function getStaticCurrentPlayerIcon(settings: GameSettings): string {
  return "./src/assets/icons/current-player.png";
}

function getInitialCurrentPlayerIcon(settings: GameSettings, blueIconSrc: string, orangeIconSrc: string): string {
  if (settings.theme === "code-vibes") {
    return getCurrentPlayerIcon(settings.player, blueIconSrc, orangeIconSrc);
  }

  return getStaticCurrentPlayerIcon(settings);
}

function getGameLayoutAssets(settings: GameSettings): GameLayoutAssets {
  const themeFolder = getThemeAssetsFolder(settings.theme);
  const blueIconSrc = createThemeAssetPath(themeFolder, "player-icon-blue.png");
  const orangeIconSrc = createThemeAssetPath(themeFolder, "player-icon-orange.png");
  const exitButtonIconSrc = createThemeAssetPath(themeFolder, "exit-btn-icon.png");

  return {
    blueIconSrc,
    orangeIconSrc,
    currentPlayerIconSrc: getInitialCurrentPlayerIcon(settings, blueIconSrc, orangeIconSrc),
    exitButtonIconSrc,
    exitOverlayCopy: getExitOverlayCopy(settings.theme),
  };
}

function getPlayerIconSources(settings: GameSettings): Record<PlayerColor, string> {
  const themeFolder = getThemeAssetsFolder(settings.theme);
  return {
    blue: createThemeAssetPath(themeFolder, "player-icon-blue.png"),
    orange: createThemeAssetPath(themeFolder, "player-icon-orange.png"),
  };
}

function applyGameTheme(theme: GameSettings["theme"]): void {
  document.body.dataset.theme = theme;
}

function getBoardElement(): HTMLElement | null {
  return document.querySelector<HTMLElement>("[data-game-board]") ?? document.querySelector<HTMLElement>(".game__board");
}

function getBoardColumnCount(cardCount: number): number {
  return boardColumnsByCardCount[cardCount] ?? 4;
}

function getThemeCardCount(theme: GameSettings["theme"]): number {
  return themeCardCountByValue[theme];
}

function createCardFileName(index: number): string {
  return `card-${String(index).padStart(3, "0")}.png`;
}

function createThemeCardFaceSources(settings: GameSettings): string[] {
  const themeFolder = getThemeAssetsFolder(settings.theme);
  const cardCount = getThemeCardCount(settings.theme);
  return Array.from({ length: cardCount }, (_, index) => {
    return createThemeAssetPath(themeFolder, `cards/${createCardFileName(index + 1)}`);
  });
}

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

function getRandomCardFaces(sources: string[], pairCount: number): string[] {
  return shuffleList(sources).slice(0, pairCount);
}

function createCardPair(faceSrc: string, coverSrc: string, pairIndex: number): MemoryCardData[] {
  const pairId = `pair-${pairIndex + 1}`;
  return [
    { id: `${pairId}-a`, pairId, coverSrc, faceSrc },
    { id: `${pairId}-b`, pairId, coverSrc, faceSrc },
  ];
}

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

function clearPlayerStacks(): void {
  const stackElements = document.querySelectorAll<HTMLElement>("[data-player-stack]");
  stackElements.forEach((stackElement) => {
    stackElement.innerHTML = "";
  });
}

function renderMemoryBoard(settings: GameSettings): MemoryCardData[] {
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
      renderApp(gameLayoutTemplate(state.data));
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

function createScores(): Record<PlayerColor, number> {
  return { blue: 0, orange: 0 };
}

function createCardsById(deck: MemoryCardData[]): Map<string, MemoryCardData> {
  return new Map(deck.map((card) => [card.id, card]));
}

function createMemoryGameState(settings: GameSettings, deck: MemoryCardData[]): MemoryGameState {
  return {
    settings,
    currentPlayer: settings.player,
    scores: createScores(),
    revealedCardIds: [],
    matchedPairIds: new Set<string>(),
    cardsById: createCardsById(deck),
    totalPairs: Math.floor(deck.length / 2),
    isBoardLocked: false,
    playerIconSources: getPlayerIconSources(settings),
    currentPlayerIconSrc: getStaticCurrentPlayerIcon(settings),
  };
}

function playerLabel(player: PlayerColor): string {
  return player === "blue" ? "Blue" : "Orange";
}

function getScoreLabel(state: MemoryGameState, player: PlayerColor): string {
  const score = state.scores[player];
  if (state.settings.theme === "gaming") {
    return String(score);
  }

  return `${playerLabel(player)} ${score}`;
}

function getScoreElement(player: PlayerColor): HTMLElement | null {
  return document.querySelector<HTMLElement>(`[data-player-score="${player}"]`);
}

function renderScores(state: MemoryGameState): void {
  const blueScoreElement = getScoreElement("blue");
  if (blueScoreElement) {
    blueScoreElement.textContent = getScoreLabel(state, "blue");
  }

  const orangeScoreElement = getScoreElement("orange");
  if (orangeScoreElement) {
    orangeScoreElement.textContent = getScoreLabel(state, "orange");
  }
}

function getCurrentPlayerIconElement(): HTMLImageElement | null {
  return document.querySelector<HTMLImageElement>("[data-current-player-icon]");
}

function getCurrentPlayerBadgeElement(): HTMLElement | null {
  return document.querySelector<HTMLElement>("[data-current-player-badge]");
}

function renderCurrentPlayer(state: MemoryGameState): void {
  const currentPlayerIconElement = getCurrentPlayerIconElement();
  if (currentPlayerIconElement) {
    currentPlayerIconElement.src =
      state.settings.theme === "code-vibes"
        ? state.playerIconSources[state.currentPlayer]
        : state.currentPlayerIconSrc;
  }

  const currentPlayerBadgeElement = getCurrentPlayerBadgeElement();
  if (currentPlayerBadgeElement) {
    currentPlayerBadgeElement.dataset.player = state.currentPlayer;
  }
}

function getCardElementById(cardId: string): HTMLButtonElement | null {
  return document.querySelector<HTMLButtonElement>(`[data-memory-card-id="${cardId}"]`);
}

function getCardElementFromEvent(event: MouseEvent): HTMLButtonElement | null {
  if (!(event.target instanceof HTMLElement)) {
    return null;
  }

  return event.target.closest<HTMLButtonElement>("[data-memory-card-id]");
}

function getCardId(cardElement: HTMLButtonElement): string | null {
  return cardElement.dataset.memoryCardId ?? null;
}

function getCardPairId(cardElement: HTMLButtonElement): string | null {
  return cardElement.dataset.memoryCardPair ?? null;
}

function setCardFlipped(cardElement: HTMLButtonElement, isFlipped: boolean): void {
  cardElement.classList.toggle("is-flipped", isFlipped);
}

function setCardMatched(cardElement: HTMLButtonElement): void {
  cardElement.classList.add("is-matched");
}

function setCardCollected(cardElement: HTMLButtonElement): void {
  cardElement.classList.add("is-collected");
  cardElement.disabled = true;
}

function getPlayerStackElement(player: PlayerColor): HTMLElement | null {
  return document.querySelector<HTMLElement>(`[data-player-stack="${player}"]`);
}

function createCollectedCard(faceSrc: string, player: PlayerColor): HTMLImageElement {
  const collectedCardElement = document.createElement("img");
  collectedCardElement.className = `game__collected-card game__collected-card--${player}`;
  collectedCardElement.src = faceSrc;
  collectedCardElement.alt = "";
  collectedCardElement.setAttribute("aria-hidden", "true");
  return collectedCardElement;
}

function getStackPileIndex(cardCount: number): number {
  return Math.floor(cardCount / STACK_PILE_CARD_LIMIT);
}

function getStackPileElement(stackElement: HTMLElement, pileIndex: number): HTMLElement {
  const selector = `[data-player-pile="${pileIndex}"]`;
  const existingPileElement = stackElement.querySelector<HTMLElement>(selector);
  if (existingPileElement) {
    return existingPileElement;
  }

  const nextPileElement = document.createElement("div");
  nextPileElement.className = "game__player-pile";
  nextPileElement.dataset.playerPile = String(pileIndex);
  stackElement.append(nextPileElement);
  return nextPileElement;
}

function appendCollectedCardToStack(stackElement: HTMLElement, collectedCardElement: HTMLImageElement): void {
  const collectedCardCount = stackElement.querySelectorAll(".game__collected-card").length;
  const pileIndex = getStackPileIndex(collectedCardCount);
  const pileElement = getStackPileElement(stackElement, pileIndex);
  pileElement.append(collectedCardElement);
}

function createFlyingGhost(cardElement: HTMLButtonElement): HTMLElement {
  const cardRect = cardElement.getBoundingClientRect();
  const ghostElement = cardElement.cloneNode(true) as HTMLElement;
  ghostElement.classList.add("memory-card-ghost");
  ghostElement.classList.remove("is-collected");
  ghostElement.style.left = `${cardRect.left}px`;
  ghostElement.style.top = `${cardRect.top}px`;
  ghostElement.style.width = `${cardRect.width}px`;
  ghostElement.style.height = `${cardRect.height}px`;
  return ghostElement;
}

function animateCardGhostToTarget(ghostElement: HTMLElement, targetElement: HTMLElement): Promise<void> {
  const sourceRect = ghostElement.getBoundingClientRect();
  const targetRect = targetElement.getBoundingClientRect();
  const deltaX = targetRect.left - sourceRect.left;
  const deltaY = targetRect.top - sourceRect.top;

  return new Promise((resolve) => {
    let isFinished = false;
    const finish = () => {
      if (isFinished) {
        return;
      }

      isFinished = true;
      resolve();
    };

    ghostElement.addEventListener("transitionend", finish, { once: true });
    window.setTimeout(finish, CARD_FLY_DURATION_MS + 120);

    requestAnimationFrame(() => {
      ghostElement.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.55)`;
      ghostElement.style.opacity = "0.75";
    });
  });
}

function collectMatchedCard(cardElement: HTMLButtonElement, cardData: MemoryCardData, player: PlayerColor): Promise<void> {
  const stackElement = getPlayerStackElement(player);
  if (!stackElement) {
    setCardCollected(cardElement);
    return Promise.resolve();
  }

  const collectedCardElement = createCollectedCard(cardData.faceSrc, player);
  collectedCardElement.style.visibility = "hidden";
  appendCollectedCardToStack(stackElement, collectedCardElement);

  const ghostElement = createFlyingGhost(cardElement);
  document.body.append(ghostElement);

  return animateCardGhostToTarget(ghostElement, collectedCardElement).then(() => {
    setCardCollected(cardElement);
    collectedCardElement.style.visibility = "visible";
    ghostElement.remove();
  });
}

function switchPlayer(state: MemoryGameState): void {
  state.currentPlayer = state.currentPlayer === "blue" ? "orange" : "blue";
}

function resetRevealedCards(state: MemoryGameState): void {
  state.revealedCardIds = [];
}

function cardPairMatches(state: MemoryGameState): boolean {
  const [firstCardId, secondCardId] = state.revealedCardIds;
  const firstCard = state.cardsById.get(firstCardId);
  const secondCard = state.cardsById.get(secondCardId);
  return Boolean(firstCard && secondCard && firstCard.pairId === secondCard.pairId);
}

function handleMismatchedCards(state: MemoryGameState): void {
  const [firstCardId, secondCardId] = state.revealedCardIds;
  window.setTimeout(() => {
    const firstCardElement = getCardElementById(firstCardId);
    const secondCardElement = getCardElementById(secondCardId);
    if (firstCardElement) {
      setCardFlipped(firstCardElement, false);
    }

    if (secondCardElement) {
      setCardFlipped(secondCardElement, false);
    }

    resetRevealedCards(state);
    switchPlayer(state);
    renderCurrentPlayer(state);
    state.isBoardLocked = false;
  }, MISMATCH_FLIP_DELAY_MS);
}

function getRevealedCardElements(state: MemoryGameState): [HTMLButtonElement | null, HTMLButtonElement | null] {
  const [firstCardId, secondCardId] = state.revealedCardIds;
  return [getCardElementById(firstCardId), getCardElementById(secondCardId)];
}

function getRevealedCardData(state: MemoryGameState): [MemoryCardData | undefined, MemoryCardData | undefined] {
  const [firstCardId, secondCardId] = state.revealedCardIds;
  return [state.cardsById.get(firstCardId), state.cardsById.get(secondCardId)];
}

function handleMatchedCards(state: MemoryGameState): void {
  const [firstCardData, secondCardData] = getRevealedCardData(state);
  if (!firstCardData || !secondCardData) {
    resetRevealedCards(state);
    state.isBoardLocked = false;
    return;
  }

  const [firstCardElement, secondCardElement] = getRevealedCardElements(state);
  if (!firstCardElement || !secondCardElement) {
    resetRevealedCards(state);
    state.isBoardLocked = false;
    return;
  }

  setCardMatched(firstCardElement);
  setCardMatched(secondCardElement);
  state.matchedPairIds.add(firstCardData.pairId);
  state.scores[state.currentPlayer] += 1;
  renderScores(state);

  window.setTimeout(() => {
    Promise.all([
      collectMatchedCard(firstCardElement, firstCardData, state.currentPlayer),
      collectMatchedCard(secondCardElement, secondCardData, state.currentPlayer),
    ]).then(() => {
      resetRevealedCards(state);
      state.isBoardLocked = false;
    });
  }, MATCH_COLLECT_DELAY_MS);
}

function isCardAlreadySelected(state: MemoryGameState, cardId: string): boolean {
  return state.revealedCardIds.includes(cardId);
}

function isCardAlreadyMatched(state: MemoryGameState, pairId: string): boolean {
  return state.matchedPairIds.has(pairId);
}

function canSelectCard(
  state: MemoryGameState,
  cardElement: HTMLButtonElement,
  cardId: string,
  pairId: string
): boolean {
  if (state.isBoardLocked) {
    return false;
  }

  if (isCardAlreadySelected(state, cardId)) {
    return false;
  }

  if (isCardAlreadyMatched(state, pairId)) {
    return false;
  }

  return !cardElement.classList.contains("is-collected");
}

function onCardSelected(state: MemoryGameState, cardElement: HTMLButtonElement, cardId: string): void {
  setCardFlipped(cardElement, true);
  state.revealedCardIds.push(cardId);
  if (state.revealedCardIds.length < 2) {
    return;
  }

  state.isBoardLocked = true;
  if (cardPairMatches(state)) {
    handleMatchedCards(state);
    return;
  }

  handleMismatchedCards(state);
}

function onBoardClick(event: MouseEvent): void {
  const state = memoryGameState;
  if (!state) {
    return;
  }

  const cardElement = getCardElementFromEvent(event);
  if (!cardElement) {
    return;
  }

  const cardId = getCardId(cardElement);
  const pairId = getCardPairId(cardElement);
  if (!cardId || !pairId) {
    return;
  }

  if (!canSelectCard(state, cardElement, cardId, pairId)) {
    return;
  }

  onCardSelected(state, cardElement, cardId);
}

function bindBoardActions(): void {
  const boardElement = getBoardElement();
  if (!boardElement) {
    return;
  }

  boardElement.addEventListener("click", onBoardClick);
}

function initializeMemoryGame(settings: GameSettings, deck: MemoryCardData[]): void {
  memoryGameState = createMemoryGameState(settings, deck);
  renderScores(memoryGameState);
  renderCurrentPlayer(memoryGameState);
}

function initGamePage(): void {
  const settings = readGameSettings();
  const layoutAssets = getGameLayoutAssets(settings);
  applyGameTheme(settings.theme);
  renderScreen({ screen: "game", data: layoutAssets });
  const deck = renderMemoryBoard(settings);
  initializeMemoryGame(settings, deck);
  bindBoardActions();
  bindExitActions();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initGamePage);
} else {
  initGamePage();
}
