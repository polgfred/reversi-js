import { copyBoard } from './utils';

import { MoveType, BoardType, SideType, PieceType } from './types';

// annoying - mutable version of Capture tuple
type MutableMoveType = [
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
  readonly findMoves: () => readonly MoveType[];
  readonly doMove: (move: MoveType) => () => void;
}

export function makeRules(_board: BoardType, side: SideType): Rules {
  // don't mutate the caller's board
  const board = copyBoard(_board);

  function findMoves() {
    // keep track of moves
    const moves: MoveType[] = [];
    // reuse capture buffer
    const move: MutableMoveType = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    // my piece value
    const mine = side === BLACK ? BLACK_PIECE : WHITE_PIECE;
    // loop through the squares
    for (let y = 0; y < 8; ++y) {
      for (let x = 0; x < 8; ++x) {
        // only empty squares are moveable
        if (board[y][x] !== EMPTY) continue;
        // whether we found a valid capture
        let found = false;
        // reset capture buffer
        move[0] = x;
        move[1] = y;
        move.fill(0, 2);
        // direction index for capture (after x, y)
        let dir = 2;
        // loop through the directions (dx, dy) from this square
        for (let dy = -1; dy <= 1; ++dy) {
          for (let dx = -1; dx <= 1; ++dx) {
            // (don't count 0, 0)
            if (dx === 0 && dy === 0) continue;
            // try to find a capture starting from (x, y)
            let nx = x;
            let ny = y;
            for (let count = 0; ; ++count) {
              nx += dx;
              ny += dy;
              // we've gone off the board, no capture
              if (nx < 0 || nx > 7 || ny < 0 || ny > 7) break;
              const p = board[ny][nx];
              // we've hit an empty square, no capture
              if (p === EMPTY) break;
              // we've hit our piece
              if (p === mine) {
                // if we've captured anything, flag it
                if (count > 0) {
                  move[dir] = count;
                  found = true;
                }
                break;
              }
            }
            ++dir;
          }
        }
        // save if any captures were found
        if (found) {
          moves.push([...move]);
        }
      }
    }
    // return the moves from this position
    return moves;
  }

  function doMove(move: MoveType) {
    // get the coords from the capture
    const [x, y] = move;
    // piece values
    const mine = side === BLACK ? BLACK_PIECE : WHITE_PIECE;
    const theirs = side === BLACK ? WHITE_PIECE : BLACK_PIECE;
    // put down the piece
    board[y][x] = mine;
    // direction index for capture (after x, y)
    let dir = 2;
    // loop through the directions (dx, dy) from this square
    for (let dy = -1; dy <= 1; ++dy) {
      for (let dx = -1; dx <= 1; ++dx) {
        // (don't count 0, 0)
        if (dx === 0 && dy === 0) continue;
        // flip `count` pieces starting from (x, y)
        let nx = x;
        let ny = y;
        for (let count = move[dir]; count > 0; --count) {
          nx += dx;
          ny += dy;
          board[ny][nx] = mine;
        }
        ++dir;
      }
      // switch sides
      side = -side;
    }

    // reverser
    return () => {
      // pick up the piece
      board[y][x] = EMPTY;
      // direction index for capture (after x, y)
      let dir = 2;
      // loop through the directions (dx, dy) from this square
      for (let dy = -1; dy <= 1; ++dy) {
        for (let dx = -1; dx <= 1; ++dx) {
          // (don't count 0, 0)
          if (dx === 0 && dy === 0) continue;
          // flip `count` pieces starting from (x, y)
          let nx = x;
          let ny = y;
          for (let count = move[dir]; count > 0; --count) {
            nx += dx;
            ny += dy;
            board[ny][nx] = theirs;
          }
          ++dir;
        }
        // switch sides
        side = -side;
      }
    };
  }

  return {
    getBoard: () => board,
    getSide: () => side,
    findMoves,
    doMove,
  };
}
