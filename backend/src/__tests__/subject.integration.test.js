const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app.js');
const config = require('../config/index.js');
const Subject = require('../models/subject.model.js');
const { USER_ROLES } = require('../utils/constants.js');
const jwt = require('jsonwebtoken');

describe('Subject API - Integration Tests', () => {
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
    await Subject.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('POST /api/subject', () => {
    it('should allow an admin to create a new subject and return 201', async () => {
      const newSubject = {
        name: 'Data Structures',
        code: 'CS301',
        branch: sampleBranchId.toString(),
        semester: 3,
        credits: 4,
      };

      const response = await request(app)
        .post('/api/subject')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newSubject);

      expect(response.statusCode).toBe(201);
      expect(response.body.data.code).toBe('CS301');
    });

    it('should FORBID a non-admin user from creating a subject and return 403', async () => {
      const newSubject = {
        name: 'Unauthorized Subject',
        code: 'UA101',
        branch: sampleBranchId.toString(),
        semester: 1,
        credits: 3,
      };

      const response = await request(app)
        .post('/api/subject')
        .set('Authorization', `Bearer ${studentToken}`) // Use student token
        .send(newSubject);

      expect(response.statusCode).toBe(403);
    });

    it('should return 409 Conflict if subject code already exists', async () => {
      const subject = {
        name: 'Existing Subject',
        code: 'EX101',
        branch: sampleBranchId.toString(),
        semester: 1,
        credits: 3,
      };
      await Subject.create(subject);

      const response = await request(app)
        .post('/api/subject')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(subject);

      expect(response.statusCode).toBe(409);
      expect(response.body.message).toBe('Subject Already Exists');
    });
  });

  describe('GET /api/subject', () => {
    it('should allow any authenticated user to get a list of subjects', async () => {
      await Subject.create({
        name: 'Thermodynamics',
        code: 'ME201',
        branch: sampleBranchId.toString(),
        semester: 2,
        credits: 4,
      });

      const response = await request(app)
        .get('/api/subject')
        .set('Authorization', `Bearer ${studentToken}`); // A student can view

      expect(response.statusCode).toBe(200);
      expect(response.body.data.length).toBe(1);
    });
  });

  describe('PUT /api/subject/:id', () => {
    it('should allow an admin to update a subject', async () => {
      const subject = await Subject.create({
        name: 'Old Name',
        code: 'ON101',
        branch: sampleBranchId.toString(),
        semester: 1,
        credits: 3,
      });

      const response = await request(app)
        .put(`/api/subject/${subject._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'New Updated Name' });

      expect(response.statusCode).toBe(200);
      expect(response.body.data.name).toBe('New Updated Name');
    });
  });

  describe('DELETE /api/subject/:id', () => {
    it('should allow an admin to delete a subject', async () => {
      const subject = await Subject.create({
        name: 'To Delete',
        code: 'TD101',
        branch: sampleBranchId.toString(),
        semester: 1,
        credits: 3,
      });

      const response = await request(app)
        .delete(`/api/subject/${subject._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('Subject Deleted Successfully!');
    });
  });
});
