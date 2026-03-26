import type { MemoryCardData } from "../components/memory-card";
import { MATCH_COLLECT_DELAY_MS, MISMATCH_FLIP_DELAY_MS } from "./constants";
import { isGameFinished } from "./outcome";
import { collectMatchedCard } from "./board-collect";
import {
  getBoardElement,
  getCardElementById,
  getCardElementFromEvent,
  getCardId,
  getCardPairId,
  setCardFlipped,
  setCardMatched,
} from "./board-dom";
import type { MemoryGameState } from "./types";

interface ResolvedMatchedPair {
  firstCardElement: HTMLButtonElement;
  secondCardElement: HTMLButtonElement;
  firstCardData: MemoryCardData;
  secondCardData: MemoryCardData;
}

interface BoardControllerCallbacks {
  onScoresChanged: (state: MemoryGameState) => void;
  onCurrentPlayerChanged: (state: MemoryGameState) => void;
  onGameFinished: (state: MemoryGameState) => void;
}

/**
 * Switches the active player to the next valid state.
 * @param state Mutable in-memory game state for the current match.
 * @returns No return value; this function works via side effects.
 */
function switchPlayer(state: MemoryGameState): void {
  state.currentPlayer = state.currentPlayer === "blue" ? "orange" : "blue";
}

/**
 * Resets the revealed card list after a turn is resolved.
 * @param state Mutable in-memory game state for the current match.
 * @returns No return value; this function works via side effects.
 */
function resetRevealedCards(state: MemoryGameState): void {
  state.revealedCardIds = [];
}

/**
 * Checks whether the two currently revealed cards form a matching pair.
 * @param state Mutable in-memory game state for the current match.
 * @returns `true` when the condition is met; otherwise `false`.
 */
function cardPairMatches(state: MemoryGameState): boolean {
  const [firstCardId, secondCardId] = state.revealedCardIds;
  const firstCard = state.cardsById.get(firstCardId);
  const secondCard = state.cardsById.get(secondCardId);
  return Boolean(firstCard && secondCard && firstCard.pairId === secondCard.pairId);
}

/**
 * Flips one revealed card back to the hidden state.
 * @param cardId Unique card identifier on the board.
 * @returns No return value; this function works via side effects.
 */
function setCardFlippedBack(cardId: string): void {
  const cardElement = getCardElementById(cardId);
  if (cardElement) {
    setCardFlipped(cardElement, false);
  }
}

/**
 * Finalizes a mismatch turn and unlocks the board for the next move.
 * @param state Mutable in-memory game state for the current match.
 * @param callbacks UI callbacks for score, player-turn, and game-finish updates.
 * @returns No return value; this function works via side effects.
 */
function finishMismatchTurn(state: MemoryGameState, callbacks: BoardControllerCallbacks): void {
  resetRevealedCards(state);
  switchPlayer(state);
  callbacks.onCurrentPlayerChanged(state);
  state.isBoardLocked = false;
}

/**
 * Handles the mismatch flow by flipping both cards back after a delay.
 * @param state Mutable in-memory game state for the current match.
 * @param callbacks UI callbacks for score, player-turn, and game-finish updates.
 * @returns No return value; this function works via side effects.
 */
function handleMismatchedCards(state: MemoryGameState, callbacks: BoardControllerCallbacks): void {
  const [firstCardId, secondCardId] = state.revealedCardIds;
  window.setTimeout(() => {
    setCardFlippedBack(firstCardId);
    setCardFlippedBack(secondCardId);
    finishMismatchTurn(state, callbacks);
  }, MISMATCH_FLIP_DELAY_MS);
}

/**
 * Returns both revealed card elements for the current turn.
 * @param state Mutable in-memory game state for the current match.
 * @returns Tuple containing computed values in a fixed order.
 */
