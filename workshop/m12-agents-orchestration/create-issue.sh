#!/usr/bin/env bash
set -euo pipefail

if ! command -v gh >/dev/null 2>&1; then
echo "GitHub CLI (gh) is required but was not found in PATH."
exit 1
fi

if [[ -z "${REPO:-}" ]]; then
REPO="$(gh repo view --json nameWithOwner --jq .nameWithOwner)"
fi

TITLE="${TITLE:-M12 Exercise 1: Agent orchestration backlog item}"
BODY="${BODY:-## Goal
Create a scoped backlog item for M12 Exercise 1 agent orchestration.

## Requested change
- Pick one small change in src/api-ts/src/routes or src/frontend/src/components.
- Define acceptance criteria.
- List the validation commands the agent must run, including the relevant build command and unit tests for the chosen scope.
- Note which tasks will be delegated to an agent.

## Reviewer checklist
- Build output was executed and reviewed.
- Unit tests were run and results were reviewed.
- Any failures or warnings were triaged before review.

## Definition of done
- Acceptance criteria are testable.
- Scope fits one pull request.
- Delegation plan is clear.
- Validation plan is explicit.}"

ISSUE_URL="$(gh issue create --repo "$REPO" --title "$TITLE" --body "$BODY")"
echo "Created issue: $ISSUE_URL"
gh issue view "$ISSUE_URL"
