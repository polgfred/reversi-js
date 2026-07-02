import { PieceType } from '@reversi/core';

import styles from './board.module.css';
import type { PieceAtCoords } from './types';

const { BLACK_PIECE } = PieceType;

export function Piece({ p }: PieceAtCoords) {
  // A two-faced "coin" that rotates between black and white.
  const side = p === BLACK_PIECE ? 'black' : 'white';

  return (
    <div className={styles.piece}>
      <div className={`${styles.pieceCoin} ${styles[side]}`}>
        <div className={`${styles.pieceFace} ${styles.black}`} />
        <div className={`${styles.pieceFace} ${styles.white}`} />
      </div>
    </div>
  );
}
