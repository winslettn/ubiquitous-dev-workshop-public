<!--
title: "Module 22: Prompt Engineering & Context Management"
template: default
-->

# Module 22: Prompt Engineering & Context Management

---

## Learning Objectives

```speaker-notes
Welcome to Module 03. This module covers the single most important skill for getting great results from Copilot: prompt engineering. We'll learn patterns that dramatically improve code quality and relevance. By the end, you'll be a power user—crafting prompts that elicit exactly what you need.
```

<!--
layout: content
-->

```speaker-notes
Review these 7 objectives. They form the framework for prompt mastery.
```

- Write effective prompts that elicit better code suggestions
- Use chain-of-thought prompting for complex tasks
- Provide context through code comments and repository structure
- Optimize your repository for Copilot (README, comments, structure)
- Recognize and work within context window limits
- Apply role-based prompting ("You are a senior architect...")
- Measure prompt effectiveness and iterate

---

## Poor vs. Effective Prompts (5 min)

<!--
layout: content
-->

```speaker-notes
Start with contrast. Show bad and good prompts side-by-side to make the difference visceral. Spend 5 minutes.
```

### ❌ Poor Prompt

```
write a function that validates email
```

**Result:** Generic regex, doesn't handle edge cases, minimal comments

### ✅ Effective Prompt

```
write a function that validates email addresses using regex, 
handles edge cases (+ aliases, subdomains), and returns 
(bool, error_message) tuple. add comments explaining the regex pattern.
```

**Result:** Robust regex, handles + aliases, subdomains, clear error messaging, well-commented

### Why the Difference?

- Poor prompt: Copilot guesses what you mean
- Effective prompt: Copilot knows exactly what success looks like
- **More specificity → Better results**

---

## Pattern 1: Specific Requirements Prompting (6 min)

<!--
layout: content
-->

```speaker-notes
This is the foundation. Show the anatomy of a good prompt: requirements, constraints, output format. Spend 6 minutes.
```

### Anatomy of a Good Prompt

```
write a [what] that [constraints] and [returns/outputs]
```

### Examples by Language

**Python:**
```
write a function that validates phone numbers, 
accepts US formats (555-555-5555, (555) 555-5555),
rejects international, and returns (bool, normalized_number)
```

**TypeScript:**
```
write a function that fetches user data from an API, 
implements retry logic (max 3 attempts), 
and returns Promise<User | null>
```

**C#:**
```
write a class that manages a cache with TTL, 
evicts expired entries, and is thread-safe
```

### Key Elements

- **What:** Function, class, API endpoint
- **Constraints:** Format, edge cases, limits
- **Output:** Return type, format, structure
- **Tone:** (optional) "defensive", "optimized for speed", "beginner-friendly"

```speaker-notes
Demo Placeholder: Poor vs. Effective Prompts (5 min)
```

---

## Demo Placeholder: Poor vs. Effective Prompts (5 min)

<!--
layout: demo
-->

**In DEMO.md:** Live walk-through showing:
1. Ask Copilot the poor prompt: "write a function that validates email"
2. Show generic result
3. Ask the effective prompt with full requirements
4. Show detailed, well-commented result
5. Compare side-by-side
6. Explain: "Specificity matters"

---

## Pattern 2: Chain-of-Thought Prompting (6 min)

<!--
layout: content
-->

```speaker-notes
For complex tasks, chain-of-thought helps Copilot break the problem into steps. This leads to more structured, thoughtful solutions. Spend 6 minutes.
```

### What Is Chain-of-Thought?

Instead of: "Design an API for order management"

Use: "Design an API for order management. Think step by step:
1. What entities do we need? (Order, Customer, Item, Payment)
2. What operations? (Create, Retrieve, Update, Cancel)
3. What constraints? (Concurrency, idempotence, rollback)
Provide data models and endpoints."

### Why It Works

- Copilot "thinks through" the problem
- Results are structured and logical
- Fewer iterations needed

### Examples

