import { APIRequestContext } from '@playwright/test';

export interface Employee {
  username: string;
  id?: string;
  firstName: string;
  lastName: string;
  dependants?: number;
  expiration?: string;
  salary?: number;
  gross?: number;
  benefitsCost?: number;
  net?: number;
}

export class Employees {
  private request: APIRequestContext;
  private baseURL: string;

  constructor(request: APIRequestContext, baseURL: string = process.env.BASE_URL || '') {
    this.request = request;
    this.baseURL = baseURL;
  }


  /**
   * Get all employees
   * GET /api/Employees
   */
  async getAllEmployees() {
    const response = await this.request.get(`${this.baseURL}/api/Employees`);
    return response;
  }

  /**
   * Get employee by ID
   * GET /api/Employees/{id}
   */
  async getEmployeeById(id: string) {
    const response = await this.request.get(`${this.baseURL}/api/Employees/${id}`);
    return response;
  }

  /**
   * Create a new employee
   * POST /api/Employees
   */
  async createEmployee(employee: Employee) {
    const response = await this.request.post(`${this.baseURL}/api/Employees`, {
      data: employee,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response;
  }
}
