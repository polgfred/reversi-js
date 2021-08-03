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
  const { getBoard, getSide, findMoves, doMove } = makeRules(board, side);
  // start the descent
  return loop(level);

  // recursive traversal of the game tree
  function loop(level: number) {
    const board = getBoard();
    const side = getSide();
    let bestScore = -side / 0;
    let bestMove: MoveType;

    if (level > 0) {
      // analyze counter-moves from this position
      const moves = findMoves();
      for (const move of moves) {
        // perform the move and descend a level
        const reverse = doMove(move);
        const [, current] = loop(level - 1);
        reverse();
        // keep track of the best move from this position
        if (
          (side === BLACK && current > bestScore) ||
          (side === WHITE && current < bestScore)
        ) {
          bestMove = move;
          bestScore = current;
        }
      }
    } else {
      // we've hit bottom so just return the score for this position
      bestScore = evaluate(board);
    }
    // a pair representing the winning move and score for this turn
    return [bestMove, bestScore] as const;
  }
}
