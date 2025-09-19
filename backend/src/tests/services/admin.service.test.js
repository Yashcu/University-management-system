const adminService = require('../../services/admin.service');
const adminDetails = require('../../models/admin.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ApiError = require('../../utils/ApiError');

jest.mock('../../models/admin.model');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Admin Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('loginAdmin', () => {
    it('should return a JWT token for valid credentials', async () => {
      const loginData = { email: 'admin@test.com', password: 'password123' };
      const mockUser = { _id: 'admin-1', password: 'hashedPassword' };

      adminDetails.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('test-token');

      const token = await adminService.loginAdmin(loginData);

      expect(token).toBe('test-token');
      expect(adminDetails.findOne).toHaveBeenCalledWith({ email: loginData.email });
    });

    it('should throw 404 error if user not found', async () => {
      adminDetails.findOne.mockResolvedValue(null);
      await expect(adminService.loginAdmin({ email: 'x', password: 'y' })).rejects.toThrow('User not found');
    });

    it('should throw 401 error for invalid password', async () => {
      const mockUser = { _id: 'admin-1', password: 'hashedPassword' };
      adminDetails.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false); // Invalid password
      await expect(adminService.loginAdmin({ email: 'x', password: 'y' })).rejects.toThrow('Invalid password');
    });
  });

  describe('registerAdmin', () => {
    it('should create and return a new admin, excluding password', async () => {
        const adminData = { email: 'new@admin.com', phone: '1234567890' };
        const file = { filename: 'profile.jpg' };
        const createdAdmin = { _id: 'admin-2', ...adminData };

        // Mock the checkIfExists logic (which is now in this service)
        adminDetails.findOne.mockResolvedValue(null);
        adminDetails.create.mockResolvedValue(createdAdmin);
        // Mock the findById().select() chain
        const mockQuery = { select: jest.fn().mockResolvedValue({ ...createdAdmin, password: '' }) };
        adminDetails.findById.mockReturnValue(mockQuery);

        const result = await adminService.registerAdmin(adminData, file);

        expect(adminDetails.create).toHaveBeenCalled();
        expect(result.password).toBe('');
    });

    it('should throw 409 error if admin already exists', async () => {
        adminDetails.findOne.mockResolvedValue({ email: 'exists@admin.com' });
        const expectedError = 'Admin with this email or phone number already exists';
        await expect(adminService.registerAdmin({ email: 'exists@admin.com'}, {})).rejects.toThrow(expectedError);
    });
  });
});
