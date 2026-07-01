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

type RowType = [
  PieceType,
  PieceType,
  PieceType,
  PieceType,
  PieceType,
  PieceType,
  PieceType,
  PieceType,
];

export type BoardType = readonly [
  RowType,
  RowType,
  RowType,
  RowType,
  RowType,
  RowType,
  RowType,
  RowType,
];

export type MoveType = readonly [
  number, // x
  number, // y
  number, // number of pieces captured NW
  number, // number of pieces captured N
  number, // number of pieces captured NE
  number, // number of pieces captured W
  number, // number of pieces captured E
  number, // number of pieces captured SW
  number, // number of pieces captured S
  number, // number of pieces captured SE
];
