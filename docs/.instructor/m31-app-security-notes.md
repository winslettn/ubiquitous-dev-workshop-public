<!-- Copilot Metadata
- **Module:** m31-app-security
- **Module Group:** Security, Quality and Resiliency (30+)
  - **Audience:** Dev
- **Title:** Application Security Monitoring and Remediation
- **Est. Duration:** 25 min. instruction / 60 min. hands-on
- **Type:** Core
- **Topics:**
  - Developer-focused application security monitoring and remediation workflows
  - Dependabot: Dependency graph and alert triage, update configuration, security update automation, PR policy for dependency updates, supply-chain risk reduction practices
  - Secret scanning: Enablement and scope, push protection configuration, alert triage and remediation playbooks, token revocation and incident response, custom pattern management
  - Code scanning: Setup and enablement
  - Advanced code scanning: CodeQL query suite selection, SARIF results interpretation, baseline tuning and noise reduction, pull request scanning gates
  - Autofix: Eligibility and safety checks, reviewing AI-generated remediation patches, validation and regression safeguards, rollout strategy for automated fixes, measuring autofix effectiveness
- **Docs:**
  - https://docs.github.com/en/code-security
  - https://docs.github.com/en/code-security/dependabot
  - https://docs.github.com/en/code-security/code-scanning
  - https://docs.github.com/en/code-security/secret-scanning
  - https://docs.github.com/en/code-security/code-scanning/managing-code-scanning-alerts
  - https://docs.github.com/en/code-security/dependabot/dependabot-security-updates
