import { describe, expect, it } from 'vitest';

import { analyze } from './analyzer';
import { SideType, PieceType, type BoardType } from './types';
import { newBoard } from './utils';

const { BLACK } = SideType;
const O = PieceType.WHITE_PIECE;
const X = PieceType.BLACK_PIECE;

// A completely full board — nobody can move, so it's a true game over.
function fullBoard(blackRows: number): BoardType {
  return Array.from({ length: 8 }, (_, y) =>
    Array.from({ length: 8 }, () => (y < blackRows ? X : O))
  ) as unknown as BoardType;
}

describe('terminal / no-move handling', () => {
  // scores are from the side-to-move's perspective (negamax): positive = the
  // side to move is winning, and game over is decided by piece count.
  it('game over — side to move is winning => +Infinity', () => {
    // 5 rows black (40), 3 rows white (24); black to move
    const [score, move] = analyze(fullBoard(5), BLACK);
    expect(move).toBeUndefined(); // no move to make (game over)
    expect(score).toBe(+Infinity);
  });

  it('game over — side to move is losing => -Infinity', () => {
    // 3 rows black (24), 5 rows white (40); black to move
    const [score, move] = analyze(fullBoard(3), BLACK);
    expect(move).toBeUndefined();
    expect(score).toBe(-Infinity);
  });

  it('game over — tie => 0', () => {
    const [score, move] = analyze(fullBoard(4), BLACK);
    expect(move).toBeUndefined();
    expect(score).toBe(0);
  });

  it('returns a real (defined) move whenever moves exist', () => {
    const [score, move] = analyze(newBoard(), BLACK);
    expect(Number.isFinite(score)).toBe(true);
    expect(move).toBeDefined();
  });
});
