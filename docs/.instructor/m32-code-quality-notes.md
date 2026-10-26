<!-- Copilot Metadata
- **Module:** m32-code-quality
- **Module Group:** Security, Quality and Resiliency (30+)
- **Audience:** Dev, GitHub Admin
- **Title:** Code Quality Monitoring and Improvement
- **Est. Duration:** 20 min. instruction / 50 min. hands-on
- **Type:** Core
- **Topics:**
  - GitHub Code Quality overview and developer/admin outcomes
  - Code quality baseline and rollout strategy
  - Repository findings, ratings, and Copilot Autofix workflow
  - Pull request thresholds, rulesets, and code coverage feedback
  - Organization dashboard monitoring and follow-up actions
  - Advanced and adjacent quality workflows
- **Docs:**
  - https://docs.github.com/en/code-security/concepts/about-code-quality
  - https://docs.github.com/en/code-security/how-tos/maintain-quality-code/enable-code-quality
  - https://docs.github.com/en/code-security/tutorials/improve-code-quality/improve-your-codebase
  - https://docs.github.com/en/code-security/reference/code-quality/metrics-and-ratings
  - https://docs.github.com/en/code-security/how-tos/maintain-quality-code/set-pr-thresholds
  - https://docs.github.com/en/code-security/how-tos/maintain-quality-code/set-up-code-coverage
  - https://docs.github.com/en/code-security/how-tos/view-and-interpret-data/analyze-organization-data/explore-code-quality
  - https://learn.microsoft.com/en-us/training/modules/configure-code-scanning/
  - https://learn.microsoft.com/en-us/contribute/content/process-pull-request
  - https://learn.microsoft.com/en-us/azure/sre-agent/github-connector
- **Demos:**
  - [OctoCat Supply: Code Quality](https://github.com/octodemo-framework/demo_octocat_supply/blob/main/demo/walkthroughs/code-quality-demo.md)
  - [Bookstore Platform](https://github.com/octodemo-framework/demo_bookstore/blob/main/README.md)
- **Source workshops:**
  - [5] Improve Quality & Maintainability - Technical Workshop — [GitHub PAF](https://miniature-adventure-vmnkp9n.pages.github.io/resources?type=guided-engagement&search=workshop)
  - [9] Accelerate PR Velocity & Quality - Technical Workshop — [GitHub PAF](https://miniature-adventure-vmnkp9n.pages.github.io/resources?type=guided-engagement&search=workshop)
  - [11] Burn Down Tech Debt — [GitHub PAF](https://miniature-adventure-vmnkp9n.pages.github.io/resources?type=guided-engagement&search=workshop)
  - [MS Learn: Configure code scanning on GitHub](https://learn.microsoft.com/en-us/training/modules/configure-code-scanning/)
- **Source slides:** docs/.instructor/slides/m32-code-quality-slides.md
-->

# M32 Code Quality Monitoring and Improvement - Instructor Materials

Use this module as the instructor facilitation guide for developers and GitHub administrators who want to monitor and improve code quality with GitHub Code Quality.

## Preparation

### Delivery priorities

1. Present the module topics in the exact sequence defined in metadata.
2. Keep explanations aligned to two outcomes: developer remediation workflows and administrator monitoring/governance workflows.
3. Reserve enough time for all lab exercises from the related workshop module.

### Demo preparation

- Review the related workshop module: `m32-code-quality.md`.
- Confirm repository and organization permissions for enabling Code Quality, editing rulesets, and viewing dashboards.
- Confirm that GitHub Actions is enabled and that your demo repository has a supported language and a recent pull request to inspect.
- Prepare one concise transition from presentation topics to hands-on work.

### Success signal

Participants can explain how GitHub Code Quality supports both pull request quality improvement and organization-level monitoring, then complete the mapped lab exercises with minimal prompting.

---

## Presentation

Duration: 20 min. instruction

- GitHub Code Quality overview and why reliability and maintainability matter
- Establishing a code quality baseline and phased rollout strategy
- Repository findings, ratings, and Copilot Autofix workflow
- Pull request thresholds, rulesets, and code coverage feedback
- Organization dashboard monitoring and follow-up actions
- Advanced and adjacent quality workflows

---

## Lab Exercises

Duration: 50 min. hands-on

1. Exercise 1: Enable GitHub Code Quality and assess a repository baseline
2. Exercise 2: Interpret findings, severity, and ratings
3. Exercise 3: Enforce pull request thresholds and add code coverage feedback
4. Exercise 4: Review organization-level results and define follow-up actions

---

## Wrap-up

Summarize key decisions, outcomes, and follow-up actions before moving to the next module.
