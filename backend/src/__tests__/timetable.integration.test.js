const request = require('supertest');
const mongoose = require('mongoose');
const path = require('path');
const app = require('../app');
const config = require('../config');
const Timetable = require('../models/timetable.model');
const { USER_ROLES } = require('../utils/constants');
const jwt = require('jsonwebtoken');

describe('Timetable API - Integration Tests', () => {
  let adminToken, studentToken;
  let sampleBranchId;

  beforeAll(async () => {
    await mongoose.connect(config.mongodbUri);

    const adminPayload = {
      userId: new mongoose.Types.ObjectId(),
      role: USER_ROLES.ADMIN,
    };
    adminToken = jwt.sign(adminPayload, config.jwtSecret);

    const studentPayload = {
      userId: new mongoose.Types.ObjectId(),
      role: USER_ROLES.STUDENT,
    };
    studentToken = jwt.sign(studentPayload, config.jwtSecret);

    sampleBranchId = new mongoose.Types.ObjectId();
  });

  afterEach(async () => {
    await Timetable.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('POST /api/timetable', () => {
    it('should allow an admin to create a timetable and return 201', async () => {
      const response = await request(app)
        .post('/api/timetable')
        .set('Authorization', `Bearer ${adminToken}`)
        .field('semester', '3')
        .field('branch', sampleBranchId.toString())
        .attach('file', path.resolve(__dirname, '../../test-media/mock.jpg'))

      expect(response.statusCode).toBe(201);
      expect(response.body.data).toHaveProperty('link');
      expect(response.body.data.semester).toBe(3);
    });

    it('should FORBID a student from creating a timetable and return 403', async () => {
      const response = await request(app)
        .post('/api/timetable')
        .set('Authorization', `Bearer ${studentToken}`)
        .field('semester', '1')
        .field('branch', sampleBranchId.toString())
        .attach('file', path.resolve(__dirname, '../../test-media/mock.jpg'))

      expect(response.statusCode).toBe(403);
    });
  });

  describe('GET /api/timetable', () => {
    it('should allow any authenticated user to view timetables', async () => {
      await Timetable.create({
        semester: 5,
        branch: sampleBranchId,
        link: 'timetable.jpg',
      });

      const response = await request(app)
        .get('/api/timetable')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.data.length).toBe(1);
    });
  });

  describe('DELETE /api/timetable/:id', () => {
    it('should allow an admin to delete a timetable', async () => {
      const timetable = await Timetable.create({
        semester: 7,
        branch: sampleBranchId,
        link: 'timetable-to-delete.jpg',
      });

      const response = await request(app)
        .delete(`/api/timetable/${timetable._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.statusCode).toBe(200);
    });
  });
});
