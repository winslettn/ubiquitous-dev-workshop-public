import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { expect, test as base } from '@playwright/test';

const COVERAGE_DIR = path.resolve(process.cwd(), '.coverage/e2e/raw');

async function persistCoverage(coverage: unknown, testInfo: { titlePath: string[]; workerIndex: number; retry: number }) {
  await mkdir(COVERAGE_DIR, { recursive: true });

  const testName = testInfo.titlePath.join(' > ').replace(/[^a-z0-9-_ ]/gi, '').replace(/\s+/g, '-').toLowerCase();
  const fileName = `${Date.now()}-${testInfo.workerIndex}-${testInfo.retry}-${testName}.json`;
  const filePath = path.join(COVERAGE_DIR, fileName);

  await writeFile(filePath, JSON.stringify(coverage), 'utf8');
}

export const test = base.extend({
  page: async ({ page }, use, testInfo) => {
    if (process.env.PW_COVERAGE === '1') {
      await page.coverage.startJSCoverage({ resetOnNavigation: false });
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks -- Playwright fixture callback, not a React hook
    await use(page);

    if (process.env.PW_COVERAGE === '1') {
      const coverage = await page.coverage.stopJSCoverage();
      await persistCoverage(coverage, {
        titlePath: testInfo.titlePath,
        workerIndex: testInfo.workerIndex,
        retry: testInfo.retry,
      });
    }
  },
});

export { expect };
