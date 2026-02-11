import { test as base, createAPIContext } from '../fixtures/login.fixture';
import { BenefitsDashboard } from '../page-objects/benefitsDashboard.page';
import { Employees, Employee } from '../services/employees.api';

/**
 * Custom test fixtures that extend Playwright's base test
 * This allows you to inject page objects and other utilities into your tests
 */
type EmployeeFixtures = {
  benefitsDashboard: BenefitsDashboard;
  newEmployee: Employee;
}


export const test = base.extend<EmployeeFixtures>({
  benefitsDashboard: async ({ page }, use) => {
    const benefitsDashboard = new BenefitsDashboard(page);
    await use(benefitsDashboard);
  },
  newEmployee: async ({}, use) => {
    // Create a test employee via API before the test
    const api = new Employees(await createAPIContext());
    const employee = await api.createEmployee({
      username: process.env.USERNAME || `username_${Date.now()}`,
      firstName: `Employee_${Date.now()}`,
      lastName: 'Test',
      dependants: 2
    });

    const employeeData: Employee = JSON.parse(await employee.text());
    await use(employeeData); // Pass the created employee data to the test
  },
});

export { expect, Page, APIRequestContext } from '@playwright/test';