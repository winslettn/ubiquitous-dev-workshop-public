# Pull-request CI and coverage gates

Workflows `octosupply-frontend-ci.yml` and `octosupply-api-ts-ci.yml` run on `pull_request`,
`push` to `main`, and manual `workflow_dispatch`.

| Workflow | Triggered by changes to |
| --- | --- |
| Frontend | `src/frontend/**`, its workflow file |
| API TypeScript | `src/api-ts/**`, `src/database/**`, its workflow file |

Frontend job: `npm run build`, `npm run lint`, `npm run test:unit:coverage` (Vitest), Playwright
browser install, then `npm run test:coverage` (E2E). API job: `npm run build`, `npm run lint`,
`npm run test:coverage` (Vitest route/repository/migration tests, using temp SQLite databases).

## Coverage baseline (measured with Vitest v8, all source files included)

| Package | Statements | Branches | Functions | Lines |
| --- | --- | --- | --- | --- |
| api-ts | 19.73 | 17.47 | 28.9 | 19.55 |
| frontend (unit) | 9.33 | 3.69 | 7.14 | 9.5 |

Global thresholds in each `vitest.config.ts` are set just below these values so coverage cannot
regress, and per-file thresholds (including branches) guard the critical modules that have tests:
`routes/branch.ts`, `repositories/branchesRepo.ts`, `repositories/suppliersRepo.ts`, `db/sqlite.ts`
(API) and `components/Login.tsx` (frontend). Raise thresholds as tests are added.

## Currently untested critical files (0% coverage)

API: `routes/security.ts`, `routes/delivery.ts`, `routes/supplier.ts`, `routes/product.ts`,
`routes/order*.ts`, `routes/headquarters.ts`, `db/seed.ts`, all other repositories and `utils` error handling.
Frontend: `AuthContext.tsx`, `AdminProducts.tsx`, `ProductForm.tsx`, `Products.tsx`, `App.tsx`.
Regression tests for the related issues (#3 command injection, #4 authorization, #5 admin page
loading/retry) should be added alongside those fixes; once added, add per-file thresholds for them.

## Required checks / branch protection

Workflow changes cannot enable branch protection. A repository administrator must configure a
branch protection rule (or ruleset) for `main` requiring the status checks
`OctoSupply Frontend / build` and `OctoSupply API TypeScript / build`.
