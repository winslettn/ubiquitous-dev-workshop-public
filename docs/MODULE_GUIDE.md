# Module Guide

This document explains the structure and standards for the GitHub Copilot and Advanced Security training platform.

## Platform Philosophy

This platform is designed around three principles:

1. **Modular** — Teach individual modules or the full curriculum; start any module with a clean branch
2. **Flexible** — Supports multiple coding languages and IDEs, tailorable by customer needs
3. **Hands-On** — Participants learn by doing; exercises are optional but highly recommended

## Module Directory Structure

Instructor content is centralized in `docs/.instructor/`:

**Instructor Materials (Centralized):**
```
docs/.instructor/
├── INSTRUCTOR_GUIDE.md                # Master guide for instructors
├── mNN-product-name-notes.md          # Module-specific instructor notes
└── slides/                            # Slide markdown files
    └── mNN-product-name-slides.md
```

**Participant Content (Workshop-based):**
```
modules/mNN-{name}/
├── README.md              # Module overview, learning objectives, and exercises
└── setup-scripts/         # Optional: automated setup for language environments
```

**Shared Language Codebases:**
All modules use the same shared language codebases in:
```
src/
├── python/
├── typescript/
├── csharp/
└── java/
```

**Rule:** Do not create instructor-only or module-specific duplicate demo projects. Demos must run on the shared language codebases in `src/{language}/`.

## Module Anatomy

Each module follows this structure:

### 1. **Instructor Notes** (`docs/.instructor/mNN-product-name-notes.md`)

**Purpose:** Instructor facilitation guide with metadata and learning outcomes

**Contents:**
```markdown
<!-- Copilot Metadata
- **Module:** mNN
- **Module Group:** [Group Name]
- **Audience:** [Dev/Admin/Executive]
- **Title:** [Module Title]
- **Est. Duration:** [time] instruction / [time] hands-on
- **Type:** [Shared/Optional/Specialty]
- **Topics:**
  - Topic 1
  - Topic 2
- **Docs:** [Links to relevant documentation]
- **Demos:** [Demo scenarios and resources]
- **Source workshops:** [Related external resources]
- **Source slides:** [Slide deck references]
-->

# MNN [Title] - Instructor Materials

## Preparation
### Delivery priorities
### Demo preparation
### Success signal

## Presentation
Duration: [time]
- Topic 1
- Topic 2

## Lab Exercises
Duration: [time]
1. Exercise 1
2. Exercise 2

## Wrap-up
Summarize and transition to next module
```

**Format:**
- YAML metadata block in HTML comments
- Clear sections: Preparation, Presentation, Lab Exercises, Wrap-up
- Practical guidance for facilitators, not exhaustive content

**Length:** 2-3 pages

---

### 2. **Participant Module README** (`modules/mNN-{name}/README.md`)

**Purpose:** Participant-facing module entry point with learning objectives and exercises

**Contents:**
- Module overview (1-2 sentences)
- Duration, skill level, prerequisites
- Learning objectives (5-7 bullet points)
- Key concepts with IDE-specific callouts
- Practice exercises (Beginner, Intermediate, Advanced)
- Next module pointer

Instructor-specific guidance stays in `docs/.instructor/`, not in module README files.

**Format:** Concept-focused, IDE-agnostic with IDE callouts using blockquotes

**Length:** 1-2 pages

**Tone:** "You will..." not "Do this..."  
**Avoid:** Step-by-step "Click here" instructions

---

### 3. **Slide Deck** (`docs/.instructor/slides/mNN-product-name-slides.md`)

**Purpose:** (Optional) Markdown slides for presentation conversion or reference

**Format:** Markdown slides with speaker notes using fenced blocks:
```markdown
# Module NN: Title

```speaker-notes
Welcome to Module NN. By the end of this module, participants will be able to...
```

## Topic 1: Core Concept

- Point 1
- Point 2

```speaker-notes
Spend ~5 minutes on this section. The key insight is...
```

---

## Demo Placeholder: [Demo Name]

```speaker-notes
Now let's see this in action. Open DEMO.md section "Demo 1" and follow along...
```
```

