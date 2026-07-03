import { canMoveFrom } from './rules';
import { type BoardType, PieceType, SideType } from './types';

const { BLACK, WHITE } = SideType;
const { EMPTY, BLACK_PIECE, WHITE_PIECE } = PieceType;

const CLOSED = 0x01;
const LOCKED = 0x02;
const EDGE = 0x04;

export interface EvalConfig {
  permanent: number; // axis anchored by an edge or locked on both ends
  locked: number; // axis locked on one end only (transient safety)
  mobility: number; // weight per net legal move
  risk: number; // penalty per capturable axis (0 disables the gate)
}

export const DEFAULT_CONFIG: EvalConfig = {
  permanent: 10,
  locked: 5,
  mobility: 10,
  risk: 4,
};

export function makeEvaluator(config: Partial<EvalConfig> = {}) {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  // scratchpad for evaluating piece axes
  const state = [0, 0, 0, 0, 0, 0, 0, 0];
  return (board: BoardType) => evaluate(board, state, cfg);
}

function evaluate(board: BoardType, state: number[], cfg: EvalConfig) {
  let score = 0;
  let count = 0;

  function runScores(x: number, y: number) {
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
        // risk of immediate capture (gate disabled when cfg.risk is 0)
        risk += cfg.risk;
      } else {
        if ((state1 | state2) & EDGE) safe += cfg.permanent;
        else if (state1 & state2 & LOCKED) safe += cfg.permanent;
        else if ((state1 | state2) & LOCKED) safe += cfg.locked;
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

  function netCount(x: number, y: number) {
    // net mobility from this square
    const black = canMoveFrom(board, x, y, BLACK) ? 1 : 0;
    const white = canMoveFrom(board, x, y, WHITE) ? 1 : 0;
    return black - white;
  }

  for (let y = 0; (y & ~7) === 0; ++y) {
    for (let x = 0; (x & ~7) === 0; ++x) {
      const p = board[y][x];
      switch (p) {
        case EMPTY:
          count += netCount(x, y);
          break;
        case BLACK_PIECE:
          score += runScores(x, y);
          break;
        case WHITE_PIECE:
          score -= runScores(x, y);
          break;
      }
    }
  }

  return score + cfg.mobility * count;
}
