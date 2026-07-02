import { createContext, useContext } from 'react';

import type { BoardType, MoveType, SideType } from '@reversi/core';

import type { History } from './store';
import type { Coords } from './types';

export interface GameContextType {
  board: BoardType;
  side: SideType;
  moves: readonly MoveType[];
  hist: History;
  canPlay(xy: Coords): boolean;
  handleClick(xy: Coords): void;
}

export const GameContext = createContext<GameContextType>(null);

export function useGameContext() {
  const context = useContext(GameContext);
  if (!context) throw new Error('no game context');
  return context;
}
