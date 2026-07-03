/* eslint-disable no-console */
// Reusable arena sweep. Edit the `players` list and settings below, then run:
//   npx tsx packages/core/src/sweep.ts
// Every player plays every other, each opening twice with colors swapped.
import { runMatch, type Player } from './arena';

// the tunings to pit against each other — edit freely
const players: Player[] = [
  { name: 'm5', config: { mobility: 5 } },
  // { name: 'm10', config: { mobility: 10 } },
  { name: 'm16', config: { mobility: 16 } },
  // { name: 'm24', config: { mobility: 24 } },
];

const OPENINGS = 30;
const LEVEL = 6;
const SEED = 21;

const acc = new Map<string, { score: number; games: number }>();
players.forEach((p) => acc.set(p.name, { score: 0, games: 0 }));

const t0 = Date.now();
for (let i = 0; i < players.length; i++) {
  for (let j = i + 1; j < players.length; j++) {
    const a = players[i];
    const b = players[j];
    const label = `${a.name} vs ${b.name}`;
    const r = runMatch(a, b, {
      openings: OPENINGS,
      level: LEVEL,
      seed: SEED,
      onGame: (d, t) => process.stdout.write(`\r${label}: ${d}/${t} games...`),
    });
    const bScore = r.games - r.aScore;
    acc.get(a.name)!.score += r.aScore;
    acc.get(a.name)!.games += r.games;
    acc.get(b.name)!.score += bScore;
    acc.get(b.name)!.games += r.games;
    process.stdout.write(
      `\r${label}: ${r.aScore}-${bScore} (${r.draws}d)          \n`
    );
  }
}
const secs = ((Date.now() - t0) / 1000).toFixed(0);

console.log(`\n=== standings (level ${LEVEL}, ${OPENINGS} openings/pairing, ${secs}s) ===`);
[...acc.entries()]
  .map(([name, s]) => ({ name, ...s, pct: (s.score / s.games) * 100 }))
  .sort((x, y) => y.pct - x.pct)
  .forEach((s) =>
    console.log(
      `${s.name.padEnd(10)} ${s.score.toString().padStart(5)}/${s.games}  ${s.pct.toFixed(1)}%`
    )
  );
