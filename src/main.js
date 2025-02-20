import "./style.css";

// 1- Canvas
const canvas = document.querySelector("canvas"); // Use lowercase "canvas"
const context = canvas.getContext("2d");

const BLOCK_SIZE = 20;
const BOARD_WIDTH = 14;
const BOARD_HEIGHT = 30;

const $score = document.querySelector("span");

let score = 0;

canvas.width = BLOCK_SIZE * BOARD_WIDTH;
canvas.height = BLOCK_SIZE * BOARD_HEIGHT;

context.scale(BLOCK_SIZE, BLOCK_SIZE);

// 2. Board

const board = Array.from({ length: BOARD_HEIGHT }, (_, y) => {
  if (y === BOARD_HEIGHT - 1) {
    const row = Array(BOARD_WIDTH).fill(0);

    return row;
  }

  return Array(BOARD_WIDTH).fill(0);
});

// Pieces

const piece = {
  position: { x: 5, y: 5 },
  shape: [
    [1, 1],
    [1, 1],
  ],
};

// Pieces

const pieces = [
  [
    [0, 1, 0],
    [1, 1, 1],
  ],
  [
    [1, 1, 0],
    [0, 1, 1],
  ],
  [[1, 1, 1, 1]],
  [
    [0, 1, 1],
    [1, 1, 0],
  ],
  [
    [1, 1, 1],
    [0, 0, 1],
  ],
  [
    [1, 1, 1],
    [1, 0, 0],
  ],
];

console.log(pieces);

// 3. Game loop
/*function update() {
  draw();
  window.requestAnimationFrame(update);
} */

let counterDrop = 0;
let lastTime = 0;

function update(time = 0) {
  const dropTime = time - lastTime;
  lastTime = time;

  counterDrop += dropTime;

  if (counterDrop > 500) {
    piece.position.y++;
    counterDrop = 0;

    if (checkCollision()) {
      piece.position.y--;
      solidifyPiece();
      rowsRemove();
    }
  }

  draw();
  window.requestAnimationFrame(update);
}

function draw() {
  context.fillStyle = "#000";
  context.fillRect(0, 0, canvas.width, canvas.height);

  board.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 1) {
        context.fillStyle = "purple";
        context.fillRect(x, y, 1, 1);
      }
    });
  });

  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        context.fillStyle = "Blue";
        context.fillRect(x + piece.position.x, y + piece.position.y, 1, 1);
      }
    });
  });
  $score.innerText = score;
}

// Movements

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    piece.position.x--;
    if (checkCollision()) {
      piece.position.x++;
    }
  }
  if (event.key === "ArrowRight") {
    piece.position.x++;
    if (checkCollision()) {
      piece.position.x--;
    }
  }

  if (event.key === "ArrowDown") {
    piece.position.y++;
    if (checkCollision()) {
      piece.position.y--;
      solidifyPiece();
      rowsRemove();
    }
  }

  if (event.key === "ArrowUp") {
    const oldShape = piece.shape.map((row) => [...row]);
    const rotate = [];

    for (let i = 0; i < piece.shape[0].length; i++) {
      const newRow = [];

      for (let j = piece.shape.length - 1; j >= 0; j--) {
        newRow.push(piece.shape[j][i]);
      }

      rotate.push(newRow);
    }

    piece.shape = rotate;

    if (checkCollision()) {
      // Si colisiona, revertimos a la forma original
      piece.shape = oldShape;
    }
  }
});

// collision

function checkCollision() {
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x] !== 0) {
        const boardX = x + piece.position.x;
        const boardY = y + piece.position.y;

        if (boardX < 0 || boardX >= BOARD_WIDTH) {
          return true;
        }

        if (boardY >= BOARD_HEIGHT) {
          return true;
        }

        if (board[boardY][boardX] !== 0) {
          return true;
        }
      }
    }
  }
  return false;
}

//Solidify

function solidifyPiece() {
  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 1) {
        board[y + piece.position.y][x + piece.position.x] = 1;
      }
    });
  });

  // random piece

  piece.shape = pieces[Math.floor(Math.random() * pieces.length)];

  //reset position piece
  piece.position.x = 5;
  piece.position.y = 0;

  //GameOver

  if (checkCollision()) {
    alert("Game Over :(");
    board.forEach((row) => row.fill(0));
    gameOver = true;
    return;
  }
}

// remove rows

function rowsRemove() {
  const rowsForRemove = [];
  board.forEach((row, y) => {
    if (row.every((value) => value === 1)) {
      rowsForRemove.push(y);
    }
  });

  rowsForRemove.forEach((y) => {
    board.splice(y, 1);
    const newRow = Array(BOARD_WIDTH).fill(0);
    board.unshift(newRow);
    score += 100;
  });
}

update();
