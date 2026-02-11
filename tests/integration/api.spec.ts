import { test, expect, createAPIContext, APIRequestContext } from '../fixtures/login.fixture.ts';

const API_ENDPOINT = `${process.env.BASE_URL}/api/employees`;
let api: APIRequestContext; // Declare api variable to hold the API request context

test.beforeAll(async () => {
  // Create an API context with the token from the .env file
  api = await createAPIContext();
});

// Helper function to generate valid employee data
function generateValidEmployee(overrides = {}) {
  return {
    username: `testuser_${Date.now()}`,
    firstName: 'John',
    lastName: 'Doe',
    dependants: 2,
    ...overrides
  };
}

test.describe('Employee API Tests', () => {
  let createdEmployeeId: string;

  test.afterEach(async () => {
    // Cleanup: delete created employee if exists
    if (createdEmployeeId) {
      await api.delete(`${API_ENDPOINT}/${createdEmployeeId}`);
      createdEmployeeId = '';
    }
  });

  test.describe('Create Employee tests', () => {
    test('should create employee with all required fields', async () => {
      const employee = generateValidEmployee({ username: process.env.USERNAME });
      
      const response = await api.post(API_ENDPOINT, {
        data: employee
      });

      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);

      const responseData = await response.json();
      createdEmployeeId = responseData.id;

      expect(responseData).toHaveProperty('id');
      expect(responseData.firstName).toBe(employee.firstName);
      expect(responseData.lastName).toBe(employee.lastName);
      expect(responseData.username).toBe(employee.username);
      expect(responseData.dependants).toBe(employee.dependants);
      expect(responseData.salary).toBe(52000);
      expect(responseData.gross).toBe(2000);
    });

    test('should create employee with minimum dependants (0)', async () => {
      const employee = generateValidEmployee({ dependants: 0 });
      
      const response = await api.post(API_ENDPOINT, {
        data: employee
      });

      expect(response.ok()).toBeTruthy();
      const responseData = await response.json();
      createdEmployeeId = responseData.id;
      expect(responseData.dependants).toBe(0);
      expect(responseData.benefitsCost).toBe(38.46154);
      expect(responseData.net).toBe(1961.5385);
    });

    test('should create employee with maximum dependants (32)', async () => {
      const employee = generateValidEmployee({ dependants: 32 });
      
      const response = await api.post(API_ENDPOINT, {
        data: employee
      });

      expect(response.ok()).toBeTruthy();
      const responseData = await response.json();
      createdEmployeeId = responseData.id;
      expect(responseData.dependants).toBe(32);
      expect(responseData.benefitsCost).toBe(653.8462);
      expect(responseData.net).toBe(1346.1538);
    });

    test('should fail when firstName is missing', async () => {
      const employee = generateValidEmployee();
      delete (employee as any).firstName;
      
      const response = await api.post(API_ENDPOINT, {
        data: employee
      });

      expect(response.ok()).toBeFalsy();
      expect(response.status()).toBeGreaterThanOrEqual(400);
    });

    test('should fail when lastName is missing', async () => {
      const employee = generateValidEmployee();
      delete (employee as any).lastName;
      
      const response = await api.post(API_ENDPOINT, {
        data: employee
      });

      expect(response.ok()).toBeFalsy();
      expect(response.status()).toBeGreaterThanOrEqual(400);
    });

    test('should fail when username is missing', async () => {
      const employee = generateValidEmployee();
      delete (employee as any).username;
      
      const response = await api.post(API_ENDPOINT, {
        data: employee
      });

      expect(response.ok()).toBeFalsy();
      expect(response.status()).toBeGreaterThanOrEqual(400);
    });

    test('should fail when firstName exceeds max length (50)', async () => {
      const employee = generateValidEmployee({
        firstName: 'a'.repeat(51)
      });
      
      const response = await api.post(API_ENDPOINT, {
        data: employee
      });

      expect(response.ok()).toBeFalsy();
      expect(response.status()).toBeGreaterThanOrEqual(400);
    });

    test('should fail when lastName exceeds max length (50)', async () => {
      const employee = generateValidEmployee({
        lastName: 'a'.repeat(51)
      });
      
      const response = await api.post(API_ENDPOINT, {
        data: employee
      });

      expect(response.ok()).toBeFalsy();
      expect(response.status()).toBeGreaterThanOrEqual(400);
    });

    test('should fail when username exceeds max length (50)', async () => {
      const employee = generateValidEmployee({
        username: 'a'.repeat(51)
      });
      
      const response = await api.post(API_ENDPOINT, {
        data: employee
      });

      expect(response.ok()).toBeFalsy();
      expect(response.status()).toBeGreaterThanOrEqual(400);
    });

    test('should fail when dependants is negative', async () => {
      const employee = generateValidEmployee({ dependants: -1 });
      
      const response = await api.post(API_ENDPOINT, {
        data: employee
      });

      expect(response.ok()).toBeFalsy();
      expect(response.status()).toBeGreaterThanOrEqual(400);
      const responseData = await response.json();
      expect(responseData.errorMessage).toContain('The field Dependants must be between 0 and 32.');
    });

    test('should fail when dependants exceeds maximum (32)', async () => {
      const employee = generateValidEmployee({ dependants: 33 });
      
      const response = await api.post(API_ENDPOINT, {
        data: employee
      });

      expect(response.ok()).toBeFalsy();
      expect(response.status()).toBeGreaterThanOrEqual(400);
      const responseData = await response.json();
      expect(responseData.errorMessage).toContain('The field Dependants must be between 0 and 32.');
    });
  });

  test.describe('GET /api/Employees - Get All Employees', () => {
    test('should return list of employees', async () => {
      const response = await api.get(API_ENDPOINT);

      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);

      const responseData = await response.json();
      expect(Array.isArray(responseData)).toBeTruthy();
    });

    test('should return employees with all required properties', async () => {
      // First create an employee
      const employee = generateValidEmployee();
      const createResponse = await api.post(API_ENDPOINT, {
        data: employee
      });
      const createdEmployee = await createResponse.json();
      createdEmployeeId = createdEmployee.id;

      // Get all employees
      const response = await api.get(API_ENDPOINT);
      const employees = await response.json();

      const foundEmployee = employees.find((e: any) => e.id === createdEmployeeId);
      expect(foundEmployee).toBeDefined();
      expect(foundEmployee).toHaveProperty('id');
      expect(foundEmployee).toHaveProperty('firstName');
      expect(foundEmployee).toHaveProperty('lastName');
      expect(foundEmployee).toHaveProperty('username');
      expect(foundEmployee).toHaveProperty('dependants');
      expect(foundEmployee).toHaveProperty('salary');
      expect(foundEmployee).toHaveProperty('gross');
      expect(foundEmployee).toHaveProperty('benefitsCost');
      expect(foundEmployee).toHaveProperty('net');
    });
  });

  test.describe('Get Employee by ID tests', () => {
    test('should return employee by valid ID', async () => {
      // First create an employee
      const employee = generateValidEmployee();
      const createResponse = await api.post(API_ENDPOINT, {
        data: employee
      });
      const createdEmployee = await createResponse.json();
      createdEmployeeId = createdEmployee.id;

      // Get employee by ID
      const response = await api.get(`${API_ENDPOINT}/${createdEmployeeId}`);

      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);

      const responseData = await response.json();
      expect(responseData.id).toBe(createdEmployeeId);
      expect(responseData.firstName).toBe(employee.firstName);
      expect(responseData.lastName).toBe(employee.lastName);
    });

    test('should fail when employee ID does not exist', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      
      const response = await api.get(`${API_ENDPOINT}/${nonExistentId}`);

      expect(response.ok()).toBeFalsy();
      expect(response.status()).toBeGreaterThanOrEqual(400);
    });

    test('should fail with invalid UUID format', async () => {
      const invalidId = 'invalid-uuid';
      
      const response = await api.get(`${API_ENDPOINT}/${invalidId}`);

      expect(response.ok()).toBeFalsy();
      expect(response.status()).toBeGreaterThanOrEqual(400);
    });
  });

  test.describe('Update Employee tests', () => {
    test('should update employee with valid data', async () => {
      // First create an employee
      const employee = generateValidEmployee();
      const createResponse = await api.post(API_ENDPOINT, {
        data: employee
      });
      const createdEmployee = await createResponse.json();
      createdEmployeeId = createdEmployee.id;

      // Update employee
      const updatedData = {
        ...createdEmployee,
        firstName: 'Jane',
        lastName: 'Smith',
        dependants: 3
      };

      const response = await api.put(API_ENDPOINT, {
        data: updatedData
      });

      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);

      // Verify update
      const getResponse = await api.get(`${API_ENDPOINT}/${createdEmployeeId}`);
      const updatedEmployee = await getResponse.json();
      expect(updatedEmployee.firstName).toBe('Jane');
      expect(updatedEmployee.lastName).toBe('Smith');
      expect(updatedEmployee.dependants).toBe(3);
    });

    test('should fail when updating with missing required fields', async () => {
      const invalidUpdate = {
        id: '00000000-0000-0000-0000-000000000000',
        firstName: 'Jane'
        // Missing lastName and username
      };

      const response = await api.put(API_ENDPOINT, {
        data: invalidUpdate
      });

      expect(response.ok()).toBeFalsy();
      expect(response.status()).toBeGreaterThanOrEqual(400);
    });

    test('should fail when updating with invalid dependants value', async () => {
      const employee = generateValidEmployee();
      const createResponse = await api.post(API_ENDPOINT, {
        data: employee
      });
      const createdEmployee = await createResponse.json();
      createdEmployeeId = createdEmployee.id;

      const invalidUpdate = {
        ...createdEmployee,
        dependants: 50 // Exceeds maximum
      };

      const response = await api.put(API_ENDPOINT, {
        data: invalidUpdate
      });

      expect(response.ok()).toBeFalsy();
      expect(response.status()).toBeGreaterThanOrEqual(400);
    });
  });

  test.describe('Delete Employee tests', () => {
    test('should delete employee by valid ID', async () => {
      // First create an employee
      const employee = generateValidEmployee();
      const createResponse = await api.post(API_ENDPOINT, {
        data: employee
      });
      const createdEmployee = await createResponse.json();
      createdEmployeeId = createdEmployee.id;

      // Delete employee
      const response = await api.delete(`${API_ENDPOINT}/${createdEmployeeId}`);

      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);

      // Verify deletion
      const getResponse = await api.get(`${API_ENDPOINT}/${createdEmployeeId}`);
      expect(getResponse.ok()).toBeFalsy();

      createdEmployeeId = ''; // Clear since already deleted
    });

    test('should fail when deleting non-existent employee', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      
      const response = await api.delete(`${API_ENDPOINT}/${nonExistentId}`);

      expect(response.ok()).toBeFalsy();
      expect(response.status()).toBeGreaterThanOrEqual(400);
    });

    test('should fail with invalid UUID format', async () => {
      const invalidId = 'not-a-uuid';
      
      const response = await api.delete(`${API_ENDPOINT}/${invalidId}`);

      expect(response.ok()).toBeFalsy();
      expect(response.status()).toBeGreaterThanOrEqual(400);
    });
  });

  test.describe('Type Validation tests', () => {
    test('should reject non-integer dependents value', async () => {
      const employee = generateValidEmployee({ dependants: 2.5 });
      
      const response = await api.post(API_ENDPOINT, {
        data: employee
      });

      expect(response.ok()).toBeFalsy();
      expect(response.status()).toBeGreaterThanOrEqual(400);
    });

    test('should reject non-string firstName', async () => {
      const employee = {
        username: 'testuser',
        firstName: 123,
        lastName: 'Doe',
        dependants: 0
      };
      
      const response = await api.post(API_ENDPOINT, {
        data: employee
      });

      expect(response.ok()).toBeFalsy();
      expect(response.status()).toBeGreaterThanOrEqual(400);
    });
  });
});
