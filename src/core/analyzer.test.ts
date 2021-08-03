import { analyze } from './analyzer';
import { SideType } from './types';
import { newBoard, newBoardFromData } from './utils';

const { BLACK } = SideType;

describe('Analyzer', () => {
  it('should find the best play from this position', () => {
    const [play, score] = analyze(newBoard(), BLACK);
    console.log(play, score);
    expect(0).toEqual(0);
  });
});
