import "@scss/main.scss";
import { navigateTo } from "./shared/_navigation";

document.querySelector(".subtitle")!.innerHTML = "It´s play time!";
document.querySelector(".title")!.innerHTML = "Ready to play?";

function goToSettings(): void {
  document.querySelector<HTMLButtonElement>(".button--primary")?.addEventListener("click", () => {
    navigateTo("settings");
  });
}

goToSettings();
