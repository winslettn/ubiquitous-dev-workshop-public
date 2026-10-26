<!-- Copilot Metadata
- **Module:** m10
- **Module Group:** Development Platform (10+)
- **Audience:** Admin
- **Title:** GHE Admin
- **Est. Duration:** 25 min. instruction / 35 min. hands-on
- **Type:** Optional
- **Topics:**
  - GHE Variants: GHES, GHEC, GHEC-DR (Proxima), Enterprise Managed Users (EMU)
  - Authentication: Personal Accounts, Enterprise with personal accounts, SAML/SSO. and Enterprise Managed Users
  - Authorization: Teams and Roles
  - Enterprises, Organizations, and Repos
  - Branches, Tags, and Rulesets
  - Settings: Management, Configuration as code (native and 3rd party such as Terraform), APIs, and security settings
  - InnerSource and open source governance boundaries
- **Docs:**
  - **GHE Variants:**
    - https://docs.github.com/en/enterprise-cloud@latest/admin/overview/about-enterprise-accounts
    - https://docs.github.com/en/admin/overview/about-github-enterprise-server
    - https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/understanding-iam-for-enterprises/about-enterprise-managed-users
  - **Authentication:**
    - https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/understanding-iam-for-enterprises/about-saml-for-enterprise-iam
    - https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/using-saml-for-enterprise-iam/configuring-saml-single-sign-on-for-your-enterprise
    - https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/configuring-authentication-for-enterprise-managed-users
  - **Authorization:**
    - https://docs.github.com/en/organizations/organizing-members-into-teams/about-teams
    - https://docs.github.com/en/organizations/managing-access-to-your-organizations-repositories/repository-roles-for-an-organization
  - **Enterprises, Organizations, and Repos:**
    - https://docs.github.com/en/enterprise-cloud@latest/admin/overview/about-enterprise-accounts
    - https://docs.github.com/en/organizations/collaborating-with-groups-in-organizations/about-organizations
    - https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features
  - **Settings:**
    - https://docs.github.com/en/enterprise-cloud@latest/admin/managing-accounts-and-repositories
    - https://docs.github.com/en/organizations/keeping-your-organization-secure/managing-security-settings-for-your-organization
    - https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/about-repository-settings
  - **Branches, Tags, and Rulesets:**
    - https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/about-rulesets
    - https://docs.github.com/en/organizations/managing-organization-settings/managing-rulesets-for-repositories-in-your-organization
    - https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-a-branch-protection-rule
