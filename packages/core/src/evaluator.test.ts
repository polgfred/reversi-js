import { describe, expect, it } from 'vitest';

import { makeEvaluator } from './evaluator';
import { type BoardType, PieceType } from './types';
import { newBoard } from './utils';

const O = PieceType.WHITE_PIECE;
const X = PieceType.BLACK_PIECE;
const _ = PieceType.EMPTY;

// build an 8x8 board from 8 strings of 'X' (black), 'O' (white), '.' (empty)
function make(rows: string[]): BoardType {
  return rows.map((row) =>
    Array.from(row, (c) => (c === 'X' ? X : c === 'O' ? O : _))
  );
}

describe('evaluator', () => {
  const evaluate = makeEvaluator();

  it('scores initial position as zero', () => {
    const board = newBoard();
    const score = evaluate(board);
    expect(score).toBe(0);
  });

  describe('stability', () => {
    it('scores a corner as fully permanent', () => {
      const board = make([
        'X.......',
        '........',
        '........',
        '........',
        '........',
        '........',
        '........',
        '........',
      ]);
      // every axis anchors on an edge → 4 × 10
      expect(evaluate(board)).toBe(40);
    });

    it('is sign-symmetric between colors', () => {
      const board = make([
        'O.......',
        '........',
        '........',
        '........',
        '........',
        '........',
        '........',
        '........',
      ]);
      expect(evaluate(board)).toBe(-40);
    });

    it('anchors three axes for a mid-edge disc', () => {
      const board = make([
        '...X....',
        '........',
        '........',
        '........',
        '........',
        '........',
        '........',
        '........',
      ]);
      // three edge-anchored axes at +10; the axis running along the edge is open
      expect(evaluate(board)).toBe(30);
    });

    it('gives no credit to a disc floating in open space', () => {
      const board = make([
        '........',
        '........',
        '........',
        '...X....',
        '........',
        '........',
        '........',
        '........',
      ]);
      expect(evaluate(board)).toBe(0);
    });

    it('ranks corner > edge > center', () => {
      const corner = make([
        'X.......',
        '........',
        '........',
        '........',
        '........',
        '........',
        '........',
        '........',
      ]);
      const edge = make([
        '...X....',
        '........',
        '........',
        '........',
        '........',
        '........',
        '........',
        '........',
      ]);
      const center = make([
        '........',
        '........',
        '........',
        '...X....',
        '........',
        '........',
        '........',
        '........',
      ]);
      expect(evaluate(corner)).toBeGreaterThan(evaluate(edge));
      expect(evaluate(edge)).toBeGreaterThan(evaluate(center));
    });
  });

  describe('corner grabbing', () => {
    it('prefers taking a corner over leaving it', () => {
      // black has taken the corner, flipping a diagonal whose new discs sit
      // next to white — the exact shape the old risk gate used to over-punish
      const grabbed = make([
        'X.......',
        '.XO.....',
        '.OX.....',
        '...X....',
        '........',
        '........',
        '........',
        '........',
      ]);
      // identical layout, but black never took the corner: the diagonal is
      // still white and the corner sits empty
      const notGrabbed = make([
        '........',
        '.OO.....',
        '.OO.....',
        '...X....',
        '........',
        '........',
        '........',
        '........',
      ]);
      expect(evaluate(grabbed)).toBeGreaterThan(evaluate(notGrabbed));
    });
  });
});
