import { MoveType, BoardType, SideType } from './types';
import { makeRules } from './rules';
import { evaluate } from './evaluator';

const { BLACK, WHITE } = SideType;

// how many levels deep to search the tree
const LEVEL = 10;

export function analyze(
  board: BoardType,
  side: SideType,
  level = LEVEL
): readonly [number, MoveType] {
  // get the rules
  const { getSide, findMoves } = makeRules(board, side);

  return loop(-Infinity, +Infinity);

  // recursive traversal of the game tree
  function loop(alpha: number, beta: number) {
    const side = getSide();

    // keep track of best move and score so far
    let value = side === BLACK ? -Infinity : +Infinity;
    let play: MoveType;

    if (level === 0) {
      value = evaluate(board);
    } else {
      level--;

      // analyze counter-moves from this position
      const source = findMoves();
      for (const move of source) {
        // get the score for this move
        const [current] = loop(alpha, beta);

        // check if we got a better score
        switch (side) {
          case BLACK:
            if (current > value) {
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
            break;
          case WHITE:
            if (current < value) {
              value = current;
              play = move;
            }
            if (value <= alpha) {
              source.return();
              break;
            }
            if (value < beta) {
              beta = value;
            }
            break;
        }
      }

      level++;
    }

    // the winning move and score for this turn
    return [value, play] as const;
  }
}
