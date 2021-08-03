import { BoardType, PieceType } from './types';

const { BLACK_PIECE, WHITE_PIECE } = PieceType;

// define scores for 1/8 of the board and let symmetry do the rest
const values = [[90], [10, 5], [30, 10, 30], [20, 10, 20, 10]];

// piece values for heuristic evaluator
const scores: number[][] = [[], [], [], [], [], [], [], []];
for (let y = 0; y < 8; ++y) {
  for (let x = 0; x < 8; ++x) {
    // reflected values of x and y
    const rx = x ^ 7;
    const ry = y ^ 7;
    // reflect (x,y) along all 4 axes till you find the value
    scores[y][x] =
      values[y]?.[x] ??
      values[ry]?.[x] ??
      values[y]?.[rx] ??
      values[ry]?.[rx] ??
      values[x]?.[y] ??
      values[rx]?.[y] ??
      values[x]?.[ry] ??
      values[rx]?.[ry] ??
      0;
  }
}

export function evaluate(board: BoardType): number {
  let total = 0;
  for (let y = 0; y < 8; ++y) {
    for (let x = 0; x < 8; ++x) {
      const p = board[y][x];
      if (p === BLACK_PIECE) {
        total += scores[y][x];
      } else if (p === WHITE_PIECE) {
        total -= scores[y][x];
      }
    }
  }
  return total;
}
