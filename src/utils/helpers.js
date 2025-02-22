export function checkCollision(piece, board, boardWidth, boardHeight) {
  return piece.shape.some((row, y) =>
    row.some((value, x) => {
      if (!value) return false;
      const boardX = x + piece.position.x;
      const boardY = y + piece.position.y;
      return (
        boardX < 0 ||
        boardX >= boardWidth ||
        boardY >= boardHeight ||
        board[boardY]?.[boardX]
      );
    })
  );
}

export function rotateMatrix(matrix) {
  return matrix[0].map((_, i) => matrix.map((row) => row[i]).reverse());
}
