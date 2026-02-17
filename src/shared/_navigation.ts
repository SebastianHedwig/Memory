export const ROUTES = {
  home: "./index.html",
  settings: "./settings.html",
  game: "./game.html",
} as const;

export type RouteKey = keyof typeof ROUTES;

export function navigateTo(route: RouteKey): void {
  window.location.href = ROUTES[route];
}
