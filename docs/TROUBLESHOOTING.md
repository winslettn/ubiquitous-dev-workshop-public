# Troubleshooting

Common issues and quick fixes for workshop setup and module execution.

## Environment and tooling

### Python track fails setup

- **Symptom:** `python --version` is not 3.13.x or `uv` not found.
- **Fix:** Install Python 3.13.x, then re-run Module 00 Python steps.

### Node/npm command not found

- **Symptom:** `node --version` or `npm --version` fails.
- **Fix:** Install Node.js 22.x LTS and reopen your terminal.

### dotnet command not found

- **Symptom:** `dotnet --version` fails.
- **Fix:** Install .NET SDK 10.x and restart shell/IDE.

### Java command not found

- **Symptom:** `java --version` fails.
- **Fix:** Install JDK 21 and reopen shell/IDE.

## Copilot setup

### Copilot not appearing in IDE

- Confirm extension/plugin is installed for your selected IDE.
- Sign out/sign in to GitHub in the IDE.
- Restart IDE and retry.

### Vim/Neovim Copilot not working

- Ensure `copilot.vim` is installed.
- Run `:Copilot setup` to authenticate.
- Confirm Node.js is installed (`node --version`).

## Test and build failures

### TypeScript tests/build/lint fail

- Run commands from `src/typescript`.
- Install dependencies first: `npm install`.

### C# tests show NuGet vulnerability warnings

- Current warnings do not block test execution, but should be tracked as
  dependency hygiene work.

### Java tests fail in local environment

- Run from `src/java` with the wrapper:
  - Windows: `.\mvnw.cmd -pl web test`
  - POSIX: `./mvnw -pl web test`
- If failures persist, capture stack trace and open an issue.
