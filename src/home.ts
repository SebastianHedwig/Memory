import "@scss/main.scss";

document.querySelector(".subtitle")!.innerHTML = "It´s play time!";
document.querySelector(".title")!.innerHTML = "Ready to play?";

function goToSettings(): void {
  document.querySelector<HTMLButtonElement>(".button--primary")?.addEventListener("click", () => {
      window.location.href = "./settings.html";
    });
}

goToSettings();
