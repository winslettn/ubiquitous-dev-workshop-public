# GitHub Enterprise (GHE) Basics

**Audience:** Developers and technical contributors new to GitHub team workflows

## Overview

This module introduces GitHub Enterprise (GHE) basics through practical team workflows in this repository. Participants practice Git version control, GitHub collaboration, pull requests, issues, and projects to build repeatable habits for day-to-day delivery. By the end, they can apply these fundamentals to plan work, propose changes, and complete reviews with clear ownership.

### Key Concepts

1. Git for local version control, branching, and commit history.
2. GitHub for shared repository workflows and collaboration.
3. Pull requests for review, discussion, and merge quality gates.
4. Issues for work definition, tracking, and ownership.
5. Projects for planning, prioritization, and execution flow visibility.

## Exercises

### Exercise 1: Hands-on collaboration flow

**Objective:** Complete a standard change workflow in `dev-workshops` from local edit through pull request merge and branch cleanup.

**Hands-on:**
1. Use [Introduction to Git](https://learn.microsoft.com/en-us/training/modules/intro-to-git/?ns-enrollment-type=Collection&ns-enrollment-id=o1njfe825p602p) and [Repositories documentation](https://docs.github.com/en/repositories) to clone this repository, create a feature branch, and commit one small documentation change in `workshop/README.md`.
2. Use [Introduction to GitHub](https://learn.microsoft.com/en-us/training/modules/introduction-to-github/?ns-enrollment-type=Collection&ns-enrollment-id=o1njfe825p602p) and [Pull requests documentation](https://docs.github.com/en/pull-requests) to open a pull request with a clear title, summary, and reviewer request.
3. Complete the review by responding to feedback, updating the branch, and merging the pull request; delete the branch after the merge.

**Knowledge Check:**
1. How did Git branching and commit history help you prepare a safe change for review?
2. Which pull request details made your change easier for a reviewer to evaluate?
3. What merge criteria did you apply before completing the pull request?
4. Why is branch cleanup important after a merge?

### Exercise 2: Hands-on feature request and fix pull request

**Objective:** Use issue-driven development to track and deliver a feature request through a linked pull request.

**Hands-on:**
1. Create a feature request issue using [Issues documentation](https://docs.github.com/en/issues) to "Add a support contact section" in `workshop/README.md`. 
2. Create a branch for the issue; implement the feature and commit with a message that references the issue.
3. Open a pull request for the fix using [Pull requests documentation](https://docs.github.com/en/pull-requests), link the issue, and include validation notes for how the fix was confirmed.
4. Complete review updates, merge the pull request, and confirm the linked issue is closed.

**Knowledge Check:**
1. How did linking the issue and pull request improve traceability and accountability?
2. What evidence in the pull request best demonstrated that the issue was implemented?
3. How does issue-first flow improve team collaboration?

### Exercise 3: Hands-on project planning and tracking

**Objective:** Set up a project to track delivery, including issues, draft work, and pull request execution.

**Hands-on:**
1. Create a new project using [Planning and tracking with projects](https://docs.github.com/en/issues/planning-and-tracking-with-projects) and add fields that support triage and execution status.
2. Run one issue-seeding script to create module support issues with `gh`:
	- Bash: `bash workshop/m11-ghe-basics/create-module-issues.sh`
	- PowerShell: `pwsh workshop/m11-ghe-basics/create-module-issues.ps1`
   The script uses the GitHub CLI (`gh`) to create three issues (one per module exercise), prints each created issue URL, and gives you a list to add into your project board.
4. Add the created module issues to the project.
5. Add one draft item for planned work that has not yet been created as an issue.

**Knowledge Check:**
1. Which project fields were most useful for managing workflow visibility?
2. Why are draft items useful before formal issues are created?
3. How does tracking pull requests alongside issues improve delivery coordination?
4. What project views would you use for daily standup versus leadership reporting?

## Completion Criteria

1. You can use Git to create a branch, commit changes, and prepare work for collaboration.
2. You can open, review, merge, and clean up pull requests and branches in GitHub.
3. You can create an issue and deliver a linked pull request that resolves it.
4. You can link issues and pull requests to preserve end-to-end traceability.
5. You can create and use projects to manage issues, draft items, and pull request progress.
