const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const config = require('../config');
const Branch = require('../models/branch.model');
const { USER_ROLES } = require('../utils/constants');
const jwt = require('jsonwebtoken');

describe('Branch API - Integration Tests', () => {
  let adminToken;

  beforeAll(async () => {
    await mongoose.connect(config.mongodbUri);
    const adminPayload = {
      userId: new mongoose.Types.ObjectId(),
      role: USER_ROLES.ADMIN,
    };
    adminToken = jwt.sign(adminPayload, config.jwtSecret);
  });

  afterEach(async () => {
    await Branch.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('POST /api/branch', () => {
    it('should create a new branch and return 201 when given valid data and admin token', async () => {
      const newBranch = { name: 'Computer Science', branchId: 'CS' };
      const response = await request(app)
        .post('/api/branch')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newBranch);
      expect(response.statusCode).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('_id');
      expect(response.body.data.name).toBe(newBranch.name);
    });

    it('should return 401 Unauthorized if no token is provided', async () => {
      const response = await request(app)
        .post('/api/branch')
        .send({ name: 'Test', branchId: 'T' });
      expect(response.statusCode).toBe(401);
    });
  });

  describe('GET /api/branch', () => {
    it('should return all branches and a status of 200', async () => {
      // Arrange
      const branchesToCreate = [
        { name: 'Mechanical Engineering', branchId: 'ME' },
        { name: 'Civil Engineering', branchId: 'CE' },
      ];
      await Branch.create(branchesToCreate);

      // Act
      const response = await request(app)
        .get('/api/branch')
        .set('Authorization', `Bearer ${adminToken}`);

      // Assert
      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      // CORRECTED TEST LOGIC:
      // 1. Check that we received the correct number of items
      expect(response.body.data.length).toBe(2);
      // 2. Check that the array contains the names we expect, regardless of order
      const receivedNames = response.body.data.map((branch) => branch.name);
      expect(receivedNames).toContain('Mechanical Engineering');
      expect(receivedNames).toContain('Civil Engineering');
    });
  });
});
