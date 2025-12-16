import { motion } from 'motion/react';

import { PieceType } from '../core/types';
import type { PieceAtCoords } from './types';

const { EMPTY, BLACK_PIECE } = PieceType;

const transition = {
  duration: 0.8,
  times: [0, 0.4, 0.4, 0.8],
};

const animateBlack = {
  fill: [null, '#fff', '#000', '#000'],
  rotateY: [null, 90, 90, 180],
};

const animateWhite = {
  fill: [null, '#000', '#fff', '#fff'],
  rotateY: [null, 90, 90, 0],
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
          transition={transition}
        />
      </svg>
    </div>
  );
}
