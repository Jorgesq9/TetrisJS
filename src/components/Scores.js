export class Scores {
  constructor() {
    this.highscores =
      JSON.parse(localStorage.getItem("tetrisHighscores")) || [];
  }

  addScore(name, score) {
    this.highscores.push({ name, score, date: new Date() });
    this.highscores.sort((a, b) => b.score - a.score);
    this.highscores = this.highscores.slice(0, 10);
    localStorage.setItem("tetrisHighscores", JSON.stringify(this.highscores));
  }

  getHighscores() {
    return this.highscores;
  }

  updateHighscoresDisplay() {
    const list = document.getElementById("highscoresList");
    list.innerHTML = this.highscores
      .map(
        (score, i) => `
        <li class="neon-text">
          ${i + 1}. ${score.name} - ${score.score}
        </li>
      `
      )
      .join("");
  }
}
