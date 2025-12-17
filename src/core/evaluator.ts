import { type BoardType, PieceType } from './types';

const { BLACK_PIECE, WHITE_PIECE } = PieceType;

// define scores for 1/8 of the board and let symmetry do the rest
const scores = [[90], [10, 5], [30, 10, 30], [20, 10, 20, 10], [], [], [], []];

for (let y = 0; (y & ~7) === 0; ++y) {
  for (let x = 0; (x & ~7) === 0; ++x) {
    // reflected values of x and y
    const rx = x ^ 7;
    const ry = y ^ 7;
    // reflect (x,y) along all 4 axes till you find the value
    scores[y][x] ??=
      scores[ry][x] ??
      scores[y][rx] ??
      scores[ry][rx] ??
      scores[x][y] ??
      scores[rx][y] ??
      scores[x][ry] ??
      scores[rx][ry];
  }
}

export function evaluate(board: BoardType) {
  let total = 0;

  for (let y = 0; y < 8; ++y) {
    for (let x = 0; x < 8; ++x) {
      const p = board[y][x];
      switch (p) {
        case BLACK_PIECE:
          total += scores[y][x];
          break;
        case WHITE_PIECE:
          total -= scores[y][x];
          break;
      }
    }
  }

  return total;
}
