import { type BoardType, PieceType } from './types';

const { EMPTY, BLACK_PIECE, WHITE_PIECE } = PieceType;

const OPEN = 1;
const CLOSED = 2;
const LOCKED = 3;

export function evaluate(board: BoardType) {
  let total = 0;

  function score(x: number, y: number) {
    const state = [0, 0, 0, 0, 0, 0, 0, 0];
    const p = board[y][x];
    let dir = 0;

    function scoreAxis(dir1: number, dir2: number) {
      const state1 = state[dir1];
      const state2 = state[dir2];

      if (state1 === LOCKED && state2 === LOCKED) return 10;
      if (state1 === LOCKED || state2 === LOCKED) return 5;
      if (state1 === CLOSED && state2 === CLOSED) return 3;
      if (state1 === OPEN && state2 === OPEN) return 1;
      // closed -> open, risk of immediate capture
      return -3;
    }

    for (let dy = -1; dy <= 1; ++dy) {
      for (let dx = -1; dx <= 1; ++dx) {
        if (dx === 0 && dy === 0) {
          continue;
        }

        let nx = x;
        let ny = y;
        for (;;) {
          nx += dx;
          ny += dy;

          if (((nx | ny) & ~7) !== 0) {
            state[dir] = LOCKED;
            break;
          }

          const np = board[ny][nx];
          if (np === EMPTY) {
            state[dir] = OPEN;
            break;
          } else if (np === -p) {
            state[dir] = CLOSED;
            break;
          }
        }

        ++dir;
      }
    }

    return (
      scoreAxis(0, 7) + // NW <-> SE
      scoreAxis(1, 6) + // N <-> S
      scoreAxis(2, 5) + // NE <-> SW
      scoreAxis(3, 4) // W <-> E
    );
  }

  for (let y = 0; (y & ~7) === 0; ++y) {
    for (let x = 0; (x & ~7) === 0; ++x) {
      const p = board[y][x];
      switch (p) {
        case BLACK_PIECE:
          total += score(x, y);
          break;
        case WHITE_PIECE:
          total -= score(x, y);
          break;
      }
    }
  }

  return total;
}
