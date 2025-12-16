import { createContext } from 'react';
import { BoardType, MoveType, SideType } from '../core/types';

export interface GameContextType {
  board: BoardType;
  side: SideType;
  moves: readonly MoveType[];
  hist: readonly MoveType[];
  handlePlay(move: MoveType): void;
  handleComputerPlay(): void;
}

export const GameContext = createContext<GameContextType>(null);
