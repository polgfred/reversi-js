import { makeRules } from './rules';
import { SideType, PieceType } from './types';
import { newBoard, newBoardFromData } from './utils';

const { BLACK } = SideType;
const { BLACK_PIECE, WHITE_PIECE } = PieceType;

describe('rules', () => {
  it('should initialize the board', () => {
    const { getBoard } = makeRules(newBoard(), BLACK);
    const board = getBoard();
    expect(board[3][3]).toBe(WHITE_PIECE);
    expect(board[3][4]).toBe(BLACK_PIECE);
    expect(board[4][3]).toBe(BLACK_PIECE);
    expect(board[4][4]).toBe(WHITE_PIECE);
  });

  it('should find the plays from the initial position', () => {
    const { findPlays } = makeRules(newBoard(), BLACK);
    expect(findPlays()).toEqual([
      [3, 2],
      [2, 3],
      [5, 4],
      [4, 5],
    ]);
  });
});
