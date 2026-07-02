import {
  analyze,
  copyBoard,
  makeEvaluator,
  type BoardType,
  type SideType,
} from '@reversi/core';

// tell typescript that we're in a web worker, as the
// postMessage API is slightly different
declare const self: Worker;

type MessageType = {
  board: BoardType;
  side: SideType;
  level?: number;
};

const evaluate = makeEvaluator();

self.addEventListener(
  'message',
  (ev: MessageEvent<MessageType>) => {
    const { board, side, level = 6 } = ev.data;
    const board2 = copyBoard(board);
    // re-pack arrays after structured clone
    const [, move] = analyze(board2, side, level, evaluate);
    // undefined means "no legal move here" (a pass); send null across the wire
    self.postMessage({ move: move ?? null });
  },
  false
);
