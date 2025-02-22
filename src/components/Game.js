import { checkCollision, rotateMatrix } from "../utils/helpers.js";

export class Game {
  constructor(gameOverCallback) {
    this.canvas = document.querySelector("canvas");
    this.context = this.canvas.getContext("2d");
    this.gameOverCallback = gameOverCallback;

    this.BLOCK_SIZE = 20;
    this.BOARD_WIDTH = 14;
    this.BOARD_HEIGHT = 30;
    this.score = 0;

    this.pieces = [
      [
        [0, 1, 0],
        [1, 1, 1],
      ], // T
      [
        [1, 1, 0],
        [0, 1, 1],
      ], // Z
      [[1, 1, 1, 1]], // I
      [
        [0, 1, 1],
        [1, 1, 0],
      ], // S
      [
        [1, 1, 1],
        [0, 0, 1],
      ], // L
      [
        [1, 1, 1],
        [1, 0, 0],
      ], // J
    ];

    this.nextPieceCanvas = document.getElementById("nextPieceCanvas");
    this.nextPieceContext = this.nextPieceCanvas.getContext("2d");
    this.PREVIEW_SIZE = 100;

    // Configuración inicial del canvas de preview
    this.nextPieceCanvas.width = this.PREVIEW_SIZE;
    this.nextPieceCanvas.height = this.PREVIEW_SIZE;
    this.nextPieceContext.scale(this.PREVIEW_SIZE / 5, this.PREVIEW_SIZE / 5);

    this.initGame();
    this.setupEventListeners();
  }

  initGame() {
    // Configuración del canvas principal
    this.canvas.width = this.BLOCK_SIZE * this.BOARD_WIDTH;
    this.canvas.height = this.BLOCK_SIZE * this.BOARD_HEIGHT;
    this.context.scale(this.BLOCK_SIZE, this.BLOCK_SIZE);

    // Estado del juego
    this.board = this.createBoard();
    this.dropCounter = 0;
    this.lastTime = 0;
    this.gameOver = false;

    // Sistema de piezas
    this.nextPiece = {
      shape: this.pieces[Math.floor(Math.random() * this.pieces.length)],
    };
    this.currentPiece = this.createNewPiece();
    this.drawNextPiece();
  }

  createBoard() {
    return Array.from({ length: this.BOARD_HEIGHT }, () =>
      Array(this.BOARD_WIDTH).fill(0)
    );
  }

  createNewPiece() {
    const newShape = this.nextPiece.shape;
    this.nextPiece.shape =
      this.pieces[Math.floor(Math.random() * this.pieces.length)];

    return {
      position: { x: 5, y: 0 },
      shape: newShape,
    };
  }

  solidifyPiece() {
    // Fijar pieza actual al tablero
    this.currentPiece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) {
          const boardY = y + this.currentPiece.position.y;
          const boardX = x + this.currentPiece.position.x;
          if (boardY >= 0) this.board[boardY][boardX] = 1;
        }
      });
    });

    // Generar nueva pieza
    this.currentPiece = this.createNewPiece();

    // Verificar Game Over antes de dibujar la siguiente pieza
    if (
      checkCollision(
        this.currentPiece,
        this.board,
        this.BOARD_WIDTH,
        this.BOARD_HEIGHT
      )
    ) {
      this.gameOver = true;
      this.board.forEach((row) => row.fill(0));
      this.gameOverCallback?.();
      return;
    }

    // Dibujar la nueva pieza en el preview
    this.drawNextPiece();
  }

  drawNextPiece() {
    // Limpiar canvas
    this.nextPieceContext.clearRect(0, 0, 5, 5);

    // Calcular offset para centrar
    const offsetX = (5 - this.nextPiece.shape[0].length) / 2;
    const offsetY = (5 - this.nextPiece.shape.length) / 2;

    // Dibujar nueva pieza
    this.nextPiece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) {
          this.nextPieceContext.fillStyle = "blue";
          this.nextPieceContext.fillRect(x + offsetX, y + offsetY, 1, 1);
        }
      });
    });
  }

  setupEventListeners() {
    document.addEventListener("keydown", (event) => this.handleInput(event));
  }

  handleInput(event) {
    if (this.gameOver) return;

    switch (event.key) {
      case "ArrowLeft":
        this.movePiece(-1);
        break;
      case "ArrowRight":
        this.movePiece(1);
        break;
      case "ArrowDown":
        this.dropPiece();
        break;
      case "ArrowUp":
        this.rotatePiece();
        break;
    }
  }

  movePiece(direction) {
    this.currentPiece.position.x += direction;
    if (
      checkCollision(
        this.currentPiece,
        this.board,
        this.BOARD_WIDTH,
        this.BOARD_HEIGHT
      )
    ) {
      this.currentPiece.position.x -= direction;
    }
    this.draw();
  }

  dropPiece() {
    const maxDropFrames = 1; // Limitar la cantidad máxima de veces que se mueve la pieza hacia abajo en cada cuadro
    for (let i = 0; i < maxDropFrames; i++) {
      this.currentPiece.position.y++;
      if (
        checkCollision(
          this.currentPiece,
          this.board,
          this.BOARD_WIDTH,
          this.BOARD_HEIGHT
        )
      ) {
        this.currentPiece.position.y--;
        this.solidifyPiece();
        this.removeRows();
        break;
      }
    }
    this.draw();
  }

  rotatePiece() {
    const rotated = rotateMatrix(this.currentPiece.shape);
    const originalShape = this.currentPiece.shape;

    this.currentPiece.shape = rotated;
    if (
      checkCollision(
        this.currentPiece,
        this.board,
        this.BOARD_WIDTH,
        this.BOARD_HEIGHT
      )
    ) {
      this.currentPiece.shape = originalShape;
    }
    this.draw();
  }

  update(time = 0) {
    if (this.gameOver) return;

    const deltaTime = time - this.lastTime;
    this.lastTime = time;
    this.dropCounter += deltaTime;

    if (this.dropCounter > 500) {
      this.currentPiece.position.y++;
      if (
        checkCollision(
          this.currentPiece,
          this.board,
          this.BOARD_WIDTH,
          this.BOARD_HEIGHT
        )
      ) {
        this.currentPiece.position.y--;
        this.solidifyPiece();
        this.removeRows();
      }
      this.dropCounter = 0;
    }
    this.draw();
    requestAnimationFrame((t) => this.update(t));
  }

  draw() {
    this.context.fillStyle = "#000";
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Dibujar tablero
    this.board.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) {
          this.context.fillStyle = "purple";
          this.context.fillRect(x, y, 1, 1);
        }
      });
    });

    // Dibujar pieza actual
    this.currentPiece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) {
          this.context.fillStyle = "blue";
          this.context.fillRect(
            x + this.currentPiece.position.x,
            y + this.currentPiece.position.y,
            1,
            1
          );
        }
      });
    });
  }

  removeRows() {
    const fullRows = [];
    this.board.forEach((row, y) => {
      if (row.every((cell) => cell === 1)) fullRows.push(y);
    });

    fullRows.forEach((y) => {
      this.board.splice(y, 1);
      this.board.unshift(Array(this.BOARD_WIDTH).fill(0));
      this.score += 100;
    });
  }

  getScore() {
    return this.score;
  }

  reset() {
    this.initGame();
    this.score = 0;
    this.gameOver = false;
  }
}
