import { fileURLToPath } from 'node:url';

import {
  analyze,
  type BoardType,
  copyBoard,
  type EvalConfig,
  makeEvaluator,
  makeRules,
  type MoveType,
  newBoard,
  SideType,
} from '@reversi/core';

const { BLACK } = SideType;

// a tunable opponent: a name plus whatever evaluator weights it overrides
export interface Player {
  readonly name: string;
  readonly config: Partial<EvalConfig>;
}

export type GameResult = 'black' | 'white' | 'draw';

type EvalFn = (board: BoardType) => number;

// small seeded PRNG so matches are reproducible and both color assignments of
// an opening share the same random line
function mulberry32(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// play a random legal line to diversify openings (deterministic search would
// otherwise replay the same game every time)
function randomOpening(plies: number, rand: () => number): MoveType[] {
  const rules = makeRules(newBoard(), BLACK);
  const moves: MoveType[] = [];
  for (let i = 0; i < plies; i++) {
    const legal = rules
      .findMoves()
      .map((move) => [...move] as MoveType)
      .toArray();
    if (legal.length === 0) break;
    const move = legal[Math.floor(rand() * legal.length)];
    rules.doMove(move);
    moves.push(move);
  }
  return moves;
}

// play one game to completion; returns the winner by final disc count
export function playGame(
  blackEval: EvalFn,
  whiteEval: EvalFn,
  level: number,
  opening: MoveType[] = []
): { result: GameResult; black: number; white: number } {
  const rules = makeRules(newBoard(), BLACK);
  for (const move of opening) rules.doMove(move);

  let passes = 0;
  while (passes < 2) {
    const side = rules.getSide();
    const evaluate = side === BLACK ? blackEval : whiteEval;
    // hand the search a copy so it can never corrupt the live game board
    const [, move] = analyze(
      copyBoard(rules.getBoard()),
      side,
      level,
      evaluate
    );
    if (move === undefined) {
      rules.pass();
      passes++;
    } else {
      rules.doMove(move);
      passes = 0;
    }
  }

  const [black, white] = rules.getCounts();
  const result: GameResult =
    black > white ? 'black' : white > black ? 'white' : 'draw';
  return { result, black, white };
}

export interface MatchResult {
  games: number;
  aWins: number;
  bWins: number;
  draws: number;
  aScore: number; // win = 1, draw = 0.5
}

// play `a` against `b` over `openings` random lines, each played twice with
// colors swapped for fairness
export function runMatch(
  a: Player,
  b: Player,
  {
    openings = 10,
    openingPlies = 6,
    level = 4,
    seed = 1,
    onGame,
  }: {
    openings?: number;
    openingPlies?: number;
    level?: number;
    seed?: number;
    onGame?: (done: number, total: number) => void;
  } = {}
): MatchResult {
  const rand = mulberry32(seed);
  const aEval = makeEvaluator(a.config);
  const bEval = makeEvaluator(b.config);

  let aWins = 0;
  let bWins = 0;
  let draws = 0;

  const tally = (aIsBlack: boolean, result: GameResult) => {
    if (result === 'draw') draws++;
    else if ((result === 'black') === aIsBlack) aWins++;
    else bWins++;
  };

  const total = openings * 2;
  let done = 0;
  for (let i = 0; i < openings; i++) {
    const opening = randomOpening(openingPlies, rand);
    tally(true, playGame(aEval, bEval, level, opening).result);
    onGame?.(++done, total);
    tally(false, playGame(bEval, aEval, level, opening).result);
    onGame?.(++done, total);
  }

  return {
    games: openings * 2,
    aWins,
    bWins,
    draws,
    aScore: aWins + draws * 0.5,
  };
}

// run directly with `npx tsx src/arena.ts` (env: LEVEL, OPENINGS, SEED)
function main() {
  const a: Player = { name: 'risk-off', config: { risk: 0 } };
  const b: Player = { name: 'risk-on', config: { risk: 5 } };

  const level = Number(process.env.LEVEL ?? 4);
  const openings = Number(process.env.OPENINGS ?? 10);
  const seed = Number(process.env.SEED ?? 1);

  process.stdout.write(
    `\n${a.name} vs ${b.name}  —  level ${level}, ` +
      `${openings} openings ×2 (colors swapped)\n\n`
  );

  const t0 = Date.now();
  const r = runMatch(a, b, { openings, level, seed });
  const secs = ((Date.now() - t0) / 1000).toFixed(1);

  const pct = ((r.aScore / r.games) * 100).toFixed(0);
  process.stdout.write(
    `  ${a.name}: ${r.aWins}   ${b.name}: ${r.bWins}   draws: ${r.draws}\n` +
      `  ${a.name} score: ${r.aScore}/${r.games} (${pct}%)   [${secs}s]\n\n`
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
