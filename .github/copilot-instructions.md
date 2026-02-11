# Playwright TypeScript Test Automation Project

This workspace contains a Playwright test automation project using TypeScript.

## Project Structure
- `tests/` - End-to-end test files
- `playwright.config.ts` - Playwright configuration
- `.github/workflows/playwright.yml` - GitHub Actions CI workflow

## Available Commands
- `npx playwright test` - Run all tests
- `npx playwright test --ui` - Run tests in UI mode
- `npx playwright test --debug` - Run tests in debug mode
- `npx playwright codegen` - Generate tests with Codegen
- `npx playwright show-report` - View test reports

## Best Practices
- Write tests in the `tests/` directory
- Use TypeScript for type safety
- Follow Playwright's testing patterns
- Run tests before committing code
