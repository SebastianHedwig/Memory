import "@scss/main.scss";
import { navigateTo } from "./shared/_navigation";

document.querySelector(".subtitle")!.innerHTML = "It´s play time!";
document.querySelector(".title")!.innerHTML = "Ready to play?";

/**
 * Executes Go To Settings for the current flow.
 * @returns No return value; this function works via side effects.
 */
function goToSettings(): void {
  document.querySelector<HTMLButtonElement>(".button--primary")?.addEventListener("click", () => {
    navigateTo("settings");
  });
}

goToSettings();
