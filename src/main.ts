import render from './renderer.js';

await render({
  resolution: { width: 1920, height: 1080 },
  outputDirectory: 'output',
  manifestPath: 'overlays/lower-third/lower-third.ograf',
});
