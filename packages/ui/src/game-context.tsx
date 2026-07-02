import { createContext } from 'react';

import type { BoardType, MoveType, SideType } from '@reversi/core';

import type { History } from './store';

export interface GameContextType {
  board: BoardType;
  side: SideType;
  moves: readonly MoveType[];
  hist: History;
  handlePlay(move: MoveType): void;
}

export const GameContext = createContext<GameContextType>(null);