- **Demos:**
  - [GHAS](https://github.com/octodemo-framework/demo_ghas/blob/main/README.md)
  - [GHAzDO](https://github.com/octodemo-framework/demo_ghazdo/blob/main/README.md)
  - [GHAzDO .NET](https://github.com/octodemo-framework/demo_ghazdo_dotnet/blob/main/README.md)
  - [OctoCat Supply: GitHub Advanced Security](https://github.com/octodemo-framework/demo_octocat_supply/blob/main/demo/walkthroughs/ghas/code-security.md)
- **Source workshops:**
  - [46] MS Learn Module: Configure Dependabot security updates on your GitHub repo — [GitHub Learn](https://learn.microsoft.com/en-us/training/modules/configure-dependabot-security-updates-on-github-repo/)
  - [47] MS Learn Module: Configure and use secret scanning in your GitHub repository — [GitHub Learn](https://learn.microsoft.com/en-us/training/modules/configure-use-secret-scanning-github-repository/?ns-enrollment-type=Collection&ns-enrollment-id=rqymc6yw8q5rey)
  - [48] MS Learn Module: Configure code scanning on GitHub — [GitHub Learn](https://learn.microsoft.com/en-us/training/modules/configure-code-scanning/?ns-enrollment-type=Collection&ns-enrollment-id=rqymc6yw8q5rey)
  - [49] MS Learn Module: Identify security vulnerabilities in your codebase with CodeQL — [GitHub Learn](https://learn.microsoft.com/en-us/training/modules/codebase-representation-codeql/?ns-enrollment-type=Collection&ns-enrollment-id=rqymc6yw8q5rey)
  - [50] MS Learn Module: Code scanning with GitHub CodeQL — [GitHub Learn](https://learn.microsoft.com/en-us/training/modules/code-scanning-with-github-codeql/?ns-enrollment-type=Collection&ns-enrollment-id=rqymc6yw8q5rey)
  - [53] GitHub Skills Project-based exercise: Secure Repository Supply Chain — [GitHub Learn](https://github.com/skills/secure-repository-supply-chain)
  - [54] GitHub Skills Project-based exercise: Introduction to CodeQL — [GitHub Learn](https://github.com/skills/introduction-to-codeql)
  - [55] GitHub Skills Project-based exercise: Introduction to secret scanning — [GitHub Learn](https://github.com/skills/introduction-to-secret-scanning)
  - [MS Learn: Configure Dependabot security updates on your GitHub repo (includes slide deck)](https://learn.microsoft.com/en-us/training/modules/configure-dependabot-security-updates-on-github-repo/)
  - [MS Learn: Configure code scanning on GitHub (includes slide deck)](https://learn.microsoft.com/en-us/training/modules/configure-code-scanning/?ns-enrollment-type=Collection&ns-enrollment-id=rqymc6yw8q5rey)
  - [MS Learn: Code scanning with GitHub CodeQL (includes slide deck)](https://learn.microsoft.com/en-us/training/modules/code-scanning-with-github-codeql/?ns-enrollment-type=Collection&ns-enrollment-id=rqymc6yw8q5rey)
- **Source slides:** None
-->

# M31 Application Security Monitoring and Remediation - Instructor Materials

Use this module as the instructor facilitation guide for a developer audience.

## Preparation

### Delivery priorities

1. Follow the slide sequence: overview, optional context, GitHub security tools, Dependabot, code scanning, secret scanning, summary, then exercises.
2. Keep the discussion anchored in the developer workflow: alerts surface in the **Security** tab and pull request checks, then move through triage, remediation, validation, and safe merge.
3. Distinguish the GitHub security product surfaces clearly: Dependabot is included with GitHub, while **Secret Protection** and **Code Security** can be licensed separately or bundled through **GHAS**.
4. Use the hidden "Why Application Security Matters" slide only when the audience needs business context before the technical walkthrough.
5. Reserve enough time for all three workshop exercises from the related module.

### Demo preparation

- Review the related workshop module: `m31-app-security.md`.
- Confirm the demo repository has:
  - at least one Dependabot alert and related pull request,
  - at least one code scanning alert that can show data flow and Autofix,
  - at least one secret scanning alert or a safe demo secret for push protection.
- Verify the presenter account can access **Security** tabs, pull requests, rulesets, and any required Actions runs.
- Prepare one concise transition from each demo into the matching workshop exercise.

### Success signal

Participants can explain how developers monitor and remediate dependency, code, and secret findings in GitHub, then complete the mapped lab exercises with minimal prompting.

---

## Presentation

Duration: 25 min. instruction

1. Overview and learning objectives
2. Optional context: why application security matters
3. GitHub security tools for developers:
   - Dependabot
   - Secret Protection
   - Code Security
   - GHAS bundling and licensing model
4. Dependabot:
   - dependency graph, manifest scanning, and advisory matching,
   - alert triage, grouped updates, and auto-triage rules,
   - dependency pull request review, Dependency Review, and merge safety
5. Code scanning:
   - CodeQL monitoring, default setup, and AI-powered detections,
   - alert triage with severity, CWE context, and data flow review,
   - Copilot Autofix and merge protection with rulesets
6. Secret scanning:
   - repository history, issue, and pull request secret detection,
   - validity checks, push protection, and bypass governance,
   - remediation workflow, evidence capture, and custom patterns
7. Module summary and handoff to exercises

### Demo cues

1. **Dependabot demo**
   - Review a high-severity alert in **Security** > **Dependabot alerts**.
   - Open the related Dependabot pull request and point out release notes, compatibility context, grouped updates, and CI validation.
   - Show **Dependency Review** blocking or warning on risky dependency changes.
2. **Code scanning demo**
   - Open a code scanning alert and walk the source-to-sink data flow.
   - Review a Copilot Autofix suggestion in a pull request and explain required validation before merge.
   - Show a ruleset or protected branch behavior that blocks merge when findings exceed the allowed severity threshold.
3. **Secret scanning demo**
   - Demonstrate push protection with a safe sample secret or review a recorded blocked push example.
   - Open a secret scanning alert and discuss validity checks, blast radius, and evidence required for closure.
   - Show how a custom pattern and bypass approval fit the same triage and remediation process.

---

## Lab Exercises

Duration: 60 min. hands-on

1. Exercise 1: Hands-on Dependabot alert triage and remediation
   - Reference: REF:
https://learn.microsoft.com/en-us/training/modules/configure-dependabot-security-updates-on-github-repo/3-dependabot-alerts
2. Exercise 2: Hands-on secret scanning and push protection
   - Reference: https://learn.microsoft.com/en-us/training/modules/configure-use-secret-scanning-github-repository/
3. Exercise 3: Hands-on code scanning with CodeQL and Autofix
   - Reference: https://learn.microsoft.com/en-us/training/modules/code-scanning-with-github-codeql/

---

## Wrap-up

Reinforce the shared developer pattern across all three tools: surface the alert in the **Security** tab or pull request checks, assess severity and reachability, remediate in a branch or pull request, validate the fix, and close with clear evidence before moving to the next module.
