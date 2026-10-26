# GitHub Copilot Fundamentals

**Audience:** Developers and engineers new to daily Copilot workflows

## Overview

This module gives you a practical baseline for using GitHub Copilot every day in your editor and terminal workflow. You will practice IDE chat and inline completions, improve prompt quality through short iteration loops, generate code/tests/docs with human review, and build a repeatable productivity loop that avoids common beginner mistakes.

### Key Concepts

1. IDE usage with Copilot Chat and inline completions.
2. Prompting fundamentals and iteration loops.
3. Assisted generation of code, tests, and documentation.
4. Editor workflows for daily productivity.
5. Common beginner pitfalls and how to fix them.

## Prerequisites

1. GitHub Copilot is enabled for your account and your IDE extension is signed in, based on [GitHub Copilot setup guidance](https://docs.github.com/en/copilot/get-started-with-github-copilot).
2. This repository is open locally in your IDE.
3. You can run project commands from terminal in the repository root.
4. You have reviewed [GitHub Copilot docs](https://docs.github.com/en/copilot) and [using GitHub Copilot](https://docs.github.com/en/copilot/using-github-copilot) for feature orientation.

## Exercises

### Exercise 1: Use IDE Chat and inline completions on a scoped change

**Objective:** Apply Copilot Chat and inline completions together in one realistic edit.

**Exercise Type:** Hands-on

**Hands-on:**
1. Open one target file in `src/api-ts/src/routes` or `src/frontend/src/components`.
2. In Copilot Chat, ask for a small scoped improvement plan for that file (for example: input validation, clearer naming, or a small UX enhancement).
3. Implement the change using inline completions. Accept suggestions that match intent, and dismiss suggestions that do not.
4. Ask Copilot Chat to explain the final code path in plain language and verify the explanation matches what you intended.
5. Capture one short note in your branch or local notes: where chat helped most vs where inline completion helped most.

**Knowledge Check:**
1. Which part of the task was better handled by inline completion than chat?
2. Which suggestion did you reject, and why?
3. How did you verify Copilot’s explanation matched the actual code behavior?

### Exercise 2: Improve output quality with prompt iteration loops

**Objective:** Improve Copilot output by moving from vague prompts to constrained prompts.

**Exercise Type:** Hands-on

**Hands-on:**
1. Start with a vague request in chat (for example, “improve this function”) and inspect the output quality.
2. Re-run the request using a structured prompt with: goal, constraints, inputs, and expected format, using [write better prompts for GitHub Copilot](https://docs.github.com/en/copilot/how-tos/write-better-prompts-for-github-copilot).
3. Add one more iteration that includes repository-specific constraints (naming style, error-handling approach, or test style).
4. Compare all three outputs and keep the best one.
5. Write a reusable 3-4 line prompt template you can use in future modules.

**Knowledge Check:**
1. Which added constraint improved quality the most?
2. How did output quality change across each iteration?
3. What prompt structure will you reuse by default?

### Exercise 3: Generate code, tests, and documentation with review

**Objective:** Use Copilot to produce implementation artifacts while maintaining human quality checks.

**Exercise Type:** Hands-on

**Hands-on:**
1. Ask Copilot to generate one focused code change in your selected file.
2. Ask Copilot to generate or update one related test in the nearest test folder.
3. Ask Copilot to draft a short documentation update (comment block, README note, or PR summary text) describing the change.
4. Manually review all generated output for correctness, repository style, and edge cases before keeping it.
5. Run the relevant local validation command(s) and record results in your notes.

**Knowledge Check:**
1. What did Copilot generate well with minimal edits?
2. What required manual correction before it was usable?
3. What validation evidence gave you confidence to keep the generated output?

### Exercise 4: Build a repeatable editor productivity loop

**Objective:** Create a daily Copilot workflow you can repeat for small features and fixes.

**Exercise Type:** Instructor-Guided

**Hands-on:**
1. Define a five-step loop in your editor workflow: understand scope, prompt, implement, validate, summarize.
2. Use Copilot Chat to quickly explain one unfamiliar function in your working area.
3. Use inline completion to implement a small follow-up improvement.
4. Use chat for a quick self-review pass (readability, edge cases, and maintainability).
5. Create a short “done note” you could paste into a pull request description.

**Knowledge Check:**
1. Which step in your loop saved the most time?
2. Which step prevented the most rework?
3. How will you keep this loop lightweight for daily use?

### Exercise 5: Practice beginner pitfall detection and recovery

**Objective:** Identify common early mistakes and apply a reliable recovery pattern.

**Exercise Type:** Hands-on

**Hands-on:**
1. Trigger one intentional pitfall:
   - Use an overly broad prompt,
   - Accept a suggestion without checking context, or
   - Ask for code without specifying constraints.
2. Observe the weak output and identify exactly why it failed (ambiguity, missing constraints, or wrong scope).
3. Use [troubleshooting GitHub Copilot](https://docs.github.com/en/copilot/troubleshooting-github-copilot) and [using GitHub Copilot](https://docs.github.com/en/copilot/using-github-copilot) to apply a fix pattern.
4. Re-run with a corrected prompt and verify improvement.
5. Document your personal “pitfall → fix” checklist with at least two patterns.

**Knowledge Check:**
1. Which pitfall appears most often in your own workflow?
2. What is your first recovery step when output quality drops?
3. How do you decide when to stop prompting and edit manually?

## Completion Criteria

1. You can use Copilot Chat and inline completions together in one scoped development task.
2. You can improve generated output through structured prompt iteration.
3. You can generate and review code, tests, and documentation before accepting output.
4. You can apply a repeatable editor workflow for daily productivity.
5. You can identify common beginner pitfalls and recover quickly with a defined fix pattern.
