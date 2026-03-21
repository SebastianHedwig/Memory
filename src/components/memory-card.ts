export interface MemoryCardData {
  id: string;
  pairId: string;
  coverSrc: string;
  faceSrc: string;
}

function cardClassName(isFlipped: boolean): string {
  return isFlipped ? "memory-card is-flipped" : "memory-card";
}

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

function getMemoryCardElement(target: EventTarget | null): HTMLButtonElement | null {
  if (!(target instanceof HTMLElement)) {
    return null;
  }

  return target.closest<HTMLButtonElement>("[data-memory-card-id]");
}

function toggleMemoryCard(cardElement: HTMLButtonElement): void {
  cardElement.classList.toggle("is-flipped");
}

function onMemoryBoardClick(event: MouseEvent): void {
  const cardElement = getMemoryCardElement(event.target);
  if (!cardElement) {
    return;
  }

  toggleMemoryCard(cardElement);
}

export function bindMemoryCardFlip(boardElement: HTMLElement): void {
  boardElement.addEventListener("click", onMemoryBoardClick);
}
