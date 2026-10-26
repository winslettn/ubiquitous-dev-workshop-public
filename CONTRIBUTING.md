# Contributing

Thanks for contributing to the workshop curriculum.

## Scope

This repository contains:

- Participant materials in `modules/`
- Instructor materials in `docs/.instructor/`
- Shared language implementations in `src/`

Keep participant and instructor content separated per `docs/MODULE_GUIDE.md`.

## Repository maintenance model

This repository is intended to be hosted in the `octodemo-framework` GitHub
organization, following the same operating model used by
`octodemo-framework/demo_octocat_supply`.

- The canonical source repository will live under `octodemo-framework`.
- Repository content will be replicated to Microsoft-facing and partner-facing
  repositories.
- We accept pull requests and issues from Microsoft and GitHub employees.
- A cross-interest, cross-company council serves as the maintainer group for
  triage, review, and release decisions.

### Maintenance gaps and requirements

- **TBD**: Define and document the canonical repo-to-mirror replication process
  (directionality, cadence, conflict handling, and ownership).
- **TBD**: Define contributor eligibility and access verification for Microsoft
  and GitHub employees (including external collaborator scenarios).
- **TBD**: Publish council governance details (membership, rotation, quorum,
  and escalation path for deadlocks).
- **TBD**: Establish issue and PR triage SLAs (initial response, review target,
  and stale handling policy).
- **TBD**: Add/confirm required guardrails in the canonical repo:
  branch protection, required checks, CODEOWNERS, and release/tag permissions.
- **TBD**: Clarify legal/compliance requirements for inbound contributions
  (CLA/DCO and applicable policy references).
- **TBD**: Document security intake and disclosure workflow
  (`SECURITY.md`, private reporting route, and response ownership).

## Pull request expectations

1. Keep changes scoped to the modules/docs affected by your update.
2. Use consistent module naming: `mNN-{slug}`.
3. Preserve language parity when updating core participant guidance.
4. Update related docs when behavior or workflow changes.
5. Include validation notes when changing setup, test, or run instructions.

## Module authoring checklist

- Add or update `modules/mNN-*/README.md` (participant content).
- Add or update `docs/.instructor/mNN-*/SLIDES.md`, `DEMO.md`, and optional
  `INSTRUCTOR.md` as needed.
- Confirm "Next Module" links are correct.
- Ensure references and URLs are still valid.

## Validation checklist

- Run validation from `src/` for each language track you changed:
  - TypeScript API (`src/api-ts`): `make test-ts`, `make build-ts`, `make lint`
  - C# API (`src/api-cs` + `src/api-cs-tests`): `make test-cs`, `make build-cs`
  - Java API (`src/api-java`): `make test-java`, `make build-java`
  - Python API (`src/api-py`): `make test-py`, `make build-py`
  - Frontend (`src/frontend`): `make test-frontend`, `make build-frontend`,
    `make lint`
- If you modify shared schema/contracts or cross-language behavior, run all API
  variant targets (`test-ts`, `test-cs`, `test-java`, `test-py`) before
  requesting review.
- If `make` is unavailable in your environment, run the equivalent native
  commands from the matching `src/*` project directory.
