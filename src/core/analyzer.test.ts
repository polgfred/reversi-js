import { analyze } from './analyzer';
import { SideType } from './types';
import { newBoard, newBoardFromData } from './utils';

const { BLACK } = SideType;

describe('Analyzer', () => {
  it('should run the evaluator on this position', () => {
    const [move, score] = analyze(newBoard(), BLACK, 1);
    // brittle
    expect(move).toEqual([3, 2, 0, 0, 0, 0, 0, 0, 1, 0]);
    expect(score).toEqual(40);
  });
});
