import type { MemoryCardData } from "../components/memory-card";
import type { GameSettings } from "../shared/_game-settings";
import type { ExitOverlayCopy } from "../components/exit-overlay";

export type PlayerColor = "blue" | "orange";

export type WinnerRenderData = {
  confettiSrc: string;
  playerName: string;
  playerColor: PlayerColor;
  playerImageSrc: string;
  playerImageAlt: string;
  pedestalLabel?: string;
};

export type GameOverRenderData = {
  blueIconSrc: string;
  blueScore: number;
  orangeIconSrc: string;
  orangeScore: number;
};

export type DrawRenderData = {
  confettiSrc: string;
};

export interface GameLayoutAssets {
  blueIconSrc: string;
  orangeIconSrc: string;
  currentPlayerIconSrc: string;
  exitButtonIconSrc: string;
  exitButtonLabel: string;
  exitOverlayCopy: ExitOverlayCopy;
}

export type ScreenRenderState =
  | { screen: "game"; data: GameLayoutAssets }
  | { screen: "winner"; data: WinnerRenderData }
  | { screen: "draw"; data: DrawRenderData }
  | { screen: "gameOver"; data: GameOverRenderData };

export interface MemoryGameState {
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

