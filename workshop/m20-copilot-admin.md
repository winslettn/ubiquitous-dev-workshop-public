# Copilot Admin and Governance

**Audience:** Enterprise and organization administrators responsible for Copilot governance

## Overview

This module focuses on running GitHub Copilot as an enterprise service. You will define governance controls at enterprise, organization, and repository scope; design rollout policy tiers; build usage and budget operating rhythms; and create an enablement plan that supports safe adoption. By the end of the module, you should be able to operate Copilot with clear ownership, measurable outcomes, and controlled model access.

All GHCP administration (including org-level policy governance that is not app-security or code-quality specific) belongs in this module.

### Key Concepts

1. Enterprise management: billing, licensing, monitoring, cost centers, and budgets.
2. Organization management: access, policies, model controls, Cloud Agent controls, customization instructions, and content exclusions.
3. Repository management: code review controls, Cloud Agent usage boundaries, and memory behavior.
4. Copilot rollout and policy tier administration.
5. Usage telemetry and KPI tracking.
6. Budgeting, cost attribution, and governance operating model.
7. Team enablement and adoption planning.
8. Models: enabling and using GitHub Models, marketplace options, and playground workflows.

## Prerequisites

- Admin access (or read access plus screenshots) for enterprise, organization, and repository Copilot settings.
- Access to billing and usage views for your environment.
- A target team or business unit to use as your rollout scenario.

## Exercises

### Exercise 1: Enterprise governance baseline

**Objective:** Define enterprise-level Copilot controls for license allocation, spend governance, and monitoring ownership.

**Exercise Type:** Hands-on

