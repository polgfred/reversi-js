import { useCallback, useContext } from 'react';

import { Board } from './board';
import { GameContext } from './game-context';
import { PlayerContext } from './player-context';
import type { Coords } from './types';

export function HumanPlayer() {
  const { board, moves, handlePlay } = useContext(GameContext);

  const canPlay = useCallback(
    ({ x, y }: Coords) => !!moves.find(([qx, qy]) => x === qx && y === qy),
    [moves]
  );

  const doPlay = useCallback(
    ({ x, y }: Coords) => {
      const move = moves.find(([qx, qy]) => x === qx && y === qy);
      handlePlay(move);
    },
    [moves, handlePlay]
  );

  return (
    <PlayerContext.Provider
      value={{
        canPlay,
        doPlay,
      }}
    >
      <Board board={board} />
    </PlayerContext.Provider>
  );
}
