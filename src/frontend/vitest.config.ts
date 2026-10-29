import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.test.{ts,tsx}', 'src/main.tsx', 'src/vite-env.d.ts'],
      reporter: ['text', 'json-summary'],
      // Floors set just below the measured baseline (see docs/CI_TESTING.md)
      thresholds: {
        statements: 9,
        branches: 3,
        functions: 7,
        lines: 9,
        'src/components/Login.tsx': { statements: 90, branches: 60, functions: 100, lines: 90 },
      },
    },
  },
});
