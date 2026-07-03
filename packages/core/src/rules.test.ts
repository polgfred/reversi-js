import { describe, expect, it } from 'vitest';

import { makeRules } from './rules';
import { type BoardType, SideType, PieceType } from './types';
import { newBoard, dumpBoard } from './utils';

const { BLACK, WHITE } = SideType;
const { EMPTY, BLACK_PIECE, WHITE_PIECE } = PieceType;

// build a board from 8 strings of 'X' (black), 'O' (white), '.' (empty)
function make(rows: string[]): BoardType {
  return rows.map((row) =>
    Array.from(row, (c) =>
      c === 'X' ? BLACK_PIECE : c === 'O' ? WHITE_PIECE : EMPTY
    )
  );
}

describe('Rules', () => {
  it('should initialize the board', () => {
    const { getBoard } = makeRules(newBoard());
    const board = getBoard();
    dumpBoard(board);
    expect(board[3][3]).toBe(BLACK_PIECE);
    expect(board[4][3]).toBe(WHITE_PIECE);
    expect(board[3][4]).toBe(WHITE_PIECE);
    expect(board[4][4]).toBe(BLACK_PIECE);
  });

  it('should find the moves from the initial position', () => {
    const { findMoves } = makeRules(newBoard());
    const moves = findMoves(BLACK)
      .map((move) => [...move])
      .toArray();
    expect(moves).toEqual([
      [4, 2, 0, 0, 0, 0, 0, 0, 1, 0],
      [5, 3, 0, 0, 0, 1, 0, 0, 0, 0],
      [2, 4, 0, 0, 0, 0, 1, 0, 0, 0],
      [3, 5, 0, 1, 0, 0, 0, 0, 0, 0],
    ]);
  });

  it('has moves at the opening', () => {
    const rules = makeRules(newBoard());
    expect(rules.hasMove(BLACK)).toBe(true);
  });

  // the bug that ended a game early: one side stuck must NOT mean game over
  // while the other side can still move.
  it('sees one side stuck while the other can still move', () => {
    // lone white in the corner: black can't bracket it, but white can play C1
    const rules = makeRules(
      make([
        'OX......',
        '........',
        '........',
        '........',
        '........',
        '........',
        '........',
        '........',
      ])
    );
    expect(rules.hasMove(BLACK)).toBe(false); // black is stuck...
    expect(rules.hasMove(WHITE)).toBe(true); // ...but white isn't — the game goes on
  });

  it('sees both sides stuck on a full board', () => {
    const rules = makeRules(
      make([
        'XXXXXXXX',
        'XXXXXXXX',
        'XXXXXXXX',
        'XXXXXXXX',
        'XXXXXXXX',
        'XXXXXXXX',
        'XXXXXXXX',
        'XXXXXXXX',
      ])
    );
    expect(rules.hasMove(BLACK)).toBe(false);
    expect(rules.hasMove(WHITE)).toBe(false);
  });
});
