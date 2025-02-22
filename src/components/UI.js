export class UI {
  constructor() {
    this.startScreen = document.getElementById("startScreen");
    this.gameScreen = document.getElementById("app");
    this.gameOverScreen = document.getElementById("gameOverModal");
    this.scoreElement = document.querySelector("span");
  }

  showScreen(screenName) {
    const screens = {
      start: () => {
        this.startScreen.style.display = "block";
        this.gameScreen.style.display = "none";
        this.gameOverScreen.style.display = "none";

        // 🔹 Limpiar el campo de nombre cuando se vuelve a la pantalla inicial
        document.getElementById("playerName").value = "";
      },
      game: () => {
        this.startScreen.style.display = "none";
        this.gameScreen.style.display = "block";
        this.gameOverScreen.style.display = "none";
      },
      gameOver: () => {
        this.startScreen.style.display = "none";
        this.gameScreen.style.display = "none";
        this.gameOverScreen.style.display = "flex";
      },
    };

    screens[screenName]?.();
  }

  updateScore(score) {
    this.scoreElement.textContent = score;
  }

  bindStartGame(handler) {
    document.getElementById("startGame").addEventListener("click", handler);
  }

  bindRestartGame(handler) {
    document.getElementById("restartButton").addEventListener("click", handler);
  }
}
