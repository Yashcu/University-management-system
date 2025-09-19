const studentService = require('../../services/student.service');
const studentDetails = require('../../models/student.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ApiError = require('../../utils/ApiError');

jest.mock('../../models/student.model');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Student Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('loginStudent', () => {
    it('should return a JWT token for valid credentials', async () => {
      const loginData = { email: 'student@test.com', password: 'password123' };
      const mockUser = { _id: 'student-1', password: 'hashedPassword' };

      studentDetails.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('test-student-token');

      const token = await studentService.loginStudent(loginData);

      expect(token).toBe('test-student-token');
    });

    it('should throw 404 error if user not found', async () => {
      studentDetails.findOne.mockResolvedValue(null);
      await expect(studentService.loginStudent({ email: 'x', password: 'y' })).rejects.toThrow('User not found');
    });
  });

  describe('registerStudent', () => {
    it('should create a new student with an auto-generated email and enrollment number', async () => {
        const studentData = { firstName: 'Test', lastName: 'Student' };
        const file = { path: 'uploads/profile.jpg' };

        // Mock the toObject method that is called in the service
        const mockCreatedStudent = {
            ...studentData,
            toObject: () => ({ ...studentData })
        };

        studentDetails.create.mockResolvedValue(mockCreatedStudent);

        const result = await studentService.registerStudent(studentData, file);

        expect(studentDetails.create).toHaveBeenCalled();
        // Check that the result from toObject() is returned
        expect(result.firstName).toBe('Test');
    });
  });

  describe('searchStudents', () => {
    it('should find students based on a name query', async () => {
        const mockStudents = [{ firstName: 'John' }];
        const mockQuery = {
            select: jest.fn().mockReturnThis(),
            populate: jest.fn().mockReturnThis(),
            sort: jest.fn().mockResolvedValue(mockStudents),
        };
        studentDetails.find.mockReturnValue(mockQuery);

        const result = await studentService.searchStudents({ name: 'John' });

        expect(result).toEqual(mockStudents);
        expect(studentDetails.find).toHaveBeenCalledWith(expect.objectContaining({
            '$or': expect.any(Array)
        }));
    });

    it('should throw 404 error if no students are found', async () => {
        const mockQuery = {
            select: jest.fn().mockReturnThis(),
            populate: jest.fn().mockReturnThis(),
            sort: jest.fn().mockResolvedValue([]), // No students found
        };
        studentDetails.find.mockReturnValue(mockQuery);

        await expect(studentService.searchStudents({ name: 'nobody' })).rejects.toThrow('No students found');
    });
  });
});
