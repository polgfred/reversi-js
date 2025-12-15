import { MoveType, BoardType, SideType } from './types';
import { makeRules } from './rules';
import { evaluate } from './evaluator';

const { BLACK } = SideType;

// how many levels deep to search the tree
const LEVEL = 8;

export function analyze(
  board: BoardType,
  side: SideType,
  level: number = LEVEL
): readonly [number, MoveType] {
  // get the rules
  const { getBoard, getSide, findMoves } = makeRules(board, side);

  // start the descent
  return loop(level);

  // recursive traversal of the game tree
  function loop(level: number) {
    const board = getBoard();
    const side = getSide();

    // keep track of best move and score so far
    let value = side === BLACK ? -Infinity : +Infinity;
    let play: MoveType;

    if (level === 0) {
      value = evaluate(board);
    } else {
      // analyze counter-moves from this position
      for (const move of findMoves()) {
        // get the score for this move
        const [current] = loop(level - 1);

        // check if we got a better score
        if (side === BLACK ? current > value : current < value) {
          play = move;
          value = current;
        }
      }
    }

    // the winning move and score for this turn
    return [value, play] as const;
  }
}
