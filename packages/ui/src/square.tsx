import { type ReactNode } from 'react';

import styles from './board.module.css';
import { useGameContext } from './game-context';
import type { Coords } from './types';

export function Square({ x, y, children }: Coords & { children: ReactNode }) {
  const { canPlay, handleClick } = useGameContext();

  return canPlay({ x, y }) ? (
    <td
      className={styles.playable}
      onClick={() => {
        handleClick({ x, y });
      }}
    >
      {children}
    </td>
  ) : (
    <td>{children}</td>
  );
}
