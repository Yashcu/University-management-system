const request = require('supertest');
const mongoose = require('mongoose');
const path = require('path');
const app = require('../app');
const config = require('../config');
const Admin = require('../models/details/admin-details.model');

describe('Admin Details API - Integration Tests', () => {
  beforeAll(async () => {
    await mongoose.connect(config.mongodbUri);
  });

  afterEach(async () => {
    await Admin.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('POST /api/admin/register', () => {
    it('should register a new admin and return 201', async () => {
      const response = await request(app)
        .post('/api/admin/register')
        // --- FIX: Set each field individually ---
        .field('firstName', 'Test')
        .field('lastName', 'Admin')
        .field('email', 'testadmin@example.com')
        .field('phone', '1234567890')
        .field('address', '123 Street')
        .field('city', 'Testville')
        .field('state', 'Testland')
        .field('pincode', '123456')
        .field('country', 'India')
        .field('gender', 'male')
        .field('dob', '1990-01-01')
        .field('designation', 'Manager')
        .field('joiningDate', '2025-01-01')
        .field('salary', '50000')
        // -----------------------------------------
        .attach(
          'file',
          path.resolve(__dirname, '../../media/Faculty_Profile_123456.jpg')
        );

      expect(response.statusCode).toBe(201);
      expect(response.body.data.email).toBe('testadmin@example.com');
    });
  });

  describe('POST /api/admin/login', () => {
    // FIX 2: Use beforeEach to create a user for the login tests
    beforeEach(async () => {
      await Admin.create({
        employeeId: 123,
        firstName: 'Login',
        lastName: 'User',
        email: 'login@example.com',
        phone: '0987654321',
        address: '123 Street',
        city: 'Testville',
        state: 'Testland',
        pincode: '123456',
        country: 'India',
        gender: 'female',
        dob: '1990-01-01',
        designation: 'Tester',
        joiningDate: '2025-01-01',
        salary: 60000,
        password: 'admin123',
      });
    });

    it('should log in an existing admin and return a JWT token', async () => {
      const loginCredentials = {
        email: 'login@example.com',
        password: 'admin123',
      };
      const response = await request(app)
        .post('/api/admin/login')
        .send(loginCredentials);
      expect(response.statusCode).toBe(200);
      expect(response.body.data).toHaveProperty('token');
    });

    it('should fail to log in with incorrect password and return 401', async () => {
      const loginCredentials = {
        email: 'login@example.com',
        password: 'wrongpassword',
      };
      const response = await request(app)
        .post('/api/admin/login')
        .send(loginCredentials);
      // Now this will correctly be 401 because the user exists
      expect(response.statusCode).toBe(401);
    });
  });
});