**Structure:**
- Title & module number
- Learning objectives slide
- 3-5 core concept sections with speaker notes
- Demo Placeholder slides between sections
- Q&A / Wrap-up

**Time Guidance:**
- Add time estimates to each section
- Total = module duration minus demo time
- Simpler topics: <10 slides
- Medium topics: 10-15 slides
- Complex topics: 15-20 slides

**Deck Generation:**
Use the skill-local compose script to generate the markdown deck used by the HTML presenter workflow:
```bash
node .github/skills/generate-instructor-slides/scripts/compose-module-slides.mjs --modules mNN --presentation-name "<presentation-name>"
```

---

### 4. **Practice Exercises**

**Purpose:** Hands-on practice with graduated difficulty

**Locations:**
- Exercises are documented in module README
- Solution code lives in `assets/samples/{language}/`
- Git branches (`mNN-ready`, `mNN-complete`) mark exercise starting and ending states

**Structure per Exercise:**
- **Objective:** What skill it teaches
- **Setup:** Commands and file locations
- **Task:** What to do (not step-by-step)
- **Solution:** Where to find the answer
- **Challenge:** (optional) Extended thinking

**Difficulty Levels:**
- **Beginner**: Scaffolded, guided, mostly copy-paste with understanding
- **Intermediate**: Guided approach, some problem-solving
- **Advanced**: Minimal guidance, design-level thinking

**Language Versions:**
- Provide same exercises in all 4 languages
- Use language-specific patterns and idioms in `src/{language}/`
- Store solution snapshots in `assets/samples/{language}/`

**Length:** 1-2 pages per module

---

## Instructor Facilitation Workflow

### Before Teaching

1. **Review Module Materials**
   - Use Copilot Chat skill `generate-instructor-slides` with your target modules and a presentation name (for example: `m21,m22,m24` and `Agentic Automation Workshop`) to compose a facilitator-ready deck
   - Review generated deck markdown in `docs/.instructor/slides/generated/`
   - Read `docs/.instructor/mNN-product-name-notes.md` for facilitation priorities
   - Review module metadata (audience, duration, topics)
   - Check linked documentation and demo resources

2. **Prepare Demo**
   - Study the demo scenario from the notes
   - Run the demo yourself on the same code participants will use
   - Test on your IDE and language of choice
   - Verify all links, environments, and permissions

3. **Set Up Environment**
   - Verify the appropriate git branch is available (e.g., `mNN-ready`)
   - Test participant setup steps
   - Prepare backup plan if demo breaks (see TROUBLESHOOTING.md)

4. **Choose Delivery Path**
   - **Short Session (30-60 min):** M00 + M01 (MVP Setup)
   - **Half Day (3-4 hours):** M00-M03 (MVP Copilot)
   - **Full Day (6-8 hours):** M00-M06 + M07-M08 (Development + Security)
   - **Multi-Day Workshop:** M00+ by track (Dev, Admin, Security)

### During Teaching

1. **Present** (10-25 min)
   - Follow topics from instructor notes
   - Prefer the deck generated by `generate-instructor-slides` as the source for HTML slide presentation
   - Stick to time estimates
   - Include explicit "Demo Placeholder" slides for transitions

2. **Live Demo** (15-30 min)
   - Use the same demo app and shared language code participants use
   - Type slowly; narrate *why*, not just *how*
   - Follow `docs/.instructor/mNN-product-name-notes.md` demo guidance
   - If demo breaks, revert file (`git checkout -- filename`) or skip to next section

3. **Participant Exercises** (30-120 min) — Optional
   - Point participants to module `README.md`, not slides
   - Beginner exercises: guided with scaffolding
   - Intermediate exercises: guided approach with problem-solving
   - Advanced exercises: minimal guidance, design-level thinking

4. **Wrap Up** (5-10 min)
   - Recap learning objectives
   - Show solutions from `assets/samples/` 
   - Point to next module
   - Collect feedback

