import { analyze, type BoardType, type SideType } from '@reversi/core';

// tell typescript that we're in a web worker, as the
// postMessage API is slightly different
declare const self: Worker;

self.addEventListener(
  'message',
  (ev: MessageEvent<{ board: BoardType; side: SideType }>) => {
    const { board, side } = ev.data;
    const [, move] = analyze(board, side);
    // undefined means "no legal move here" (a pass); send null across the wire
    self.postMessage({ move: move ?? null });
  },
  false
);
