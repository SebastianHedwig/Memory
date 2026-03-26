export const ROUTES = {
  home: "./index.html",
  settings: "./settings.html",
  game: "./game.html",
} as const;

export type RouteKey = keyof typeof ROUTES;

/**
 * Executes Navigate To for the current flow.
 * @param route Internal navigation target key.
 * @returns No return value; this function works via side effects.
 */
export function navigateTo(route: RouteKey): void {
  window.location.href = ROUTES[route];
}
