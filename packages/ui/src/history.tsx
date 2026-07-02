import { createRef, useContext, useLayoutEffect } from 'react';

import { SideType, type MoveType } from '@reversi/core';

import { GameContext } from './game-context';
import styles from './styles.module.css';
import { ThinkingSpinner } from './thinking';

const { WHITE } = SideType;

const xValues = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

function moveToString(move: MoveType) {
  const [x, y] = move;
  return `${xValues[x]}${y + 1}`;
}

export function History() {
  const { hist, side } = useContext(GameContext);

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
                if (move) {
                  return <td key={j}>{moveToString(move)}</td>;
                }
                // an empty cell is a pass, unless it's white's slot in the
                // last row while white is still to play (the computer thinking)
                const thinking =
                  i === hist.length - 1 && j === 1 && side === WHITE;
                return <td key={j}>{thinking ? <ThinkingSpinner /> : null}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
