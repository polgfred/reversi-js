import { analyze } from './analyzer';
import { SideType } from './types';
import { newBoard, newBoardFromData } from './utils';

const { BLACK } = SideType;

describe('Analyzer', () => {
  it('should run the evaluator on this position', () => {
    const [, score] = analyze(newBoard(), BLACK, 0);
    expect(score).toEqual(0);
  });
});
