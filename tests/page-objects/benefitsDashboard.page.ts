import { Page, Locator, expect } from "@playwright/test";
import { LoginPage } from "./login.page";

export class BenefitsDashboard extends LoginPage {
  // Navigation
  readonly logoutLink: Locator;
  readonly dashboardLink: Locator;

  // Table
  readonly employeesTable: Locator;
  readonly tableRows: Locator;

  // Buttons
  readonly addEmployeeButton: Locator;

  // Employee Modal
  readonly employeeModal: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly dependentsInput: Locator;
  readonly addButton: Locator;
  readonly updateButton: Locator;
  readonly cancelButton: Locator;
  readonly closeModalButton: Locator;

  // Delete Modal
  readonly deleteModal: Locator;
  readonly deleteButton: Locator;
  readonly deleteCancelButton: Locator;
  readonly deleteCloseButton: Locator;
  readonly deleteFirstNameSpan: Locator;
  readonly deleteLastNameSpan: Locator;

  constructor(page: Page) {
    super(page);

    // Navigation - using text content
    this.logoutLink = page.getByRole("link", { name: "Log Out" });
    this.dashboardLink = page.getByRole("link", {
      name: "Paylocity Benefits Dashboard",
    });

    // Table - using id since it's present
    this.employeesTable = page.locator("#employeesTable");
    this.tableRows = this.employeesTable.locator("tbody tr");

    // Buttons - using id and role
    this.addEmployeeButton = page.getByRole("button", { name: "Add Employee" });

    // Employee Modal - using id for inputs and labels
    this.employeeModal = page.locator("#employeeModal");
    this.firstNameInput = page.locator("#firstName");
    this.lastNameInput = page.locator("#lastName");
    this.dependentsInput = page.locator("#dependants");
    this.addButton = page.locator("#addEmployee");
    this.updateButton = page.locator("#updateEmployee");
    this.cancelButton = this.employeeModal.getByRole("button", {
      name: "Cancel",
    });
    this.closeModalButton = this.employeeModal.getByLabel("Close");

    // Delete Modal - using id and role
    this.deleteModal = page.locator("#deleteModal");
    this.deleteButton = page.locator("#deleteEmployee");
    this.deleteCancelButton = this.deleteModal.getByRole("button", {
      name: "Cancel",
    });
    this.deleteCloseButton = this.deleteModal.getByLabel("Close");
    this.deleteFirstNameSpan = page.locator("#deleteFirstName");
    this.deleteLastNameSpan = page.locator("#deleteLastName");
  }

  async open() {
    await this.page.goto(`${process.env.BASE_URL}/Benefits`);
  }

  // Helper methods
  async addEmployee(firstName: string, lastName: string, dependents: number) {
    await this.addEmployeeButton.click();
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.dependentsInput.fill(dependents.toString());
    await this.addButton.click();
  }

  async editEmployeeInRow(employee: string) {
    const employeeRow = this.page.locator("tr").filter({ hasText: employee });
    await employeeRow.locator(".fa-edit").click();
  }

  async deleteEmployeeInRow(employee: string) {
    const employeeRow = this.page.locator("tr").filter({ hasText: employee });
    await employeeRow.locator(".fa-times").click();
  }

  async updateEmployee(
    firstName: string,
    lastName: string,
    dependents: number,
  ) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.dependentsInput.fill(dependents.toString());
    await this.updateButton.click();
  }

  async confirmDelete() {
    await this.deleteButton.click();
  }

  async getEmployeeData(employee: string) {
    const employeeRow = this.page.locator("tr").filter({ hasText: employee });
    const cells = employeeRow.locator("td");

    return {
      id: await cells.nth(0).textContent(),
      firstName: await cells.nth(1).textContent(),
      lastName: await cells.nth(2).textContent(),
      dependents: await cells.nth(3).textContent(),
      salary: await cells.nth(4).textContent(),
      grossPay: await cells.nth(5).textContent(),
      benefitsCost: await cells.nth(6).textContent(),
      netPay: await cells.nth(7).textContent(),
    };
  }

  async getEmployeeCount() {
    return await this.tableRows.count();
  }
}
