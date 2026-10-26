<!--
title: "Module 20: Copilot Basics — IDE & CLI Fundamentals"
template: default
-->

# Module 20: Copilot Basics — IDE & CLI Fundamentals

---

## Learning Objectives

```speaker-notes
Welcome to Module 02. In this 60-minute session, participants will master the core Copilot capabilities: code completion, Chat interface, inline fixes, and CLI integration. By the end, you'll be comfortable using Copilot in your IDE and from the command line across all 4 supported languages.
```

<!--
layout: content
-->

```speaker-notes
Review these 6 objectives. They form the framework for the entire module.
```

- Use Copilot code completion to generate code suggestions
- Interact with Copilot Chat in your IDE
- Use Copilot Chat from the command line
- Apply inline fixes and quick actions
- Understand context window limits and how to work with them
- Practice in all 4 supported languages (Python, TypeScript, C#, Java)

---

## Code Completion Fundamentals (5 min)

<!--
layout: content
-->

```speaker-notes
This is the bread-and-butter of Copilot. Explain the UX (suggestions as you type), acceptance workflow (Tab to accept, Esc to dismiss), and importance of context. Spend about 5 minutes here.
```

### How Code Completion Works

- Copilot observes patterns in your code
- As you type, it predicts the next statement
- Suggestion appears in gray (faded text)
- Accept with **Tab**, dismiss with **Esc**

### Context Matters

- Copilot reads your current file
- Understands your variable names, patterns, imports
- Better context → better suggestions

### Quality Over Speed

- Don't accept every suggestion
- Read before you Tab
- Use Esc if the suggestion doesn't match your intent

```speaker-notes
Demo Placeholder: Code Completion Live Demo (7 min)
```

---

## Demo Placeholder: Code Completion in Action (7 min)

<!--
layout: demo
-->

**In DEMO.md:** Live walk-through showing:
1. Create a new file in your language
2. Type a function signature
3. Show Copilot suggestions appearing
4. Accept one with Tab
5. Type function body stub
6. Show Copilot completing the body
7. Explain why the suggestion matched

---

## Chat Interface — IDE (7 min)

<!--
layout: content
-->

```speaker-notes
Move from basic completion to Chat. Explain the IDE Chat interface: opening it, asking questions, context awareness. Spend 7 minutes here. This is powerful for exploration and refactoring.
```

### Opening Chat

- **VS Code**: `Cmd+Shift+I` (Mac) / `Ctrl+Shift+I` (Windows)
- **Visual Studio**: View → GitHub Copilot Chat
- **JetBrains**: Tools → GitHub Copilot → Chat

### What Can You Ask?

1. **"Explain this function"** → Copilot explains your code
2. **"Refactor this"** → Copilot suggests improvements
3. **"How do I..."** → General questions about patterns
4. **"What's wrong?"** → Help debugging

### Key Features

- Copilot sees your current file & open files
- Can reference code with `#file` syntax
- Can ask about specific functions or classes
- Maintains conversation history

```speaker-notes
Demo Placeholder: IDE Chat Demo (7 min)
```

---

## Demo Placeholder: Chat Interface — IDE (7 min)

<!--
layout: demo
-->

**In DEMO.md:** Live walk-through showing:
1. Open a complex function in your language
2. Open Chat panel (Cmd+Shift+I / Ctrl+Shift+I)
3. Ask "Explain this function"
4. Show Copilot's explanation
5. Ask "How would you refactor this?"
6. Show refactoring suggestions
7. Ask a clarifying follow-up question

---

## Chat Interface — Command Line (5 min)

<!--
layout: content
-->

```speaker-notes
Show the CLI integration. Copilot Chat is available from the terminal—useful for scripting, quick questions, and automation. Spend 5 minutes.
```

### Using Copilot Chat from Terminal

```bash
copilot chat "explain what this code does" --file myfile.py
copilot chat "write a function that validates email" --language python
copilot chat "how do I set up a FastAPI server?"
```

### Why CLI Chat?

- Scripting & automation
- Hands-free quick answers
- Chain with other commands:
  ```bash
  cat myfile.py | copilot chat "refactor this for performance"
  ```

### Limitations

- Less context than IDE Chat (use `--file` to add context)
- No multi-turn conversation
- Best for specific, focused questions

```speaker-notes
Demo Placeholder: CLI Chat Demo (3 min)
```

---

## Demo Placeholder: Chat — Command Line (3 min)

<!--
layout: demo
-->

**In DEMO.md:** Live walk-through showing:
1. Open terminal
2. Run `copilot chat "write a simple hello world function"` for your language
3. Show result
4. Run `copilot chat --help` to show available flags
5. Show chaining with cat: `cat test_file.py | copilot chat "explain this"`

---

## Inline Fixes & Quick Actions (4 min)

<!--
layout: content
-->

```speaker-notes
Show the developer experience of quick fixes. Copilot can suggest fixes and refactorings. This is integrated into most IDEs as lightbulbs or code actions.
```

### Recognizing Quick Actions

- Yellow lightbulb 💡 in your editor
- Click to see Copilot's suggestions
- Examples:
  - Missing import statement
  - Undefined variable
  - Refactoring suggestions
  - Performance improvements

### How to Use

1. Write code (intentionally or accidentally) with an issue
2. Wait for lightbulb to appear
3. Click lightbulb → see suggestions
4. Click suggestion to apply

```speaker-notes
Demo Placeholder: Inline Fixes Demo (3 min)
```

---

## Demo Placeholder: Inline Fixes (3 min)

<!--
layout: demo
-->

**In DEMO.md:** Live walk-through showing:
1. Write code with an intentional error (undefined variable, missing import)
2. Wait for lightbulb to appear
3. Click lightbulb
4. Show Copilot's suggested fix
5. Accept the suggestion
6. Code is corrected

---

## Context Window Limits (3 min)

<!--
layout: content
-->

```speaker-notes
Important reality: Copilot has a finite context window. Explain the implications and how to work around them.
```

### What Is Context?

- Copilot can "see" ~8,000 tokens of code
- ~1 token ≈ 4 characters

### Implications

- Very large files may cause Copilot to lose context
- Opening many files reduces per-file context
- Comments in code consume tokens

### Workarounds

1. **Add comments** near the problem area (helps focus Copilot's attention)
2. **Use focused prompts** ("write a function that does X, not Y")
3. **Break large files** into smaller modules
4. **Ask explicitly** ("consider constraints from line 10")

---

## Hands-On Practice (20-25 min)

<!--
layout: content
-->

```speaker-notes
After the demos, give participants 20-25 minutes to practice these concepts in the module README. Walk around and help.
```

**See the module README for:**

1. **Exercise 1:** Use code completion to implement 3 simple functions
2. **Exercise 2:** Ask Chat 3 refactoring questions about provided code
3. **Exercise 3:** Use CLI Chat to debug a broken script

**Choose your language:** Python / TypeScript / C# / Java  
**Time:** 20-25 minutes

---

## Q&A & Wrap-Up (5 min)

<!--
layout: wrap-up
-->

```speaker-notes
Open floor for questions. Summarize the 3 ways to use Copilot (completion, IDE Chat, CLI Chat) and point to next module.
```

### Key Takeaways

✅ **Code Completion** — Accept suggestions with Tab, dismiss with Esc  
✅ **IDE Chat** — Ask questions about your code in real-time  
✅ **CLI Chat** — Use from terminal for scripting & quick answers  
✅ **Context Limits** — Write focused prompts; add comments for clarity  

### Next Module

**Module 03: Prompt Engineering & Context Management** — Learn to craft better prompts and optimize your repository for Copilot

---

## Resources

<!--
layout: content
-->

- **README.md** — Hands-on practice (participant file)
- **solutions/** → Completed exercise examples
- **CLI Reference** → `copilot --help`

---

## Exercises

<!--
layout: content
-->

- Use `workshop/m22-copilot-fundamentals.md` for the full exercise guide.
- Exercise: Hands-on Copilot basics in a real code path
- Exercise: Hands-on productivity loop and pitfall recovery
- Completion focus: You can use Copilot Chat and inline completion effectively in the IDE; You can improve outcomes by iterating prompts with explicit constraints

```speaker-notes
Use this slide to transition from the content deck into the hands-on module for GitHub Copilot Fundamentals.
Point participants to workshop/m22-copilot-fundamentals.md and preview the exercise flow: Hands-on Copilot basics in a real code path; Hands-on productivity loop and pitfall recovery.
Frame success around the completion criteria, especially: You can use Copilot Chat and inline completion effectively in the IDE; You can improve outcomes by iterating prompts with explicit constraints.
```
