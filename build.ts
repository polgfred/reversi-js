import Bun from 'bun';

await Bun.build({
  entrypoints: ['./src/index.html', './src/worker.ts'],
  format: 'esm',
  outdir: './dist',
  minify: true,
});
