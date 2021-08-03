import { BoardType, PieceType } from './types';

const { BLACK_PIECE, WHITE_PIECE } = PieceType;

// the board is reflective along all 4 axes, so we only need to define
// scores for 1/8 of it
// prettier-ignore
const scores = [ 
	[ 90 ],
	[ 10,  5 ],
	[ 30, 10, 30 ],
	[ 20, 10, 20, 10 ],
]

export function evaluate(board: BoardType): number {
  let total = 0;
  for (let y = 0; y < 8; ++y) {
    for (let x = 0; x < 8; ++x) {
      const p = board[y][x];
      const rx = x ^ 7;
      const ry = y ^ 7;
      if (p === BLACK_PIECE) {
        total +=
          scores[y]?.[x] ??
          scores[ry]?.[x] ??
          scores[y]?.[rx] ??
          scores[ry]?.[rx] ??
          scores[x]?.[y] ??
          scores[rx]?.[y] ??
          scores[x]?.[ry] ??
          scores[rx]?.[ry] ??
          0;
      } else if (p === WHITE_PIECE) {
        total -=
          scores[y]?.[x] ??
          scores[ry]?.[x] ??
          scores[y]?.[rx] ??
          scores[ry]?.[rx] ??
          scores[x]?.[y] ??
          scores[rx]?.[y] ??
          scores[x]?.[ry] ??
          scores[rx]?.[ry] ??
          0;
      }
    }
  }
  return total;
}
