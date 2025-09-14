const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const config = require('../config');
const Marks = require('../models/marks.model');
const Student = require('../models/details/student-details.model');
const { USER_ROLES } = require('../utils/constants');
const jwt = require('jsonwebtoken');

describe('Marks API - Integration Tests', () => {
  let facultyToken, studentToken;
  let sampleStudentId, sampleBranchId, sampleSubjectId, sampleExamId;

  beforeAll(async () => {
    await mongoose.connect(config.mongodbUri);

    const facultyPayload = {
      userId: new mongoose.Types.ObjectId(),
      role: USER_ROLES.FACULTY,
    };
    facultyToken = jwt.sign(facultyPayload, config.jwtSecret);

    sampleBranchId = new mongoose.Types.ObjectId();
    const student = await Student.create({
      enrollmentNo: 123456,
      firstName: 'Test',
      lastName: 'Student',
      email: 'teststudent@example.com',
      phone: '1112223333',
      semester: 5,
      branchId: sampleBranchId,
      gender: 'female',
      dob: '2002-05-10',
      address: '123 Test St',
      city: 'Testville',
      state: 'Testland',
      pincode: '123456',
      country: 'India',
      password: 'student123',
    });
    sampleStudentId = student._id;

    const studentPayload = {
      userId: sampleStudentId,
      role: USER_ROLES.STUDENT,
    };
    studentToken = jwt.sign(studentPayload, config.jwtSecret);

    sampleSubjectId = new mongoose.Types.ObjectId();
    sampleExamId = new mongoose.Types.ObjectId();
  });

  afterEach(async () => {
    await Marks.deleteMany({});
  });

  afterAll(async () => {
    await Student.deleteMany({});
    await mongoose.connection.close();
  });

  describe('GET /api/marks/students', () => {
    it('should return a list of students for a given branch, subject, etc.', async () => {
      const response = await request(app)
        .get('/api/marks/students')
        .set('Authorization', `Bearer ${facultyToken}`)
        .query({
          branch: sampleBranchId.toString(),
          subject: sampleSubjectId.toString(),
          semester: '5',
          examId: sampleExamId.toString(),
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.data.length).toBe(1);
    });
  });

  describe('POST /api/marks/bulk', () => {
    it('should allow a faculty member to add marks for students', async () => {
      const marksData = {
        examId: sampleExamId.toString(),
        subjectId: sampleSubjectId.toString(),
        semester: 5,
        marks: [{ studentId: sampleStudentId.toString(), obtainedMarks: 85 }],
      };
      const response = await request(app)
        .post('/api/marks/bulk')
        .set('Authorization', `Bearer ${facultyToken}`)
        .send(marksData);

      expect(response.statusCode).toBe(200);
    });

    it('should FORBID a student from adding marks', async () => {
      const marksData = {
        examId: sampleExamId.toString(),
        subjectId: sampleSubjectId.toString(),
        semester: 5,
        marks: [{ studentId: sampleStudentId.toString(), obtainedMarks: 99 }],
      };
      const response = await request(app)
        .post('/api/marks/bulk')
        .set('Authorization', `Bearer ${studentToken}`)
        .send(marksData);

      expect(response.statusCode).toBe(403);
    });
  });

  describe('GET /api/marks/student', () => {
    it('should allow a student to fetch their own marks', async () => {
      await Marks.create({
        studentId: sampleStudentId,
        subjectId: sampleSubjectId,
        examId: sampleExamId,
        semester: 5,
        marksObtained: 92,
      });

      const response = await request(app)
        .get('/api/marks/student')
        .set('Authorization', `Bearer ${studentToken}`)
        .query({ semester: '5' });

      expect(response.statusCode).toBe(200);
      expect(response.body.data.length).toBe(1); // This will now pass!
      expect(response.body.data[0].marksObtained).toBe(92);
    });
  });
});
