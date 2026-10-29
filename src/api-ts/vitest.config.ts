/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: false,
    environment: 'node',
    coverage: {
      // Include json-summary so CI can read src/api-ts/coverage/coverage-summary.json
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.test.ts', 'src/generate-swagger.ts', 'src/init-db.ts', 'src/index.ts'],
      // Floors set just below the measured baseline (see docs/CI_TESTING.md)
      thresholds: {
        statements: 19,
        branches: 17,
        functions: 28,
        lines: 19,
        'src/routes/branch.ts': { statements: 70, branches: 30, functions: 100, lines: 70 },
        'src/repositories/branchesRepo.ts': { statements: 50, branches: 50, functions: 70, lines: 50 },
        'src/repositories/suppliersRepo.ts': { statements: 65, branches: 45, functions: 80, lines: 65 },
        'src/db/sqlite.ts': { statements: 65, branches: 55, functions: 90, lines: 65 },
      },
      reporter: ['text', 'json', 'json-summary', 'html', 'cobertura'],
    },
    exclude: ['dist/**', 'node_modules/**', 'database/**']
  },
});
