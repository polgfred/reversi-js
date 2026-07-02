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

function GameOverOverlay({
  counts,
  onPlayAgain,
}: {
  counts: readonly [number, number];
  onPlayAgain: () => void;
}) {
  const [black, white] = counts;
  const title =
    black > white
      ? 'Black wins!'
      : white > black
        ? 'White wins!'
        : "It's a tie!";

  return (
    <div className={styles.gameOverOverlay}>
      <div className={styles.gameOverPanel}>
        <h2 className={styles.gameOverTitle}>{title}</h2>
        <p className={styles.gameOverScore}>
          {black} &ndash; {white}
        </p>
        <button className={styles.playAgainButton} onClick={onPlayAgain}>
          Play Again
        </button>
      </div>
    </div>
  );
}

export function Game({ getMove }: GameProps) {
  const { snapshot, handlePlay, handlePass, startGame } = useGameStore();
  const { board, side, moves, gameOver, counts, hist } = snapshot;
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

  useEffect(() => {
    // @ts-expect-error window object
    window.DEBUG = () => {
      const block = board
        .map(
          (row) =>
            `  [${row.map((p) => (p === 0 ? '_' : p === 1 ? 'X' : 'O')).join(', ')}],`
        )
        .join('\n');
      // eslint-disable-next-line no-console
      console.log(`const board = [\n${block}\n] as BoardType;\n`);
    };
  }, [board]);

  return (
    <GameContext.Provider
      value={{ board, side, moves, hist, canPlay, handleClick }}
    >
      <div className={styles.gameContainer}>
        <Board board={board} />
        <History />
        {gameOver && (
          <GameOverOverlay counts={counts} onPlayAgain={startGame} />
        )}
      </div>
    </GameContext.Provider>
  );
}
