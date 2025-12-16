import { motion } from 'motion/react';

import { PieceType } from '../core/types';
import type { PieceAtCoords } from './types';

const { EMPTY, BLACK_PIECE } = PieceType;

const animateBlack = {
  fill: '#000',
  rotateY: 0,
};

const animateWhite = {
  fill: '#fff',
  rotateY: 180,
};

const duration = {
  duration: 1,
};

export function Piece({ p }: PieceAtCoords) {
  if (p === EMPTY) {
    return null;
  }

  return (
    <div>
      <svg width="60" height="60">
        <motion.circle
          cx="30"
          cy="30"
          r="26"
          initial={false}
          animate={p === BLACK_PIECE ? animateBlack : animateWhite}
          transition={duration}
        />
      </svg>
    </div>
  );
}
