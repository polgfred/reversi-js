import { useCallback, useEffect } from 'react';

import { type BoardType, type MoveType, SideType } from '@reversi/core';

import { Board } from './board';
import { GameContext } from './game-context';
import { History } from './history';
import { useGameStore } from './store';
import styles from './styles.module.css';
import type { Coords } from './types';
import { usePlayer } from './use-player';

const { WHITE } = SideType;

export type GetMove = (
  board: BoardType,
  side: SideType
) => Promise<MoveType | null>;

export interface GameProps {
  getMove: GetMove;
}

export function Game({ getMove }: GameProps) {
  const { snapshot, handlePlay, handlePass } = useGameStore();
  const { board, side, moves, gameOver, hist } = snapshot;
  const { canPlay, getPlay } = usePlayer(snapshot);

  // drive the turn: pass when stuck, otherwise let the computer play white
  useEffect(() => {
    if (gameOver) {
      return;
    }

    // the side to move is stuck but the game isn't over, so pass
    if (moves.length === 0) {
      const timer = setTimeout(handlePass, 600);
      return () => clearTimeout(timer);
    }

    if (side === WHITE) {
      const timer = setTimeout(() => {
        getMove(board, side).then((move) => {
          if (move) {
            handlePlay(move);
          } else {
            handlePass();
          }
        });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [board, side, moves, gameOver, getMove, handlePlay, handlePass]);

  // handle user click
  const handleClick = useCallback(
    ({ x, y }: Coords) => {
      const play = getPlay({ x, y });
      if (play) {
        handlePlay(play);
      }
    },
    [getPlay, handlePlay]
  );

  return (
    <GameContext.Provider
      value={{ board, side, moves, hist, canPlay, handleClick }}
    >
      <div className={styles.gameContainer}>
        <Board board={board} />
        <History />
      </div>
    </GameContext.Provider>
  );
}
