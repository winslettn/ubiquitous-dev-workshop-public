# Advanced GitHub Copilot

**Audience:** Developers and technical contributors building advanced, repeatable Copilot workflows

## Overview

This module helps you move from ad hoc Copilot usage to structured, high-signal workflows. You will compare advanced harnesses (CLI, GitHub Copilot App, and chat surfaces), design robust custom instructions, apply skills and slash commands, connect external systems with MCP, use planning mode for complex work, and execute safe multi-file refactors with validation checkpoints.

### Key Concepts

1. Harnesses: CLI, GitHub Copilot App, and related Copilot entry points.
2. Custom instructions and `AGENTS.md` design.
3. Skills and slash-command workflows.
4. MCP integrations for external systems.
5. Planning mode for complex tasks.
6. Advanced multi-file refactoring patterns.

## Prerequisites

1. You can access GitHub Copilot in your IDE and terminal environment.
2. You have a local clone of `dev-workshops` and can run repository commands.
3. You completed or reviewed `m22` fundamentals and `m24` context engineering workflows.
4. You reviewed [GitHub Copilot App](https://docs.github.com/en/copilot/concepts/agents/github-copilot-app) and [custom agents](https://docs.github.com/en/copilot/concepts/agents/about-custom-agents) concepts.

## Exercises

### Exercise 1: Compare advanced Copilot harnesses for one scoped task

**Objective:** Select the best harness for a task by comparing output quality, speed, and control.

**Exercise Type:** Hands-on

**Hands-on:**
1. Choose one scoped task in this repository (for example: update one workshop section or improve one small route handler).
2. Run the task once in Copilot CLI and once in GitHub Copilot App or GitHub chat, using [Copilot CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) and [chat in GitHub](https://docs.github.com/en/copilot/how-tos/copilot-on-github/chat-with-copilot/chat-in-github).
3. Capture comparison notes for: setup friction, context handling, response precision, and effort to reach a usable result.
4. Decide a default harness choice for three task types: quick fix, multi-file change, and review/summarization.

**Expected outcomes:**
- A harness comparison table for at least two Copilot entry points.
- A personal decision rule for choosing the right harness per task type.

**Knowledge Check:**
1. Which harness produced the most implementation-ready output for your task, and why?
2. Which harness gave you the strongest control over scope and validation?
3. When should you switch harnesses instead of retrying prompts in the same one?

### Exercise 2: Design repository-level custom instructions and `AGENTS.md` guardrails

**Objective:** Build a consistent behavior baseline that improves reliability across Copilot sessions.

**Exercise Type:** Hands-on

**Hands-on:**
1. Review existing instruction files in `.github/instructions/` and identify one gap in behavior guidance.
2. Draft or refine instruction guidance using [add custom instructions](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-custom-instructions) and [custom agents configuration](https://docs.github.com/en/copilot/reference/custom-agents-configuration).
3. Create an `AGENTS.md` template for task scope, required validation commands, and escalation rules for ambiguous changes.
4. Run one before/after comparison prompt in the same file to evaluate consistency and correctness changes.

**Expected outcomes:**
- A reusable custom instruction baseline for this repository.
- An `AGENTS.md` pattern that reduces prompt ambiguity and overreach.

**Knowledge Check:**
1. Which instruction clause most improved output consistency?
2. What `AGENTS.md` rule best prevented unscoped edits?
3. What evidence showed the updated guidance improved quality?

### Exercise 3: Build a skill and slash-command workflow for repeat tasks

**Objective:** Package a repeated engineering workflow into a reusable skill/command pattern.

**Exercise Type:** Instructor-Guided

**Hands-on:**
1. Identify one recurring task pattern (for example: “read instructions → edit one module → verify structure consistency”).
2. Design a skill-oriented flow using [agent skills](https://docs.github.com/en/copilot/concepts/agents/agent-skills) and [add skills](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills).
3. Define a slash-command style invocation and expected output shape (for example: checklist + edits + verification notes), using the [chat cheat sheet](https://docs.github.com/en/copilot/reference/chat-cheat-sheet).
4. Test the workflow on one small task and document where manual review remains mandatory.

**Expected outcomes:**
- One reusable skill/slash-command workflow definition.
- Clear boundaries between automation and required human review.

**Knowledge Check:**
1. Which workflow step benefited most from standardization?
2. What should never be fully delegated in this workflow?
3. How will you know the skill is still useful after multiple runs?

### Exercise 4: Connect external context with MCP safely

**Objective:** Evaluate and configure MCP usage so external context improves output without increasing risk.

**Exercise Type:** Hands-on

**Hands-on:**
1. Open `.vscode/mcp.json` and map each configured server to its intended use.
2. Use [MCP concepts](https://docs.github.com/en/copilot/concepts/context/mcp), [extend Copilot Chat with MCP](https://docs.github.com/en/copilot/how-tos/provide-context/use-mcp-in-your-ide/extend-copilot-chat-with-mcp), and [configure MCP server access](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-mcp-usage/configure-mcp-server-access) to classify each integration as approved, restricted, or not needed.
3. Test one safe MCP-assisted query and one local-only alternative for the same question.
4. Record governance decisions: allowed data sources, sensitive boundaries, and owner for MCP policy review.

**Expected outcomes:**
- An MCP usage map for this repository.
- A practical allow/deny guideline for external context access.

**Knowledge Check:**
1. What criteria made an MCP server “safe enough” for your workflow?
2. Which tasks should remain local-only?
3. What controls are required before enabling broader MCP access?

### Exercise 5: Use planning mode for complex, staged execution

**Objective:** Turn a complex request into a validated plan before implementation starts.

**Exercise Type:** Hands-on

**Hands-on:**
1. Pick a realistic complex request (for example: “update one API flow and matching workshop documentation with tests”).
2. Use [plan a project](https://docs.github.com/en/copilot/tutorials/plan-a-project) to generate a step-by-step plan with explicit files, validation commands, and stop conditions.
3. Review the plan and tighten scope until each step is independently verifiable.
4. Execute only the first one or two plan steps and confirm results before continuing.
5. Record one plan adjustment caused by intermediate output or discovered constraints.

**Expected outcomes:**
- A staged plan with explicit validation gates.
- Evidence that plan-first execution reduced rework risk.

**Knowledge Check:**
1. Which planning detail prevented the most downstream mistakes?
2. What signal told you the plan was still too broad?
3. When should you re-plan instead of continuing execution?

### Exercise 6: Execute an advanced multi-file refactor with guardrails

**Objective:** Complete a scoped multi-file refactor while preserving correctness, traceability, and reviewability.

**Exercise Type:** Hands-on

**Hands-on:**
1. Select a refactor involving at least two files (for example: shared utility extraction in `src/api-ts/src` plus test updates), guided by [refactor code](https://docs.github.com/en/copilot/tutorials/refactor-code).
2. Define hard constraints before editing: files in scope, no unrelated changes, and required validation commands.
3. Execute the refactor with Copilot assistance in small batches and run validation after each batch.
4. Create a short PR-ready summary: what changed, why it changed, and how correctness was verified.
5. Run a final self-review pass for overreach, regression risk, and missing tests or docs updates.

**Expected outcomes:**
- A scoped, validated multi-file refactor result.
- A review-ready change summary with clear verification evidence.

**Knowledge Check:**
1. Which guardrail most effectively prevented accidental scope creep?
2. What validation evidence gave confidence the refactor is safe?
3. What would trigger a rollback or split into smaller pull requests?

## Completion Criteria

1. You can select the right Copilot harness for different advanced task categories.
2. You can define custom instructions and `AGENTS.md` rules that improve consistency and safety.
3. You can design and use skill/slash-command workflows for repeat engineering tasks.
4. You can evaluate and apply MCP integrations with clear governance boundaries.
5. You can use planning mode to stage complex work with explicit validation gates.
6. You can execute advanced multi-file refactors with scope control and review-ready evidence.
