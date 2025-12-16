import { BoardType, PieceType } from '../core/types';

import { Square } from './square';
import { Piece } from './piece';

const COORDS = [0, 1, 2, 3, 4, 5, 6, 7];
const REV_COORDS = COORDS.slice().reverse();

export function Board({ board }: { board: BoardType }) {
  return (
    <div className="board-container">
      <table className="board">
        <tbody>
          {REV_COORDS.map((y) => (
            <tr key={y}>
              {COORDS.map((x) => (
                <Square key={x} x={x} y={y}>
                  {board[y][x] !== PieceType.EMPTY && (
                    <Piece x={x} y={y} p={board[y][x]} />
                  )}
                </Square>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
