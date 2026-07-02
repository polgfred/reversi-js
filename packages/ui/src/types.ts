import type { PieceType } from '@reversi/core';

export interface Coords {
  x: number;
  y: number;
}

export interface PieceAtCoords extends Coords {
  p: Exclude<PieceType, 0>;
}
