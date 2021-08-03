export type Capture = readonly [
  number, // x
  number, // y
  number, // number of pieces captured NW
  number, // number of pieces captured N
  number, // number of pieces captured NE
  number, // number of pieces captured W
  number, // number of pieces captured E
  number, // number of pieces captured SW
  number, // number of pieces captured S
  number // number of pieces captured SE
];

export type BoardType = Int8Array[];

export enum SideType {
  BLACK = 1,
  WHITE = -1,
}

export enum PieceType {
  EMPTY = 0,
  BLACK_PIECE = 1,
  WHITE_PIECE = -1,
}
