import { useEffect } from 'react';

import { type BoardType, type MoveType, SideType } from '@reversi/core';

import { GameContext } from './game-context';
import { History } from './history';
import { Player } from './player';
import { useGameStore } from './store';
import styles from './styles.module.css';

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

  return (
    <GameContext.Provider value={{ board, side, moves, hist, handlePlay }}>
      <div className={styles.gameContainer}>
        <Player />
        <History />
      </div>
    </GameContext.Provider>
  );
}
