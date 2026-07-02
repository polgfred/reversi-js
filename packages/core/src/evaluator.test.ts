import { describe, expect, it } from 'vitest';

import { makeEvaluator } from './evaluator';
import { type BoardType, PieceType } from './types';
import { newBoard } from './utils';

const O = PieceType.WHITE_PIECE;
const X = PieceType.BLACK_PIECE;
const _ = PieceType.EMPTY;

describe('evaluator', () => {
  const evaluate = makeEvaluator();

  it('scores initial position', () => {
    const board = newBoard();
    const score = evaluate(board);
    expect(score).toBe(0);
  });

  // const board = [
  //   [ _, _, _, _, _, _, _, _ ],
  //   [ _, _, _, _, _, _, _, _ ],
  //   [ _, _, _, _, _, _, _, _ ],
  //   [ _, _, _, _, _, _, _, _ ],
  //   [ _, _, _, _, _, _, _, _ ],
  //   [ _, _, _, _, _, _, _, _ ],
  //   [ _, _, _, _, _, _, _, _ ],
  //   [ _, _, _, _, _, _, _, _ ],
  // ] as BoardType;

  it('scores a midgame position', () => {
    const board = [
      [_, _, X, _, X, _, _, _],
      [_, _, O, O, X, X, _, _],
      [_, X, X, O, X, _, _, _],
      [_, _, O, O, O, _, _, _],
      [X, X, O, _, _, _, _, _],
      [_, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _],
    ] as BoardType;
    const score = evaluate(board);
    expect(score).toBeGreaterThan(0);
  });
});
