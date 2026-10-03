import { lstatSync, readdirSync, rmdirSync, unlinkSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outputDirectory = join(projectRoot, 'dist');

let outputStats;
try {
  outputStats = lstatSync(outputDirectory);
} catch (error) {
  if (error.code === 'ENOENT') {
    process.exit(0);
  }
  throw error;
}

if (!outputStats.isDirectory()) {
  throw new Error(`Refusing to clean ${outputDirectory}: expected a directory.`);
}

function emptyDirectory(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const entryPath = join(directory, entry.name);
    if (entry.isDirectory() && !entry.isSymbolicLink()) {
      emptyDirectory(entryPath);
      rmdirSync(entryPath);
    } else {
      unlinkSync(entryPath);
    }
  }
}

emptyDirectory(outputDirectory);
console.log('Cleaned dist/.');
