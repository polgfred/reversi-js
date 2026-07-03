import type { MoveType, BoardType } from './types';
import { SideType, PieceType } from './types';

type WritableMove = [number, number, ...number[]];

const { BLACK } = SideType;
const { EMPTY, BLACK_PIECE, WHITE_PIECE } = PieceType;

type MoveGenerator = Generator<MoveType, void, void>;

export function* findMoves(board: BoardType, side: SideType): MoveGenerator {
  // capture buffer
  const move: WritableMove = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const mine: PieceType = side;
  // @ts-expect-error piece flip
  const theirs: PieceType = -mine;

  // loop through the squares
  for (let y = 0; (y & ~7) === 0; ++y) {
    for (let x = 0; (x & ~7) === 0; ++x) {
      // only empty squares are playable
      if (board[y][x] !== EMPTY) continue;

      move[0] = x;
      move[1] = y;
      if (!getCaptures(board, side, move)) continue;

      try {
        board[y][x] = mine;
        replace(board, move, mine);
        // IMPORTANT! this is live and needs to be copied by the consumer
        yield move;
      } finally {
        board[y][x] = EMPTY;
        replace(board, move, theirs);
      }
    }
  }
}

export function canMoveFrom(
  board: BoardType,
  x: number,
  y: number,
  p: PieceType
) {
  // only empty squares are moveable
  if (board[y][x] !== EMPTY) return false;

  // see if we found a capture
  for (let dy = -1; dy <= +1; ++dy) {
    for (let dx = -1; dx <= +1; ++dx) {
      // (don't count 0, 0)
      if (dx === 0 && dy === 0) continue;

      // try to find a capture starting from (x, y)
      let nx = x;
      let ny = y;
      for (let count = 0; ; ++count) {
        nx += dx;
        ny += dy;

        // we've gone off the board, no capture
        if (((nx | ny) & ~7) !== 0) break;

        // stop when we hit an empty square
        const np = board[ny][nx];
        if (np === EMPTY) break;
        // we hit our own piece
        if (np === p) {
          // see if we captured anything
          if (count > 0) return true;
          break;
        }
      }
    }
  }
}

export function hasMove(board: BoardType, side: SideType): boolean {
  // efficiently test whether we can move from this position
  for (let y = 0; (y & ~7) === 0; ++y) {
    for (let x = 0; (x & ~7) === 0; ++x) {
      if (canMoveFrom(board, x, y, side)) return true;
    }
  }
  return false;
}

export function getCaptures(
  board: BoardType,
  side: SideType,
  move: WritableMove
) {
  const [x, y] = move;

  // only empty squares are moveable
  if (board[y][x] !== EMPTY) return false;

  // whether we found a capture
  let found = false;

  // direction index for capture (after x, y)
  let dir = 2;

  // loop through the directions (dx, dy) from this square
  for (let dy = -1; dy <= 1; ++dy) {
    for (let dx = -1; dx <= 1; ++dx) {
      // (don't count 0, 0)
      if (dx === 0 && dy === 0) continue;

      // try to find a capture starting from (x, y)
      let nx = x;
      let ny = y;
      move[dir] = 0;
      for (let count = 0; ; ++count) {
        nx += dx;
        ny += dy;

        // we've gone off the board, no capture
        if (((nx | ny) & ~7) !== 0) break;

        // stop when we hit an empty square
        const p = board[ny][nx];
        if (p === EMPTY) break;
        // we hit our own piece
        if (p === side) {
          // see if we captured anything
          if (count > 0) {
            found = true;
            move[dir] = count;
          }
          break;
        }
      }

      ++dir;
    }
  }

  return found;
}

export function doMove(board: BoardType, side: SideType, move: MoveType) {
  // get the coords from the capture
  const [x, y] = move;

  // piece values
  const mine = side === BLACK ? BLACK_PIECE : WHITE_PIECE;

  // put down the piece and do the flips
  board[y][x] = mine;
  replace(board, move, mine);
}

export function replace(board: BoardType, move: MoveType, p: PieceType) {
  const [x, y] = move;

  // direction index for capture (after x, y)
  let dir = 2;

  // loop through the directions (dx, dy) from this square
  for (let dy = -1; dy <= 1; ++dy) {
    for (let dx = -1; dx <= 1; ++dx) {
      // (don't count 0, 0)
      if (dx === 0 && dy === 0) continue;

      // flip `count` pieces starting from (x, y)
      let nx = x;
      let ny = y;
      for (let count = move[dir]; count !== 0; --count) {
        nx += dx;
        ny += dy;
        board[ny][nx] = p;
      }

      ++dir;
    }
  }
}

export function getCounts(board: BoardType, counts: [number, number]) {
  counts[0] = 0;
  counts[1] = 0;

  // loop through the squares
  for (let y = 0; (y & ~7) === 0; ++y) {
    for (let x = 0; (x & ~7) === 0; ++x) {
      const p = board[y][x];
      if (p === BLACK_PIECE) counts[0]++;
      else if (p === WHITE_PIECE) counts[1]++;
    }
  }

  return counts;
}

export interface Rules {
  readonly getBoard: () => BoardType;
  readonly getCounts: () => readonly [number, number];
  readonly findMoves: (side: SideType) => MoveGenerator;
  readonly hasMove: (side: SideType) => boolean;
  readonly doMove: (side: SideType, move: MoveType) => void;
}

export function makeRules(board: BoardType): Rules {
  // reuse buffer
  const counts: [number, number] = [0, 0];

  return {
    getBoard: () => board,
    getCounts: () => getCounts(board, counts),
    findMoves: (side: SideType) => findMoves(board, side),
    hasMove: (side: SideType) => hasMove(board, side),
    doMove: (side: SideType, move: MoveType) => doMove(board, side, move),
  };
}
