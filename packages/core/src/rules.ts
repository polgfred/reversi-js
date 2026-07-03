import type { MoveType, BoardType } from './types';
import { SideType, PieceType } from './types';

type WritableMove = [number, number, ...number[]];

const { BLACK, WHITE } = SideType;
const { EMPTY, BLACK_PIECE, WHITE_PIECE } = PieceType;

type MoveGenerator = Generator<MoveType, void, void>;

export interface Rules {
  readonly getBoard: () => BoardType;
  readonly getSide: () => SideType;
  readonly findMoves: () => MoveGenerator;
  readonly hasMove: () => boolean;
  readonly doMove: (move: MoveType) => void;
  readonly pass: () => void;
  readonly getCounts: () => readonly [number, number];
}

export function makeRules(board: BoardType, side: SideType): Rules {
  function switchSides() {
    switch (side) {
      case BLACK:
        side = WHITE;
        break;
      case WHITE:
        side = BLACK;
        break;
    }
  }

  function canMove(move: WritableMove) {
    const [x, y] = move;

    // only empty squares are moveable
    if (board[y][x] !== EMPTY) {
      return false;
    }

    // whether we found a capture
    let found = false;

    // direction index for capture (after x, y)
    let dir = 2;

    // loop through the directions (dx, dy) from this square
    for (let dy = -1; dy <= 1; ++dy) {
      for (let dx = -1; dx <= 1; ++dx) {
        // (don't count 0, 0)
        if (dx === 0 && dy === 0) {
          continue;
        }

        // try to find a capture starting from (x, y)
        let nx = x;
        let ny = y;
        move[dir] = 0;
        for (let count = 0; ; ++count) {
          nx += dx;
          ny += dy;

          // we've gone off the board, no capture
          if (((nx | ny) & ~7) !== 0) {
            break;
          }

          // stop when we hit an empty square
          const p = board[ny][nx];
          if (p === EMPTY) {
            break;
          }

          // we hit our own piece
          if (p === side) {
            // see if we captured anything
            if (count > 0) {
              found = true;
              move[dir] = count;
            }
            break;
          }
        }

        ++dir;
      }
    }

    return found;
  }

  function replace(p: PieceType, move: MoveType) {
    const [x, y] = move;

    // direction index for capture (after x, y)
    let dir = 2;

    // loop through the directions (dx, dy) from this square
    for (let dy = -1; dy <= 1; ++dy) {
      for (let dx = -1; dx <= 1; ++dx) {
        // (don't count 0, 0)
        if (dx === 0 && dy === 0) {
          continue;
        }

        // flip `count` pieces starting from (x, y)
        let nx = x;
        let ny = y;
        for (let count = move[dir]; count !== 0; --count) {
          nx += dx;
          ny += dy;
          board[ny][nx] = p;
        }

        ++dir;
      }
    }
  }

  function* findMoves(): MoveGenerator {
    // reuse capture buffer
    const move: WritableMove = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    // my piece value
    const mine = side === BLACK ? BLACK_PIECE : WHITE_PIECE;
    const theirs = side === BLACK ? WHITE_PIECE : BLACK_PIECE;

    // loop through the squares
    for (let y = 0; (y & ~7) === 0; ++y) {
      for (let x = 0; (x & ~7) === 0; ++x) {
        // only empty squares are moveable
        if (board[y][x] !== EMPTY) {
          continue;
        }

        move[0] = x;
        move[1] = y;

        // see if we found a capture
        if (!canMove(move)) {
          // not a valid move
          continue;
        }

        try {
          board[y][x] = mine;
          replace(mine, move);
          switchSides();

          yield [...move];
        } finally {
          switchSides();
          board[y][x] = EMPTY;
          replace(theirs, move);
        }
      }
    }
  }

  function hasMove(): boolean {
    // efficiently test whether we can move from this position
    for (let y = 0; (y & ~7) === 0; ++y) {
      for (let x = 0; (x & ~7) === 0; ++x) {
        // only empty squares are moveable
        if (board[y][x] !== EMPTY) {
          continue;
        }

        // see if we found a capture
        for (let dy = -1; dy <= +1; ++dy) {
          for (let dx = -1; dx <= +1; ++dx) {
            if (dx === 0 && dy === 0) {
              continue;
            }

            let nx = x;
            let ny = y;
            for (let count = 0; ; ++count) {
              nx += dx;
              ny += dy;

              if (((nx | ny) & ~7) !== 0) {
                break;
              }

              const np = board[ny][nx];
              if (np === EMPTY) {
                break;
              } else if (np === side) {
                if (count > 0) return true;
                break;
              }
            }
          }
        }
      }
    }

    return false;
  }

  function doMove(move: MoveType) {
    // get the coords from the capture
    const [x, y] = move;

    // piece values
    const mine = side === BLACK ? BLACK_PIECE : WHITE_PIECE;

    // put down the piece and do the flips
    board[y][x] = mine;
    replace(mine, move);
    switchSides();
  }

  function getCounts() {
    let cb = 0;
    let cw = 0;

    // loop through the squares
    for (let y = 0; (y & ~7) === 0; ++y) {
      for (let x = 0; (x & ~7) === 0; ++x) {
        const p = board[y][x];
        if (p === BLACK_PIECE) {
          cb++;
        } else if (p === WHITE_PIECE) {
          cw++;
        }
      }
    }

    return [cb, cw] as const;
  }

  return {
    getBoard: () => board,
    getSide: () => side,
    findMoves,
    hasMove,
    doMove,
    pass: switchSides,
    getCounts,
  };
}
