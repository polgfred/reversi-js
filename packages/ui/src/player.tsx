import { useCallback, useContext, useEffect } from 'react';

import { SideType, makeRules, copyBoard, type BoardType } from '@reversi/core';

import { Board } from './board';
import { GameContext } from './game-context';
import { PlayerContext } from './player-context';
import type { Coords } from './types';

const { BLACK, WHITE } = SideType;

// does `side` have any legal move on this board? (checked on a copy so the
// live game state is never disturbed)
function hasAnyMove(board: BoardType, side: SideType) {
  return !makeRules(copyBoard(board), side).findMoves().next().done;
}

export function Player() {
  const { board, side, moves, handlePlay, handlePass, handleComputerPlay } =
    useContext(GameContext);

  const canPlay = useCallback(
    ({ x, y }: Coords) => {
      switch (side) {
        case BLACK:
          return moves.some(([qx, qy]) => x === qx && y === qy);
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
        }
      }
    },
    [side, moves, handlePlay]
  );

  useEffect(() => {
    // the side to move has no legal play: pass to the opponent, unless they
    // are also stuck — in which case the game is over and we leave the board.
    if (moves.length === 0) {
      const opponent = side === BLACK ? WHITE : BLACK;
      if (hasAnyMove(board, opponent)) {
        const timer = setTimeout(handlePass, 600);
        return () => clearTimeout(timer);
      }
      return;
    }

    // the computer plays white
    if (side === WHITE) {
      const timer = setTimeout(handleComputerPlay, 1000);
      return () => clearTimeout(timer);
    }
  }, [side, moves, board, handlePass, handleComputerPlay]);

  return (
    <PlayerContext.Provider value={{ canPlay, doPlay }}>
      <Board board={board} />
    </PlayerContext.Provider>
  );
}
