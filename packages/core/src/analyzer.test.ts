import { describe, expect, it } from 'vitest';

import { analyze } from './analyzer';
import { SideType } from './types';
import { newBoard } from './utils';

const { BLACK } = SideType;

describe('Analyzer', () => {
  it('should run the evaluator on this position', () => {
    const board = newBoard();
    const [score, move] = analyze(board, BLACK, 1);

    expect(score).toEqual(0);
    expect(move).toEqual([4, 2, 0, 0, 0, 0, 0, 0, 1, 0]);
    // this checks that the board was put back correctly
    expect(board).toEqual(newBoard());
  });
});
