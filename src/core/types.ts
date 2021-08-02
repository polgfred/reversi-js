export interface CoordsType {
  x: number;
  y: number;
}
export type BoardType = Int8Array[];
export type FormationType = readonly [number, number, PieceType][];
export type ScoresType = readonly [FormationType, number][][][];

export enum SideType {
  BLACK = 1,
  WHITE = -1,
}

export enum PieceType {
  EMPTY = 0,
  BLACK_PIECE = 1,
  WHITE_PIECE = -1,
}
