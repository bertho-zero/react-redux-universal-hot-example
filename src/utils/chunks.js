import { readFileSync } from 'fs';
import chokidar from 'chokidar';

let chunksStats = [];

export function getChunks() {
  return chunksStats;
}

export async function waitChunks(chunksPath) {
  function setChunks(path) {
    chunksStats = JSON.parse(readFileSync(path));
  }

  const watcher = chokidar.watch(chunksPath, {
    persistent: __DEVELOPMENT__,
    awaitWriteFinish: __DEVELOPMENT__
  });

  return new Promise((resolve, reject) => {
    watcher
      .on('change', path => setChunks(path))
      .on('ready', () => {
        setChunks(chunksPath);
        resolve(chunksStats);
      })
      .on('error', reject);
  });
}
