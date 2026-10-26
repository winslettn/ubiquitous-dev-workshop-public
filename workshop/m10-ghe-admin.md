# GitHub Enterprise Administration

**Audience:** GitHub Enterprise administrators, platform owners,  security/governance leads, and/or developers

## Learning Objectives

- Distinguish GitHub Enterprise Server (GHES), GitHub Enterprise Cloud (GHEC), GHEC with data residency, and Enterprise Managed Users (EMU) based on hosting, compliance, identity, and operational-control requirements.
- Choose the right authentication and identity lifecycle model for a governance scenario, including personal accounts, SAML SSO, GHES-managed authentication, and EMU.
- Design team-based authorization with repository roles and custom-role delegation that supports least privilege and auditability.
- Map controls to enterprise, organization, and repository scope, then explain how to verify that each control is working.
- Define a repeatable administration baseline using rulesets, repository settings, and settings automation.

## Overview

This module treats GitHub Enterprise administration as an operating model, not just a settings tour. You will evaluate platform and identity choices first, then apply governance controls at the right scope using teams, roles, rulesets, and settings management. The goal is to leave with a practical model for selecting a control, assigning an owner, and identifying the evidence that proves the control is working.

### Key Concepts

1. **Platform models:** GHES, GHEC, GHEC with EMU, and GHEC with data residency each solve different hosting, compliance, and operational needs.
2. **Authentication and identity:** personal accounts, SAML SSO, GHES-managed authentication integrations, and EMU each change who owns identity, access lifecycle, and collaboration boundaries.
3. **Governance layers:** enterprise, organization, and repository scopes each have distinct responsibilities for policy, delegation, audit, and day-to-day administration.
4. **Authorization:** teams, built-in repository roles, and custom roles are the preferred path for least-privilege administration at scale.
5. **Administrative operations:** rulesets, settings baselines, APIs, CLI workflows, and Terraform help make governance repeatable and reviewable.
6. **Governance boundaries:** InnerSource and open source participation require explicit decisions about visibility, ownership, and exception handling.

## Exercises

### Exercise 1: Whiteboard/Discussion on Architecture and tradeoffs

**Objective:** Design the right GitHub Enterprise architecture for your own scenario, including platform and identity choices, team-based authorization, and governance scope boundaries.


### Exercise 2: Authorization with teams and roles

**Objective:** Design an access model that uses teams and roles instead of direct-user permission sprawl.

**Hands-on or instructor-guided:**
1. Assign the minimum repository role to teams and/or individuals (refernece: [About teams](https://docs.github.com/en/organizations/organizing-members-into-teams/about-teams) and [Repository roles for an organization](https://docs.github.com/en/organizations/managing-access-to-your-organizations-repositories/repository-roles-for-an-organization)).
2. Identify one administrative capability that should use an enterprise or organization custom role instead of broad owner access.

**Knowledge Check:**
1. Why are teams the preferred access abstraction for most repositories?
2. Which role assignments need the strongest audit trail?
3. Where should platform administration stay separate from day-to-day repository maintenance?
4. When might direct collaborator access would still be allowed, if at all, and what review cadence would catch excess privilege?

### Exercise 3: Branches and rulesets

**Objective:** Create a reusable enforcement baseline for protected branches and release tags.

**Hands-on:**
1. Create a repository or organization ruleset for the default branch that requires pull requests, blocks force pushes, and enforces required checks.
2. Add CODEOWNERS review or equivalent approval expectations for protected branches.
3. Add a tag protection or ruleset strategy for release tags and define who can bypass or administer it.
4. Record which exceptions are allowed, who approves them, and how they are time-bounded or reviewed.

**Knowledge Check:**
1. Why are rulesets preferable to one-off branch protection drift?
2. Which branch or tag controls are mandatory for your governance scenario?
3. How would you prove the enforcement is working after rollout?

## Module Summary

- Platform choice comes first: GHES, GHEC, data residency, and EMU each change the operating model for hosting, identity, and compliance.
- Identity and access choices come next: personal accounts, SAML SSO, GHES-managed authentication, and EMU each imply different lifecycle and governance boundaries.
- Governance is layered: enterprise, organization, and repository controls should be applied deliberately, with teams and roles handling least-privilege access at scale.
- Rulesets and settings automation turn governance intent into repeatable enforcement, while audit evidence and named ownership keep the model operational over time.
- InnerSource and open source governance should be explicit, especially where visibility, external participation, and enterprise identity boundaries differ.

## Completion Criteria

1. You can explain when GHES, GHEC, GHEC with data residency, or EMU is the better fit for a governance scenario.
2. You can distinguish personal-account access, SAML SSO, GHES-managed authentication, and EMU-managed identity lifecycle control.
3. You can design team-based authorization using repository roles and targeted custom-role delegation instead of relying on direct-user exceptions.
4. You can map an administrative requirement to enterprise, organization, or repository scope and name the evidence that validates it.
5. You can identify which settings should be standardized and which should be automated through API, CLI, or infrastructure as code.
6. You can define a practical ruleset strategy for protected branches and release tags with clear exception ownership.