**API Design:**
```
Design a rate-limiting middleware. Think step by step:
1. How do we track requests? (in-memory, Redis?)
2. What's the window size? (per second, minute, hour?)
3. How do we handle burst traffic?
Provide pseudocode.
```

**Refactoring:**
```
Refactor this function for performance. Think about:
1. Where are the bottlenecks? (loops? database calls?)
2. Can we cache intermediate results?
3. Can we parallelize?
Suggest specific optimizations.
```

```speaker-notes
Demo Placeholder: Chain-of-Thought Demo (5 min)
```

---

## Demo Placeholder: Chain-of-Thought Demo (5 min)

<!--
layout: demo
-->

**In DEMO.md:** Live walk-through showing:
1. Ask Copilot: "Design a caching layer" (direct)
2. Show result (high-level, generic)
3. Ask: "Design a caching layer. Think about: 1. Eviction strategies? 2. Concurrency? 3. Staleness?" (chain-of-thought)
4. Show result (structured, thoughtful)
5. Compare
6. Explain: "Chain-of-thought breaks complex problems into steps"

---

## Pattern 3: Role-Based Prompting (4 min)

<!--
layout: content
-->

```speaker-notes
Role-based prompting shapes Copilot's mindset. A "security engineer" will think differently than a "performance engineer". Spend 4 minutes.
```

### How It Works

Start your prompt with a role:

```
You are a senior security engineer. Design a password validation 
function considering: brute-force protection, timing attacks, 
entropy requirements. Provide implementation.
```

vs.

```
You are a performance engineer. Optimize this database query 
considering latency, throughput, and resource usage. Show 
the optimized query and explain the trade-offs.
```

### Common Roles

- **Security Engineer** → Defensive code, threat modeling
- **Performance Engineer** → Optimization, profiling
- **API Designer** → RESTful patterns, backward compatibility
- **QA Engineer** → Edge cases, error handling
- **DevOps Engineer** → Deployment, scalability, monitoring

### Example in Chat

```
You are a Python architect. Review this code for:
1. Error handling
2. Type hints
3. Testability
4. Performance
Suggest improvements.
```

```speaker-notes
Demo Placeholder: Role-Based Prompting Demo (3 min)
```

---

## Demo Placeholder: Role-Based Prompting (3 min)

<!--
layout: demo
-->

**In DEMO.md:** Live walk-through showing:
1. Ask Copilot: "Write a function that processes user input" (generic)
2. Show generic result
3. Ask: "You are a security engineer. Write a function that safely processes user input, preventing SQL injection, XSS, etc."
4. Show security-focused result
5. Compare
6. Explain: "Roles shape how Copilot approaches the problem"

---

## Context Optimization (6 min)

<!--
layout: content
-->

```speaker-notes
Show how to optimize your repository and comments so Copilot has better context. This includes README structure, inline comments, and module organization.
```

### Repository Structure Signals

**Well-organized repository:**
```
src/
├── models/          (Clear intent)
├── services/        (Clear intent)
├── utils/           (Clear intent)
└── tests/           (Clear intent)
```

**Poorly-organized repository:**
```
src/
├── helpers.py       (Vague intent)
├── utils.js         (Vague intent)
├── old_code/        (Dead code signals noise)
└── temp/            (Temporary junk)
```

### Inline Comments as Context

**Without comments:**
```python
def process_order(order):
    if order.total > 100:
        order.discount = order.total * 0.1
```

Copilot guesses: "Apply 10% discount if total > 100"

**With strategic comments:**
```python
def process_order(order):
    # VIP customers (orders > $100) get 10% loyalty discount
    if order.total > 100:
        order.discount = order.total * 0.1
```

Copilot understands: "This is VIP loyalty logic, not arbitrary"

### README as Context

**Good README includes:**
- Project purpose (1 sentence)
- Architecture overview (2-3 sentences)
- Key patterns used (API style, async/await, etc.)
- Naming conventions (prefix, suffix, formatting)

**Poor README:**
- No description
- Out of date
- No patterns documented

