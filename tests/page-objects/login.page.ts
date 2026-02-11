import { Locator, Page, expect } from '@playwright/test';

/**
 * Base Page Object class that other page objects can extend
 */
export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;  
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(
    page: Page
  ) {
    this.page = page;
    this.usernameInput = this.page.getByRole('textbox', { name: 'Username' });
    this.passwordInput = this.page.getByRole('textbox', { name: 'Password' });
    this.loginButton = this.page.getByRole('button', { name: 'Log In' });
  }
  async open() {
    await this.page.goto(`${process.env.BASE_URL}/Account/login`);
  }

  async login(username: string = process.env.USERNAME || '', password: string = process.env.PASSWORD || '') {
    await this.open();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
