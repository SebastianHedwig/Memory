export interface MemoryCardData {
  id: string;
  pairId: string;
  coverSrc: string;
  faceSrc: string;
}

/**
 * Executes Card Class Name for the current flow.
 * @param isFlipped Controls whether a card is rendered as flipped.
 * @returns Generated string value for rendering or downstream processing.
 */
function cardClassName(isFlipped: boolean): string {
  return isFlipped ? "memory-card is-flipped" : "memory-card";
}

/**
 * Executes Memory Card Template for the current flow.
 * @param data Input value used in this processing step.
 * @param isFlipped Controls whether a card is rendered as flipped.
 * @returns Generated string value for rendering or downstream processing.
 */
export function memoryCardTemplate(data: MemoryCardData, isFlipped = false): string {
  return /*html*/ `
    <button
      class="${cardClassName(isFlipped)}"
      type="button"
      data-memory-card-id="${data.id}"
      data-memory-card-pair="${data.pairId}"
      aria-label="Memory card">
      <span class="memory-card__inner">
        <img class="memory-card__face memory-card__face--front" src="${data.coverSrc}" alt="" aria-hidden="true">
        <img class="memory-card__face memory-card__face--back" src="${data.faceSrc}" alt="" aria-hidden="true">
      </span>
    </button>`;
}

/**
 * Returns Memory Card Element from the current DOM/state context.
 * @param target Original event target used for DOM lookup.
 * @returns Resolved `HTMLButtonElement`, or `null` when no matching element can be resolved.
 */
function getMemoryCardElement(target: EventTarget | null): HTMLButtonElement | null {
  if (!(target instanceof HTMLElement)) {
    return null;
  }

  return target.closest<HTMLButtonElement>("[data-memory-card-id]");
}

/**
 * Executes Toggle Memory Card for the current flow.
 * @param cardElement Button element representing a memory card on the board.
 * @returns No return value; this function works via side effects.
 */
function toggleMemoryCard(cardElement: HTMLButtonElement): void {
  cardElement.classList.toggle("is-flipped");
}

/**
 * Handles events for Memory Board Click.
 * @param event DOM event triggered by the current user interaction.
 * @returns No return value; this function works via side effects.
 */
function onMemoryBoardClick(event: MouseEvent): void {
  const cardElement = getMemoryCardElement(event.target);
  if (!cardElement) {
    return;
  }

  toggleMemoryCard(cardElement);
}

/**
 * Binds event handlers for Memory Card Flip.
 * @param boardElement Board container element.
 * @returns No return value; this function works via side effects.
 */
export function bindMemoryCardFlip(boardElement: HTMLElement): void {
  boardElement.addEventListener("click", onMemoryBoardClick);
}

