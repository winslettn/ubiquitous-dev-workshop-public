# Application Security Monitoring and Remediation

**Audience:** Developers

## Learning Objectives

- Understand common application security vulnerabilities and their impact.
- Monitor and remediate dependency vulnerabilities with Dependabot.
- Detect and fix code vulnerabilities with Code Scanning and CodeQL Autofix.
- Prevent and respond to leaked secrets with Secret Scanning and Push Protection.
- Apply a consistent triage and remediation workflow across all vulnerability types.


## Exercises

### Exercise 1: Dependabot alert triage and remediation

**Objective:** Review dependency vulnerabilities, process automated security updates, and build a repeatable remediation workflow for Dependabot alerts.

**Hands-on:**
1. Verify **Dependency graph** is enabled for the repository.
2. Identify a vulnerable dependency (reference:  [Dependabot alerts](https://docs.github.com/en/code-security/how-tos/manage-security-alerts/manage-dependabot-alerts/view-dependabot-alerts)); note the package, vulnerable version, severity, and patched version.
3. Open the related security update pull request, or create a branch that updates the dependency to the minimum safe version.
4. Review the pull request with **Dependency Review** (reference: [Dependency review](https://docs.github.com/en/code-security/concepts/supply-chain-security/dependency-review)) and confirm the change does not add new vulnerable dependencies.
5. Merge the fix, or record why the alert should be scheduled or dismissed, including owner and due date.

**Knowledge Check:**
1. How do Dependabot alerts and pull requests help reduce supply-chain risk over time?
2. Which criteria determine whether an alert should be patched immediately versus scheduled?
3. What PR guardrails prevent unsafe dependency updates from being merged?
4. How does Dependency Review strengthen the pull request review process?

### Exercise 2: Secret Scanning and Push Protection

**Objective:** Enable secret scanning controls, prevent secrets from being pushed, and define a response process for leaked credentials.

**Hands-on:**
1. Enable **Secret scanning** and **Push protection** in **Settings** > **Code security and analysis** (reference: [Secret scanning](https://docs.github.com/en/code-security/concepts/secret-security/secret-scanning)).
2. Open one alert in **Security** > **Secret scanning** and note the secret type, whether it is a true positive, and any validity details GitHub provides.
3. Revoke or rotate the exposed credential, then remove it from the branch or commits as needed before closing the alert.
4. Trigger or review a blocked push (reference: [Push protection on the command line](https://docs.github.com/en/code-security/how-tos/secure-your-secrets/work-with-leak-prevention/push-protection-on-the-command-line)), then note the approved bypass reasons and who can approve a bypass in your environment.
5. If your organization uses custom token formats, identify one secret pattern GitHub should detect.

**Knowledge Check:**
1. What is the difference between alert detection and push protection prevention?
2. Which remediation actions are mandatory before closing a true-positive secret alert?
3. When should a custom secret pattern be added?
4. What evidence must be captured for post-incident review?

### Exercise 3: Scanning with CodeQL and Autofix

**Objective:** Configure or review CodeQL scanning, interpret findings, and apply Autofix suggestions with merge protection.

**Hands-on:**
1. Enable CodeQL with default setup (reference: [Configure code scanning](https://docs.github.com/en/code-security/how-tos/find-and-fix-code-vulnerabilities/configure-code-scanning/configure-code-scanning)), or review the existing setup if scanning is already enabled.
2. Run or inspect a recent scan, then open one result in **Code scanning alerts** (reference: [Code scanning alerts](https://docs.github.com/en/code-security/concepts/code-scanning/code-scanning-alerts)).
3. Triage the alert by noting the rule, severity, affected line, and, if available, the data flow or affected branches.
4. Apply Copilot Autofix or a manual fix in a branch, then confirm the required checks pass before merge.
5. If you would dismiss the alert, record the dismissal reason. If not, identify which required checks or rulesets should prevent merge until it is fixed.

**Knowledge Check:**
1. Why is default setup the recommended starting point for most repositories?
2. Which alert details helped you decide priority fastest?
3. When is Autofix enough on its own, and when does the change need deeper review?
4. Which findings should block merge by policy?

## Module Summary

- Dependabot monitors the dependency graph and alerts on known CVEs; automated pull requests, grouped updates, and Dependency Review help developers patch vulnerable packages before merge.
- CodeQL analyzes source code for vulnerability patterns on every push and pull request; code scanning alerts include severity, code location, CWE context, and data flow for triage, and AI-powered detections expand coverage beyond traditional static analysis.
- Copilot Autofix can generate one-click remediation suggestions for common code scanning findings, but developers still validate the change and own the merge decision.
- Secret scanning detects 250+ secret patterns across repository history, issues, and pull requests; push protection can block a secret before it lands, validity checks help prioritize response, and bypasses require documented justification.
- A consistent developer workflow is to surface alerts in the Security tab and pull request checks, prioritize by severity and reachability, remediate in a branch, validate the outcome, and close the loop with documented evidence.

## Completion Criteria

1. You can monitor, triage, and remediate Dependabot, code scanning, and secret scanning alerts using a consistent developer workflow.
2. You can evaluate dependency alerts, process automated updates, and use Dependency Review before merge.
3. You can enable CodeQL scanning, interpret findings, and enforce meaningful pull request security gates.
4. You can evaluate and apply Autofix or manual remediation patches with safety checks and validation evidence.
5. You can enable secret scanning and push protection, then execute a repeatable secret incident response playbook.
6. You can explain one end-to-end application security monitoring workflow that connects dependency, code, and secret remediation.
