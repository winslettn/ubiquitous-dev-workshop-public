#!/usr/bin/env bash
set -euo pipefail

if ! command -v gh >/dev/null 2>&1; then
  echo "GitHub CLI (gh) is required but was not found in PATH."
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "GitHub CLI is not authenticated. Run: gh auth login"
  exit 1
fi

if [[ -z "${REPO:-}" ]]; then
  REPO="$(gh repo view --json nameWithOwner --jq .nameWithOwner)"
fi

if [[ -z "${TITLE_PREFIX:-}" ]]; then
  TITLE_PREFIX="M11"
fi

declare -a TITLES=(
  "$TITLE_PREFIX Exercise 1: Hands-on collaboration flow"
  "$TITLE_PREFIX Exercise 2: Feature request and linked PR"
  "$TITLE_PREFIX Exercise 3: Project planning and tracking"
)

declare -a BODIES=(
"## Goal
Practice a full branch -> commit -> pull request -> merge workflow.

## Suggested acceptance criteria
- A feature branch is created.
- One documentation change is committed.
- A pull request is opened and merged.
- The feature branch is deleted after merge."
"## Goal
Use issue-driven development to deliver a tracked change.

## Suggested acceptance criteria
- A feature request is documented.
- The implementation pull request links this issue.
- Validation notes are included in the pull request.
- Issue is closed by merge."
"## Goal
Set up project-based planning and execution tracking.

## Suggested acceptance criteria
- A project is created or selected.
- Module issues are added to the project.
- One draft work item is added.
- At least one project view is configured."
)

echo "Creating module issues in $REPO..."

created_urls=()
for i in "${!TITLES[@]}"; do
  issue_url="$(gh issue create --repo "$REPO" --title "${TITLES[$i]}" --body "${BODIES[$i]}")"
  created_urls+=("$issue_url")
  echo "Created issue: $issue_url"
done

echo

echo "Issue creation complete. Add these issues to your Exercise 3 project:"
for url in "${created_urls[@]}"; do
  echo "- $url"
done
