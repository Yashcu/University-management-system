const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const config = require('../config');
const Notice = require('../models/notice.model');
const { USER_ROLES } = require('../utils/constants');
const jwt = require('jsonwebtoken');

describe('Notice API - Integration Tests', () => {
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
    await Notice.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('POST /api/notice', () => {
    it('should create a new notice and return 201', async () => {
      const newNotice = {
        title: 'Exam Schedule Released',
        description: 'Mid-term exams will start next week.',
        type: 'both',
      };
      const response = await request(app)
        .post('/api/notice')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newNotice);

      expect(response.statusCode).toBe(201);
      expect(response.body.data.title).toBe(newNotice.title);
    });

    it('should return 400 Bad Request if required fields are missing', async () => {
      const incompleteNotice = {
        description: 'This notice is incomplete.',
      };
      const response = await request(app)
        .post('/api/notice')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(incompleteNotice);

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Title is required');
      expect(response.body.message).toContain('Type is required');
    });
  });

  describe('GET /api/notice', () => {
    it('should return all notices and a status of 200', async () => {
      await Notice.create({
        title: 'Holiday Declared',
        description: 'Tomorrow is a holiday.',
        type: 'both',
      });
      const response = await request(app)
        .get('/api/notice')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.data.length).toBe(1);
    });
  });

  describe('PUT /api/notice/:id', () => {
    it('should update the notice and return 200', async () => {
      const notice = await Notice.create({
        title: 'Old Title',
        description: 'Old Description',
        type: 'student',
      });
      const updateData = { title: 'Updated Title' };
      const response = await request(app)
        .put(`/api/notice/${notice._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData);

      expect(response.statusCode).toBe(200);
      expect(response.body.data.title).toBe('Updated Title');
    });

    // --- NEW TEST CASE ---
    it('should return 400 Bad Request for an invalid ObjectId format', async () => {
      const invalidId = '123-invalid-id';
      const response = await request(app)
        .put(`/api/notice/${invalidId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ title: 'This will fail' });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toContain('Invalid ID format');
    });
  });

  describe('DELETE /api/notice/:id', () => {
    it('should delete the notice and return 200', async () => {
      const notice = await Notice.create({
        title: 'To Be Deleted',
        description: 'Delete me.',
        type: 'faculty',
      });
      const response = await request(app)
        .delete(`/api/notice/${notice._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.statusCode).toBe(200);
    });

    // --- NEW TEST CASE ---
    it('should return 404 Not Found when trying to delete a non-existent notice', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .delete(`/api/notice/${nonExistentId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('Notice Not Found!');
    });
  });
});
