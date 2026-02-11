import { test, expect } from "../fixtures/employee.fixture";

test.describe("Employee Benefits Dashboard E2E Tests", () => {
  test.beforeEach(async ({ loginPage, benefitsDashboard }) => {
    // Login to the application before each test
    await loginPage.login();
  });

  test.afterEach(async ({ benefitsDashboard }) => {
    // Logout after each test to ensure clean state
    await benefitsDashboard.logoutLink.click();
  });

  test("should add a new employee", async ({ benefitsDashboard }) => {
    const firstName = `Test_1_${Date.now()}`;
    const lastName = "User";
    const dependents = 2;

    await test.step("Add a new employee", async () => {
      // Click Add Employee button
      await expect(benefitsDashboard.tableRows.first()).toBeVisible({
        timeout: 10000,
      });
      await benefitsDashboard.addEmployeeButton.click();

      await expect(benefitsDashboard.employeeModal).toBeVisible({
        timeout: 5000,
      });

      // Fill in employee details
      await benefitsDashboard.firstNameInput.fill(firstName);
      await benefitsDashboard.lastNameInput.fill(lastName);
      await benefitsDashboard.dependentsInput.fill(dependents.toString());

      // Click Add button
      await benefitsDashboard.addButton.click();

      // Wait for modal to close
      await expect(benefitsDashboard.employeeModal).not.toBeVisible({
        timeout: 5000,
      });
    });

    await test.step("Verify the new employee appears in the table with correct details", async () => {
      // Find the newly added employee in the table
      const newEmployeeData = await benefitsDashboard.getEmployeeData(
        `${firstName}`,
      );
      expect(newEmployeeData.firstName).toBe(firstName);
      expect(newEmployeeData.lastName).toBe(lastName);
      expect(newEmployeeData.dependents).toBe(dependents.toString());
    });
  });

  test("should update an existing employee", async ({
    benefitsDashboard,
    newEmployee,
  }) => {
    const updatedFirstName = `UpdatedTest_2_${Date.now()}`;
    const updatedLastName = `UpdatedUser`;
    const updatedDependents = 3;

    await test.step("Edit the newly added employee", async () => {
      await benefitsDashboard.page.reload(); // Ensure we have the latest data loaded
      await expect(benefitsDashboard.tableRows.first()).toBeVisible({
        timeout: 10000,
      });
      await benefitsDashboard.editEmployeeInRow(newEmployee.firstName);
      await benefitsDashboard.updateEmployee(
        updatedFirstName,
        updatedLastName,
        updatedDependents,
      );

      // Wait for modal to close
      await expect(benefitsDashboard.employeeModal).not.toBeVisible({
        timeout: 5000,
      });
    });

    await test.step("Verify the employee details are updated in the table", async () => {
      // Verify employee was updated
      const updatedEmployeeData =
        await benefitsDashboard.getEmployeeData(updatedFirstName);
      expect(updatedEmployeeData.firstName).toBe(updatedFirstName);
      expect(updatedEmployeeData.lastName).toBe(updatedLastName);
      expect(updatedEmployeeData.dependents).toBe(updatedDependents.toString());
    });
  });

  test("should calculate benefits cost and net pay for employee with dependents", async ({
    benefitsDashboard,
    newEmployee,
  }) => {
    await benefitsDashboard.page.reload(); // Ensure we have the latest data loaded
    await expect(benefitsDashboard.tableRows.first()).toBeVisible({
      timeout: 10000,
    });
    // Get the employee data for the newly added employee
    const employeeData = await benefitsDashboard.getEmployeeData(
      newEmployee.firstName,
    );

    // Verify calculated fields are correct
    expect(employeeData.salary).toContain("52000.00"); // Annual salary
    expect(employeeData.grossPay).toContain("2000.00"); // Gross pay
    expect(employeeData.benefitsCost).toContain("76.92"); // Base cost + dependents
    expect(employeeData.netPay).toContain("1923.08"); // Salary - benefits cost
  });

  test("should delete an employee", async ({
    benefitsDashboard,
    newEmployee,
  }) => {
    await benefitsDashboard.page.reload(); // Ensure we have the latest data loaded
    await expect(benefitsDashboard.tableRows.first()).toBeVisible({
      timeout: 10000,
    });
    await test.step("Delete the employee", async () => {
      await benefitsDashboard.deleteEmployeeInRow(newEmployee.firstName);
      await benefitsDashboard.confirmDelete();

      // Wait for deletion to complete
      await expect(benefitsDashboard.employeeModal).not.toBeVisible({
        timeout: 5000,
      });
    });

    await test.step("Verify the employee is removed from the table", async () => {
      // Verify employee was deleted
      await expect(
        benefitsDashboard.page
          .locator("tr")
          .filter({ hasText: newEmployee.firstName }),
      ).not.toBeVisible();
    });
  });
});
