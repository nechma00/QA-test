# Playwright TypeScript Test Automation

This project contains integration and end-to-end test automation using Playwright with TypeScript. The purpose of this repository is to demonstrate well structured test automation repository with using BE testing on API level and UI testing following best practices.

### Structure
All tests are part of the "tests" folder
- fixtures - classes for test prerequisites used in the tests itself to create all the necessary data for the test
- page-objets - page object models
- services - classes for api requests structured into logic entities
- e2e - test specifications
- playwright.config.ts - global config file

## Installation

The project is already set up with all dependencies installed. If you need to reinstall:

```bash
yarn install
```

### How to run

- To run tests locally, create a .env file with all necessary environment variables

        BASE_URL="https://wmxrwq14uc.execute-api.us-east-1.amazonaws.com/Prod"
        API_TOKEN=""
        USERNAME=""
        PASSWORD=""

- run the e2e tests:

        yarn test:e2e

- run the integration tests:

        yarn test:integration

- or run in debug mode:

        yarn test:e2e tests/ui/network.spec.ts --debug

- or with UI:

        yarn test:e2e tests/ui/network.spec.ts --ui
