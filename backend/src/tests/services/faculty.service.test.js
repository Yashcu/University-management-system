const facultyService = require('../../services/faculty.service');
const facultyDetails = require('../../models/faculty.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ApiError = require('../../utils/ApiError');

jest.mock('../../models/faculty.model');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Faculty Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('loginFaculty', () => {
    it('should return a JWT token for valid credentials', async () => {
      const loginData = { email: 'faculty@test.com', password: 'password123' };
      const mockUser = { _id: 'faculty-1', password: 'hashedPassword' };

      facultyDetails.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('test-faculty-token');

      const token = await facultyService.loginFaculty(loginData);

      expect(token).toBe('test-faculty-token');
      expect(facultyDetails.findOne).toHaveBeenCalledWith({ email: loginData.email });
    });

    it('should throw 404 error if user not found', async () => {
      facultyDetails.findOne.mockResolvedValue(null);
      await expect(facultyService.loginFaculty({ email: 'x', password: 'y' })).rejects.toThrow('User not found');
    });

    it('should throw 401 error for invalid password', async () => {
      const mockUser = { _id: 'faculty-1', password: 'hashedPassword' };
      facultyDetails.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false); // Simulate invalid password
      await expect(facultyService.loginFaculty({ email: 'x', password: 'y' })).rejects.toThrow('Invalid password');
    });
  });

  describe('registerFaculty', () => {
    it('should create and return a new faculty member, excluding the password', async () => {
        const facultyData = { email: 'new@faculty.com', phone: '1122334455' };
        const file = { filename: 'profile.jpg' };
        const createdFaculty = { _id: 'faculty-2', ...facultyData };

        facultyDetails.findOne.mockResolvedValue(null);
        facultyDetails.create.mockResolvedValue(createdFaculty);

        const mockQuery = { select: jest.fn().mockResolvedValue({ ...createdFaculty, password: '' }) };
        facultyDetails.findById.mockReturnValue(mockQuery);

        const result = await facultyService.registerFaculty(facultyData, file);

        expect(facultyDetails.create).toHaveBeenCalled();
        expect(result.password).toBe('');
    });

    it('should throw 409 error if faculty with the same email or phone already exists', async () => {
        facultyDetails.findOne.mockResolvedValue({ email: 'exists@faculty.com' });
        const expectedError = 'Faculty with this email or phone number already exists';
        await expect(facultyService.registerFaculty({ email: 'exists@faculty.com'}, {})).rejects.toThrow(expectedError);
    });
  });
});
