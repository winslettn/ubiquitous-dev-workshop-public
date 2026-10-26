param(
[string]$Repo = "",
[string]$Title = "M12 Exercise 1: Agent orchestration backlog item",
[string]$Body = @"
## Goal
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
- Validation plan is explicit.
"@
)

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
Write-Error "GitHub CLI (gh) is required but was not found in PATH."
exit 1
}

if ([string]::IsNullOrWhiteSpace($Repo)) {
$Repo = gh repo view --json nameWithOwner --jq .nameWithOwner
}

$issueUrl = gh issue create --repo $Repo --title $Title --body $Body
Write-Host "Created issue: $issueUrl"
gh issue view $issueUrl
