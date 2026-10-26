# Application Security - Overview & Management

**Audience:** Organization administrators and security platform owners

## Learning Objectives

- Understand how organization-level GHAS settings establish a shared application security baseline.
- Configure core security controls for code scanning, secret scanning, and dependency security.
- Apply repository rulesets and required checks that reinforce resiliency and code quality.
- Validate policy inheritance, exceptions, and ownership for ongoing governance.

## Exercises

### Exercise 1: Configure Dependabot security updates

**Objective:** Configure Dependabot defaults, reduce update noise, and define an alert triage model for pilot repositories.

**Hands-on:**
1. Confirm **Dependabot alerts** and security updates are enabled (reference: [Dependabot quickstart guide](https://docs.github.com/en/code-security/getting-started/dependabot-quickstart-guide)).
2. Add or review `.github/dependabot.yml` and define the package ecosystem, schedule, target branch, and one grouping rule (reference: [Dependabot options reference](https://docs.github.com/en/code-security/dependabot/working-with-dependabot/dependabot-options-reference)).
3. Review one Dependabot alert and assign an owner, severity-based SLA, and remediation path.
4. Enable or review **Dependency Review** in pull requests so new vulnerabilities can block merge (reference: [Configuring the dependency review action](https://docs.github.com/en/code-security/supply-chain-security/understanding-your-software-supply-chain/configuring-the-dependency-review-action)).
5. Record one auto-triage or grouped-update rule you would apply org-wide after the pilot.

**Knowledge Check:**
1. Which Dependabot settings should be standardized across repositories?
2. How do grouping and ignore rules reduce PR noise without hiding risk?
3. Which alerts should be auto-triaged versus assigned for immediate action?
4. How does Dependency Review strengthen merge safety?

### Exercise 2: Configure and use Secret Scanning

**Objective:** Enable secret scanning controls, define bypass governance, and establish a repeatable response workflow for leaked credentials.

**Hands-on:**
1. Enable **Secret scanning** and **Push protection**, or confirm inherited org defaults already apply (reference: [Enabling secret scanning for your repository](https://docs.github.com/en/code-security/secret-scanning/enabling-secret-scanning-features/enabling-secret-scanning-for-your-repository)).
2. Review one secret scanning alert and note the owner, SLA, validity status, and closure evidence required.
3. Trigger or inspect a blocked push and document the approved bypass reasons and who can bypass (reference: [Push protection](https://docs.github.com/en/code-security/secret-scanning/introduction/about-push-protection)).
4. Enable or review delegated bypass governance for push protection (reference: [Enabling delegated bypass for push protection](https://docs.github.com/en/code-security/secret-scanning/using-advanced-secret-scanning-and-push-protection-features/delegated-bypass-for-push-protection/enabling-delegated-bypass-for-push-protection)).
5. Define one custom pattern for an internal credential format (reference: [Defining custom patterns for secret scanning](https://docs.github.com/en/code-security/secret-scanning/using-advanced-secret-scanning-and-push-protection-features/custom-patterns/defining-custom-patterns-for-secret-scanning)).

**Knowledge Check:**
1. Which secret scanning settings should be enforced org-wide?
2. What evidence should be captured before closing a true-positive alert?
3. When should a bypass be allowed, and who should approve it?
4. Which internal credential formats justify a custom pattern?

### Exercise 3: Code Scanning with CodeQL

**Objective:** Enable CodeQL, enforce merge protection, and define alert dismissal controls for pilot repositories.

**Hands-on:**
1. Enable **default setup** for CodeQL or review the existing configuration (reference: [Quickstart for securing your repository](https://docs.github.com/en/code-security/getting-started/quickstart-for-securing-your-repository)).
2. Review one code scanning alert and note the severity, owner, dismissal policy, and remediation expectation.
3. Create or review a repository ruleset that requires code scanning results to pass before merge (reference: [Code scanning alerts in rulesets](https://docs.github.com/en/code-security/code-scanning/managing-code-scanning-alerts/about-code-scanning-alerts-in-rulesets)).
4. Enable or review delegated alert dismissal so dismissals require the right approval path (reference: [Enabling delegated alert dismissal for code scanning](https://docs.github.com/en/code-security/code-scanning/managing-code-scanning-alerts/enabling-delegated-alert-dismissal-for-code-scanning)).

**Knowledge Check:**
1. Why is default setup the right starting point for most pilot repositories?
2. Which findings should block merge by policy?
3. When should third-party SARIF results be included alongside CodeQL?
4. Who should be allowed to dismiss alerts, and with what justification?

### Exercise 4: Security Overview and Campaigns

**Objective:** Use Security Overview to assess feature adoption, identify gaps, and plan a time-boxed remediation campaign.

**Hands-on:**
1. Open **Security Overview** and review feature adoption for Dependabot, secret scanning, and code scanning.
2. Identify one coverage gap or alert trend that should be addressed first.
3. Create a campaign plan for that gap by defining the target repositories, owner, due date, and success metric.
4. Review how Copilot Autofix or campaign workflows could accelerate remediation for the selected finding set.
5. Record one monthly review you would use to track adoption, risk reduction, and policy drift after rollout.

**Knowledge Check:**
1. Which Security Overview signals matter most during a pilot?
2. What makes a good first campaign target?
3. How should campaign progress be measured and reported?
4. How do overview metrics help drive org-wide rollout decisions?

## Module Summary

- Dependabot management starts with repository defaults, update schedules, grouping, and Dependency Review so teams can remediate safely at scale.
- Secret scanning management combines inherited controls, push protection, delegated bypass, and custom patterns with a clear response workflow.
- Code scanning management combines CodeQL setup, merge protection, SARIF visibility, and dismissal governance so findings are actionable and auditable.
- Security Overview and campaigns help administrators measure adoption, identify gaps, and drive time-boxed remediation across pilot repositories.

## Completion Criteria

1. You can configure Dependabot, secret scanning, and code scanning settings for pilot repositories using a consistent management approach.
2. You can define ownership, SLAs, merge guardrails, and dismissal or bypass controls for each security surface.
3. You can use Security Overview to identify adoption gaps and select a campaign target.
4. You can define a review cadence to keep repository and org-level controls current and effective.
