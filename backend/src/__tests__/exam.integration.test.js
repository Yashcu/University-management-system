const request = require('supertest');
const mongoose = require('mongoose');
const path = require('path');
const app = require('../app');
const config = require('../config');
const Exam = require('../models/exam.model');
const { USER_ROLES } = require('../utils/constants');
const jwt = require('jsonwebtoken');

describe('Exam API - Integration Tests', () => {
  let adminToken, studentToken;

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
  });

  afterEach(async () => {
    await Exam.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('POST /api/exam', () => {
    it('should allow an admin to create an exam and return 200', async () => {
      const response = await request(app)
        .post('/api/exam')
        .set('Authorization', `Bearer ${adminToken}`)
        .field('name', 'Mid-Term Examination')
        .field('date', '2025-10-20')
        .field('semester', '5')
        .field('examType', 'mid')
        .field('totalMarks', '100')
        .attach('file', path.resolve(__dirname, '../media/Faculty_Profile_123456.jpg'))

      expect(response.statusCode).toBe(200);
      expect(response.body.data.name).toBe('Mid-Term Examination');
    });

    it('should FORBID a student from creating an exam and return 403', async () => {
      const response = await request(app)
        .post('/api/exam')
        .set('Authorization', `Bearer ${studentToken}`) // Using student token
        .field('name', 'Unauthorized Exam')
        .field('date', '2025-11-01')
        .field('semester', '1')
        .field('examType', 'end')
        .field('totalMarks', '75')
        .attach('file', path.resolve(__dirname, '../media/Faculty_Profile_123456.jpg'))

      expect(response.statusCode).toBe(403);
    });
  });

  describe('GET /api/exam', () => {
    it('should allow any authenticated user to view exams', async () => {
      await Exam.create({
        name: 'Final Examination',
        date: '2025-12-15',
        semester: 3,
        examType: 'end',
        totalMarks: 100,
        timetableLink: 'somefile.jpg',
      });
      const response = await request(app)
        .get('/api/exam')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.data.length).toBe(1);
    });
  });

  describe('DELETE /api/exam/:id', () => {
    it('should allow an admin to delete an exam', async () => {
      const exam = await Exam.create({
        name: 'To Be Deleted',
        date: '2025-01-01',
        semester: 1,
        examType: 'mid',
        totalMarks: 25,
        timetableLink: 'delete.jpg',
      });

      const response = await request(app)
        .delete(`/api/exam/${exam._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('Exam Deleted Successfully!');
    });
  });
});
