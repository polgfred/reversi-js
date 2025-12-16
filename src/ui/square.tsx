import { ReactNode, useContext } from 'react';

import { PlayerContext } from './player-context';
import type { Coords } from './types';

export function Square({ x, y, children }: Coords & { children: ReactNode }) {
  const { canPlay, doPlay } = useContext(PlayerContext);

  return canPlay({ x, y }) ? (
    <td
      className="playable"
      onClick={() => {
        doPlay({ x, y });
      }}
    >
      {children}
    </td>
  ) : (
    <td>{children}</td>
  );
}
