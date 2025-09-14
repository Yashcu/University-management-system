const request = require('supertest');
const mongoose = require('mongoose');
const path = require('path');
const app = require('../app');
const config = require('../config');
const Material = require('../models/material.model');
const { USER_ROLES } = require('../utils/constants');
const jwt = require('jsonwebtoken');

describe('Material API - Integration Tests', () => {
  let facultyToken, studentToken;
  let sampleBranchId, sampleSubjectId;

  beforeAll(async () => {
    await mongoose.connect(config.mongodbUri);

    const facultyPayload = {
      userId: new mongoose.Types.ObjectId(),
      role: USER_ROLES.FACULTY,
    };
    facultyToken = jwt.sign(facultyPayload, config.jwtSecret);

    const studentPayload = {
      userId: new mongoose.Types.ObjectId(),
      role: USER_ROLES.STUDENT,
    };
    studentToken = jwt.sign(studentPayload, config.jwtSecret);

    sampleBranchId = new mongoose.Types.ObjectId();
    sampleSubjectId = new mongoose.Types.ObjectId();
  });

  afterEach(async () => {
    await Material.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('POST /api/material', () => {
    it('should allow a faculty member to upload material and return 201', async () => {
      const response = await request(app)
        .post('/api/material')
        .set('Authorization', `Bearer ${facultyToken}`)
        // --- FIX: Set each field individually ---
        .field('title', 'Test Notes')
        .field('semester', '5')
        .field('branch', sampleBranchId.toString())
        .field('subject', sampleSubjectId.toString())
        .field('type', 'notes')
        // -----------------------------------------
        .attach(
          'file',
          path.resolve(__dirname, '../../media/Faculty_Profile_123456.jpg')
        );

      expect(response.statusCode).toBe(201);
      expect(response.body.data.title).toBe('Test Notes');
      expect(response.body.data).toHaveProperty('file');
    });

    it('should FORBID a student from uploading material and return 403', async () => {
      const response = await request(app)
        .post('/api/material')
        .set('Authorization', `Bearer ${studentToken}`)
        // --- FIX: Set each field individually ---
        .field('title', 'Test Notes')
        .field('semester', '5')
        .field('branch', sampleBranchId.toString())
        .field('subject', sampleSubjectId.toString())
        .field('type', 'notes')
        // -----------------------------------------
        .attach(
          'file',
          path.resolve(__dirname, '../../media/Faculty_Profile_123456.jpg')
        );

      expect(response.statusCode).toBe(403);
    });
  });
});
