import { describe, expect, it } from 'vitest';

import { analyze, MATE } from './analyzer';
import { SideType, PieceType, type BoardType } from './types';
import { newBoard } from './utils';

const { BLACK } = SideType;
const O = PieceType.WHITE_PIECE;
const X = PieceType.BLACK_PIECE;
const _ = PieceType.EMPTY;

// A completely full board — nobody can move, so it's a true game over.
function fullBoard(blackRows: number): BoardType {
  return Array.from({ length: 8 }, (_, y) =>
    Array.from({ length: 8 }, () => (y < blackRows ? X : O))
  ) as unknown as BoardType;
}

describe('terminal / no-move handling', () => {
  // scores are from the side-to-move's perspective (negamax): positive = the
  // side to move is winning, offset by distance to the game's end. an already
  // finished game is at distance 0, so it scores exactly ±MATE.
  it('game over — side to move is winning => +MATE', () => {
    // 5 rows black (40), 3 rows white (24); black to move
    const [score, move] = analyze(fullBoard(5), BLACK);
    expect(move).toBeUndefined(); // no move to make (game over)
    expect(score).toBe(MATE);
  });

  it('game over — side to move is losing => -MATE', () => {
    // 3 rows black (24), 5 rows white (40); black to move
    const [score, move] = analyze(fullBoard(3), BLACK);
    expect(move).toBeUndefined();
    expect(score).toBe(-MATE);
  });

  it('game over — tie => 0', () => {
    const [score, move] = analyze(fullBoard(4), BLACK);
    expect(move).toBeUndefined();
    expect(score).toBe(0);
  });

  it('a move that wins the game one ply out scores MATE - 1', () => {
    // one empty square; black plays [7,0], flanking the O-row against the X at
    // [0,0], filling the board all-black => black wins one ply from here.
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

    const [score, move] = analyze(board, BLACK);
    expect(move?.[0]).toBe(7); // x
    expect(move?.[1]).toBe(0); // y
    expect(score).toBe(MATE - 1);
  });

  it('returns a real (defined) move whenever moves exist', () => {
    const [score, move] = analyze(newBoard(), BLACK);
    expect(Number.isFinite(score)).toBe(true);
    expect(move).toBeDefined();
  });
});
