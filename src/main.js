import "./style.css";
import { Game } from "./components/Game.js";
import { UI } from "./components/UI.js";
import { Scores } from "./components/Scores.js";

class App {
  constructor() {
    this.ui = new UI();
    this.scores = new Scores();
    this.game = new Game();
    this.playerName = "";

    this.initialize();
    this.game = new Game(() => this.gameOver());
    this.audio = document.getElementById("gameMusic");
    this.audio.volume = 0.3; // 30% de volumen
    this.setupMusicControls();
  }

  setupMusicControls() {
    const musicIcon = document.createElement("img");
    musicIcon.src = "/assets/music-icon.png"; // Icono de altavoz
    musicIcon.className = "music-control";
    musicIcon.style.width = "40px";
    document.body.appendChild(musicIcon);

    musicIcon.addEventListener("click", () => {
      this.audio.paused ? this.audio.play() : this.audio.pause();
      musicIcon.style.opacity = this.audio.paused ? 0.5 : 1;
    });
  }

  initialize() {
    this.ui.bindStartGame(() => this.startGame());
    this.ui.bindRestartGame(() => this.restartGame());

    document.getElementById("homeButton").addEventListener("click", () => {
      this.ui.showScreen("start");
      this.game.reset(); // Reinicia el juego correctamente
    });

    this.ui.showScreen("start");
  }

  startGame() {
    this.playerName = document.getElementById("playerName").value || "Player";
    this.ui.showScreen("game");
    this.game.update();
    this.startScoreUpdate();
    this.audio.play().catch(() => {
      // Necesario para algunos navegadores
      this.audio.play();
    });
  }

  startScoreUpdate() {
    setInterval(() => {
      this.ui.updateScore(this.game.getScore());
    }, 100);
  }

  restartGame() {
    this.game.reset();
    this.ui.showScreen("game");
    this.game.update();
  }

  gameOver() {
    this.scores.addScore(this.playerName, this.game.getScore());
    this.ui.showScreen("gameOver");
    this.scores.updateHighscoresDisplay();
    document.querySelector(".final-score .neon-text").textContent =
      this.game.getScore();
    this.audio.pause();
    this.audio.currentTime = 0;
  }
}

new App();
