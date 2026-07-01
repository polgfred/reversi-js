/**
 * This file is the entry point for the app, it sets up the root element,
 * wires up the web worker that computes computer moves, and renders the
 * Game component to the DOM.
 *
 * It is included in `index.html`.
 */

import { createRoot } from 'preact/compat/client';

import type { BoardType, MoveType, SideType } from '@reversi/core';
import { Game } from '@reversi/ui';

import './app.css';

type Root = ReturnType<typeof createRoot>;

type WorkerResponse = {
  move: MoveType;
};

const worker = new Worker(new URL('./worker.ts', import.meta.url), {
  type: 'module',
});

function getMove(board: BoardType, side: SideType) {
  return new Promise<MoveType>((resolve) => {
    worker.onmessage = (ev: MessageEvent<WorkerResponse>) => {
      resolve(ev.data.move);
      worker.onmessage = null;
    };
    worker.postMessage({ board, side });
  });
}

const elem = document.getElementById('reversi-container')!;
const app = <Game getMove={getMove} />;

if (import.meta.hot) {
  // With hot module reloading, `import.meta.hot.data` is persisted.
  const hotData = import.meta.hot.data as { root?: Root };
  const root = (hotData.root ??= createRoot(elem));
  root.render(app);
} else {
  // The hot module reloading API is not available in production.
  createRoot(elem).render(app);
}