- **Demos:**
  - [OctoCat Supply: Governance & Compliance](https://github.com/octodemo-framework/demo_octocat_supply/blob/main/demo/walkthroughs/governance.md)
- **Source workshops:**
  - [3] Copilot Introduction Workshop — [GitHub PAF](https://miniature-adventure-vmnkp9n.pages.github.io/resources?type=guided-engagement&search=workshop)
  - [38] MS Learn Module: Manage your work with GitHub Projects — [GitHub Learn](https://learn.microsoft.com/en-us/training/modules/manage-work-github-projects/)
  - [39] MS Learn Module: Communicate effectively on GitHub using markdown — [GitHub Learn](https://learn.microsoft.com/en-us/training/modules/communicate-using-markdown/?ns-enrollment-type=Collection&ns-enrollment-id=o1njfe825p602p)
  - [40] MS Learn Module: Contribute to an open-source project on GitHub — [GitHub Learn](https://learn.microsoft.com/en-us/training/modules/contribute-open-source/?ns-enrollment-type=Collection&ns-enrollment-id=o1njfe825p602p)
  - [41] MS Learn Module: Manage an InnerSource program by using GitHub — [GitHub Learn](https://learn.microsoft.com/en-us/training/modules/manage-innersource-program-github/?ns-enrollment-type=Collection&ns-enrollment-id=o1njfe825p602p)
  - [43] MS Learn Module: Manage repository changes by using pull requests on GitHub — [GitHub Learn](https://learn.microsoft.com/en-us/training/modules/manage-changes-pull-requests-github/?ns-enrollment-type=Collection&ns-enrollment-id=o1njfe825p602p)
  - [44] MS Learn Module: Search and organize repository history by using GitHub — [GitHub Learn](https://learn.microsoft.com/en-us/training/modules/search-organize-repository-history-github/?ns-enrollment-type=Collection&ns-enrollment-id=o1njfe825p602p)
  - [45] MS Learn Module: Introduction to GitHub Advanced Security — [GitHub Learn](https://learn.microsoft.com/en-us/training/modules/introduction-github-advanced-security/?ns-enrollment-type=Collection&ns-enrollment-id=rqymc6yw8q5rey)
  - [52] MS Learn Module: Manage sensitive data and security policies within GitHub — [GitHub Learn](https://learn.microsoft.com/en-us/training/modules/manage-sensitive-data-security-policies)
  - [56] GitHub Skills Project-based exercise: Secure code game — [GitHub Learn](https://github.com/skills/secure-code-game)
  - [57] GitHub Skills Project-based exercise: Migrate an Azure DevOps Repository — [GitHub Learn](https://github.com/skills/migrate-ado-repository)
  - [58] MS Learn Module: Introduction to GitHub administration — [GitHub Learn](https://learn.microsoft.com/en-us/training/modules/github-introduction-administration/)
  - [63] MS Learn Module: Introduction to GitHub Actions — [GitHub Learn](https://learn.microsoft.com/en-us/training/modules/introduction-to-github-actions/)
  - [83] MS Learn Module: Automate Azure infrastructure change reviews by using Bicep and GitHub — [GitHub Learn](https://learn.microsoft.com/en-us/training/modules/automate-azure-infrastructure-change-reviews-using-bicep-github/)
  - [97] MS Learn Module: Introduction to GitHub's products — [GitHub Learn](https://learn.microsoft.com/en-us/training/modules/github-introduction-products/)
  - [98] MS Learn Module: Authenticate and authorize user identities on GitHub — [GitHub Learn](https://learn.microsoft.com/en-us/training/modules/authenticate-authorize-user-identities-github/)
  - [99] GitHub Skills Project-based exercise: Introduction to GitHub — [GitHub Learn](https://github.com/skills/introduction-to-github)
  - [100] GitHub Skills Project-based exercise: Communicate using Markdown — [GitHub Learn](https://github.com/skills/communicate-using-markdown)
  - [101] GitHub Skills Project-based exercise: GitHub Pages — [GitHub Learn](https://github.com/skills/github-pages)
  - [109] GitHub Skills Project-based exercise: Turn an idea into an app with GitHub Spark — [GitHub Learn](https://github.com/skills/idea-to-app-with-spark)
  - [111] GitHub Skills Project-based exercise: Test with Actions — [GitHub Learn](https://github.com/skills/test-with-actions)
  - [118] GitHub Skills Project-based exercise: Introduction to Git — [GitHub Learn](https://github.com/skills/introduction-to-git)
  - [119] GitHub Skills Project-based exercise: Review Pull Requests — [GitHub Learn](https://github.com/skills/review-pull-requests)
  - [120] GitHub Skills Project-based exercise: Resolve merge conflicts — [GitHub Learn](https://github.com/skills/resolve-merge-conflicts)
  - [122] GitHub Skills Project-based exercise: Introduction to Repository Management — [GitHub Learn](https://github.com/skills/introduction-to-repository-management)
  - [MS Learn: Introduction to GitHub's products (includes slide deck)](https://learn.microsoft.com/en-us/training/modules/github-introduction-products/)
  - [MS Learn: Introduction to GitHub administration (includes slide deck)](https://learn.microsoft.com/en-us/training/modules/github-introduction-administration/)
  - [Copilot Introduction Workshop — GitHub PAF (requires sign-in)](https://miniature-adventure-vmnkp9n.pages.github.io/resources?type=guided-engagement&search=workshop)
- **Source slides:** None
-->


# M10: GitHub Enterprise Administration - Instructor Materials

Use this module as the instructor facilitation guide for enterprise and organization administrators.

## Preparation

### Delivery priorities

1. Follow the slide flow: overview, platform models, authentication, governance layers, authorization, repository enforcement, administrative operations, and wrap-up.
2. Keep the discussion anchored in operational governance: identity lifecycle, least privilege, reusable policy, and auditability.
3. Distinguish clearly between hosting model decisions (GHES vs. GHEC), identity model decisions (personal accounts, SAML SSO, EMU), and policy enforcement decisions (teams, roles, rulesets, and settings automation).
4. Use the hidden demo and optional talking points only when the audience needs deeper admin workflow walkthroughs.
5. Reserve enough time to connect each platform control to a verification step participants can repeat in their own environment.

### Demo preparation

- Use organization settings screenshots or a safe sandbox org.
- Prepare one policy-before / policy-after scenario.
- Confirm the presenter account can access enterprise, organization, and repository settings that match the story you plan to tell.
- If showing automation, prepare one API, CLI, or Terraform example that demonstrates repeatable administration.

### Success signal

Participants can map an enterprise governance requirement to a concrete GitHub control and verification step.

---

## Presentation

Duration: 25 min. instruction

1. Overview and learning objectives
2. Platform models
3. Authentication models
4. Governance layers
5. Authorization with teams and roles
6. Branch, tag, and ruleset governance
7. Administrative operations
8. Module summary and transition to exercises

### Demo cues

1. **Optional governance and identity demo**
   - For an admin audience, consider running this as instructor-guided with a customer participant sharing their screen while you shoulder-surf and narrate the settings and rationale.
   - For a developer audience, either shorten this demo or cut it if timing is tight.
   - Review enterprise or organization authentication settings and explain how the model changes for GHES, SAML SSO, or EMU.
   - Show team membership, role assignment, or delegated administration at the appropriate scope.
   - Connect one governance requirement to the exact policy surface that enforces it.
2. **Repository governance demo**
   - For an admin audience, consider running this as instructor-guided with a customer participant sharing their screen while you shoulder-surf and narrate the settings and rationale.
   - Create or review a team hierarchy which can be used by the students in Exercise 2.
   - Open a repository or organization ruleset and explain which branch or tag policy it standardizes.
   - Show repository settings such as merge controls, Actions permissions, access controls, or security-related configuration.
   - If available, show the same control represented in Terraform, CLI, or API form to reinforce configuration as code.

---

## Lab Exercises

Duration: 35 min. hands-on

1. Exercise 1: Discuss GitHub Enterprise architecture
2. Exercise 2: Authorization
3. Exercise 3: Repo Management
4. Exercise 4: Branches and Rulesets

Use the exercises slide as the transition into the workshop portion of the module.

```

---

## Wrap-up

Reinforce the operating model: choose the right platform and identity approach first, implement team-based access and least privilege second, then enforce repository policy through rulesets and settings automation. Close by summarizing each follow-up item in terms of the control, the evidence that proves it is working, and the owner accountable for maintaining it, then transition directly into the workshop with the reminder that participants should be able to map each governance requirement to a concrete GitHub control and verification step.
