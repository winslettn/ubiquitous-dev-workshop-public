# Additional Features

**Audience:** Developers exploring security, quality, and environment acceleration capabilities

## Overview

This module introduces supporting capabilities that improve delivery quality and operational consistency. You will connect dependency, secret, and code security practices with code quality baselines, then evaluate how development containers and GitHub Codespaces improve onboarding and how the GitHub Well-Architected Framework informs design tradeoffs.

### Key Concepts

1. Security overview across dependencies, secrets, and source code.
2. Code quality overview for reliability and maintainability outcomes.
3. Development container and GitHub Codespaces setup patterns.
4. GitHub Well-Architected Framework usage for design and governance reviews.

## Exercises

### Exercise 1: View and remediate Dependabot alerts in this repository

**Objective:** Use GitHub Dependabot to identify vulnerable dependencies in `dev-workshops`, and apply a remediation.

**Hands-on:**
1. Open the repository **Security** tab and select **Dependabot alerts**. Filter by severity and package ecosystem to identify actionable alerts. Use [About Dependabot alerts](https://docs.github.com/en/code-security/dependabot/dependabot-alerts/about-dependabot-alerts) as needed.
2. Pick one alert with a clear upgrade path and review its details: affected manifest file, vulnerable versions, patched version, and advisory context.
3. Choose a remediation path:
	- Create a Dependabot security update pull request from the alert if available, or
	- Manually update the dependency version in the relevant manifest and open your own pull request.
4. Validate the remediation by running the affected project checks (for example, build and tests) and confirm no regressions.

**Knowledge Check:**
1. Which alert did you prioritize first, and what risk criteria drove that decision?
2. What remediation option did you use (Dependabot PR or manual update), and why?
3. What evidence confirms the fix is safe to merge?
4. How will you track unresolved alerts and prevent repeat exposure?

### Exercise 2: Whiteboard/Discussion on Well-Architected tradeoffs

**Objective:** Apply Well-Architected thinking to prioritize incremental repository improvements.

**Whiteboard/Discussion:**
1. Use [secure use reference for GitHub](https://docs.github.com/en/code-security/getting-started/secure-use-reference) principles to review one delivery flow in `dev-workshops`.
2. Identify one tradeoff each for security, quality, developer velocity, and governance.
3. Decide which actions belong in immediate sprint work versus backlog.
4. Define review cadence and ownership for revisiting the architecture decisions.

**Knowledge Check:**
1. Which Well-Architected pillar most changes your short-term roadmap?
2. What tradeoff did you accept, and what risk did that introduce?
3. How will you verify that chosen improvements are working?
4. What ownership model keeps the review process sustainable?

## Completion Criteria

1. You can describe a realistic security and quality baseline for this repository.
2. You can evaluate development environment readiness using devcontainer and Codespaces artifacts.
3. You can prioritize improvements using Well-Architected tradeoff analysis.
4. You can translate findings into actionable, owned implementation tasks.