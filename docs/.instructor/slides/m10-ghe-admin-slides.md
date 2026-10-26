<!--
title: "Module 10: GitHub Enterprise Administration"
template: default
-->

# Module 10: GitHub Enterprise Administration

---

## Overview

<!--
layout: content
-->

- **Learning objectives**

  - Understand the differences between GitHub Enterprise Server (GHES), GitHub Enterprise Cloud (GHEC), GHEC data residency, and Enterprise Managed Users (EMU)

  - Choose the right authentication and authorization approach for governance, lifecycle management, and least-privilege access
  
  - Map enterprise, organization, and repository controls to the policies they enforce
  
  - Apply rulesets, settings automation, and governance boundaries consistently across the platform

---

## Platform Models

<!--
layout: section
-->

---

## GitHub Enterprise Deployment and Identity Models

<!--
layout: table
-->

| Model | Best fit | Primary admin considerations |
| --- | --- | --- |
| **GitHub Enterprise Server (GHES)** | Customer-managed hosting, network isolation, and tighter infrastructure control | Appliance lifecycle, upgrades, backup/restore, authentication integration, and operational ownership |
| **GitHub Enterprise Cloud (GHEC)** | SaaS delivery with the fastest feature velocity and lowest platform maintenance | Enterprise policy, organization structure, identity integration, and repository governance |
| **GHEC with Enterprise Managed Users (EMU)** | Centrally managed enterprise identities and lifecycle control on GHEC | Provisioning, deprovisioning, username management, and reduced reliance on personal accounts |
| **GHEC with data residency** | Cloud delivery with regional data residency requirements | Residency scope, enterprise policy rollout, and alignment with compliance requirements |

```speaker-notes
Key framing:
- GHES and GHEC are hosting/operating models.
- EMU is primarily an identity and lifecycle model on top of GHEC.
  - GHEC allows public/open-source contributions but requires developers to own their own identity. EMU providers the enterprise ownership of the identity but places a hard wall between company and open-source repositories.
  - Moving between GHEC and EMU requires a full migration (just like GHES>GHEC).
- Data residency is a governance and compliance decision, not a separate product experience for day-to-day users.

References:
- Enterprise accounts: https://docs.github.com/en/enterprise-cloud@latest/admin/overview/about-enterprise-accounts
- GitHub Enterprise Server: https://docs.github.com/en/admin/overview/about-github-enterprise-server
- Enterprise Managed Users: https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/understanding-iam-for-enterprises/about-enterprise-managed-users
```

---

## Authentication Models

<!--
layout: content
-->

- **GHES: Enterprise-managed authentication and integrations**
  - Uses built-in authentication by default, but can be integrated with external identity providers using either **SAML** or **LDAP** for centralized authentication

- **GitHub (including GHEC): Personal accounts with enterprise membership**
  - Users keep their own GitHub identities and can collaborate across multiple orgs and public repositories
  - GitHub is the system of identity for the account itself; enterprise membership grants access to enterprise resources
  - Best when external collaboration and open source participation are important

- **GHEC: SAML SSO with personal accounts**
  - Users still keep their personal GitHub accounts, but enterprise or org access is gated through the customer's identity provider
  - GitHub remains the account identity; SAML adds an enterprise sign-in requirement before those personal accounts can use protected resources
  - Improves centralized access control while preserving personal-account workflows

- **GHEC: Enterprise Managed Users (EMU)**
  - Accounts are provisioned and controlled by the enterprise identity system
  - Best for strict lifecycle management, standardized identity, and stronger control over enterprise access; required for GHEC with data residency
  - _Decision tradeoff: Personal accounts maximize developer flexibility; EMU maximizes enterprise control and identity governance._

```speaker-notes
References:
- Configuring built-in authentication (GHES): https://docs.github.com/en/enterprise-server@3.21/admin/managing-iam/using-built-in-authentication/configuring-built-in-authentication
- Using LDAP (GHES): https://docs.github.com/en/enterprise-server@3.21/admin/managing-iam/using-ldap-for-enterprise-iam/using-ldap
- Configuring SAML single sign-on for your enterprise (GHES): https://docs.github.com/en/enterprise-server@3.21/admin/managing-iam/using-saml-for-enterprise-iam/configuring-saml-single-sign-on-for-your-enterprise
- About SAML for enterprise IAM: https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/understanding-iam-for-enterprises/about-saml-for-enterprise-iam
- Configuring SAML single sign-on for your enterprise: https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/using-saml-for-enterprise-iam/configuring-saml-single-sign-on-for-your-enterprise
- Configuring authentication for EMU: https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/configuring-authentication-for-enterprise-managed-users

Clarify the distinction:
- GHES defaults to built-in authentication on the instance, but admins can switch to SAML or LDAP-based external authentication.
- Personal accounts with enterprise membership means GitHub authenticates the user and the enterprise grants access through membership.
- SAML SSO with personal accounts means GitHub still authenticates the personal account, but the enterprise also requires successful IdP sign-in before protected org or enterprise resources can be used.
- GHES is different because the enterprise controls the server and its authentication integrations directly.
- EMU goes further by moving account provisioning and lifecycle control into the enterprise identity system.
```

