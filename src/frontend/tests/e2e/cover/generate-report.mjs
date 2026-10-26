import { mkdir, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import v8toIstanbul from 'v8-to-istanbul';
import libCoverage from 'istanbul-lib-coverage';
import libReport from 'istanbul-lib-report';
import reports from 'istanbul-reports';

const { createCoverageMap } = libCoverage;
const { createContext } = libReport;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendRoot = path.resolve(__dirname, '../../..');
const coverageRoot = path.resolve(frontendRoot, '.coverage/e2e');
const rawDir = path.resolve(coverageRoot, 'raw');

function isAppScript(url) {
  if (!url || typeof url !== 'string') {
    return false;
  }

  if (url.startsWith('extensions::') || url.startsWith('chrome-extension://') || url.startsWith('data:')) {
    return false;
  }

  return !url.includes('/node_modules/') && !url.includes('/@vite/');
}

async function listJsonFiles(dirPath) {
  const entries = await readdir(dirPath, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
    .map((entry) => path.join(dirPath, entry.name));
}

async function main() {
  await mkdir(coverageRoot, { recursive: true });

  const rawFiles = await listJsonFiles(rawDir).catch(() => []);
  if (rawFiles.length === 0) {
    console.error('No Playwright coverage artifacts found in .coverage/e2e/raw.');
    process.exit(1);
  }

  const coverageMap = createCoverageMap({});

  for (const rawFile of rawFiles) {
    const json = await readFile(rawFile, 'utf8');
    const entries = JSON.parse(json);

    for (const entry of entries) {
      if (!isAppScript(entry?.url) || !entry?.source || !Array.isArray(entry?.functions)) {
        continue;
      }

      const converter = v8toIstanbul(entry.url, 0, { source: entry.source });
      await converter.load();
      converter.applyCoverage(entry.functions);
      coverageMap.merge(converter.toIstanbul());
    }
  }

  const context = createContext({
    dir: coverageRoot,
    coverageMap,
  });

  reports.create('text-summary').execute(context);
  reports.create('json-summary').execute(context);
  reports.create('lcov').execute(context);

  console.log(`Coverage reports written to ${coverageRoot}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
