import { PieceType, type BoardType } from '@reversi/core';

import { Piece } from './piece';
import { Square } from './square';

export function Board({ board }: { board: BoardType }) {
  return (
    <div className="board-container">
      <table>
        <tbody>
          {board
            .map((row, y) => (
              <tr key={y}>
                {row.map((p, x) => (
                  <Square key={x} x={x} y={y}>
                    {p === PieceType.EMPTY ? null : <Piece x={x} y={y} p={p} />}
                  </Square>
                ))}
              </tr>
            ))
            .reverse()}
        </tbody>
      </table>
    </div>
  );
}
