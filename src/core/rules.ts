import { copyBoard } from './utils';

import { BoardType, SideType, PieceType } from './types';

type XY = [number, number];

const { BLACK } = SideType;
const { EMPTY, BLACK_PIECE, WHITE_PIECE } = PieceType;

export interface Rules {
  readonly getBoard: () => BoardType;
  readonly getSide: () => SideType;
  readonly findPlays: () => readonly XY[];
  readonly doPlay: (play: XY) => () => void;
}

export function makeRules(_board: BoardType, side: SideType): Rules {
  // don't mutate the caller's board
  const board = copyBoard(_board);

  function findPlays() {
    // keep track of plays
    const plays = [] as XY[];
    // my piece value
    const mine = side === BLACK ? BLACK_PIECE : WHITE_PIECE;
    // loop through the squares
    for (let y = 0; y < 8; y += side) {
      for (let x = 0; x < 8; x += side) {
        // only empty squares are playable
        if (board[y][x] !== EMPTY) continue;
        // loop through the directions (dx, dy) from this square
        dirs: for (let dx = -1; dx <= 1; ++dx) {
          for (let dy = -1; dy <= 1; ++dy) {
            // (don't count 0,0)
            if (dx === 0 && dy === 0) continue;
            // start from the current square
            let nx = x;
            let ny = y;
            // the number of captures in this direction
            let captures = 0;
            // keep moving in this direction until...
            for (;;) {
              nx += dx;
              ny += dy;
              // - we've gone off the board, no capture
              if (nx < 0 || nx > 7 || ny < 0 || ny > 7) break;
              const p = board[ny][nx];
              // - we've hit an empty square, no capture
              if (p === EMPTY) break;
              // - we've hit our piece
              if (p === mine) {
                // if we've captured anything, flag it
                if (captures > 0) {
                  plays.push([x, y]);
                  break dirs;
                }
                break;
              }
              // - keep going
              ++captures;
            }
          }
        }
      }
    }
    // return the plays from this position
    return plays;
  }

  function doPlay() {
    return () => {};
  }

  return {
    getBoard: () => board,
    getSide: () => side,
    findPlays,
    doPlay,
  };
}
