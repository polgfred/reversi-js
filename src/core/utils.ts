import { BoardType, PieceType } from './types';

const { EMPTY, BLACK_PIECE, WHITE_PIECE } = PieceType;

export function copyBoard(board: BoardType): BoardType {
  return [
    [...board[0]],
    [...board[1]],
    [...board[2]],
    [...board[3]],
    [...board[4]],
    [...board[5]],
    [...board[6]],
    [...board[7]],
  ];
}

// utility to reverse the board rows (for easier visualization)
export function reverseBoard(board: BoardType): BoardType {
  return [
    [...board[7]],
    [...board[6]],
    [...board[5]],
    [...board[4]],
    [...board[3]],
    [...board[2]],
    [...board[1]],
    [...board[0]],
  ];
}

export function newBoard() {
  // prettier-ignore
  return reverseBoard([
   [  0,  0,  0,  0,  0,  0,  0,  0, ],
   [  0,  0,  0,  0,  0,  0,  0,  0, ],
   [  0,  0,  0,  0,  0,  0,  0,  0, ],
   [  0,  0,  0,  1, -1,  0,  0,  0, ],
   [  0,  0,  0, -1,  1,  0,  0,  0, ],
   [  0,  0,  0,  0,  0,  0,  0,  0, ],
   [  0,  0,  0,  0,  0,  0,  0,  0, ],
   [  0,  0,  0,  0,  0,  0,  0,  0, ],
  ]);
}

const xLookup = 'ABCDEFGH';
const yLookup = '12345678';
export function coordsToString(x: number, y: number) {
  return `${xLookup[x]}${yLookup[y]}`;
}

export function dumpBoard(board: BoardType) {
  // eslint-disable-next-line no-console
  console.log(
    [
      '  A B C D E F G H',
      ...board.map((row, y) =>
        [
          y + 1,
          ...Array.from(row).map((cell) => {
            switch (cell) {
              case EMPTY:
                return '.';
              case BLACK_PIECE:
                return 'X';
              case WHITE_PIECE:
                return 'O';
            }
          }),
        ].join(' ')
      ),
    ].join('\n')
  );
}
