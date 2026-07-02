import { PieceType, type BoardType } from '@reversi/core';

import boardStyles from './board.module.css';
import { Piece } from './piece';
import { Square } from './square';
import styles from './styles.module.css';

export function Board({ board }: { board: BoardType }) {
  return (
    <div className={`${styles.panelSurface} ${boardStyles.boardContainer}`}>
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
