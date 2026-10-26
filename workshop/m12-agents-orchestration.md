# Agent HQ - Agents & Orchestration

**Audience:** Developers and technical contributors building agent-assisted delivery workflows

## Overview

This module focuses on using GitHub Copilot agents to plan, delegate, execute, and refine multi-step development work in `dev-workshops`. You will practice selecting the right agent mode, decomposing work into actionable issues, orchestrating parallel tasks, and monitoring agent runs so you can move from prompt to reviewed implementation with less manual coordination.

### Key Concepts

1. Agent mode fundamentals across Copilot Chat, pull request (PR) summaries, Code Review Agent, and Cloud Agent.
2. Task decomposition for autonomous execution with issue creation and clear acceptance criteria.
3. Multi-agent orchestration patterns for parallel and sequential work.
4. Delegation and prompt scoping strategy to reduce rework.
5. Agent run monitoring and iterative refinement based on intermediate output.
6. Related platform capabilities including Copilot Spaces, custom instructions, memory, and Model Context Protocol (MCP) integration in GitHub Copilot Chat.

## Exercises

### Exercise 1: Hands-on Copilot Chat issue intake, decomposition, and validation planning

**Objective:** Create and refine a scoped issue that is ready for agent execution, build validation, and review.

**Hands-on:**
1. From `workshop/m12-agents-orchestration`, run `./create-issue.sh` (Bash) or `.\create-issue.ps1` (PowerShell), then open and review the generated issue in GitHub.
2. Update the issue to target a small change in `src/api-ts/src/routes` or `src/frontend/src/components`, and add explicit validation commands for the chosen scope. At minimum, include the relevant build command and the automated tests the agent must run before review (for example, `cd src/api-ts && npm run build && npm run test`).
3. In Copilot Chat, ask for task decomposition into 3-5 work items with acceptance criteria, using [Chat with Copilot on GitHub](https://docs.github.com/en/copilot/how-tos/copilot-on-github/chat-with-copilot/chat-in-github). Require one work item for executing the build, one for running or adding unit tests as needed, and one for reviewing the output before opening a pull request.
4. Paste the refined task breakdown back into the issue and confirm the scope fits one pull request.
5. Add a short reviewer checklist to the issue that verifies the build completed successfully, unit tests were run, and any failures or warnings were triaged before the change is considered ready for agent handoff.

**Knowledge Check:**
1. Which Copilot Chat prompt produced the clearest issue decomposition?
2. How did you confirm the issue included enough detail for an agent to run and review the build successfully?
3. Which acceptance criteria were most important for ensuring unit tests were executed and reviewed?
4. What would you change before handing this issue to an agent or reviewer?

### Exercise 2: Hands-on pull request summary workflow

**Objective:** Use pull request summaries to speed reviewer understanding and feedback loops.

**Hands-on:**
1. Create a draft pull request for your scoped change and request a Copilot pull request summary.
2. Compare the summary with your intended scope and update the pull request description when gaps appear.
3. Add one reviewer note that references the summary and asks for targeted feedback.
4. Track how the summary improved reviewer onboarding speed and clarity.

**Knowledge Check:**
1. Which pull request summary details helped reviewers the most?
2. What summary gaps required manual clarification?
3. How did summary quality affect review turnaround?
4. What should always stay human-authored in the pull request body?

### Exercise 3: Hands-on Code Review Agent loop

**Objective:** Use Code Review Agent findings to improve a pull request before merge.

**Hands-on:**
1. Run Code Review Agent against your draft pull request.
2. Triage findings into required fixes, optional improvements, and false positives.
3. Apply at least one meaningful fix and respond to the corresponding review comment.
4. Re-run review and capture what changed in issue or pull request notes.

**Knowledge Check:**
1. Which Code Review Agent findings were highest signal for this change?
2. How did you decide which findings to accept or defer?
3. What evidence showed review quality improved after fixes?
4. How should teams handle recurring low-value findings?

### Exercise 4: Hands-on Cloud Agent delegation and monitoring

**Objective:** Delegate a scoped subtask to Cloud Agent and iterate based on run output.

**Hands-on:**
1. Select one subtask from your issue and delegate it to Cloud Agent with explicit scope, files, and acceptance criteria.
2. Monitor run output and identify one place where prompt scope needs refinement.
3. Re-run with improved scope, using [Use Cloud Agent on GitHub](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/use-cloud-agent-on-github). 

**Knowledge Check:**
1. What prompt details most improved Cloud Agent output quality?
2. Which monitoring signals indicated the first run needed refinement?
3. What tasks are good candidates for Cloud Agent versus direct editing?
4. How would you standardize this delegation flow for your team?

## Completion Criteria

1. You can decompose a feature request into agent-ready work units with explicit scope.
2. You can use Copilot pull request summaries to accelerate reviewer understanding.
3. You can apply Code Review Agent feedback to improve pull request quality.
4. You can run and monitor Cloud Agent delegation, then refine prompts when outputs are incomplete.
5. You can explain how to combine Copilot Chat, pull request summaries, Code Review Agent, and Cloud Agent in one delivery loop.
