import { describe, expect, it } from 'vitest';

import { evaluate } from './evaluator';
import { PieceType } from './types';
import { copyBoard, newBoard } from './utils';

const O = PieceType.WHITE_PIECE;
const X = PieceType.BLACK_PIECE;
const _ = PieceType.EMPTY;

describe('evaluator', () => {
  it('scores initial position', () => {
    const board = newBoard();
    const score = evaluate(board);
    expect(score).toBe(0);
  });

  // // prettier-ignore
  // const board = copyBoard([
  //   [ _, _, _, _, _, _, _, _ ],
  //   [ _, _, _, _, _, _, _, _ ],
  //   [ _, _, _, _, _, _, _, _ ],
  //   [ _, _, _, _, _, _, _, _ ],
  //   [ _, _, _, _, _, _, _, _ ],
  //   [ _, _, _, _, _, _, _, _ ],
  //   [ _, _, _, _, _, _, _, _ ],
  //   [ _, _, _, _, _, _, _, _ ],
  // ]);

  it('scores a midgame position', () => {
    // prettier-ignore
    const board = copyBoard([
      [ _, _, X, _, X, _, _, _ ],
      [ _, _, O, O, X, X, _, _ ],
      [ _, X, X, O, X, _, _, _ ],
      [ _, _, O, O, O, _, _, _ ],
      [ X, X, O, _, _, _, _, _ ],
      [ _, _, _, _, _, _, _, _ ],
      [ _, _, _, _, _, _, _, _ ],
      [ _, _, _, _, _, _, _, _ ],
    ]);
    const score = evaluate(board);
    expect(score).toBeGreaterThan(0);
  });
});
