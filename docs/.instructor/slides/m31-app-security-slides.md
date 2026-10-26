<!--
title: "Module 31: Application Security Monitoring and Remediation"
template: default
-->

# Module 31: Application Security Monitoring and Remediation

---

## Overview

<!--
layout: content
-->

- **Learning objectives**
  - Understand common application security vulnerabilities and their impact
  - Monitor and remediate dependency vulnerabilities with Dependabot
  - Detect and fix code vulnerabilities with code scanning and CodeQL Autofix
  - Prevent and respond to leaked secrets with secret scanning and push protection
  - Apply a consistent triage and remediation workflow across all vulnerability types

---

## Why Application Security Matters

<!--
layout: content
hidden: true
-->

- **Common vulnerabilities in application code**
  - Leaked credentials and secrets: hard-coded API keys, tokens, and private keys exposed in code, logs, or configuration
  - Application code vulnerabilities: input-handling flaws like SQL injection, XSS, and command injection
  - Supply chain vulnerabilities: vulnerable or malicious third-party libraries and packages in your dependency tree

- **Why this matters to you**
  - IBM Cost of a Data Breach Report 2024: average breach cost reached $4.88M globally
  - Verizon DBIR: 31% of breaches now start with software vulnerabilities
  - Synopsys OSSRA 2024: 84% of audited codebases contained at least one open-source vulnerability

---

## GitHub Security Tools for Developers

<!--
layout: content
-->

- **GitHub Dependabot**
  - Automatic dependency vulnerability alerts and pull requests with security updates
  - Included with GitHub

- **GitHub Secret Protection**
  - Detects leaked secrets in your code, blocks them at push, and guides remediation
  - Licensed per active committer or bundled with GHAS

- **GitHub Code Security**
  - Code scanning with CodeQL and Copilot Autofix for AI-powered remediation suggestions on pull requests
  - Licensed per active committer or bundled with GHAS

- **GitHub Advanced Security (GHAS)**
  - Bundles Secret Protection and Code Security into a single license per active committer

---

## Dependabot

<!--
layout: section
-->

---

## Monitoring Dependency Vulnerabilities

<!--
layout: content
-->

- **How Dependabot works**
  - Scans your manifest files (`package.json`, `Gemfile`, `requirements.txt`, and more) and builds a dependency graph
  - Cross-references dependencies against the GitHub Advisory Database for known CVEs
  - Creates alerts ranked by severity (Critical, High, Medium, Low) with CVSS scores

- **What you see as a developer**
  - Dependabot alerts appear in the Security tab of your repository and in email or notification digests
  - Each alert includes the affected package, vulnerable version range, patched version, and advisory details
  - Dependency Review in pull requests flags new vulnerabilities introduced by dependency changes before merge

---

## Responding to Dependabot Alerts

<!--
layout: content
-->

- **Automated security updates**
  - Dependabot opens pull requests that bump the vulnerable package to the minimum patched version
  - PRs include release notes, changelogs, and commit details to help you assess the update
  - Grouped updates batch related dependency PRs to reduce review burden

- **Manual triage and remediation**
  - Review alert details: severity, exploitability, and whether the vulnerable code path is reachable
  - Dismiss alerts with a reason (tolerable risk, false positive, or not applicable) for audit tracking
  - Use auto-triage rules to automatically dismiss or snooze low-severity alerts

- **Copilot Autofix for dependencies**
  - Copilot can suggest code changes when a simple version bump does not resolve the issue
  - Review, test, and merge the suggested fix like any other pull request

---

## DEMO

<!--
layout: demo
-->

- Review Dependabot alerts
- Process a Dependabot pull request
- Dependency Review in a pull request

```speaker-notes
- Review Dependabot alerts
  - Navigate to Security > Dependabot alerts; filter by severity and ecosystem
  - Open a Critical/High alert; review the advisory, affected versions, and remediation guidance
- Process a Dependabot pull request
  - Open an automated Dependabot PR; review the changelog and compatibility score
  - Run CI checks and verify tests pass; merge the update
- Dependency Review in a pull request
  - Open a PR that adds a new dependency; review the dependency-review check results
  - Show how the action blocks merge when a known vulnerability is detected
```

---

## Code Scanning

<!--
layout: section
-->

---

## Monitoring Code Vulnerabilities

<!--
layout: content
-->

- **How code scanning works**
  - CodeQL builds a database of your code and runs semantic queries to find vulnerability patterns
  - Default setup auto-detects supported languages and runs on every push and pull request
  - Alerts map to CWEs (Common Weakness Enumerations) with severity ratings and remediation guidance

- **What you see as a developer**
  - Code scanning alerts appear as annotations directly in pull request diffs and in the Security tab
  - Each alert includes the vulnerability type, affected code location, data flow path, and fix guidance
  - Alerts are grouped by rule and severity for efficient triage

- **AI-powered detections**
  - CodeQL includes AI-powered detections that find vulnerability patterns beyond traditional static analysis
  - Expanded coverage for JavaScript, TypeScript, Python, Java, and C/C++

---

## Code Scanning Triage and Autofix

<!--
layout: content
-->