```speaker-notes
Demo Placeholder: Repository Optimization Demo (3 min)
```

---

## Demo Placeholder: Context Optimization (3 min)

<!--
layout: demo
-->

**In DEMO.md:** Live walk-through showing:
1. Show poorly-documented code → Ask Copilot a question
2. Show generic result
3. Show well-documented code (comments, clear structure) → Ask same question
4. Show specific, informed result
5. Compare
6. Explain: "Copilot learns from your code organization and comments"

---

## Measuring Effectiveness (3 min)

<!--
layout: content
-->

```speaker-notes
How do you know a prompt is working? Show metrics and feedback loops.
```

### Metrics for Effective Prompts

1. **Acceptance Rate** → % of suggestions you accept
   - Target: 70%+ acceptance (you're happy with suggestions)

2. **Iterations Needed** → How many refinements before good code?
   - Target: 1-2 iterations (prompts are clear)

3. **Code Quality** → Tests pass? Linting passes?
   - Target: 90%+ first-time quality

### Feedback Loop

1. Write a prompt
2. Get a result
3. **If good:** Move on (accept the suggestion)
4. **If mediocre:** Refine the prompt (add constraints, role, chain-of-thought)
5. **If poor:** Rewrite from scratch (too vague or wrong direction)

### Example Iteration

**Iteration 1 (vague):**
```
write a function that handles errors
```
Result: Generic try-catch, not useful

**Iteration 2 (specific):**
```
write a function that validates user input and returns 
specific error messages (e.g., "Email invalid", "Password too short")
```
Result: Better, but still generic

**Iteration 3 (with role and constraints):**
```
You are a UX-focused engineer. Write a function that validates 
user input and returns user-friendly error messages for:
- Email (show hint: "user@example.com")
- Password (show hint: "8+ chars, 1 uppercase, 1 number")
```
Result: ✅ Much better!

---

## Hands-On Practice (30-45 min)

<!--
layout: content
-->

```speaker-notes
Participants practice prompt engineering using the module README. Walk around and guide them toward better prompts.
```

**See the module README for:**

1. **Exercise 1 (15 min):** Refactor poor prompts into effective ones
2. **Exercise 2 (15 min):** Use chain-of-thought for complex design
3. **Exercise 3 (15 min):** Apply role-based prompting to a real scenario

**Choose your language:** Python / TypeScript / C# / Java  
**Time:** 30-45 minutes

---

## Q&A & Wrap-Up (5 min)

<!--
layout: wrap-up
-->

```speaker-notes
Open floor for questions. Summarize the 5 prompting patterns and point to next module.
```

### Key Takeaways

✅ **Specificity** — More detail = Better results  
✅ **Chain-of-Thought** — Break complex problems into steps  
✅ **Role-Based** — Prompt as if Copilot is a specialist  
✅ **Context** — Organize code, write good comments, structure your repo  
✅ **Iteration** — Refine prompts based on results  

### Next Module

**Module 04: Customization with Skills, APM, Agents, and MCP** — Extend Copilot with custom capabilities

---

## Resources

<!--
layout: content
-->

- **README.md** — Hands-on practice (participant file)
- **Prompt Patterns Guide** → `assets/prompt-patterns.md`
- **solutions/** → Example prompt progressions

---

## Exercises

<!--
layout: content
-->

- Use `workshop/m24-context-engineering.md` for the full exercise guide.
- Exercise: Hands-on context budget and retrieval strategy
- Exercise: Hands-on model selection and prompt structure tuning
- Completion focus: You can budget context and reduce token waste without dropping required signal; You can select model mode intentionally for task complexity and quality needs

```speaker-notes
Use this slide to transition from the content deck into the hands-on module for Context Engineering.
Point participants to workshop/m24-context-engineering.md and preview the exercise flow: Hands-on context budget and retrieval strategy; Hands-on model selection and prompt structure tuning.
Frame success around the completion criteria, especially: You can budget context and reduce token waste without dropping required signal; You can select model mode intentionally for task complexity and quality needs.
```
