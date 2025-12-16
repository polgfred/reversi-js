import { useCallback, useContext, useEffect } from 'react';

import { SideType } from '../core/types';
import { Board } from './board';
import { GameContext } from './game-context';
import { PlayerContext } from './player-context';
import type { Coords } from './types';

const { BLACK, WHITE } = SideType;

export function Player() {
  const { board, side, moves, handlePlay, handleComputerPlay } =
    useContext(GameContext);

  const canPlay = useCallback(
    ({ x, y }: Coords) => {
      switch (side) {
        case BLACK:
          return moves.some(([qx, qy]) => x === qx && y === qy);
        case WHITE:
          return false;
      }
    },
    [side, moves]
  );

  const doPlay = useCallback(
    ({ x, y }: Coords) => {
      switch (side) {
        case BLACK: {
          const move = moves.find(([qx, qy]) => x === qx && y === qy);
          handlePlay(move);
          break;
        }
        case WHITE:
          break;
      }
    },
    [side, moves, handlePlay]
  );

  useEffect(() => {
    if (side === WHITE) {
      handleComputerPlay();
    }
  }, [side, handleComputerPlay]);

  return (
    <PlayerContext.Provider value={{ canPlay, doPlay }}>
      <Board board={board} />
    </PlayerContext.Provider>
  );
}
