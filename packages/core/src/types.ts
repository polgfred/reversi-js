export const SideType = {
  BLACK: 1,
  WHITE: -1,
} as const;

export type SideType = typeof SideType.BLACK | typeof SideType.WHITE;

export const PieceType = {
  EMPTY: 0,
  BLACK_PIECE: 1,
  WHITE_PIECE: -1,
} as const;

export type PieceType =
  | typeof PieceType.EMPTY
  | typeof PieceType.BLACK_PIECE
  | typeof PieceType.WHITE_PIECE;

type RowType = PieceType[];

export type BoardType = readonly RowType[];

export type MoveType = readonly [
  number, // x
  number, // y
  ...number[], // # captures in compass directions NW,N,NE,W,E,SW,S,SE
];
