import { test, expect } from '../fixtures/employee.fixture';

test.describe('Employee Benefits Dashboard E2E Tests', () => {

  test.beforeEach(async ({ loginPage, benefitsDashboard }) => {
    // Login to the application before each test
    await loginPage.login();
    // Navigate to the employees page
    await benefitsDashboard.open();
  });

  test('should add a new employee', async ({ benefitsDashboard }) => {
    const firstName = `Test_1_${Date.now()}`;
    const lastName = 'User';
    const dependents = 2;

    // Click Add Employee button
    await benefitsDashboard.addEmployeeButton.click();

    // Fill in employee details
    await benefitsDashboard.firstNameInput.fill(firstName);
    await benefitsDashboard.lastNameInput.fill(lastName);
    await benefitsDashboard.dependentsInput.fill(dependents.toString());

    // Click Add button
    await benefitsDashboard.addButton.click();

    // Wait for modal to close
    await expect(benefitsDashboard.employeeModal).not.toBeVisible({timeout: 5000 });

    // Find the newly added employee in the table
    const newEmployeeData = await benefitsDashboard.getEmployeeData(`${firstName}`);
    expect(newEmployeeData.firstName).toBe(firstName);
    expect(newEmployeeData.lastName).toBe(lastName);
    expect(newEmployeeData.dependents).toBe(dependents.toString());
  });

  test('should update an existing employee', async ({ benefitsDashboard, newEmployee }) => {
    await benefitsDashboard.editEmployeeInRow(newEmployee.firstName);

    // Update employee details
    const updatedFirstName = `UpdatedTest_2_${Date.now()}`;
    const updatedLastName = `UpdatedUser`;
    const updatedDependents = 3;

    await benefitsDashboard.updateEmployee(updatedFirstName, updatedLastName, updatedDependents);

    // Wait for modal to close
    await expect(benefitsDashboard.employeeModal).not.toBeVisible({timeout: 5000 });

    // Verify employee was updated
    const updatedEmployeeData = await benefitsDashboard.getEmployeeData(updatedFirstName);
    expect(updatedEmployeeData.firstName).toBe(updatedFirstName);
    expect(updatedEmployeeData.lastName).toBe(updatedLastName);
    expect(updatedEmployeeData.dependents).toBe(updatedDependents.toString());
  });

  test('should calculate benefits cost and net pay for employee with dependents', async ({ benefitsDashboard, newEmployee }) => {
    // Get the employee data for the newly added employee
    const employeeData = await benefitsDashboard.getEmployeeData(newEmployee.firstName);

    // Verify calculated fields are correct
    expect(employeeData.salary).toContain("52000.00"); // Annual salary
    expect(employeeData.grossPay).toContain("2000.00"); // Gross pay
    expect(employeeData.benefitsCost).toContain("76.92"); // Base cost + dependents
    expect(employeeData.netPay).toContain("1923.08"); // Salary - benefits cost

  });
});