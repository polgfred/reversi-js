import { MoveType, BoardType, SideType } from './types';
import { makeRules } from './rules';
import { evaluate } from './evaluator';

const { BLACK } = SideType;

// how many levels deep to search the tree
const LEVEL = 8;

export function analyze(
  board: BoardType,
  side: SideType,
  level = LEVEL
): readonly [number, MoveType] {
  // get the rules
  const { getSide, findMoves, getCounts } = makeRules(board, side);

  return loop(-Infinity, +Infinity);

  // recursive traversal of the game tree
  function loop(alpha: number, beta: number, pass = false) {
    const side = getSide();

    // keep track of best move and score so far
    let value = side === BLACK ? -Infinity : +Infinity;
    let play: MoveType;

    if (level === 0) {
      value = evaluate(board);
    } else {
      level--;

      // analyze counter-moves from this position
      let found = false;
      const source = findMoves();
      for (const move of source) {
        found = true;

        // get the score for this move
        const [current] = loop(-beta, -alpha);

        // check if we got a better score
        if (
          side === BLACK
            ? value === -Infinity || current > value
            : value === +Infinity || current < value
        ) {
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

      if (!found) {
        if (pass) {
          // neither player can move, so count pieces to determine the winner
          const [cb, cw] = getCounts();
          if (cb > cw) {
            value = side === BLACK ? +Infinity : -Infinity;
          } else if (cb < cw) {
            value = side === BLACK ? -Infinity : +Infinity;
          } else {
            value = 0;
          }
        }
      }

      level++;
    }

    // the winning move and score for this turn
    return [value, play] as const;
  }
}
