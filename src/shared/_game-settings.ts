export type ThemeValue = "code-vibes" | "gaming" | "foods";
export type PlayerValue = "blue" | "orange";

export interface GameSettings {
  theme: ThemeValue;
  player: PlayerValue;
  boardSize: number;
}

const SETTINGS_STORAGE_KEY = "memory-game-settings";
const DEFAULT_BOARD_SIZE = 16;

export const DEFAULT_THEME: ThemeValue = "code-vibes";
export const DEFAULT_PLAYER: PlayerValue = "blue";

/**
 * Checks whether Theme Value is satisfied.
 * @param value Raw value used for parsing, validation, or mapping.
 * @returns Value of type `value is ThemeValue`.
 */
function isThemeValue(value: string): value is ThemeValue {
  return value === "code-vibes" || value === "gaming" || value === "foods";
}

/**
 * Checks whether Player Value is satisfied.
 * @param value Raw value used for parsing, validation, or mapping.
 * @returns Value of type `value is PlayerValue`.
 */
function isPlayerValue(value: string): value is PlayerValue {
  return value === "blue" || value === "orange";
}

/**
 * Parses Board Size into the expected typed value.
 * @param value Raw value used for parsing, validation, or mapping.
 * @returns Computed numeric value.
 */
function parseBoardSize(value: unknown): number {
  const parsed = Number.parseInt(String(value), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_BOARD_SIZE;
}

/**
 * Parses Theme into the expected typed value.
 * @param value Raw value used for parsing, validation, or mapping.
 * @returns Value of type `ThemeValue`.
 */
function parseTheme(value: unknown): ThemeValue {
  const nextValue = String(value);
  return isThemeValue(nextValue) ? nextValue : DEFAULT_THEME;
}

/**
 * Parses Player into the expected typed value.
 * @param value Raw value used for parsing, validation, or mapping.
 * @returns Value of type `PlayerValue`.
 */
function parsePlayer(value: unknown): PlayerValue {
  const nextValue = String(value);
  return isPlayerValue(nextValue) ? nextValue : DEFAULT_PLAYER;
}

/**
 * Writes the current settings object to session storage.
 * @param settings Validated game settings selected on the settings page.
 * @returns No return value; this function works via side effects.
 */
export function writeGameSettings(settings: GameSettings): void {
  sessionStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
}

/**
 * Reads persisted settings and normalizes invalid values to defaults.
 * @returns Value of type `GameSettings`.
 */
export function readGameSettings(): GameSettings {
  const rawSettings = sessionStorage.getItem(SETTINGS_STORAGE_KEY);
  if (!rawSettings) {
    return { theme: DEFAULT_THEME, player: DEFAULT_PLAYER, boardSize: DEFAULT_BOARD_SIZE };
  }

  try {
    const parsedSettings = JSON.parse(rawSettings) as Partial<GameSettings>;
    return {
      theme: parseTheme(parsedSettings.theme),
      player: parsePlayer(parsedSettings.player),
      boardSize: parseBoardSize(parsedSettings.boardSize),
    };
  } catch {
    return { theme: DEFAULT_THEME, player: DEFAULT_PLAYER, boardSize: DEFAULT_BOARD_SIZE };
  }
}
