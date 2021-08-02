import { copyBoard } from './utils';

import { BoardType, SideType, PieceType } from './types';

type Capture = readonly [
  number, // x
  number, // y
  number, // number of pieces captured SW
  number, // number of pieces captured S
  number, // number of pieces captured SE
  number, // number of pieces captured W
  number, // unused
  number, // number of pieces captured E
  number, // number of pieces captured NW
  number, // number of pieces captured N
  number // number of pieces captured NE
];

// annoying
type MutableCapture = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number
];

const { BLACK } = SideType;
const { EMPTY, BLACK_PIECE, WHITE_PIECE } = PieceType;

export interface Rules {
  readonly getBoard: () => BoardType;
  readonly getSide: () => SideType;
  readonly findPlays: () => readonly Capture[];
  readonly doPlay: (play: Capture) => () => void;
}

export function makeRules(_board: BoardType, side: SideType): Rules {
  // don't mutate the caller's board
  const board = copyBoard(_board);

  function findPlays() {
    // keep track of captures
    const captures: Capture[] = [];
    // my piece value
    const mine = side === BLACK ? BLACK_PIECE : WHITE_PIECE;
    // loop through the squares
    for (let y = 0; y < 8; y += side) {
      for (let x = 0; x < 8; x += side) {
        // only empty squares are playable
        if (board[y][x] !== EMPTY) continue;
        const cap: MutableCapture = [x, y, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        let found = false; // whether we found a valid capture
        // loop through the directions (dx, dy) from this square
        let dir = 2; // direction index for capture
        for (let dy = -1; dy <= 1; ++dy) {
          for (let dx = -1; dx <= 1; ++dx, ++dir) {
            // (don't count 0,0)
            if (dx === 0 && dy === 0) continue;
            // count captured pieces until...
            for (let nx = x, ny = y, count = 0; ; ++count) {
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
                if (count > 0) {
                  cap[dir] = count;
                  found = true;
                }
                break;
              }
            }
          }
        }
        // if any captures were found
        if (found) {
          captures.push(cap);
        }
      }
    }
    // return the plays from this position
    return captures;
  }

  function doPlay(cap: Capture) {
    // get the coords from the capture
    const [x, y] = cap;
    // piece values
    const mine = side === BLACK ? BLACK_PIECE : WHITE_PIECE;
    const theirs = side === BLACK ? WHITE_PIECE : BLACK_PIECE;
    // put down the piece
    board[y][x] = mine;
    // loop through the directions (dx, dy) from this square
    let dir = 2; // direction index for capture
    for (let dy = -1; dy <= 1; ++dy) {
      for (let dx = -1; dx <= 1; ++dx, ++dir) {
        // (don't count 0,0)
        if (dx === 0 && dy === 0) continue;
        for (let nx = x, ny = y, count = cap[dir]; count > 0; --count) {
          nx += dx;
          ny += dy;
          // flip the piece
          board[ny][nx] = mine;
        }
      }
    }
    // reverser
    return () => {
      // pick up the piece
      board[y][x] = EMPTY;
      // loop through the directions (dx, dy) from this square
      let dir = 2; // direction index for capture
      for (let dy = -1; dy <= 1; ++dy) {
        for (let dx = -1; dx <= 1; ++dx, ++dir) {
          // (don't count 0,0)
          if (dx === 0 && dy === 0) continue;
          for (let nx = x, ny = y, count = cap[dir]; count > 0; --count) {
            nx += dx;
            ny += dy;
            // flip the piece back
            board[ny][nx] = theirs;
          }
        }
      }
    };
  }

  return {
    getBoard: () => board,
    getSide: () => side,
    findPlays,
    doPlay,
  };
}
