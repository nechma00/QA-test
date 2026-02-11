import { test as base, request, APIRequestContext } from '@playwright/test';
import { LoginPage } from '../page-objects/login.page';

/**
 * Custom test fixtures that extend Playwright's base test
 * This allows you to inject page objects and other utilities into your tests
 */
type LoginFixtures = {
  loginPage: LoginPage;
};
let api: Promise<APIRequestContext>; // Declare api variable to hold the API request context

export async function apiContext(username: string, password: string): Promise<APIRequestContext>{
  // Simulate an API call to get a token async getToken(username: string, password: string): Promise<string> {
    const context = await request.newContext();
    const response = await context.post(`${process.env.BASE_URL}/api/auth/login`, {
      data: { username, password },
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok()) {
      throw new Error(`Failed to get token: ${response.status()} ${response.statusText()}`);
    }

    const data = await response.json();
    const token = data.token; // Assuming the token is returned in the 'token' field
    api = request.newContext({
      baseURL: '/Prod',
      extraHTTPHeaders: { Authorization: `Bearer ${token}` }
    });
    return api; // Return the API request context with the token set in the headers
  }

export async function createAPIContext(): Promise<APIRequestContext> {
      api = request.newContext({
      baseURL: '/Prod',
      extraHTTPHeaders: { Authorization: `Basic ${process.env.API_TOKEN}` }
    });
    return api; // Return the API request context with the token set in the headers
  }


export const test = base.extend<LoginFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
});

export { expect, Page, APIRequestContext, request } from '@playwright/test';
