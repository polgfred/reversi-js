import { ReactNode, useContext } from 'react';

import { PlayerContext } from './player-context';
import type { Coords } from './types';

export function Square({ x, y, children }: Coords & { children: ReactNode }) {
  const { canPlay, doPlay } = useContext(PlayerContext);

  return canPlay({ x, y }) ? (
    <td
      onClick={() => {
        doPlay({ x, y });
      }}
      style={{
        cursor: 'pointer',
      }}
    >
      {children}
    </td>
  ) : (
    <td>{children}</td>
  );
}
