import { useCallback, useEffect, useRef, useState } from 'react';

import { type MoveType, SideType } from '../core/types';
import { makeRules } from '../core/rules';
import { newBoard } from '../core/utils';

import { GameContext } from './game-context';
import { Player } from './player';
import { History } from './history';

const { BLACK } = SideType;

export function Game() {
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

  // set up the web worker for computer moves
  const worker = useRef<Worker | null>(null);

  useEffect(() => {
    worker.current = new Worker('/worker.js');
    worker.current.addEventListener(
      'message',
      (ev: { data: { move: MoveType } }) => {
        const { move } = ev.data;
        handlePlay(move);
      }
    );

    return () => {
      worker.current.terminate();
    };
  }, [handlePlay, worker]);

  // ask the worker to compute a move
  const handleComputerPlay = useCallback(() => {
    worker.current.postMessage({ board, side });
  }, [worker, board, side]);

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
      <div className="game-container">
        <Player />
        <History />
      </div>
    </GameContext.Provider>
  );
}
