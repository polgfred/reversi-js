import { MoveType, BoardType, SideType, PieceType } from './types';

type Mutable<T> = { -readonly [K in keyof T]: T[K] };

const { BLACK, WHITE } = SideType;
const { EMPTY, BLACK_PIECE, WHITE_PIECE } = PieceType;

type MoveGenerator = Generator<MoveType, void, void>;

export interface Rules {
  readonly getBoard: () => BoardType;
  readonly getSide: () => SideType;
  readonly findMoves: () => MoveGenerator;
  readonly doMove: (move: MoveType) => void;
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

  function* findMoves(): MoveGenerator {
    // reuse capture buffer
    const move: Mutable<MoveType> = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

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

        // whether this is a valid play (we found a capture)
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
            if (dx === 0 && dy === 0) {
              continue;
            }

            // try to find a capture starting from (x, y)
            let nx = x;
            let ny = y;
            loop: for (let count = 0; ; ++count) {
              nx += dx;
              ny += dy;

              // we've gone off the board, no capture
              if (((nx | ny) & ~7) !== 0) {
                break;
              }

              switch (board[ny][nx]) {
                case EMPTY:
                  break loop;
                case mine:
                  // if we've captured anything, flag it
                  if (count > 0) {
                    found = true;
                    move[dir] = count;
                  }
                  break loop;
                case theirs:
                  break;
              }
            }
            ++dir;
          }
        }

        if (!found) {
          // not a valid move
          continue;
        }

        try {
          // put down the piece
          board[y][x] = mine;

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
              for (let count = move[dir]; count > 0; --count) {
                nx += dx;
                ny += dy;
                board[ny][nx] = mine;
              }
              ++dir;
            }
          }

          switchSides();

          yield [...move];
        } finally {
          switchSides();

          // pick up the piece
          board[y][x] = EMPTY;

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
              for (let count = move[dir]; count > 0; --count) {
                nx += dx;
                ny += dy;
                board[ny][nx] = theirs;
              }
              ++dir;
            }
          }
        }
      }
    }
  }

  function doMove(move: MoveType) {
    // get the coords from the capture
    const [x, y] = move;

    // piece values
    const mine = side === BLACK ? BLACK_PIECE : WHITE_PIECE;

    // put down the piece
    board[y][x] = mine;

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
        for (let count = move[dir]; count > 0; --count) {
          nx += dx;
          ny += dy;
          board[ny][nx] = mine;
        }
        ++dir;
      }

      switchSides();
    }
  }

  return {
    getBoard: () => board,
    getSide: () => side,
    findMoves,
    doMove,
  };
}
