# Environment Setup

**Audience:** Workshop participants

## Overview

This guide applies to the **manual local environment setup path only**. Codespaces and devcontainer setup are handled as part of the instructor-led demo. Use this module when you need to prepare your own local machine so later modules can run without setup interruptions.

### Key Concepts

1. Accounts and repository access prerequisites.
2. Workshop content access for manual local setup.
3. IDE extension installation and configuration.
4. Copilot sign-in and activation.
5. Local repository bootstrap and readiness verification.

## Prerequisites

- A GitHub account with access to this repository.
- A GitHub Copilot license or trial activation.
- One IDE: Visual Studio Code, Visual Studio, or a JetBrains IDE.
- One API language track for the workshop:
  - TypeScript (`src/api-ts`)
  - C# (`src/api-cs`)
  - Python (`src/api-py`)
  - Java (`src/api-java`)

## Learning Objectives

- Confirm GitHub account access, GitHub CLI authentication, and Copilot entitlement before starting hands-on work.
- Complete the manual local setup path when Codespaces or devcontainers are not being used for your seat.
- Install the required IDE extensions and verify Copilot is active in the local IDE.
- Clone or open the repository, bootstrap dependencies, and complete the readiness checks.
- Identify the evidence that proves your local setup is working before proceeding to later modules.

## Exercises

### Exercise 1: Verify accounts and access prerequisites

**Objective:** Confirm that your account and permissions are ready before environment setup.

**Hands-on:**
1. Sign in to GitHub and confirm access your workshop repository (reference: [GitHub Getting Started](https://docs.github.com/en/get-started) and [GitHub authentication](https://docs.github.com/en/authentication)).

### Exercise 2: Set up your development environment

**Objective:** Complete the manual local development environment setup path.

**Hands-on:**
1. Confirm that you are on the **manual local setup** path.
   - If your instructor is using Codespaces or a devcontainer for your seat, follow the instructor-led demo instead of this exercise.
2. Get the workshop content using the path your instructor selected:
   - fork the repository,
   - create a repository from a template, or
   - use the manually provided copy.
3. Install required runtimes and tools for your local machine:
   - [Git](https://git-scm.com/downloads)
   - [GitHub CLI](https://cli.github.com/)
   - [Node.js LTS](https://nodejs.org/en/download) for TypeScript
   - [.NET 10+ SDK](https://dotnet.microsoft.com/en-us/download) for C#
   - [Python 3](https://www.python.org/downloads/) for Python
   - [OpenJDK 17+](https://adoptium.net/temurin/releases/) for Java
4. Verify your selected runtime and required CLI tools:
   ```bash
   git --version
   gh --version
   ```
   Run the language-specific check for your chosen API language:
   ```bash
   node --version
   dotnet --version
   python3 --version
   java --version
   ```

5. Confirm GitHub CLI authentication:
   ```bash
   gh auth status
   ```
   If you are not authenticated, run:
   ```bash
   gh auth login
   ```

### Exercise 3: Install IDE extensions

**Objective:** Install the IDE extensions needed for a complete GitHub + Copilot workflow.

**Hands-on:**
1. Install your selected IDE if needed:
   - [Visual Studio Code](https://code.visualstudio.com/Download)
   - [Visual Studio](https://visualstudio.microsoft.com/downloads/)
   - [JetBrains Toolbox](https://www.jetbrains.com/toolbox-app/)
2. Install GitHub Copilot extensions using [Configuring GitHub Copilot](https://docs.github.com/en/copilot/configuring-github-copilot):
   - Visual Studio Code: GitHub Copilot and GitHub Copilot Chat
   - Visual Studio: GitHub Copilot
   - JetBrains IDEs: GitHub Copilot plugin
3. Confirm extension status is visible in your IDE (enabled and not blocked by policy).

### Exercise 4: Sign in to Copilot and validate activation

**Objective:** Confirm that Copilot is active and responding in your IDE.

**Hands-on:**
1. Complete IDE sign-in and activation steps from [Get started with GitHub Copilot](https://docs.github.com/en/copilot/get-started-with-github-copilot).
2. Open any source file and trigger one inline suggestion; accept it.
3. Open Copilot Chat and ask one repository question, for example: `Summarize this file`.
4. Confirm Copilot status is active/ready in your IDE status area.
5. If your workshop setup includes Copilot CLI, verify it is available on your local machine.


### Exercise 5: Bootstrap the repository and run readiness checks

**Objective:** Start the shared application stack and verify your development loop is ready.

**Hands-on:**
1. Clone the repository if not already cloned, using [Repository documentation](https://docs.github.com/en/repositories).

2. Move intothe repo folder and `src` and install dependencies for your selected backend:
   ```bash
   cd src
   ```
   - TypeScript: `make install-ts`
   - C#: `make install-cs`
   - Python: `make install-py`
   - Java: `make install-java`
3. Build your selected backend:
   - TypeScript: `make build-ts`
   - C#: `make build-cs`
   - Python: `make build-py`
   - Java: `make build-java`
4. Run one test command for your selected backend:
   - TypeScript: `make test-ts`
   - C#: `make test-cs`
   - Python: `make test-py`
   - Java: `make test-java`
5. Start the full stack:
   - TypeScript: `make dev-ts`
   - C#: `make dev-cs`
   - Python: `make dev-py`
   - Java: `make dev-java`
6. Verify endpoints:
   - API responds on `http://localhost:3000`
   - Frontend responds on `http://localhost:5137`
7. Stop processes cleanly with `Ctrl+C`.

## Completion Criteria

1. You can confirm GitHub account access, CLI authentication, and Copilot entitlement.
2. You can clone, build, test, and run your selected backend with the shared frontend.
3. You can verify workshop endpoints and continue with a repeatable local setup workflow.
