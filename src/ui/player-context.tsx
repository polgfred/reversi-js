import { createContext } from 'react';

import type { Coords } from './types';

export interface PlayerContextType {
  canPlay: (xy: Coords) => boolean;
  doPlay: (xy: Coords) => void;
}

export const PlayerContext = createContext<PlayerContextType>({
  canPlay: () => false,
  doPlay: () => undefined,
});
