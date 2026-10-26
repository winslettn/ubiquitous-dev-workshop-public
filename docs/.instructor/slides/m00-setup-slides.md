<!--
title: "Module 00: Setup & Environment"
template: default
-->

# Module 00: Setup & Environment

---

## Agenda: Day 1

<!--
layout: content
-->

**INSTRUCTOR TODO: Update these agenda slides based on your specific modules**

**GitHub Enterprise & Development Platform (9:00 AM - 5:00 PM)**

| Start Time | Duration | Module | Title |
|-----------|----------|--------|-------|
| 9:00 AM | 60 min | m00 | Setup & Environment |
| 10:00 AM | 15 min | — | Break |
| 10:15 AM | 95 min | m10 | GHE Admin |
| 11:50 AM | 55 min | m11 | GHE Basics |
| 12:45 PM | 45 min | — | **Lunch** |
| 1:30 PM | 90 min | m12 | Agents & Orchestration |
| 3:00 PM | 15 min | — | Break |
| 3:15 PM | 105 min | m13 | Actions & Automation |

---

## Agenda: Day 2

<!--
layout: content
-->

**Copilot Fundamentals & Advanced (9:00 AM - 5:00 PM)**

| Start Time | Duration | Module | Title |
|-----------|----------|--------|-------|
| 9:00 AM | 70 min | m14 | Additional Features |
| 10:10 AM | 15 min | — | Break |
| 10:25 AM | 70 min | m20 | Copilot Admin |
| 11:35 AM | 10 min | m21 | Idea to Code |
| 11:45 AM | 45 min | — | **Lunch** |
| 12:30 PM | 60 min | m22 | Copilot Fundamentals |
| 1:30 PM | 15 min | — | Break |
| 1:45 PM | 105 min | m23 | Advanced Copilot |
| 3:30 PM | 15 min | — | Break |
| 3:45 PM | 75 min | m24 | Context Engineering |

---

## Agenda: Day 3

<!--
layout: content
-->

**Security & Code Quality (9:00 AM - 5:00 PM)**

| Start Time | Duration | Module | Title |
|-----------|----------|--------|-------|
| 9:00 AM | 60 min | m30 | Application Security Overview & Management |
| 10:00 AM | 15 min | — | Break |
| 10:15 AM | 85 min | m31 | Application Security Monitoring & Remediation |
| 11:40 AM | 45 min | — | **Lunch** |
| 12:25 PM | 70 min | m32 | Code Quality Monitoring & Improvement |
| 1:35 PM | 3 hrs 25 min | — | Buffer / Optional extensions |

---

## Getting Ready

<!--
layout: section
-->

---

## Workshop Prerequisites

<!--
layout: content
-->

**Setup:**

- Workshop content (the _ubiquitous-dev-workshop_ repo)

- The environment:
  - IDE installation (VS Code, Visual Studio, JetBrains, eclipse, ...)
  - Plug-ins and tools (git, GitHub CLI, GitHub Copilot API, GitHub Copilot App, ... )

```speaker-notes
Before we get started, we need to make sure everyon has access to the workshop content and has a functional hands-on environment.  I will walk you through the setup for your environment...
```

---

## EXERCISE (Instructor led)

<!--
layout: demo
-->

**Workshop content:**

- Option 1 - Fork the repo

- Option 2 - Deploy from a template

- Option 3 - Manually

_Follow along while we setup the content!_

```speaker-notes
**INSTRUCTOR TODO:** There are multiple ways for the students to get the content.  Make sure you know your approach and have worked with the GitHub admins for your customer if using their tenant (receommended).

1. As a fork from a repo that they have access to, hopefully in their GitHub organization.
2. By deploying from a template copy of this repo which you've helped configure in their GitHub organization.
3. Manually, via a ZIP and/or scripts to upload the workshop content.
```
---

## EXERCISE (Instructor led)

<!--
layout: demo
-->

**Environment Setup:**

- Provision the Codespace or open the repository in a devcontainer

- Verify the Environment

- Log in to required services

_Follow along while we setup the environment!_

```speaker-notes
**INSTRUCTOR TODO:** There are three options: Codespaces, devcontainer, or manual setup (which can be painful and fault prone depending upon the attendees skill and environmental constraints).  We are defaulting to the easiest managed paths (Codespace or devcontainer) but hide/show this and the following slide based on your customer needs.

For the codespace path (this one):
1. Create the codespace on main
2. Verify GitHub CLI and login
3. [OPTIONAL] Install and verify GitHub Copilot CLI
4. [OPTIONAL] Verify login to GitHub Copilot in the IDE

For the devcontainer path:
1. Clone the repository locally
2. Open it in the devcontainer
3. Verify GitHub CLI and login
4. [OPTIONAL] Install and verify GitHub Copilot CLI
5. [OPTIONAL] Verify login to GitHub Copilot in the IDE
```

---

## IDE Installation & Configuration

<!--
layout: section
hidden: true
-->

```speaker-notes
This section is required only if you're not using Codespaces or a devcontainer. A few slides about what is going to happen and then a lead-in to the Exercises.
```

---

## Choose Your IDE
<!--
layout: content
hidden: true
-->

**VS Code** (Universal)
- Works with Python, TypeScript, C#, Java
- Lightweight, extensible
- Extension: GitHub Copilot for VS Code

**Visual Studio 2026** (.NET-focused)
- Best for C# and full-stack .NET development
- Built-in Copilot support
- Comprehensive debugging & diagnostics

**JetBrains IDEs** (Language-specific)
- PyCharm (Python)
- WebStorm (TypeScript/JavaScript)
- IntelliJ IDEA (Java)
- Rider (C#/.NET)
- Unified Copilot experience across all

---

## Language Runtimes

<!--
layout: content
hidden: true
-->

**Required Runtimes (choose one or more):**

| Language | Runtime | Check Command | Installation |
|----------|---------|----------------|--------------|
| Python | Python 3.11+ | `python --version` | https://python.org |
| TypeScript | Node.js 18+ | `node --version` | https://nodejs.org |
| C# | .NET 10+ | `dotnet --version` | https://dot.net |
| Java | JDK 17+ | `java --version` | https://adoptium.net |

**Installation Time:** 10-15 minutes per language (mostly download time)

```speaker-notes
This is straightforward—show participants how to verify they have the runtimes installed. They may have already installed some. Provide quick installation links.
```

---

## Repository Setup

<!--
layout: content
hidden: true
-->

Via your IDE git plug-in or:

```bash
git clone ***your URL***.git
cd ubiquitous-dev-workshop
```

```speaker-notes
Walk through cloning and basic git navigation. Show the branch structure so participants understand how to reset to a known state.
```

---

## Exercises

<!--
layout: content
hidden: true
-->

_Use workshop/m00-setup.md for the full exercise guide._

**EXERCISES:**

- Verify accounts and access prerequisites

- Set up your development environment

- Install IDE extensions

- Sign in to Copilot and validate activation

- Bootstrap the repository and run readiness checks

```speaker-notes
Use this slide to transition from the content deck into the hands-on module for Setup.
Point participants to workshop/m00-setup.md.
```
