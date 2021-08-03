import { Capture, BoardType, SideType } from './types';
import { makeRules } from './rules';
import { evaluate } from './evaluator';

const { BLACK, WHITE } = SideType;

// how many levels deep to search the tree
const LEVEL = 8;

export function analyze(
  board: BoardType,
  side: SideType,
  level: number = LEVEL
): readonly [Capture, number] {
  const { getBoard, getSide, findPlays, doPlay } = makeRules(board, side);
  // start the descent
  return loop(level);

  // recursive traversal of the game tree
  function loop(level: number) {
    const board = getBoard();
    const side = getSide();
    let bestScore = -side / 0;
    let bestPlay: Capture;

    if (level > 0) {
      // analyze counter-moves from this position
      const plays = findPlays();
      for (const cap of plays) {
        // perform the play and descend a level
        const reverse = doPlay(cap);
        const [, current] = loop(level - 1);
        reverse();
        // keep track of the best move from this position
        if (
          (side === BLACK && current > bestScore) ||
          (side === WHITE && current < bestScore)
        ) {
          bestPlay = cap;
          bestScore = current;
        }
      }
    } else {
      // we've hit bottom so just return the score for this position
      bestScore = evaluate(board);
    }
    // a pair representing the winning play and score for this turn
    return [bestPlay, bestScore] as const;
  }
}
