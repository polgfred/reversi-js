import { describe, expect, it } from 'vitest';

import { analyze, MATE } from './analyzer';
import { makeEvaluator } from './evaluator';
import { makeRules } from './rules';
import { SideType, PieceType, type BoardType, type MoveType } from './types';
import { copyBoard, newBoard } from './utils';

const { BLACK, WHITE } = SideType;

type Evaluator = (board: BoardType) => number;

// Reference negamax with NO alpha-beta pruning, mirroring analyzer's leaf
// (side-relative positional evaluate), pass, and terminal (mate-distance piece
// count) semantics exactly. A sound alpha-beta must return the identical value.
// Uses the same evaluator instance as analyze so only pruning is under test.
function referenceValue(
  board: BoardType,
  side: SideType,
  level: number,
  evaluate: Evaluator
) {
  const rules = makeRules(board);
  const { findMoves, hasMove, getCounts } = rules;
  const rootLevel = level;

  function mm(s: SideType, lvl: number): number {
    const opp = -s as SideType;
    if (lvl === 0) {
      return s * evaluate(board);
    }

    let value = -Infinity;
    let moved = false;
    const gen = findMoves(s);
    for (let r = gen.next(); !r.done; r = gen.next()) {
      moved = true;
      value = Math.max(value, -mm(opp, lvl - 1));
    }

    if (!moved) {
      if (hasMove(opp)) {
        value = -mm(opp, lvl); // pass costs no ply, same as analyzer
      } else {
        const [cb, cw] = getCounts();
        value =
          cb === cw ? 0 : s * (cb > cw ? 1 : -1) * (MATE - (rootLevel - lvl));
      }
    }

    return value;
  }

  return mm(side, level);
}

function countEmpties(board: BoardType) {
  let n = 0;
  for (const row of board) {
    for (const cell of row) {
      if (cell === PieceType.EMPTY) {
        n++;
      }
    }
  }
  return n;
}

// Play a whole game (always taking the first legal move, passing when stuck)
// to collect positions from the opening all the way down to a true game over.
function fullGamePositions() {
  const samples: { board: BoardType; side: SideType; empties: number }[] = [];
  let board = newBoard();
  let side: SideType = BLACK;

  for (let guard = 0; guard < 200; guard++) {
    const opp: SideType = side === BLACK ? WHITE : BLACK;
    samples.push({
      board: copyBoard(board),
      side,
      empties: countEmpties(board),
    });

    const rules = makeRules(board);
    const it = rules.findMoves(side);
    const first = it.next();
    it.return(); // undo the probe move

    // legal move: make it, switch sides, and continue
    if (!first.done) {
      rules.doMove(side, first.value as MoveType);
      side = opp;
      continue;
    }

    // no legal move: pass, unless the opponent is also stuck (game over)
    if (!rules.hasMove(opp)) {
      break;
    }

    side = opp;
  }

  return samples;
}

describe('alpha-beta consistency', () => {
  it('matches a no-pruning reference minimax on every position and depth', () => {
    const game = fullGamePositions();
    const evaluate = makeEvaluator();

    const mismatches: {
      phase: string;
      empties: number;
      depth: number;
      alphaBeta: number;
      reference: number;
    }[] = [];

    const check = (
      phase: string,
      board: BoardType,
      side: SideType,
      empties: number,
      depth: number
    ) => {
      const alphaBeta = analyze(board, side, depth, evaluate)[0];
      const reference = referenceValue(board, side, depth, evaluate);
      if (alphaBeta !== reference) {
        mismatches.push({ phase, empties, depth, alphaBeta, reference });
      }
    };

    // broad, shallow check across opening/midgame positions
    for (const { board, side, empties } of game.slice(0, 14)) {
      for (const depth of [1, 2, 3, 4]) {
        check('broad', board, side, empties, depth);
      }
    }

    // deep check on near-terminal positions — a depth past the number of empty
    // squares reaches the game's end, exercising the mate-distance scoring
    for (const { board, side, empties } of game.filter(
      (s) => s.empties >= 1 && s.empties <= 8
    )) {
      check('deep', board, side, empties, empties + 2);
    }

    expect(mismatches).toEqual([]);
  });
});
