import { useCallback, useState } from 'react';

import {
  type BoardType,
  type MoveType,
  SideType,
  makeRules,
  newBoard,
} from '@reversi/core';

import { GameContext } from './game-context';
import { History } from './history';
import { Player } from './player';
import styles from './styles.module.css';

const { BLACK } = SideType;

export type GetMove = (board: BoardType, side: SideType) => Promise<MoveType>;

export interface GameProps {
  getMove: GetMove;
}

export function Game({ getMove }: GameProps) {
  const [{ getBoard, getSide, findMoves, doMove }] = useState(() =>
    makeRules(newBoard(), BLACK)
  );

  const board = getBoard();
  const side = getSide();
  const moves = [...findMoves()];
  const [hist] = useState([] as MoveType[]);
  const [, setClock] = useState(0);

  // make this play, update the history, and force a re-render
  const handlePlay = useCallback(
    (move: MoveType) => {
      doMove(move);
      hist.push(move);
      setClock(Date.now());
    },
    [doMove, hist]
  );

  // ask the host to compute a move (delegated to a web worker), then play it
  const handleComputerPlay = useCallback(() => {
    getMove(board, side).then(handlePlay);
  }, [getMove, board, side, handlePlay]);

  return (
    <GameContext.Provider
      value={{
        board,
        side,
        moves,
        hist,
        handlePlay,
        handleComputerPlay,
      }}
    >
      <div className={styles.gameContainer}>
        <Player />
        <History />
      </div>
    </GameContext.Provider>
  );
}
