# Instructor Guide

This guide provides everything instructors need to teach GitHub Copilot and GitHub Advanced Security using this modular training platform.

## 📌 Philosophy

This platform is designed around three principles:

1. **Modular** — Teach individual modules or the full curriculum; start any module with a clean branch
2. **Flexible** — Supports multiple coding languages and IDEs, tailorable by the customer's individual needs
3. **Hands-On** — Participants learn by doing; exercises are optional but highly recommended and can be delivered as instructor-led, scripted labs, or open hack in the customer's own environment

## 🎓 Before You Teach

### 1. Prepare Your Session

- [ ] Run the `generate-instructor-slides` skill for your module for HTML slides or `npm run generate` from `docs/.instructor/tool` for PowerPoint; then review the generated deck HTML or PPTX deck(s) in `docs/.instructor/slides/generated/`
- [ ] Review the corresponding module instructor notes `docs/.instructor/mNN-product-name-notes.md` and run the demo yourself once on the same shared app/code participants will use
- [ ] Watch for **INSTRUCTOR TODO:** in slides and instructor notes as they indicate a decision point you'll need to make _BEFORE_ the workshop begins.
- [ ] Test with the IDE and language that the attendees will use
- [ ] Prepare backup plan if demo breaks (see TROUBLESHOOTING.md)

Recommended skill prompts (Copilot Chat):

```text
Use generate-instructor-slides for modules m21,m22,m24. Presentation name: Agentic Automation Workshop. Compose a facilitator-ready markdown deck for HTML presentation.
```

```text
Use generate-instructor-slides with frontend-design for modules m21,m22,m24. Presentation name: Agentic Automation Workshop. Generate the instructor HTML deck, then apply a distinct visual design pass while preserving module content and speaker notes.
```

```text
Use generate-instructor-slides and ask me which modules to include.
```

Expected skill behavior:
- Discovers module context from workshop guides, instructor slides, and instructor notes
- Composes a combined markdown deck in `docs/.instructor/slides/generated/<modules>-slides.md`
- Asks for a presentation name and uses it to derive the default deck title and file name
- Produces HTML slides from the composed markdown
- Runs the `frontend-design` handoff by default to style the generated deck without changing instructional meaning
- Skips the design pass only when explicitly requested

### 2. Choose Your Module(s)

- **Short Session (30-60 min)?** → M00 Environment Setup or M01 Setup (pick one)
- **Half Day (3-4 hours)?** → M00 + M01 + M02 + M03 (MVP Copilot)
- **Full Day (6-8 hours)?** → M00-M03 + M04 + M07 (Copilot + Security)
- **Multi-Day Workshop?** → Start with M00-M06 (Phase 1-2), add M07-M08 (Phase 3), then M12-M14 (Administration + InnerSource) for governance tracks

### 3. Setup Participant Environment

Option A (Recommended): Participants checkout the branch before session
```bash
git checkout m00-ready
```

Option B: You distribute the repo with the branch already checked out

Option C: Provide cloud-based environment (GitHub Codespaces, VS Code Web)

### 4. Know Your Audience

- **Beginner** → Emphasize M00-M02; focus on exercises
- **Intermediate** → Mix M02-M05; moderate exercise depth
- **Advanced** → M04-M14; include administration and InnerSource modules for platform owners

## 🎬 During Your Session

Plan each session to include one or more closely related modules.  From


### Presenting Slides (10-25 min)

- Use the slide markdown as your talking points
- Treat the generated markdown deck as the source for the HTML presenter workflow
- Prefer ```speaker-notes``` fenced blocks for notes; legacy HTML comments still work during migration
- Stick to time estimates provided
- Keep slide count lean. Simpler topics should use fewer than 10 slides.
- Include explicit "Demo Placeholder" slides that cue the exact DEMO.md section to run next.

### Live Demo (15-30 min)

