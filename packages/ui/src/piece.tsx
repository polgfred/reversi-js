import { PieceType } from '@reversi/core';

import type { PieceAtCoords } from './types';

const { BLACK_PIECE } = PieceType;

export function Piece({ p }: PieceAtCoords) {
  // A two-faced "coin" that rotates between black and white.
  const side = p === BLACK_PIECE ? 'black' : 'white';

  return (
    <div className="piece">
      <div className={`piece-coin ${side}`}>
        <div className="piece-face black" />
        <div className="piece-face white" />
      </div>
    </div>
  );
}
