# Context Engineering

**Audience:** Developers optimizing Copilot output quality, speed, and cost

## Overview

This module builds practical context engineering habits for GitHub Copilot workflows in `dev-workshops`. You will learn how to reduce token waste, choose model modes intentionally, budget context windows, retrieve only high-signal context, structure prompts for precision, and measure output quality so improvements are repeatable.

### Key Concepts

1. Token and cost optimization.
2. Model selection and Auto mode.
3. Context window budgeting and trade-offs.
4. Retrieval and context selection strategy.
5. Prompt structure for precise outputs.
6. Context quality measurement techniques.

## Prerequisites

- GitHub Copilot access in your IDE or GitHub.com chat.
- A local clone of `dev-workshops` with ability to open files and run basic validation commands.
- Familiarity with module workflows from `m22` and `m23`.

## Exercises

### Exercise 1: Reduce token usage and cost per task

**Objective:** Create a repeatable approach that lowers token usage without reducing answer quality.

**Exercise type:** Hands-on

**Hands-on:**
1. Pick one small change request in `workshop/` or `src/` and write two prompts:
   - Prompt A: broad request with minimal constraints.
   - Prompt B: scoped request with explicit goal, files, and output format.
2. Use [Write better prompts for GitHub Copilot](https://docs.github.com/en/copilot/how-tos/write-better-prompts-for-github-copilot) to tighten Prompt B by removing non-essential wording.
3. Run both prompts and compare response length, relevance, and required follow-up edits.
4. Capture a one-page “token-saving checklist” for future tasks (for example: file cap, no duplicate context, explicit output format).

**Expected outcomes:**
- A baseline prompt and a token-optimized prompt for the same task.
- A short checklist you can reuse in later modules.

**Knowledge Check:**
1. Which prompt edits reduced noise the most?
2. How did reduced context affect response quality?
3. Which parts of your original prompt were unnecessary?

### Exercise 2: Compare model selection with Auto mode

**Objective:** Decide when Auto mode is sufficient and when explicit model choice is better.

**Exercise type:** Hands-on

**Hands-on:**
1. Select one medium-complexity task (for example, “propose a refactor plan for one route and one test file”).
2. Run it once in Auto mode and once with an explicit model selection in the same chat workflow.
3. Compare outputs for correctness, depth, and editability.
4. Write decision rules: when to stay in Auto mode and when to choose a model explicitly.

**Expected outcomes:**
- A side-by-side comparison log for Auto and explicit model runs.
- Team-ready model selection rules for common task types.

**Knowledge Check:**
1. For which task type did Auto mode perform best?
2. What output differences justified explicit model choice?
3. What is your default model-mode decision path now?

### Exercise 3: Budget the context window with trade-off rules

**Objective:** Build a context budgeting method that balances precision, coverage, and speed.

**Exercise type:** Instructor-Guided

**Hands-on:**
1. Start with a realistic request that spans multiple files.
2. Set a context budget before prompting:
   - Maximum number of files
   - Maximum reference length per file
   - Stop condition for adding new context
3. Run one pass with your strict budget and one pass with expanded context.
4. Record what improved and what degraded (accuracy, latency, and unnecessary output).

**Expected outcomes:**
- A written context budget template.
- Clear trade-off rules for when to expand vs. constrain context.

**Knowledge Check:**
1. What signals showed that context was too narrow?
2. What signals showed it was too broad?
3. Which budget limits should become your default?

### Exercise 4: Build a retrieval and context selection strategy

**Objective:** Define retrieval order that prioritizes high-signal repository context.

**Exercise type:** Hands-on

**Hands-on:**
1. For a selected task, list candidate context sources in order before prompting (for example: module file, related tests, architecture docs, instructions).
2. Apply this retrieval order:
   - Start with directly edited files
   - Add adjacent tests
   - Add architecture or workshop guidance only when needed
3. Use [About prompts](https://docs.github.com/en/copilot/how-tos/write-better-prompts-for-github-copilot/about-prompts) to rewrite your request so each context item has a reason for inclusion.
4. Re-run and verify that irrelevant references are removed from the output.

**Expected outcomes:**
- A retrieval sequence you can apply to future changes.
- Better relevance from Copilot responses with less context noise.

**Knowledge Check:**
1. Which context source had the highest signal for your task?
2. What did you intentionally exclude and why?
3. How did retrieval order change output precision?

### Exercise 5: Use structured prompts for precise outputs

**Objective:** Standardize prompt structure so Copilot responses are predictable and review-ready.

**Exercise type:** Hands-on

**Hands-on:**
1. Create a prompt template with these sections: objective, constraints, files, assumptions, and response format.
2. Apply the template to one coding task and one documentation task.
3. Require explicit output shape (for example: “return only patch summary + verification steps”).
4. Compare results against an unstructured prompt for the same tasks.

**Expected outcomes:**
- A reusable prompt template for engineering tasks.
- Higher consistency in output format and scope control.

**Knowledge Check:**
1. Which prompt section improved precision most?
2. How did output-format constraints reduce rework?
3. What template changes are still needed for your team?

### Exercise 6: Measure context quality and iterate

**Objective:** Evaluate prompt/context quality with simple metrics and improve in short loops.

**Exercise type:** Whiteboard/Discussion

**Hands-on:**
1. Define 3 quality metrics for your Copilot workflow (for example: acceptance rate, number of prompt iterations, validation pass rate).
2. Run two iterations of the same task and score each iteration against your metrics.
3. Identify one context improvement and one prompt improvement, then re-run.
4. Record your final “quality gate” before opening a pull request.

**Expected outcomes:**
- A measurable quality scorecard for Copilot outputs.
- A repeatable iteration loop tied to review readiness.

**Knowledge Check:**
1. Which metric best predicted output usefulness?
2. What change produced the biggest quality improvement?
3. What threshold indicates a result is ready for PR review?

## Completion Criteria

1. You can reduce token use while preserving output quality.
2. You can choose between Auto mode and explicit model selection intentionally.
3. You can set and apply context window budgets with clear trade-off rules.
4. You can retrieve and prioritize high-signal context for a task.
5. You can use structured prompts to produce precise, reviewable outputs.
6. You can measure and improve context quality with repeatable metrics.
