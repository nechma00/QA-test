# Playwright TypeScript Test Automation

This project contains end-to-end test automation using Playwright with TypeScript.

## Prerequisites

- Node.js (version 18 or higher)
- npm

## Installation

The project is already set up with all dependencies installed. If you need to reinstall:

```bash
npm install
```

## Running Tests

Run all tests:
```bash
npx playwright test
```

Run tests in UI mode:
```bash
npx playwright test --ui
```

Run tests in a specific browser:
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

Run a specific test file:
```bash
npx playwright test tests/example.spec.ts
```

Run tests in debug mode:
```bash
npx playwright test --debug
```

## Generating Tests

Use Codegen to auto-generate tests:
```bash
npx playwright codegen
```

## Viewing Test Reports

After running tests, view the HTML report:
```bash
npx playwright show-report
```

## Project Structure

- `tests/` - Test files
- `playwright.config.ts` - Playwright configuration
- `.github/workflows/playwright.yml` - GitHub Actions CI workflow

## Learn More

- [Playwright Documentation](https://playwright.dev)
- [TypeScript Documentation](https://www.typescriptlang.org)
