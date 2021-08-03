import { evaluate } from './evaluator';
import { SideType } from './types';
import { newBoard, newBoardFromData } from './utils';

describe('Evaluator', () => {
  it('should analyze the initial board', () => {
    expect(evaluate(newBoard())).toEqual(0);
  });
});
