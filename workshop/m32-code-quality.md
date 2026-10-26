# Code Quality Monitoring and Improvement

**Audience:** Developers, GitHub administrators, and engineering leads who want to improve repository health with GitHub Code Quality findings, pull request feedback, and organization-level insights.

## Learning Objectives

- Enable GitHub Code Quality for a repository, confirm the prerequisites, and review the initial baseline of standard findings.
- Interpret reliability, maintainability, severity, and rating signals so findings can be translated into concrete remediation work.
- Use Generate fix and pull requests to remediate findings and confirm that repository quality improves after merge.
- Configure pull request thresholds and code coverage feedback so reviewers can make better merge decisions.
- Use organization-level dashboards to identify low-scoring repositories and define practical follow-up actions.

## Exercises

### Exercise 1: Enable GitHub Code Quality and assess a repository baseline

**Objective:** Turn on Code Quality, confirm the platform prerequisites, and identify the first findings that will shape your rollout plan.

**Hands-on:**
1. Enable Code Quality in the repo (reference: [Enabling GitHub Code Quality](https://docs.github.com/en/code-security/how-tos/maintain-quality-code/enable-code-quality)).
2. Open **Security and quality** > **Code quality** and review the **Standard findings** view for the default branch.
3. Review the findings, using the filters to assess the existing state based on:
   - priority,
   - affected metric (reliability or maintainability),
   - severity.

**Knowledge Check:**
1. Which prerequisites mattered most before useful results appeared?
2. Why is a pilot rollout safer than enabling strict gates everywhere on day one?

### Exercise 2: Interpret findings, severity, and ratings

**Objective:** Translate Code Quality findings into specific engineering actions and explain how those actions improve repository health.

**Hands-on:**
1. Review the Code Quality scoring model (reference: [Metrics and ratings reference](https://docs.github.com/en/code-security/reference/code-quality/metrics-and-ratings)).
2. Select one finding that affects reliability and one that affects maintainability; review the details of each including:
3. Locate an "Error" finding that effects "Reliability" and review the contents.
4. "Generate fix" for that finding and open a pull request for the update.
5. Review the change and allow the checks to complete in the PR; verify that the finding is no longer present and then merge the PR.

**Knowledge Check:**
1. How do reliability and maintainability differ in day-to-day engineering decisions?
2. Which severities should trigger immediate work versus planned backlog work?
3. What evidence would show that your remediation actually improved repository quality?

### Exercise 3: Enforce pull request thresholds

**Objective:** Create reviewer-visible quality gates that protect the default branch without blocking healthy delivery unnecessarily.

**Hands-on:**
1. Configure a ruleset (reference: [Setting code quality thresholds for pull requests](https://docs.github.com/en/code-security/how-tos/maintain-quality-code/set-pr-thresholds)) to block on Errors.
2. Repeating the steps from Exercise 2, autofix another Error-level finding and open a PR.
3. Review the PR and mark as "Ready for review." Allow the checks to run and verify that the "Merging is blocked" due to the re-introduced quality issue.

### Exercise 4: Add code coverage feedback

**Objective:** Give reviewers actionable visibility into how test coverage changes on pull requests so they can make better merge decisions.

**Hands-on:**
1. Review [Setting up code coverage for your repository](https://docs.github.com/en/code-security/how-tos/maintain-quality-code/set-up-code-coverage)) and the CI build file for your selected API language ([C#](../.github/workflows/octosupply-api-cs-ci.yml), [Java](../.github/workflows/octosupply-api-java-ci.yml), [Python](../.github/workflows/octosupply-api-py-ci.yml) or [TypeScript](../.github/workflows/octosupply-api-cs-ci.yml)).
2. Uncomment the trigger for the path and PR (lines 5-14) and push the changes into a PR; review the "Code Coverage Overview" section of the PR once the checks are complete.  Merge the PR into main so that the code coverage baseline is established in that branch.
3. There are two ways to reduce code coverage: add code without tests or remove tests. Go to one of the test files for your API and comment-out tests.  Ensure the testing still works locally, then push the changes and open a new PR.  Again, monitor the PR for the Code Coverage Overview.

**Knowledge Check:**
1. How does coverage feedback improve pull request review quality?
2. What coverage change would you consider significant enough to request follow-up?

### Exercise 5: Review organization-level results and define follow-up actions

**Objective:** Use organization-level insights to identify where quality work should be focused first and turn those insights into actionable follow-up.

**Hands-on:**
1. Open the organization-level dashboard (reference: [Exploring GitHub Code Quality results in your organization](https://docs.github.com/en/code-security/how-tos/view-and-interpret-data/analyze-organization-data/explore-code-quality)).
2. Review the score distribution chart and identify one low-scoring bubble that deserves attention.
3. Drill into the repository table and select one repository for deeper investigation.

**Knowledge Check:**
1. What did the organization dashboard reveal that a single repository view would not?
2. How would you prioritize between many low-severity findings and fewer high-severity findings?
3. What kind of follow-up action is most useful after identifying a low-scoring repository?

## Module Summary

- GitHub Code Quality gives teams a repeatable workflow: enable the feature, review the initial findings baseline, and use those results to plan a phased rollout.
- Reliability, maintainability, severity, and ratings help teams decide which findings need immediate remediation and which can be scheduled as follow-up work.
- Generate fix and pull request validation make it easier to remediate individual findings and confirm that the issue is resolved before merge.
- Rulesets and code coverage feedback add reviewer-visible signals that help protect the default branch without blocking healthy delivery unnecessarily.
- Organization-level dashboards help administrators and engineering leads compare repositories, spot low-scoring outliers, and turn those observations into targeted next actions.

## Completion Criteria

1. You can enable GitHub Code Quality for a repository, confirm the prerequisites, and assess an initial findings baseline.
2. You can interpret reliability, maintainability, severity, and rating signals and use them to prioritize remediation work.
3. You can remediate a finding with Generate fix through a pull request and explain how the resulting change improves repository quality.
4. You can configure pull request thresholds and explain how they influence merge decisions.
5. You can configure code coverage feedback and use the resulting pull request signals during review.
6. You can use organization-level dashboards to identify low-scoring repositories and propose targeted follow-up actions.