- **Copilot Autofix**
  - Automatically generates code fix suggestions for code scanning alerts on pull requests
  - Fix suggestions include an explanation, the proposed change, and a diff preview
  - Accept the fix with one click, or edit the suggestion before committing
  - Supports the most common vulnerability types across JavaScript, TypeScript, Python, Java, C#, Go, Ruby, and C/C++

- **Triage workflow**
  - Review alerts by severity; prioritize Critical and High findings for immediate remediation
  - Use the data flow visualization to understand how tainted data reaches a vulnerable sink
  - Dismiss false positives with a reason; dismissed alerts are tracked for audit

- **Merge protection**
  - Repository rulesets can require code scanning to pass before merging a pull request
  - Block merges when alerts exceed configured severity thresholds

---

## DEMO

<!--
layout: demo
-->

- Review code scanning alerts
- Copilot Autofix in action
- Merge protection with rulesets

```speaker-notes
- Review code scanning alerts
  - Navigate to Security > Code scanning alerts; filter by severity and CWE
  - Open an alert; trace the data flow path from source to sink
- Copilot Autofix in action
  - Open a pull request with a code scanning alert; review the Autofix suggestion
  - Accept or edit the fix; commit and verify the alert resolves
- Merge protection with rulesets
  - Attempt to merge a PR with an open Critical alert; show the blocked merge
  - Demonstrate the dismissal workflow with justification for audit compliance
```

---

## Secret Scanning

<!--
layout: section
-->

---

## Detecting Leaked Secrets

<!--
layout: content
-->

- **How secret scanning works**
  - Scans your repository history, issues, and pull requests for over 250 known secret patterns
  - Detects API keys, tokens, passwords, private keys, and connection strings
  - Partner providers are automatically notified to revoke compromised credentials when possible
- **What you see as a developer**
  - Secret scanning alerts appear in the Security tab with the secret type, location, and validity status
  - Validity checks indicate whether a detected secret is still active and exploitable
  - Alerts include remediation steps: rotate the credential, update references, and verify the fix
- **Custom patterns**
  - Org admins can define custom regex patterns for proprietary credential formats
  - Custom pattern alerts follow the same triage workflow as built-in patterns

---

## Push Protection and Remediation

<!--
layout: content
-->

- **Push protection**
  - Blocks `git push` when a supported secret pattern is detected in your commit
  - You see the blocked push in your terminal with the secret type and file location
  - Options: remove the secret, mark as false positive, or request a bypass with justification
  - Bypasses require approval from a designated reviewer; all bypass events are logged for audit

- **Remediation workflow**
  - When a secret is detected, immediately rotate or revoke the credential
  - Update all references to the credential in your codebase and environment variables
  - Verify the old credential is invalidated; close the alert with evidence of remediation

- **Best practices**
  - Use environment variables or a secrets manager instead of hard-coding credentials
  - Add sensitive file patterns to `.gitignore`; use pre-commit hooks as an additional safety net
  - Treat any pushed secret as compromised, even if the commit is quickly reverted

---

## DEMO

<!--
layout: demo
-->

- Push protection in action
- Secret scanning alert triage
- Custom patterns

```speaker-notes
- Push protection in action
  - Attempt to push a commit containing a test secret; show the blocked push message
  - Demonstrate the bypass flow: provide justification and request approval
  - Show the audit log entry for the bypass event
- Secret scanning alert triage
  - Navigate to Security > Secret scanning alerts; review an alert with validity check results
  - Trace the secret location in the commit history
  - Demonstrate the remediation flow: rotate credential, update references, close alert
- Custom patterns
  - Show how a custom pattern defined at the org level detects a proprietary credential format
  - Triage the resulting alert using the same workflow as built-in patterns
```

---

## Module Summary

<!--
layout: content
-->

- **Dependabot**
  - Monitors dependency graph and alerts on known CVEs; opens automated PRs to patch vulnerable packages
  - Dependency Review blocks vulnerable packages in pull requests before merge
  - Auto-triage rules and grouped updates reduce alert fatigue

- **Code Scanning**
  - CodeQL analyzes source code for vulnerability patterns on every push and pull request
  - Copilot Autofix generates one-click fix suggestions directly in pull request diffs
  - Merge protection rulesets enforce code scanning pass before merge

- **Secret Scanning**
  - Detects 250+ secret patterns across repository history, issues, and pull requests
  - Push protection blocks secrets at commit time; bypass requires justification and approval
  - Validity checks confirm whether leaked credentials are still active
  
- **Developer workflow**
  - All three tools surface alerts in the Security tab and directly in pull request checks
  - Prioritize by severity; leverage Autofix and automated PRs for faster remediation

---

## Exercises

<!--
layout: content
-->

- **Exercise 1: Dependabot Alert Triage and Remediation**
  - Review alerts, process automated PRs, and configure auto-triage rules
  - Workshop: `m31-app-security.md`
- **Exercise 2: Code Scanning with CodeQL and Autofix**
  - Review code scanning alerts, apply Autofix suggestions, and configure merge protection
  - Workshop: `m31-app-security.md`
- **Exercise 3: Secret Scanning and Push Protection**
  - Test push protection, triage secret alerts, rotate credentials, and define custom patterns
  - Workshop: `m31-app-security.md`
- **Completion focus**
  - You can monitor, triage, and remediate Dependabot, code scanning, and secret scanning alerts using a consistent developer workflow
