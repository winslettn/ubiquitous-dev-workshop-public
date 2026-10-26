<!-- Copilot Metadata
- **Module:** m00
  - **Module Group:** Shared
  - **Audience:** Dev
- **Title:** Setup (Shared)
- **Est. Duration:** 20 min. instruction / 40 min. hands-on
- **Type:** Shared
- **Topics:**
  - Accounts and access prerequisites
  - Local or Codespaces environment selection and readiness checks
  - IDE extension installation
  - Copilot sign-in and activation (optional)
  - Repository bootstrap and readiness checks
- **Docs:**
  - https://docs.github.com/en/get-started
  - https://docs.github.com/en/authentication
  - https://docs.github.com/en/copilot/get-started-with-github-copilot
  - https://docs.github.com/en/copilot/configuring-github-copilot
  - https://docs.github.com/en/repositories
- **Demos:**
  - [Codespaces](https://github.com/octodemo-framework/demo_codespaces/blob/main/README.md)
  - [OctoCat Supply: General Demo Setup](https://github.com/octodemo-framework/demo_octocat_supply/blob/main/demo/walkthroughs/general/general-demo-overview.md)
- **Source workshops:**
  - [37] MS Learn Module: Code with GitHub Codespaces — [GitHub Learn](https://learn.microsoft.com/en-us/training/modules/code-with-github-codespaces/)
  - [121] GitHub Skills Project-based exercise: Code with Codespaces — [GitHub Learn](https://github.com/skills/code-with-codespaces)
  - [MS Learn: Code with GitHub Codespaces (includes slide deck)](https://learn.microsoft.com/en-us/training/modules/code-with-github-codespaces/)
- **Source slides:** None
-->

# M00 Setup (Shared) - Instructor Materials

Use this module as the instructor facilitation guide for workshop setup and environment readiness.

## Preparation

### Delivery priorities

1. Start by confirming the workshop agenda reflects the actual modules, timing, and delivery plan for this engagement.
2. Keep the module focused on readiness: content access, environment choice, IDE setup, sign-in, and verification.
3. Default to the easiest working path for the audience, usually Codespaces, unless the customer requires manual local setup.
4. Reserve enough time for the instructor-led setup steps before participants move into independent exercises.

### Demo preparation

- Review the related workshop module: `m00-setup.md`.
- Confirm the agenda slides have been updated for the actual module lineup and timing.
- Confirm links, environments, repository access, and permissions needed for demonstrations.
- Decide in advance how participants will receive the workshop content:
  - fork,
  - template deployment, or
  - manual distribution.
- Decide in advance whether the session will use Codespaces or manual local setup.
- If using Codespaces, verify you can create a codespace on `main`, use GitHub CLI, and complete any required sign-in steps.
- If not using Codespaces, review the hidden IDE and runtime slides and prepare to unhide the manual-setup path.

### Success signal

Participants can access the workshop repository, start the chosen development environment, sign in to required tools, and complete the readiness checks with minimal prompting.

### INSTRUCTOR TODO callouts

- **Update the agenda slides** so Day 1, Day 2, and Day 3 reflect the specific modules for this delivery.
- **Choose the workshop content distribution method** before class starts and coordinate with the customer's GitHub admins if their tenant is involved.
- **Choose the environment path** before class starts:
  - Codespaces as the default/easiest path, or
  - manual local setup when customer constraints require it.
- **Hide or show the manual setup slides** based on that environment decision.

---

## Presentation

Duration: 20 min. instruction

1. Agenda and workshop flow
   - Confirm the three-day agenda reflects the actual delivery plan.
   - Call out any module substitutions, optional sections, or timing changes.
2. Workshop prerequisites
   - Confirm access to the workshop content repository.
   - Confirm the target environment and required tools.
3. Instructor-led content setup
   - Walk through the selected content distribution approach: fork, template deployment, or manual setup.
4. Instructor-led environment setup
   - Default path: Codespaces provisioning and verification.
   - Alternate path: local IDE, runtime, and repository setup when required.
5. IDE extension installation and optional Copilot activation
6. Repository bootstrap and readiness checks

### Demo cues

1. **Agenda review**
   - Explicitly note that the agenda slides are expected to be customized for the current workshop.
   - Point out where breaks, lunch, optional modules, or buffer time differ from the default deck.
2. **Workshop content setup**
   - State which content delivery path the class will use.
   - If using a customer tenant, explain any org-specific repo, template, or permission assumptions.
3. **Environment setup**
   - If using Codespaces, create the codespace on `main`, verify GitHub CLI, and optionally verify Copilot CLI and IDE sign-in.
   - If using manual local setup, unhide the IDE and runtime slides and walk through installation, cloning, and verification in that order.

---

## Lab Exercises

Duration: 40 min. hands-on

1. Exercise 1: Verify accounts and access prerequisites
2. Exercise 2: Set up your development environment
3. Exercise 3: Install IDE extensions
4. Exercise 4: Sign in to Copilot and validate activation
5. Exercise 5: Bootstrap the repository and run readiness checks

Transition into the workshop by pointing participants to `workshop/m00-setup.md` and keeping the class on the chosen setup path rather than letting multiple setup approaches diverge at once.

---

## Wrap-up

Confirm that every participant has working repository access, a functional environment, the required extensions and sign-ins, and a successful readiness check before moving on. Capture any unresolved setup issues, identify who will help resolve them, and decide whether affected participants should continue in Codespaces, local setup, or paired support for the next module.
