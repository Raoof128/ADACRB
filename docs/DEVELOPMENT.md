# Development Guide

This guide covers local workflows, coding standards, and extensibility hooks for the Cybersecurity Resume Builder.

## Environment Setup
- Node.js 20+
- Install dependencies with `npm install`.
- Recommended editor settings: Prettier formatting and ESLint integration.

## Commands
- **Run**: `npm start` – generates a sample resume to `output/resume.html`.
- **Test**: `npm test` – executes the Node test runner, including security escaping coverage.
- **Lint**: `npm run lint -- --max-warnings=0` – enforces style and best practices.
- **Format**: `npm run format` – applies Prettier formatting across the repo.

## Adding Templates
1. Create a template file under `src/templates` (e.g., `src/templates/minimal.html`).
2. Register it in `src/core/layoutEngine.js` via `registerTemplate('minimal', <path>)`.
3. Add a test that renders the layout and asserts the output contains the provided data.

## Extending Keyword Intelligence
- Expand `ROLE_KEYWORDS` in `src/core/keywordEngine.js` with new specialties.
- Keep keywords concise and ATS-friendly; prefer nouns and short phrases.

## Security Practices
- Escape and sanitize all user-supplied strings before rendering HTML.
- Avoid storing personal information; use fictional defaults for demos and tests.
- Keep dependencies minimal and audited (`npm audit` is run in CI).

## Conventions
- Use descriptive names and JSDoc comments for functions.
- Prefer pure functions and small modules to keep the architecture composable.
- Log meaningful context using `Logger` rather than raw `console` calls.
