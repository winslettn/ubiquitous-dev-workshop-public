# GitHub Copilot Training Platform

A comprehensive, modular training repository for teaching GitHub Copilot and GitHub Advanced Security across multiple IDEs, programming languages, and skill levels.

## 🎯 Quick Start

### For Instructors

1. Read [`docs/.instructor/INSTRUCTOR_GUIDE.md`](docs/.instructor/INSTRUCTOR_GUIDE.md) for teaching approach
2. Open the consolidated workshop guide: [**Workshop Guide**](workshop/README.md)
3. Review the module sequence and track-specific modules
4. Use `docs/.instructor/{workshop-name}/` for slides and demo scripts

### For Participants

1. **Start with setup:** [Complete Module 00](workshop/m00-setup.md) (shared by all tracks, 90 min)
2. **Choose a track** based on your learning goals from [workshop/README.md](workshop/README.md):
   - **Track 1 (m10-m14)** — Copilot basics, customization, and governance
   - **Track 2 (m20-m24)** — Advanced agents, workflows, and platform engineering
   - **Track 3 (m30-m32)** — Applications security and quality
3. **Set up your environment:**
   - Use Codespaces: Open in GitHub Codespaces and reopen in container
   - Or local: Install Python 3.11+, Node.js 22+, .NET SDK 10, and Java 17+
4. **Follow your workshop modules** in order (each includes exercises)
5. **Compare solutions** with provided samples

### Setup Options

**Option A: Codespaces / Dev Container (recommended)**
1. Open in GitHub Codespaces (or VS Code Dev Containers)
   - for Local VS Code Dev, make sure to install GitHub.codespaces extension first (use ctrl + shift + p and search for 'Codespaces' to find relevant items)
2. Reopen in the default full-stack container using `.devcontainer/devcontainer.json`
3. Or choose the lean frontend + TypeScript variant at `.devcontainer/frontend-ts/devcontainer.json`
4. The full-stack container preinstalls Python 3.13, Node.js 24, .NET SDK 10, and Java 17 for Codespaces and local Docker on both ARM64 and AMD64

**Option B: Local Setup**
1. Install one language runtime and one IDE
2. Follow [Module 00: Environment & Copilot Setup](workshop/m00-setup.md)

## 📚 Workshop

This repository uses a **single consolidated workshop structure** with three learning tracks:

