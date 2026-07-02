import { useCallback } from 'react';

import { type MoveType, SideType } from '@reversi/core';

import type { GameSnapshot } from './store';
import type { Coords } from './types';

const { BLACK } = SideType;

const defaultCanPlay = () => false;
const defaultGetPlay = (): MoveType | null => null;

export function usePlayer(snapshot: GameSnapshot) {
  const { side, moves } = snapshot;

  const canPlay = useCallback(
    ({ x, y }: Coords) => moves.some(([qx, qy]) => x === qx && y === qy),
    [moves]
  );

  const getPlay = useCallback(
    ({ x, y }: Coords) => moves.find(([qx, qy]) => x === qx && y === qy),
    [moves]
  );

  return side === BLACK
    ? { canPlay, getPlay }
    : {
        canPlay: defaultCanPlay,
        getPlay: defaultGetPlay,
      };
}
