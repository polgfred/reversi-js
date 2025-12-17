import { describe, expect, it } from 'bun:test';

import { makeRules } from './rules';
import { SideType, PieceType } from './types';
import { newBoard, dumpBoard } from './utils';

const { BLACK } = SideType;
const { BLACK_PIECE, WHITE_PIECE } = PieceType;

describe('Rules', () => {
  it('should initialize the board', () => {
    const { getBoard } = makeRules(newBoard(), BLACK);
    const board = getBoard();
    dumpBoard(board);
    expect(board[3][3]).toBe(BLACK_PIECE);
    expect(board[4][3]).toBe(WHITE_PIECE);
    expect(board[3][4]).toBe(WHITE_PIECE);
    expect(board[4][4]).toBe(BLACK_PIECE);
  });

  it('should find the moves from the initial position', () => {
    const { findMoves } = makeRules(newBoard(), BLACK);
    const moves = [...findMoves()];
    expect(moves).toEqual([
      [4, 2, 0, 0, 0, 0, 0, 0, 1, 0],
      [5, 3, 0, 0, 0, 1, 0, 0, 0, 0],
      [2, 4, 0, 0, 0, 0, 1, 0, 0, 0],
      [3, 5, 0, 1, 0, 0, 0, 0, 0, 0],
    ]);
  });
});