### Example: 90-minute Session Time Breakdown

```
Opening & Tech Check                    5 min
Presentation (topics from notes)       20 min
Live Demo                              25 min
Participant Exercises                  35 min
Q&A & Wrap-up                           5 min
---
Total                                  90 min
```

Adjust based on audience:
- **Beginner-heavy**: Extend exercises, slow down demo
- **Advanced-heavy**: Skip basic sections, deepen exercises

## Module Development Lifecycle

When creating a new module, follow this workflow:

### Phase 1: Planning
1. Define learning objectives and audience (Dev/Admin/Executive)
2. Identify prerequisites and module group
3. Estimate duration (instruction + hands-on time)
4. Identify demo scenarios and key topics
5. Design exercises (Beginner → Intermediate → Advanced)

### Phase 2: Development
1. Create module metadata in `docs/.instructor/mNN-product-name-notes.md`
2. Write module `README.md` with learning objectives and exercises
3. Update shared codebases in `src/{language}/` for module scenarios
4. Create exercise solutions in `assets/samples/{language}/`
5. (Optional) Draft slide deck in `docs/.instructor/slides/mNN-product-name-slides.md`

### Phase 3: Testing
1. Test demo end-to-end on each IDE/language
2. Have peer instructors review module notes and README
3. Run exercise solutions and verify they work
4. Refine timing, difficulty, and clarity
5. Update `TROUBLESHOOTING.md` with any gotchas

### Phase 4: Release
1. Git commit to main
2. Create `mNN-ready` and `mNN-complete` branches for participants
3. Verify both branches work end-to-end
4. Open PR or release module
5. Gather feedback from instructors & participants

## Naming Conventions

- **Module folder:** `mNN-{kebab-case-name}` (e.g., `m02-copilot-basics`)
- **Instructor notes:** `mNN-product-name-notes.md` (e.g., `m02-copilot-basics-notes.md`)
- **Slide deck:** `mNN-product-name-slides.md` (e.g., `m02-copilot-basics-slides.md`)
- **Sample files:** `{exercise_name}_solution.{ext}` (e.g., `exercise_1_patterns_solution.py`)
- **Git branches:** `mNN-ready`, `mNN-complete` (e.g., `m02-ready`, `m02-complete`)

## Tools & Resources

### Slide Conversion
Generate markdown slides for the HTML presenter workflow:
```bash
node .github/skills/generate-instructor-slides/scripts/compose-module-slides.mjs --modules mNN --presentation-name "<presentation-name>"
```

### Branch Management
```bash
# See all available branches
git branch -a

# Switch to a module's starting state
git checkout m01-ready

# See what changed in a module
git diff m01-ready..m01-complete

# Reset to clean state mid-session
git checkout -- .
```

### Testing & Validation
```bash
# Test Python code
pushd src/python
.\scripts\test.ps1       # Windows
bash ./scripts/test.sh   # Linux/macOS
popd

# Test TypeScript code
pushd src/typescript
npm run test
popd

# Test C# code
pushd src/csharp
dotnet test ContosoUniversity.sln
popd

# Test Java code
pushd src/java
./mvnw -pl web test
popd
```

## Common Troubleshooting

**Copilot not responding?**
- Sign out and sign in again in your IDE
- Check subscription status

**Demo code looks different than expected?**
- Copilot suggestions are non-deterministic; variation is normal
- Show the concept, not exact output

**Participant's IDE crashed?**
- Have them checkout the branch again and restart IDE
- See `TROUBLESHOOTING.md` for IDE-specific tips

**Running out of time?**
- Skip exercises and point to solutions
- Offer optional async follow-up
- Prioritize core concepts over comprehensive coverage

## Next Steps

- **New to Instructing?** → Start with `INSTRUCTOR_GUIDE.md`
- **Creating a Module?** → Follow the "Module Development Lifecycle" above
- **Need Help?** → Check `TROUBLESHOOTING.md` or open a GitHub Issue
- **Module Reference:** → See individual `mNN-product-name-notes.md` files in `docs/.instructor/`