**Hands-on:**
1. Open enterprise Copilot and billing settings using [manage for organization](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization) and [manage enterprise policies](https://docs.github.com/en/enterprise-cloud@latest/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-enterprise-policies).
2. Document your license assignment model (for example: role-based, pilot cohort, or request-based).
3. Define one budget owner and one monitoring owner for Copilot usage.
4. Create a baseline cadence for reviews (weekly usage check, monthly budget review, quarterly policy review).

**Knowledge Check:**
1. Which Copilot controls must be centralized at enterprise scope?
2. What evidence proves license and spend ownership is assigned?
3. Which review cadence is most realistic for your organization?

### Exercise 2: Organization policy boundaries

**Objective:** Configure organization-level policy boundaries for access, model usage, customization, and content protection.

**Exercise Type:** Hands-on

**Hands-on:**
1. Review access and assignment flow with [grant access](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization/manage-access/grant-access).
2. Open policy controls with [manage policies](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization/manage-policies) and record your defaults for chat, agent usage, and model access.
3. Define organization customization instruction ownership and update workflow.
4. Review content boundaries using [content exclusion concepts](https://docs.github.com/en/copilot/concepts/context/content-exclusion) and [exclude content from Copilot](https://docs.github.com/en/copilot/how-tos/configure-content-exclusion/exclude-content-from-copilot); list excluded paths and approver role.
5. Capture GHCP admin baseline decisions previously handled outside this module:
   - organization feature access scope,
   - policy allow/deny defaults,
   - review expectations for AI-generated changes.

**Knowledge Check:**
1. Which policy settings should be mandatory across all organizations?
2. How do content exclusions reduce governance and data exposure risk?
3. Which GHCP baseline decisions must be standardized before rollout?
4. Who approves policy changes when teams request exceptions?

### Exercise 3: Repository guardrails for Copilot features

**Objective:** Define repository-level controls for Code Review, Cloud Agent activity, and memory behavior.

**Exercise Type:** Hands-on

**Hands-on:**
1. Review [Code Review concepts](https://docs.github.com/en/copilot/concepts/agents/code-review) and define when review agent output is advisory versus required.
2. Review [use Copilot agents](https://docs.github.com/en/copilot/how-tos/use-copilot-agents) and set repository expectations for allowed task scope and required human validation.
3. Review [Copilot memory concepts](https://docs.github.com/en/copilot/concepts/agents/copilot-memory) and [memory usage guidance](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/copilot-memory); define memory handling for sensitive repositories.
4. Capture one escalation path for unsafe agent behavior or policy drift.

**Knowledge Check:**
1. What repository controls are required before enabling agents broadly?
2. How do you verify that human review remains a hard quality gate?
3. Which repositories should run with stricter memory controls?

### Exercise 4: Rollout policy tiers and assignment

**Objective:** Create policy tiers and map teams to the right rollout path.

**Exercise Type:** Whiteboard/Discussion

**Whiteboard/Discussion:**
1. Define at least two tiers: `Standard` and `Restricted`.
2. For each tier, specify access defaults, model limits, content exclusion strictness, and agent permissions.
3. Assign at least one sample team to each tier and justify placement.
4. Define entry and exit criteria for moving a team between tiers.

**Knowledge Check:**
1. Which controls differ most between Standard and Restricted tiers?
2. What signals should trigger tier reassessment?
3. How does tiering reduce one-size-fits-all policy risk?

### Exercise 5: Usage telemetry and KPI tracking

**Objective:** Define measurable adoption, quality, and risk indicators for Copilot governance.

**Exercise Type:** Instructor-Guided

**Instructor-Guided:**
1. Open your usage dashboard and identify baseline metrics for active users, request volume, and feature mix.
2. Define 3-5 KPIs (for example: adoption rate, pull request throughput impact, review quality indicators, policy exception volume).
3. Set thresholds for one positive signal and one risk signal.
4. Assign owner and reporting cadence for each KPI.

**Knowledge Check:**
1. Which KPI best reflects productive adoption versus raw activity?
2. How will you detect unhealthy usage patterns early?
3. What governance action follows a KPI threshold breach?

### Exercise 6: Budgeting and governance operating model

**Objective:** Build a repeatable operating model for cost attribution, threshold response, and policy governance.

**Exercise Type:** Hands-on

**Hands-on:**
1. Use [cost centers](https://docs.github.com/en/billing/how-tos/products/use-cost-centers) to map spend ownership to business units or teams.
2. Define budget thresholds and alert recipients for each cost center.
3. Create a threshold response flow: detect → triage → owner decision → policy or budget adjustment.
4. Document one monthly governance review agenda with decisions and required evidence.

**Knowledge Check:**
1. How does cost attribution improve governance accountability?
2. Which threshold should trigger immediate escalation?
3. What evidence is mandatory in a monthly governance review?

### Exercise 7: Team enablement and adoption plan

**Objective:** Create an enablement plan that improves adoption quality while reducing support load.

**Exercise Type:** Whiteboard/Discussion

**Whiteboard/Discussion:**
1. Define onboarding steps for new teams (access request, policy tier assignment, training, first checkpoint).
2. Create a 30-day adoption plan with one technical checkpoint and one governance checkpoint.
3. Define support channels and escalation contacts for policy, billing, and technical issues.
4. Add a feedback loop for policy and training improvements.

**Knowledge Check:**
1. What onboarding artifact is most important for policy clarity?
2. How do you balance fast enablement with governance controls?
3. When should a team be paused from expansion?

### Exercise 8: Models enablement, marketplace, and playground workflow

**Objective:** Evaluate model options and design a safe model trial workflow for teams.

**Exercise Type:** Hands-on

**Hands-on:**
1. Review [using GitHub Models](https://docs.github.com/en/copilot/using-github-copilot/using-github-models) and [prototyping with AI models](https://docs.github.com/en/github-models/use-github-models/prototyping-with-ai-models).
2. Explore model options in [GitHub Marketplace models](https://github.com/marketplace?type=models) and shortlist candidates for your scenario.
3. Define a model evaluation template with task fit, quality, risk, and cost criteria.
4. Run one playground trial scenario and record recommended model plus guardrails.

**Knowledge Check:**
1. Which criteria matter most when approving a new model for production use?
2. How do playground trials reduce rollout risk?
3. What governance check is required before expanding model access?

## Completion Criteria

1. You can map Copilot controls to enterprise, organization, and repository scope with named ownership.
2. You can define and administer policy tiers for controlled rollout.
3. You can create telemetry KPIs and threshold responses for governance operations.
4. You can implement cost attribution and budget alerting as part of a governance operating model.
5. You can produce a team enablement plan with onboarding, escalation, and feedback loops.
6. You can evaluate and enable models using marketplace and playground workflows with clear guardrails.
