import { describe, expect, it } from 'vitest';

import { evaluate } from './evaluator';
import { SideType, PieceType, type BoardType } from './types';
import { newBoard } from './utils';

const { BLACK } = SideType;
const O = PieceType.WHITE_PIECE;
const X = PieceType.BLACK_PIECE;
const _ = PieceType.EMPTY;

describe('evaluator', () => {
  it('scores initial position', () => {
    const board = newBoard();
    const score = evaluate(board, BLACK);
    expect(score).toBe(0);
  });

  it('scores a midgame position', () => {
    // prettier-ignore
    const board = [
      [ X, O, O, O, O, O, O, _ ],
      [ X, X, X, X, X, X, X, X ],
      [ X, X, X, X, X, X, X, X ],
      [ X, X, X, X, X, X, X, X ],
      [ X, X, X, X, X, X, X, X ],
      [ X, X, X, X, X, X, X, X ],
      [ X, X, X, X, X, X, X, X ],
      [ X, X, X, X, X, X, X, X ],
    ] as BoardType;
  });
});
