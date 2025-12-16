import { createRef, useCallback, useContext, useLayoutEffect } from 'react';

import type { MoveType } from '../core/types';
import { GameContext } from './game-context';
import { ThinkingSpinner } from './thinking';

const xValues = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

function moveToString(move: MoveType) {
  const [x, y] = move;
  return `${xValues[x]}${y + 1}`;
}

export function History() {
  const { hist } = useContext(GameContext);

  const ref = createRef<HTMLDivElement>();

  useLayoutEffect(() => {
    ref.current.scrollTop = ref.current.scrollHeight;
  }, [ref]);

  // pad the row if there's only one move
  const getRow = useCallback(
    (i: number) => {
      const row = hist.slice(i * 2, i * 2 + 2);
      if (row.length === 1) {
        row.push(null);
      }
      return row;
    },
    [hist]
  );

  return (
    <div ref={ref} className="history-container">
      <table>
        <thead>
          <tr>
            <th>Black</th>
            <th>White</th>
          </tr>
        </thead>
        <tbody>
          {Array(Math.ceil(hist.length / 2))
            .fill(null)
            .map((_, i) => (
              <tr key={i}>
                {getRow(i).map((move, j) => (
                  <td key={j}>
                    {move ? moveToString(move) : <ThinkingSpinner />}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
