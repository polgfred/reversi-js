import { useCallback, useContext } from 'react';

import { SideType } from '@reversi/core';

import { Board } from './board';
import { GameContext } from './game-context';
import { PlayerContext } from './player-context';
import type { Coords } from './types';

const { BLACK } = SideType;

const defaultCanPlay = () => false;
const defaultDoPlay = () => {};

export function Player() {
  const { board, side, moves, handlePlay } = useContext(GameContext);

  const canPlay = useCallback(
    ({ x, y }: Coords) => moves.some(([qx, qy]) => x === qx && y === qy),
    [moves]
  );

  const doPlay = useCallback(
    ({ x, y }: Coords) => {
      const move = moves.find(([qx, qy]) => x === qx && y === qy);
      if (move) {
        handlePlay(move);
      }
    },
    [moves, handlePlay]
  );

  const context =
    side === BLACK
      ? { canPlay, doPlay }
      : {
          canPlay: defaultCanPlay,
          doPlay: defaultDoPlay,
        };

  return (
    <PlayerContext.Provider value={context}>
      <Board board={board} />
    </PlayerContext.Provider>
  );
}
