import { BoardType, PieceType } from './types';

const { BLACK_PIECE, WHITE_PIECE } = PieceType;

// set up the initial board position
const initial: BoardType = as2DArray(new ArrayBuffer(64));
initial[3][3] = initial[4][4] = WHITE_PIECE;
initial[3][4] = initial[4][3] = BLACK_PIECE;

// make a copy of the initial board position
export function newBoard(): BoardType {
  return copyBoard(initial);
}

// only use this on boards that are backed by a shared buffer!
export function copyBoard(board: BoardType): BoardType {
  return as2DArray(board[0].buffer.slice(0));
}

// make a new board from the passed in array data
export function newBoardFromData(data: readonly PieceType[][]): BoardType {
  const board = as2DArray(new ArrayBuffer(64));
  for (let i = 0; i < 8; ++i) {
    board[i].set(data[i]);
  }
  return board;
}

// make a 2d array wrapper around a 64-byte buffer
export function as2DArray(buf: ArrayBuffer): BoardType {
  return [
    new Int8Array(buf, 0, 8),
    new Int8Array(buf, 8, 8),
    new Int8Array(buf, 16, 8),
    new Int8Array(buf, 24, 8),
    new Int8Array(buf, 32, 8),
    new Int8Array(buf, 40, 8),
    new Int8Array(buf, 48, 8),
    new Int8Array(buf, 56, 8),
  ];
}

const xLookup = 'ABCDEFGH';
const yLookup = '12345678';
export function coordsToString(x: number, y: number): string {
  return `${xLookup[x]}${yLookup[y]}`;
}
