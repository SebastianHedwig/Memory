import type { PlayerColor } from "./types";

/**
 * Returns the board root element used for card interactions.
 * @returns Resolved `HTMLElement`, or `null` when no matching element can be resolved.
 */
export function getBoardElement(): HTMLElement | null {
  return document.querySelector<HTMLElement>("[data-game-board]") ?? document.querySelector<HTMLElement>(".game__board");
}

/**
 * Resolves a card button element by its unique board id.
 * @param cardId Unique card identifier on the board.
 * @returns Resolved `HTMLButtonElement`, or `null` when no matching element can be resolved.
 */
export function getCardElementById(cardId: string): HTMLButtonElement | null {
  return document.querySelector<HTMLButtonElement>(`[data-memory-card-id="${cardId}"]`);
}

/**
 * Resolves the clicked card button element from a board click event.
 * @param event DOM event triggered by the current user interaction.
 * @returns Resolved `HTMLButtonElement`, or `null` when no matching element can be resolved.
 */
export function getCardElementFromEvent(event: MouseEvent): HTMLButtonElement | null {
  if (!(event.target instanceof HTMLElement)) {
    return null;
  }

  return event.target.closest<HTMLButtonElement>("[data-memory-card-id]");
}

/**
 * Reads the card id from a card button dataset.
 * @param cardElement Button element representing a memory card on the board.
 * @returns Value of type `string`, or `null` when no valid value can be resolved.
 */
export function getCardId(cardElement: HTMLButtonElement): string | null {
  return cardElement.dataset.memoryCardId ?? null;
}

/**
 * Reads the pair id from a card button dataset.
 * @param cardElement Button element representing a memory card on the board.
 * @returns Value of type `string`, or `null` when no valid value can be resolved.
 */
export function getCardPairId(cardElement: HTMLButtonElement): string | null {
  return cardElement.dataset.memoryCardPair ?? null;
}

/**
 * Updates the visual flip state of a card element.
 * @param cardElement Button element representing a memory card on the board.
 * @param isFlipped Controls whether a card is rendered as flipped.
 * @returns No return value; this function works via side effects.
 */
export function setCardFlipped(cardElement: HTMLButtonElement, isFlipped: boolean): void {
  cardElement.classList.toggle("is-flipped", isFlipped);
}

/**
 * Marks a card element as matched.
 * @param cardElement Button element representing a memory card on the board.
 * @returns No return value; this function works via side effects.
 */
export function setCardMatched(cardElement: HTMLButtonElement): void {
  cardElement.classList.add("is-matched");
}

/**
 * Marks a card element as collected and disables further clicks.
 * @param cardElement Button element representing a memory card on the board.
 * @returns No return value; this function works via side effects.
 */
export function setCardCollected(cardElement: HTMLButtonElement): void {
  cardElement.classList.add("is-collected");
  cardElement.disabled = true;
}

/**
 * Resolves the stack root of a specific player color.
 * @param player Player color targeted by this operation.
 * @returns Resolved `HTMLElement`, or `null` when no matching element can be resolved.
 */
export function getPlayerStackElement(player: PlayerColor): HTMLElement | null {
  return document.querySelector<HTMLElement>(`[data-player-stack="${player}"]`);
}