- Use workshop module flow and instructor notes together as your step-by-step script source
- Use the same demo app and shared language code paths participants use (no instructor-only demo code)
- Type slowly; participants will want to follow
- Narrate what you're doing; explain *why* not just *how*
- If demo breaks, refer to TROUBLESHOOTING.md for quick fixes

**Tip**: Always have two ways to recover:
1. Revert your demo file (`git checkout -- filename`)
2. Switch to next demo section if previous section failed

### Participant Exercises (30-120 min) — Optional

- **Beginner exercises**: Guided with lots of scaffolding
- **Intermediate exercises**: Some guidance; learners problem-solve
- **Advanced exercises**: Minimal guidance; learners design solutions

Point participants to the module README, not SLIDES.md, for exercises.

### Wrap Up (5-10 min)

- Recap key learning objectives
- Show solutions from `assets/samples/` and map them back to the shared language codebases in `src/{language}/`
- Answer questions
- Point to next module (if continuing)

## ⏱️ Time Breakdown (Example: 90-minute session)

```
Opening & Tech Check                    5 min
Slides presentation                    20 min
Demo walkthrough                       25 min
Participant exercises                  35 min
Q&A & Wrap-up                           5 min
---
Total                                  90 min
```

(Find slide markdown in `docs/.instructor/slides/` and notes in `docs/.instructor/`)

Adjust based on your audience:
- **Beginner-heavy**: Extend exercises, slow down demo
- **Advanced-heavy**: Skip basic sections, deepen exercises

Slide planning guideline:
- Simpler topics: <10 slides + demo placeholder slides
- Medium topics: 10-15 slides
- Complex topics: 15-20 slides

## 🛠️ Tools & Resources

### Slide Conversion
Use the skill in Copilot Chat (recommended):

```text
Use generate-instructor-slides for modules m21,m22,m24. Presentation name: Agentic Automation Workshop.
```

Manual CLI path (equivalent command):

Compose slide markdown for the HTML presenter workflow:
```bash
node .github/skills/generate-instructor-slides/scripts/compose-module-slides.mjs --modules m21,m22,m24 --presentation-name "Agentic Automation Workshop"
```

### Branch Management
```bash
# See all available branches
git branch -a

# Switch to a module's starting state
git checkout m01-ready

# See what changed in a module
git diff m01-ready..m01-complete

# Reset to a clean state mid-session
git checkout -- .
```

### Testing & Validation
```bash
# Test Python code
pushd src/python
# Windows
.\scripts\test.ps1
# Linux/macOS
bash ./scripts/test.sh
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

## 🆘 Common Issues

**Copilot not responding?**
- Sign out and sign in again in your IDE
- Check subscription status (Settings > GitHub Copilot)

**Demo code looks different than expected?**
- Copilot suggestions are non-deterministic; variation is normal
- Show the concept, not exact output

**Participant's IDE crashed?**
- Have them checkout the branch again
- Restart IDE
- See TROUBLESHOOTING.md for IDE-specific tips

**Running out of time?**
- Skip exercises and point to solutions
- Offer optional async follow-up
- Prioritize core concepts over comprehensive coverage

## 📊 Feedback Loop

After each session, collect feedback:

1. **Quick poll** (2 min): Rate 1-5, would you recommend?
2. **Open feedback** (optional): What went well? What could improve?
3. **Check repo issues** for common pain points

Share feedback by opening a GitHub Issue or Discussion.

## 🎯 Success Indicators

- Participants can articulate learning objectives by end of session
- Participants complete exercises with minimal coaching
- Participants ask relevant follow-up questions
- Positive feedback indicating relevance & clarity

## 📚 Additional Resources

- `MODULE_GUIDE.md` — How modules are structured
- `TROUBLESHOOTING.md` — Common issues & solutions
- `GETTING_STARTED.md` — Navigation & FAQ
- Module notes in `docs/.instructor/mNN-product-name-notes.md` and workshop module guides in `workshop/`
- `assets/samples/` — Exercise solutions

---

**Questions?** Open a GitHub Issue or Discussion.
