import { PieceType } from '../core/types';

const { EMPTY, BLACK_PIECE } = PieceType;

export function Piece({ p }: { p: PieceType }) {
  if (p === EMPTY) {
    return null;
  }

  const color = p === BLACK_PIECE ? '#000' : '#fff';

  return (
    <div>
      <svg width="60" height="60">
        <circle cx="30" cy="30" r="26" fill={color} />
      </svg>
    </div>
  );
}
