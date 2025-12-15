import { describe, expect, it } from 'bun:test';

import { analyze } from './analyzer';
import { SideType } from './types';
import { newBoard } from './utils';

const { BLACK } = SideType;

describe('Analyzer', () => {
  it('should run the evaluator on this position', () => {
    const [score, move] = analyze(newBoard(), BLACK, 1);
    // brittle
    expect(move).toEqual([3, 2, 0, 0, 0, 0, 0, 0, 1, 0]);
    expect(score).toEqual(40);
  });
});