function getRevealedCardElements(state: MemoryGameState): [HTMLButtonElement | null, HTMLButtonElement | null] {
  const [firstCardId, secondCardId] = state.revealedCardIds;
  return [getCardElementById(firstCardId), getCardElementById(secondCardId)];
}

/**
 * Returns the card data objects for the currently revealed pair.
 * @param state Mutable in-memory game state for the current match.
 * @returns Tuple containing computed values in a fixed order.
 */
function getRevealedCardData(state: MemoryGameState): [MemoryCardData | undefined, MemoryCardData | undefined] {
  const [firstCardId, secondCardId] = state.revealedCardIds;
  return [state.cardsById.get(firstCardId), state.cardsById.get(secondCardId)];
}

/**
 * Validates the currently open pair and returns resolved match data.
 * @param state Mutable in-memory game state for the current match.
 * @returns Value of type `ResolvedMatchedPair`, or `null` when no valid value can be resolved.
 */
function resolveMatchedPair(state: MemoryGameState): ResolvedMatchedPair | null {
  const [firstCardData, secondCardData] = getRevealedCardData(state);
  if (!firstCardData || !secondCardData) {
    return null;
  }

  const [firstCardElement, secondCardElement] = getRevealedCardElements(state);
  if (!firstCardElement || !secondCardElement) {
    return null;
  }

  return {
    firstCardElement,
    secondCardElement,
    firstCardData,
    secondCardData,
  };
}

/**
 * Unlocks the board after matched-card collection and checks game completion.
 * @param state Mutable in-memory game state for the current match.
 * @param callbacks UI callbacks for score, player-turn, and game-finish updates.
 * @returns No return value; this function works via side effects.
 */
function unlockBoardAfterPair(state: MemoryGameState, callbacks: BoardControllerCallbacks): void {
  resetRevealedCards(state);
  if (isGameFinished(state)) {
    callbacks.onGameFinished(state);
    return;
  }

  state.isBoardLocked = false;
}

/**
 * Starts async collection animation for both cards of a matched pair.
 * @param state Mutable in-memory game state for the current match.
 * @param pair Resolved pair data for the currently matched cards.
 * @param callbacks UI callbacks for score, player-turn, and game-finish updates.
 * @returns No return value; this function works via side effects.
 */
function startMatchedPairCollection(
  state: MemoryGameState,
  pair: ResolvedMatchedPair,
  callbacks: BoardControllerCallbacks
): void {
  window.setTimeout(() => {
    Promise.all([
      collectMatchedCard(pair.firstCardElement, pair.firstCardData, state.currentPlayer),
      collectMatchedCard(pair.secondCardElement, pair.secondCardData, state.currentPlayer),
    ]).then(() => unlockBoardAfterPair(state, callbacks));
  }, MATCH_COLLECT_DELAY_MS);
}

/**
 * Marks a resolved pair as matched and updates the active player's score.
 * @param state Mutable in-memory game state for the current match.
 * @param pair Resolved pair data for the currently matched cards.
 * @param callbacks UI callbacks for score, player-turn, and game-finish updates.
 * @returns No return value; this function works via side effects.
 */
function markPairAsMatched(state: MemoryGameState, pair: ResolvedMatchedPair, callbacks: BoardControllerCallbacks): void {
  setCardMatched(pair.firstCardElement);
  setCardMatched(pair.secondCardElement);
  state.matchedPairIds.add(pair.firstCardData.pairId);
  state.scores[state.currentPlayer] += 1;
  callbacks.onScoresChanged(state);
}

/**
 * Handles the matched-pair flow and starts card collection animation.
 * @param state Mutable in-memory game state for the current match.
 * @param callbacks UI callbacks for score, player-turn, and game-finish updates.
 * @returns No return value; this function works via side effects.
 */
function handleMatchedCards(state: MemoryGameState, callbacks: BoardControllerCallbacks): void {
  const pair = resolveMatchedPair(state);
  if (!pair) {
    resetRevealedCards(state);
    state.isBoardLocked = false;
    return;
  }

  markPairAsMatched(state, pair, callbacks);
  startMatchedPairCollection(state, pair, callbacks);
}

