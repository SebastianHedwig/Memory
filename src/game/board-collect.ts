import type { MemoryCardData } from "../components/memory-card";
import { CARD_FLY_DURATION_MS, STACK_PILE_CARD_LIMIT } from "./constants";
import { getPlayerStackElement, setCardCollected } from "./board-dom";
import type { PlayerColor } from "./types";

/**
 * Creates the image node used in the player stack for a collected card.
 * @param faceSrc Image path for the card front face.
 * @param player Player color targeted by this operation.
 * @returns Value of type `HTMLImageElement`.
 */
function createCollectedCard(faceSrc: string, player: PlayerColor): HTMLImageElement {
  const collectedCardElement = document.createElement("img");
  collectedCardElement.className = `game__collected-card game__collected-card--${player}`;
  collectedCardElement.src = faceSrc;
  collectedCardElement.alt = "";
  collectedCardElement.setAttribute("aria-hidden", "true");
  return collectedCardElement;
}

/**
 * Calculates which pile index should receive the next collected card.
 * @param cardCount Total number of cards used for layout or stack calculations.
 * @returns Computed numeric value.
 */
function getStackPileIndex(cardCount: number): number {
  return Math.floor(cardCount / STACK_PILE_CARD_LIMIT);
}

/**
 * Resolves (or creates) the pile element inside a player stack.
 * @param stackElement Stack container for collected cards of one player.
 * @param pileIndex Zero-based index of the stack pile.
 * @returns Value of type `HTMLElement`.
 */
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

/**
 * Appends a collected card image into the proper player pile.
 * @param stackElement Stack container for collected cards of one player.
 * @param collectedCardElement Image element for a collected card.
 * @returns No return value; this function works via side effects.
 */
function appendCollectedCardToStack(stackElement: HTMLElement, collectedCardElement: HTMLImageElement): void {
  const collectedCardCount = stackElement.querySelectorAll(".game__collected-card").length;
  const pileIndex = getStackPileIndex(collectedCardCount);
  const pileElement = getStackPileElement(stackElement, pileIndex);
  pileElement.append(collectedCardElement);
}

/**
 * Clones a card element as a temporary ghost used for flight animation.
 * @param cardElement Button element representing a memory card on the board.
 * @returns Value of type `HTMLElement`.
 */
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

/**
 * Calculates the X/Y travel distance from ghost to target.
 * @param ghostElement Temporary cloned element used for flight animation.
 * @param targetElement Destination element for the animation.
 * @returns Object containing `deltaX` and `deltaY` pixel offsets.
 */
function getGhostTravelDelta(ghostElement: HTMLElement, targetElement: HTMLElement): { deltaX: number; deltaY: number } {
  const sourceRect = ghostElement.getBoundingClientRect();
  const targetRect = targetElement.getBoundingClientRect();
  return {
    deltaX: targetRect.left - sourceRect.left,
    deltaY: targetRect.top - sourceRect.top,
  };
}

/**
 * Wraps a resolver so it can only be executed once.
 * @param resolve Resolver callback used to complete the current async step.
 * @returns Value of type `() => void`.
 */
function createResolveOnce(resolve: () => void): () => void {
  let isFinished = false;
  return () => {
    if (isFinished) {
      return;
    }

    isFinished = true;
    resolve();
  };
}

/**
 * Starts the flight transition on the ghost element.
 * @param ghostElement Temporary cloned element used for flight animation.
 * @param deltaX Horizontal offset in pixels.
 * @param deltaY Vertical offset in pixels.
 * @returns No return value; this function works via side effects.
 */
function startGhostFlight(ghostElement: HTMLElement, deltaX: number, deltaY: number): void {
  requestAnimationFrame(() => {
    ghostElement.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.55)`;
    ghostElement.style.opacity = "0.75";
  });
}

/**
 * Animates one ghost card from source to destination.
 * @param ghostElement Temporary cloned element used for flight animation.
 * @param targetElement Destination element for the animation.
 * @returns Promise that resolves after the asynchronous UI phase completes.
 */
function animateCardGhostToTarget(ghostElement: HTMLElement, targetElement: HTMLElement): Promise<void> {
  const { deltaX, deltaY } = getGhostTravelDelta(ghostElement, targetElement);
  return new Promise((resolve) => {
    const finish = createResolveOnce(resolve);
    ghostElement.addEventListener("transitionend", finish, { once: true });
    window.setTimeout(finish, CARD_FLY_DURATION_MS + 120);
    startGhostFlight(ghostElement, deltaX, deltaY);
  });
}

/**
 * Creates and inserts a hidden collected-card image before the flight starts.
 * @param faceSrc Image path for the card front face.
 * @param player Player color targeted by this operation.
 * @param stackElement Stack container for collected cards of one player.
 * @returns Value of type `HTMLImageElement`.
 */
function createHiddenCollectedCard(faceSrc: string, player: PlayerColor, stackElement: HTMLElement): HTMLImageElement {
  const collectedCardElement = createCollectedCard(faceSrc, player);
  collectedCardElement.style.visibility = "hidden";
  appendCollectedCardToStack(stackElement, collectedCardElement);
  return collectedCardElement;
}

/**
 * Collects one matched card and animates it into the target player stack.
 * @param cardElement Button element representing a memory card on the board.
 * @param cardData Card metadata including pair id and image sources.
 * @param player Player color targeted by this operation.
 * @returns Promise that resolves after the asynchronous UI phase completes.
 */
export function collectMatchedCard(cardElement: HTMLButtonElement, cardData: MemoryCardData, player: PlayerColor): Promise<void> {
  const stackElement = getPlayerStackElement(player);
  if (!stackElement) {
    setCardCollected(cardElement);
    return Promise.resolve();
  }

  const collectedCardElement = createHiddenCollectedCard(cardData.faceSrc, player, stackElement);
  const ghostElement = createFlyingGhost(cardElement);
  document.body.append(ghostElement);
  return animateCardGhostToTarget(ghostElement, collectedCardElement).then(() => {
    setCardCollected(cardElement);
    collectedCardElement.style.visibility = "visible";
    ghostElement.remove();
  });
}
