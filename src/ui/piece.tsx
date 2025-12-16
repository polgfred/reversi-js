import classNames from 'classnames';

import { PieceType } from '../core/types';

import type { PieceAtCoords } from './types';

const { EMPTY, BLACK_PIECE } = PieceType;

function PieceElement({ color }: { color: string }) {
  return (
    <svg width="60" height="60">
      <circle cx="30" cy="30" r="28" fill={color} />
    </svg>
  );
}

export function Piece({ x, y, p }: PieceAtCoords) {
  return (
    <div
      className={classNames({
        'piece-container': true,
      })}
    >
      {p === EMPTY ? null : (
        <PieceElement color={p === BLACK_PIECE ? '#000' : '#fff'} />
      )}
    </div>
  );
}
