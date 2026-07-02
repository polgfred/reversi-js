import { makeEvaluator } from './evaluator';
import { makeRules } from './rules';
import type { MoveType, BoardType, SideType } from './types';

// how many levels deep to search the tree
const LEVEL = 8;

// terminal (win/loss) scores live in a finite band near ±MATE so that ply
// distance can be folded in: shorter wins score better.
export const MATE = 1 << 20;

export function analyze(
  board: BoardType,
  side: SideType,
  level = LEVEL,
  evaluate = makeEvaluator()
): readonly [number, MoveType | undefined] {
  // get the rules
  const { getSide, findMoves, pass, getCounts } = makeRules(board, side);

  // remaining depth at the root, to measure how far a terminal is from here
  const rootLevel = level;

  return loop(-Infinity, +Infinity);

  // does the side to move have at least one legal move?
  function hasMove() {
    const source = findMoves();
    const { done } = source.next();
    source.return();
    return !done;
  }

  // negamax with alpha-beta: every node maximizes its own score, and a child's
  // score (from the opponent's perspective) is negated to bring it into ours.
  function loop(
    alpha: number,
    beta: number
  ): readonly [number, MoveType | undefined] {
    const side = getSide();

    // leaf node: score the position from the side-to-move's perspective
    // (SideType is +1 for black, -1 for white, and evaluate() is black-positive)
    if (level === 0) {
      return [side * evaluate(board), undefined] as const;
    }

    // best move and score so far
    let value = -Infinity;
    let play: MoveType | undefined;

    level--;

    // analyze counter-moves from this position
    const source = findMoves();
    let moved = false;
    for (const move of source) {
      moved = true;

      // score this move (negate the opponent's point of view)
      const current = -loop(-beta, -alpha)[0];

      // record the first move unconditionally, then only on improvement — so a
      // node with moves always yields a `play`, even if scores are infinite
      if (play === undefined || current > value) {
        value = current;
        play = move;
      }
      if (value >= beta) {
        source.return();
        break;
      }
      if (value > alpha) {
        alpha = value;
      }
    }

    level++;

    // no legal move: this is a pass, not a loss. hand the turn to the opponent
    // and search their reply; if they can't move either, the game is over and
    // the winner is decided by piece count. `play` stays undefined (a pass).
    if (!moved) {
      pass();
      try {
        if (hasMove()) {
          value = -loop(-beta, -alpha)[0];
        } else {
          const [cb, cw] = getCounts();
          if (cb === cw) {
            value = 0;
          } else {
            // encode ply distance so shorter wins / longer losses score better
            const distance = rootLevel - level;
            value = side * (cb > cw ? 1 : -1) * (MATE - distance);
          }
        }
      } finally {
        pass();
      }
    }

    // the winning move and score for this turn
    return [value, play] as const;
  }
}
