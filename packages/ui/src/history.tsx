import { createRef, useLayoutEffect } from 'react';

import { SideType, type MoveType } from '@reversi/core';

import { useGameContext } from './game-context';
import styles from './styles.module.css';
import { ThinkingSpinner } from './thinking';

const { WHITE } = SideType;

const xValues = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

function moveToString(move: MoveType) {
  const [x, y] = move;
  return `${xValues[x]}${y + 1}`;
}

export function History({ gameOver }: { gameOver: boolean }) {
  const { hist, side } = useGameContext();

  const ref = createRef<HTMLDivElement>();

  useLayoutEffect(() => {
    ref.current.scrollTop = ref.current.scrollHeight;
  }, [ref]);

  return (
    <div
      ref={ref}
      className={`${styles.panelSurface} ${styles.historyContainer}`}
    >
      <table>
        <thead>
          <tr>
            <th>Black</th>
            <th>White</th>
          </tr>
        </thead>
        <tbody>
          {hist.map((row, i) => (
            <tr key={i}>
              {row.map((move, j) => {
                // an empty cell is a pass, unless it's white's slot in the
                // last row while white is still to play (the computer thinking)
                const thinking =
                  !gameOver &&
                  i === hist.length - 1 &&
                  j === 1 &&
                  side === WHITE;
                return (
                  <td
                    key={j}
                    className={thinking ? styles.thinkingCell : undefined}
                  >
                    {thinking ? (
                      <ThinkingSpinner />
                    ) : move ? (
                      moveToString(move)
                    ) : (
                      '—'
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