### Track 1: Standardize the Agentic Development Platform
[📖 Full Track](workshop/README.md#track-1-standardize-the-agentic-development-platform) | Duration: ~6 hours | Skill Level: Beginner to Intermediate

Learn GitHub Copilot fundamentals, prompt engineering, customization, automation, and security basics needed to deploy agents across your team.

**Modules:**
- Module 00: [Environment & Copilot Setup](workshop/m00-setup.md) (Shared, 90 min)
- Modules 11-15: [Copilot Basics → Code Security](workshop/README.md#track-1-standardize-the-agentic-development-platform) (5 hours)
- Optional: GHE Basics, GitHub WAF

### Track 2: Leverage Agents from Idea to Production
[📖 Full Track](workshop/README.md#track-2-leverage-agents-from-idea-to-production) | Duration: ~7 hours | Skill Level: Intermediate to Advanced

Master agentic patterns, agent orchestration, workflow automation, and platform engineering to build production-ready solutions.

**Modules:**
- Module 00: [Environment & Copilot Setup](workshop/m00-setup.md) (Shared, 90 min)
- Modules 21-24: [Copilot Fundamentals → Context Engineering](workshop/README.md#track-2-leverage-agents-from-idea-to-production) (6 hours)

### Track 3: Find and Fix Vulnerabilities Before They Ship
[📖 Full Track](workshop/README.md#track-3-find-and-fix-vulnerabilities-before-they-ship) | Duration: ~5 hours | Skill Level: Intermediate

Implement security scanning, dependency management, and automated remediation throughout your delivery pipeline.

**Modules:**
- Module 00: [Environment & Copilot Setup](workshop/m00-setup.md) (Shared, 90 min)
- Modules 30-32: [Org Configuration → Code Quality](workshop/README.md#track-3-find-and-fix-vulnerabilities-before-they-ship) (3.5 hours)

## 🏗️ Repository Structure

```
copilot-training/
├── README.md (this file)
├── LICENSE (MIT)
│
├── docs/
│   ├── MODULE_GUIDE.md            # Module structure & standards
│   ├── GETTING_STARTED.md         # Navigation and FAQ
│   ├── TROUBLESHOOTING.md         # Common issues & solutions
│   ├── MIGRATION_GUIDE.md         # [NEW] Upgrading from old structure
│   ├── INSTRUCTOR_GUIDE.md        # How to teach (in .instructor/)
│   │
│   └── .instructor/               # Instructor materials (slides, demos)
│       ├── INSTRUCTOR_GUIDE.md    # Teaching approach and curriculum
│       ├── w01-standardize-agentic/
│       │   ├── m01-copilot-basics/
│       │   ├── m02-copilot-prompts/
│       │   ... (7 modules × 3 workshops)
│       └── ...
│
├── workshop/                       # Consolidated workshop content
│   ├── m00-setup.md               # Shared: Environment & Copilot Setup (90 min)
│   ├── README.md                  # Consolidated track overview
│   ├── m10-*.md .. m14-*.md       # Modules 10+ (Development Platform)
│   ├── m20-*.md .. m24-*.md       # Modules 20+ (Agentic Development)
│   └── m30-*.md .. m32-*.md       # Modules 30+ (Security, Quality and Resiliency)
│
├── modules/                        # [LEGACY] Original flat structure (deprecated)
│   ├── m00-environment-setup/      # ⚠️ See workshop/m00-setup.md instead
│   ├── m01-copilot-setup/          # ⚠️ See workshop/m00-setup.md instead
│   ├── m02-copilot-basics/         # ⚠️ See workshop/m10-ghe-basics.md
│   ... (original M00-M14)
│
├── src/                            # OctoSupply demo app and shared schema
│   ├── README.md                   # Source code overview
│   ├── Makefile                    # Cross-language build/test/dev targets
│   ├── api-ts/                     # TypeScript Express API
│   ├── api-cs/                     # ASP.NET Core API
│   ├── api-cs-tests/               # xUnit tests for C# API
│   ├── api-py/                     # FastAPI implementation
│   ├── api-java/                   # Spring Boot implementation
│   ├── frontend/                   # React + Vite frontend
│   └── database/                   # Shared SQLite migrations and seed data
│
├── assets/                         # Shared resources
│   ├── samples/                    # Solution snapshots
│   ├── images/                     # Diagrams and screenshots
│   └── slide-templates/            # Markdown templates for instructors
│
└── .github/                        # GitHub workflows
    ├── workflows/
    │   ├── validate-modules.yml
    │   └── test-languages.yml
    └── ISSUE_TEMPLATE/
```

### ⚠️ Structure Migration

The repository has been refactored from a flat module structure to a **workshop-organized structure**:

- **Old:** `/modules/m01-copilot-setup/README.md` → **New:** `/workshop/m00-setup.md`
- **Old:** `/modules/m02-copilot-basics/README.md` → **New:** `/workshop/m10-ghe-basics.md`

**⚠️ The `/modules/` folder is deprecated.** See [MIGRATION_GUIDE.md](docs/MIGRATION_GUIDE.md) if you're upgrading from the old structure.
## 🔄 Git Branching Strategy

This repository uses a **workshop and module-based branching approach** for clean state resets:

```
main                                   (default, always deployable)
│
├── w01-m00-ready                      (Workshop 1, start Module 00 setup)
├── w01-m00-complete                   (Workshop 1, setup complete, ready for m01)
├── w01-m01-ready                      (Workshop 1, start Module 01)
├── w01-m01-complete                   (Workshop 1, module 1 complete, ready for m02)
├── w01-m02-ready                      (Workshop 1, start Module 02)
├── w01-m02-complete
├── ... (repeats for all 7 modules in Workshop 1)
│
├── w02-m00-ready                      (Workshop 2, start Module 00 setup)
├── w02-m00-complete                   (Workshop 2, setup complete, ready for m01)
├── w02-m01-ready                      (Workshop 2, start Module 01)
├── w02-m01-complete
├── ... (repeats for all 7 modules in Workshop 2)
│
└── w03-m00-ready                      (Workshop 3, start Module 00 setup)
    ├── w03-m00-complete              (Workshop 3, setup complete, ready for m01)
    ├── w03-m01-ready                 (Workshop 3, start Module 01)
    ├── w03-m01-complete
    └── ... (repeats for all 6 modules in Workshop 3)
```

**How to Use**:
- **Start any workshop:** `git checkout w0N-m00-ready`
- **Progress through modules:** `git checkout w0N-mNN-ready` to reset to module start
- **See a completed solution:** `git checkout w0N-mNN-complete`
- **Compare exercises:** Use `/assets/samples/` for multi-language solutions

## 👩‍🏫 Instructor Workflow

1. **Choose a workshop** based on your audience's skill level and learning path
2. **Read the workshop guide:** Open `workshop/README.md` to see the module sequence, prerequisites, and learning objectives
3. **Prepare materials:** Use `docs/.instructor/{workshop-name}/` for slides and demo scripts
4. **Structure your session:**
   - **Session 1-2 (90 min):** Complete [Module 00: Environment & Copilot Setup](workshop/m00-setup.md) as a group
   - **Session 3+ (60-90 min each):** Follow workshop modules in order, 1 per session
   - **Group exercises:** Use the shared OctoSupply code in `/src/` (API variants + frontend) with checkpoint branches

**Preparation Time**: ~2-3 hours per workshop (review all modules, test demo environment, understand exercises)

## 👨‍💻 Participant Workflow

1. **Complete Module 00:** Follow [Environment & Copilot Setup](workshop/m00-setup.md) (~90 min)
2. **Choose your track:**
   - Track 1 (m10-m14) → Develop agents and governance
   - Track 2 (m20-m24) → Advanced agentic patterns
   - Track 3 (m30-m32) → Security and vulnerability management
3. **Work through modules in order:**
   - Open the guide: `workshop/README.md`
   - Start from the branch: `git checkout <module>-ready`
   - Follow the module: `workshop/mNN-{module-name}.md`
   - Complete exercises, then check solutions in `/assets/samples/{language}/`
   - Move to next: `git checkout <next-module>-ready`

**Time Commitment**: 5-7 hours total (90 min setup + 4-6 hours modules)

## 📋 Module Content Organization

All modules follow a consistent structure across workshops:

- **Participant file:** `workshop/mNN-{module-name}.md`
  - Learning goals, concepts, and background reading
  - 2-3 graduated exercises (Beginner/Intermediate/Advanced)
  - Links to relevant sections of `/src/` (for example `api-ts`, `api-cs`, `api-py`, `api-java`, `frontend`)

- **Instructor materials:** `docs/.instructor/{workshop}/mNN-{module-name}/`
  - `SLIDES.md` (presentation + speaker notes, 20-30 slides)
  - `DEMO.md` (live walkthrough script, 15-30 min)
  - Optional `INSTRUCTOR.md` (additional teaching notes)

- **Code & samples:** module markdown + `/assets/samples/`
  - Starter files (if module requires setup)
  - Solution code in multiple languages

## 🛠️ Workshop Applications

The repository uses **OctoSupply** as the shared demo system, implemented as four
API variants plus one frontend:

| Variant | Stack | Primary entry points |
| --- | --- | --- |
| TypeScript API | Node.js, Express, TypeScript, Vitest, ESLint | `src/api-ts/src/index.ts` |
| C# API | ASP.NET Core .NET 10, Microsoft.Data.Sqlite | `src/api-cs/Program.cs` |
| Python API | FastAPI, aiosqlite, pytest | `src/api-py/main.py` |
| Java API | Spring Boot, Maven, sqlite-jdbc | `src/api-java/src/main/java/com/octocat/supply/Application.java` |
| Frontend | React 18, Vite, Tailwind, Playwright | `src/frontend/src/main.tsx` |

Shared schema and seed data live in `src/database/`, and all API variants expose
equivalent REST endpoints.

## 📖 Documentation

- **MODULE_GUIDE.md** — How modules are structured, standards
- **GETTING_STARTED.md** — Navigation guide, FAQ
- **TROUBLESHOOTING.md** — Common issues & solutions
- **CONTRIBUTING.md** — How to add modules, language versions, exercises

## 🌍 Languages Supported

- **Python** (FastAPI API variant) + TypeScript/React frontend
- **TypeScript** (Express API variant) + TypeScript/React frontend
- **C#** (ASP.NET Core API variant) + TypeScript/React frontend
- **Java** (Spring Boot API variant) + TypeScript/React frontend

All modules teach the same Copilot concepts in all 4 languages, but the imported workshop applications are not identical products.

## 🎯 Skills Covered

### Copilot (Primary)
- Code completion & suggestions
- Chat interface (IDE & CLI)
- Inline fixes & refactoring
- Custom instructions (skills)
- Agentic patterns & agents
- Personalization & personas

### GitHub Advanced Security (Primary)
- Secret scanning & remediation
- Code scanning with Copilot
- Dependabot vulnerability alerts
- Supply chain security patterns

### Additional Topics (Lower Priority)
- At-scale Pattern Engineering (APE)
- Code quality & testing
- GitHub Actions & CI/CD
- GitHub Enterprise and Copilot administration
- InnerSource operating model and governance

## 🚀 Getting Started

**For Instructors**:
```bash
git clone https://github.com/[org]/copilot-training.git
cd copilot-training
cat docs/.instructor/INSTRUCTOR_GUIDE.md
```

**For Participants**:
```bash
git clone https://github.com/[org]/copilot-training.git
cd copilot-training
git checkout m00-ready
cat workshop/m00-setup.md
```

## 📝 License

MIT License — See LICENSE file

## 🤝 Contributing

Interested in adding modules, languages, or exercises?

See `CONTRIBUTING.md` for:
- How to propose new modules
- How to add language variants
- Exercise standards & submission process
- Review process for community contributions

## 💬 Questions?

- Check `TROUBLESHOOTING.md` for common issues
- Read `GETTING_STARTED.md` for navigation help
- Open an Issue for questions or feedback

---

**Last Updated**: 2026 | **Status**: Curriculum complete (M00-M14)
