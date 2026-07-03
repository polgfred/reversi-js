import { useState, useSyncExternalStore } from 'react';

import {
  type BoardType,
  type MoveType,
  type Rules,
  SideType,
  makeRules,
  newBoard,
} from '@reversi/core';

const { BLACK } = SideType;

export type HistEntry = MoveType | null;
export type HistRow = readonly [HistEntry, HistEntry];
export type History = readonly HistRow[];

export type GameSnapshot = {
  board: BoardType;
  side: SideType;
  counts: readonly [number, number];
  moves: readonly MoveType[];
  gameOver: boolean;
  hist: History;
};

export type GameStore = {
  snapshot: () => GameSnapshot;
  subscribe: (listener: () => void) => () => void;
  handlePlay: (move: MoveType) => void;
  handlePass: () => void;
  startGame: () => void;
};

function createGameStore(): GameStore {
  let rules: Rules;
  let hist: [HistEntry, HistEntry][];
  let snapshot: GameSnapshot;

  const events = new EventTarget();

  function readSnapshot(): GameSnapshot {
    const moves = rules
      .findMoves()
      .map((move) => [...move] as MoveType)
      .toArray();

    // if there are no moves, peek ahead to see if the game is over
    let gameOver = false;
    if (moves.length === 0) {
      rules.pass();
      gameOver = !rules.hasMove();
      rules.pass();
    }

    return {
      board: rules.getBoard(),
      side: rules.getSide(),
      counts: rules.getCounts(),
      moves,
      gameOver,
      hist: hist.map((row) => [row[0], row[1]]),
    };
  }

  function subscribe(listener: () => void) {
    events.addEventListener('change', listener);
    return () => {
      events.removeEventListener('change', listener);
    };
  }

  function publish() {
    snapshot = readSnapshot();
    events.dispatchEvent(new CustomEvent('change'));
  }

  function handlePlay(move: MoveType) {
    const moveSide = rules.getSide();
    rules.doMove(move);

    if (moveSide === BLACK) {
      hist.push([move, null]);
    } else {
      const last = hist[hist.length - 1];
      if (last && last[1] === null) {
        last[1] = move;
      } else {
        hist.push([null, move]);
      }
    }

    publish();
  }

  function handlePass() {
    rules.pass();
    publish();
  }

  function startGame() {
    rules = makeRules(newBoard(), BLACK);
    hist = [];
    publish();
  }

  startGame();

  return {
    snapshot: () => snapshot,
    subscribe,
    handlePlay,
    handlePass,
    startGame,
  };
}

export function useGameStore() {
  const [store] = useState(createGameStore);
  const snapshot = useSyncExternalStore(store.subscribe, store.snapshot);
  return {
    snapshot,
    handlePlay: store.handlePlay,
    handlePass: store.handlePass,
    startGame: store.startGame,
  };
}