/**
 * Checks whether a card is already selected in the active turn.
 * @param state Mutable in-memory game state for the current match.
 * @param cardId Unique card identifier on the board.
 * @returns `true` when the condition is met; otherwise `false`.
 */
function isCardAlreadySelected(state: MemoryGameState, cardId: string): boolean {
  return state.revealedCardIds.includes(cardId);
}

/**
 * Checks whether a pair id has already been matched in the current game.
 * @param state Mutable in-memory game state for the current match.
 * @param pairId Shared pair identifier for matching cards.
 * @returns `true` when the condition is met; otherwise `false`.
 */
function isCardAlreadyMatched(state: MemoryGameState, pairId: string): boolean {
  return state.matchedPairIds.has(pairId);
}

/**
 * Checks whether a clicked card can be selected in the current state.
 * @param state Mutable in-memory game state for the current match.
 * @param cardElement Button element representing a memory card on the board.
 * @param cardId Unique card identifier on the board.
 * @param pairId Shared pair identifier for matching cards.
 * @returns `true` when the condition is met; otherwise `false`.
 */
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

/**
 * Handles a valid card selection and advances the turn logic.
 * @param state Mutable in-memory game state for the current match.
 * @param cardElement Button element representing a memory card on the board.
 * @param cardId Unique card identifier on the board.
 * @param callbacks UI callbacks for score, player-turn, and game-finish updates.
 * @returns No return value; this function works via side effects.
 */
function onCardSelected(
  state: MemoryGameState,
  cardElement: HTMLButtonElement,
  cardId: string,
  callbacks: BoardControllerCallbacks
): void {
  setCardFlipped(cardElement, true);
  state.revealedCardIds.push(cardId);
  if (state.revealedCardIds.length < 2) {
    return;
  }

  state.isBoardLocked = true;
  if (cardPairMatches(state)) {
    handleMatchedCards(state, callbacks);
    return;
  }

  handleMismatchedCards(state, callbacks);
}

/**
 * Resolves full card-selection details from a board click event.
 * @param event DOM event triggered by the current user interaction.
 * @returns Selection details or `null` when the click target is invalid.
 */
function getCardSelection(
  event: MouseEvent
): { cardElement: HTMLButtonElement; cardId: string; pairId: string } | null {
  const cardElement = getCardElementFromEvent(event);
  if (!cardElement) {
    return null;
  }

  const cardId = getCardId(cardElement);
  const pairId = getCardPairId(cardElement);
  if (!cardId || !pairId) {
    return null;
  }

  return { cardElement, cardId, pairId };
}

/**
 * Handles board click events and delegates to the card-selection flow.
 * @param event DOM event triggered by the current user interaction.
 * @param state Mutable in-memory game state for the current match.
 * @param callbacks UI callbacks for score, player-turn, and game-finish updates.
 * @returns No return value; this function works via side effects.
 */
function onBoardClick(event: MouseEvent, state: MemoryGameState, callbacks: BoardControllerCallbacks): void {
  const selection = getCardSelection(event);
  if (!selection) {
    return;
  }

  if (!canSelectCard(state, selection.cardElement, selection.cardId, selection.pairId)) {
    return;
  }

  onCardSelected(state, selection.cardElement, selection.cardId, callbacks);
}

/**
 * Binds the board click handler for the active game state.
 * @param state Mutable in-memory game state for the current match.
 * @param callbacks UI callbacks for score, player-turn, and game-finish updates.
 * @returns No return value; this function works via side effects.
 */
export function bindBoardActions(state: MemoryGameState, callbacks: BoardControllerCallbacks): void {
  const boardElement = getBoardElement();
  if (!boardElement) {
    return;
  }

  boardElement.addEventListener("click", (event: MouseEvent) => onBoardClick(event, state, callbacks));
}