---

## Governance Model

<!--
layout: section
-->

---

## Enterprise, Organizations, and Repositories

<!--
layout: content
-->

- **Enterprise**
  - Central layer for identity, policy, audit, billing, and cross-organization governance
  - Best place for global standards and visibility across the platform

- **Organization**
  - Boundary for teams, repository portfolios, settings inheritance, and local administration
  - Often aligns to a business unit, product family, or governance domain

- **Repository**
  - Where delivery controls are enforced: code ownership, branch and tag rules, Actions permissions, and security features
  - Keep repo-level exceptions deliberate, documented, and time-bounded

```speaker-notes
References:
- Enterprise accounts: https://docs.github.com/en/enterprise-cloud@latest/admin/overview/about-enterprise-accounts
- About organizations: https://docs.github.com/en/organizations/collaborating-with-groups-in-organizations/about-organizations
- Managing repository settings and features: https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features
```

---

## Authorization with Teams and Roles

<!--
layout: content
-->

- **Teams are the primary access abstraction**
  - Group people by function, product, or support boundary rather than assigning repository access user-by-user
  - Use nested teams where needed to model business structure without duplicating permission grants

- **Custom enterprise & organization roles**
  - Create custom roles with fine-grained permissions for settings and resources when the built-in roles are too broad
  - Enterprise custom roles can delegate selected enterprise capabilities such as viewing audit logs or creating organizations
  - Enterprise-created organization custom roles use the same permission model as org-level custom roles; enterprise owners can create and edit them, while organization owners assign them

- **Repository roles**
  - Apply the minimum repository role required: Read, Triage, Write, Maintain, or Admin
  - Reserve owner and admin permissions for a small, accountable set of administrators

- **Governance guidance**
  - Prefer team-based access, auditable role assignments, and periodic review over direct collaborator sprawl
  - Use teams to assign roles at scale for more consistent access management
  - Separate platform administration from day-to-day repository maintenance where possible

```speaker-notes
References:
- About teams: https://docs.github.com/en/organizations/organizing-members-into-teams/about-teams
- Repository roles for an organization: https://docs.github.com/en/organizations/managing-access-to-your-organizations-repositories/repository-roles-for-an-organization
- Creating custom roles in an enterprise: https://docs.github.com/en/enterprise-cloud@latest/admin/managing-accounts-and-repositories/managing-roles-in-your-enterprise/create-custom-roles

Key points:
- Enterprise custom roles are in public preview and provide fine-grained delegation for selected enterprise settings.
- Organization custom roles can also be created from the enterprise scope, but assignment still happens with organization owners.
- Teams are still the recommended mechanism for assigning these roles consistently at scale.
```

---

## DEMO

<!--
layout: demo
hidden: true
-->

- Review enterprise / organization settings, including authentication

- Demonstrate team and role membership and administration

```speaker-notes
**INSTRUCTOR TODO:** If you are doing this with an admin audience, consider running this as "instructor-guided" with a customer participant showing their screen while the instructor shoulder surfs to explain the settings and approach.  If it is a developer audience, show the demo or cut it depending on timing constraints.

Demo preparation from instructor notes:
- Use organization settings screenshots or a safe sandbox org
- Prepare one policy-before / policy-after scenario

Suggested flow:
- Show where authentication is configured and how the model changes with SAML/SSO, EMU, or GHES-managed identity integrations
- Show how roles and teams are created and managed at enterprise or organization scope
- Open an enterprise or organization policy surface and explain which governance requirement it enforces

Reference demos:
- OctoCat Supply: Governance & Compliance: https://github.com/octodemo-framework/demo_octocat_supply/blob/main/demo/walkthroughs/governance.md
```

---

## Branch, Tag, and Ruleset Governance

<!--
layout: content
-->

- **Rulesets standardize enforcement**
  - Define branch and tag protections once and apply them consistently across repositories or repository groups
  - Prefer rulesets over one-off branch protection drift where possible

- **Typical branch controls**
  - Require pull requests, status checks, and up-to-date branches before merge
  - Enforce CODEOWNERS reviews, restrict force pushes, or limit who can bypass controls

- **Tag and release integrity**
  - Protect release tags from unauthorized creation, update, or deletion
  - Use tag governance to preserve provenance for release and deployment processes

