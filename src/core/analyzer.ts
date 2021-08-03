import { MoveType, BoardType, SideType } from './types';
import { makeRules } from './rules';
import { evaluate } from './evaluator';

const { BLACK, WHITE } = SideType;

// how many levels deep to search the tree
const LEVEL = 8;

export function analyze(
  board: BoardType,
  side: SideType,
  level: number = LEVEL
): readonly [MoveType, number] {
  // make sure level is valid
  if (level < 1) {
    throw new Error('level < 1');
  }

  // get the rules
  const { getBoard, getSide, findMoves, doMove } = makeRules(board, side);
  // start the descent
  return loop(level);

  // recursive traversal of the game tree
  function loop(level: number) {
    const board = getBoard();
    const side = getSide();
    // keep track of best move and score so far
    let bestMove: MoveType;
    let bestScore = -side / 0;
    // analyze counter-moves from this position
    for (const move of findMoves()) {
      // perform the move and descend a level
      const reverse = doMove(move);
      const current = level === 1 ? evaluate(board) : loop(level - 1)[1];
      reverse();
      // check if this was a better move
      if (
        (side === BLACK && current > bestScore) ||
        (side === WHITE && current < bestScore)
      ) {
        bestMove = move;
        bestScore = current;
      }
    }
    // the winning move and score for this turn
    return [bestMove, bestScore] as const;
  }
}
