param(
  [string]$Repo = "",
  [string]$TitlePrefix = "M11"
)

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
  Write-Error "GitHub CLI (gh) is required but was not found in PATH."
  exit 1
}

$null = gh auth status 2>$null
if ($LASTEXITCODE -ne 0) {
  Write-Error "GitHub CLI is not authenticated. Run: gh auth login"
  exit 1
}

if ([string]::IsNullOrWhiteSpace($Repo)) {
  $Repo = gh repo view --json nameWithOwner --jq .nameWithOwner
}

$titles = @(
  "$TitlePrefix Exercise 1: Hands-on collaboration flow",
  "$TitlePrefix Exercise 2: Feature request and linked PR",
  "$TitlePrefix Exercise 3: Project planning and tracking"
)

$bodies = @(
@"
## Goal
Practice a full branch -> commit -> pull request -> merge workflow.

## Suggested acceptance criteria
- A feature branch is created.
- One documentation change is committed.
- A pull request is opened and merged.
- The feature branch is deleted after merge.
"@,
@"
## Goal
Use issue-driven development to deliver a tracked change.

## Suggested acceptance criteria
- A feature request is documented.
- The implementation pull request links this issue.
- Validation notes are included in the pull request.
- Issue is closed by merge.
"@,
@"
## Goal
Set up project-based planning and execution tracking.

## Suggested acceptance criteria
- A project is created or selected.
- Module issues are added to the project.
- One draft work item is added.
- At least one project view is configured.
"@
)

Write-Host "Creating module issues in $Repo..."

$createdUrls = @()
for ($i = 0; $i -lt $titles.Count; $i++) {
  $issueUrl = gh issue create --repo $Repo --title $titles[$i] --body $bodies[$i]
  $createdUrls += $issueUrl
  Write-Host "Created issue: $issueUrl"
}

Write-Host ""
Write-Host "Issue creation complete. Add these issues to your Exercise 3 project:"
$createdUrls | ForEach-Object { Write-Host "- $_" }
