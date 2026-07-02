import { type BoardType, PieceType } from './types';

const { EMPTY, BLACK_PIECE, WHITE_PIECE } = PieceType;

const CLOSED = 0x01;
const LOCKED = 0x02;
const EDGE = 0x04;

export function evaluate(board: BoardType) {
  const state = [0, 0, 0, 0, 0, 0, 0, 0];
  let total = 0;

  function score(x: number, y: number) {
    const p = board[y][x];

    let risk = 0;
    let safe = 0;
    function scoreAxis(dir1: number, dir2: number) {
      const state1 = state[dir1];
      const state2 = state[dir2];

      if (
        (state1 === 0 && state2 & CLOSED) ||
        (state2 === 0 && state1 & CLOSED)
      ) {
        // risk of immediate capture
        risk += 5;
      } else {
        if ((state1 | state2) & EDGE) safe += 10;
        else if (state1 & state2 & LOCKED) safe += 10;
        else if ((state1 | state2) & LOCKED) safe += 5;
      }
    }

    let dir = -1;
    for (let dy = -1; dy <= +1; ++dy) {
      for (let dx = -1; dx <= +1; ++dx) {
        if (dx === 0 && dy === 0) {
          continue;
        }

        dir++;
        state[dir] = 0;

        if (
          (dy === -1 && y === 0) ||
          (dy === +1 && y === 7) ||
          (dx === -1 && x === 0) ||
          (dx === +1 && x === 7)
        ) {
          // we're on an edge
          state[dir] = EDGE | LOCKED;
          continue;
        }

        let nx = x;
        let ny = y;
        for (;;) {
          nx += dx;
          ny += dy;

          if (((nx | ny) & ~7) !== 0) {
            // we hit a wall
            state[dir] |= LOCKED;
            break;
          }

          const np = board[ny][nx];
          if (np === EMPTY) {
            // we hit an empty square
            break;
          } else if (np === -p) {
            // mark as closed, but keep going
            state[dir] |= CLOSED;
          }
        }
      }
    }

    // score each axis
    scoreAxis(0, 7); // NW <-> SE
    scoreAxis(1, 6); // N <-> S
    scoreAxis(2, 5); // NE <-> SW
    scoreAxis(3, 4); // W <-> E
    return risk > 0 ? -risk : safe;
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