- **Administrative outcome**
  - Turn policy intent into reusable, auditable enforcement with clear exceptions

```speaker-notes
References:
- About rulesets: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/about-rulesets
- Managing rulesets for repositories in your organization: https://docs.github.com/en/organizations/managing-organization-settings/managing-rulesets-for-repositories-in-your-organization
- Managing a branch protection rule: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-a-branch-protection-rule
```

---

## DEMO

<!--
layout: demo
-->

- Review repository branch, tag, or ruleset enforcement

- Show repository-level settings administration

```speaker-notes
**INSTRUCTOR TODO:** If you are doing this with an admin audience, consider running this as "instructor-guided" with a customer participant showing their screen while the instructor shoulder surfs to explain the settings and approach.

Demo preparation from instructor notes:
- Use organization settings screenshots or a safe sandbox org
- Prepare one policy-before / policy-after scenario

Suggested flow:
- Open a repository ruleset and explain which branch or tag governance requirement it enforces
- Show repository settings such as access, merge controls, Actions permissions, or security-related configuration
- If available, show a Terraform definition, API call, or CLI workflow that makes repository administration repeatable

Reference demos:
- OctoCat Supply: Governance & Compliance: https://github.com/octodemo-framework/demo_octocat_supply/blob/main/demo/walkthroughs/governance.md
```

---

## Administrative Operations

<!--
layout: section
-->

---

## Settings Management and Configuration as Code

<!--
layout: content
-->

- **Administrative settings span multiple scopes**
  - Enterprise, organization, and repository settings all participate in governance
  - Security, Actions, repository creation, member policies, and access controls should align to a documented baseline

- **Automate where possible**
  - Use native APIs, the GitHub CLI, and infrastructure-as-code tools such as Terraform to manage repeatable settings
  - Keep governance definitions versioned, reviewable, and recoverable like application code

- **Operate with evidence**
  - Pair configuration changes with audit logs, change review, and verification steps
  - Treat settings drift as an operational risk, especially for security-sensitive controls

```speaker-notes
References:
- Managing accounts and repositories: https://docs.github.com/en/enterprise-cloud@latest/admin/managing-accounts-and-repositories
- Managing security settings for your organization: https://docs.github.com/en/organizations/keeping-your-organization-secure/managing-security-settings-for-your-organization
- About repository settings: https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/about-repository-settings
```

---

## InnerSource and Open Source Governance Boundaries

<!--
layout: content
-->

- **InnerSource is governed collaboration inside the enterprise**
  - Encourage discoverability, contribution workflows, and reusable standards across internal teams
  - Use org boundaries, visibility settings, and team ownership to control who can see and change code

- **Open source introduces additional governance requirements**
  - Public visibility, outside collaborators, community interactions, and disclosure processes require explicit policy
  - Define who can create public repositories, accept external contributions, and publish reusable assets
  - Not available for EMU or data resident GHEC

- **Admin responsibility**
  - Make the boundary between internal collaboration and public participation intentional, documented, and reviewable

```speaker-notes
Use this slide to connect platform administration to program governance:
- InnerSource benefits from broader visibility and lower friction, but still needs ownership and policy.
- Open source requires additional review for licensing, security disclosure, and external participation.
```

---

## Wrap-up

<!--
layout: section
-->

---

## Module Summary

<!--
layout: content
-->

- **Platform choices**
  - Choose GHES, GHEC, data residency, or EMU based on hosting, compliance, identity, and operational-control needs

- **Identity and access**
  - Distinguish GitHub-authenticated personal accounts, SAML-gated enterprise access, GHES-managed authentication, and EMU-managed identities
  - Use teams, built-in roles, and custom roles to implement least privilege at scale

- **Governance layers**
  - Apply enterprise, organization, and repository controls deliberately, with rulesets turning policy into reusable enforcement
  - Align enterprise and organization administration separately from repository-level administration

- **Admin operations**
  - Automate settings with APIs, CLI, or infrastructure as code, track evidence, and define clear InnerSource versus open source boundaries

---

## Exercises

<!--
layout: content
-->

Reference **workshop/m10-ghe-admin.md** for the full exercise guidance

- **Exercise 1: Review Authentication Settings**

- **Exercise 2: Authorization**

- **Exercise 3: Repo Management**

- **Exercise 4: Branches and Rulesets**

```speaker-notes
**INSTRUCTOR TODO:** 
Use this slide to transition into the workshop.

Success signal from instructor notes:
- Participants can map an enterprise governance requirement to a concrete GitHub control and verification step.

Wrap-up emphasis:
- Summarize each control in terms of control, evidence, and owner for follow-up.
```
