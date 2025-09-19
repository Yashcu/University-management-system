const materialService = require('../../services/material.service');
const Material = require('../../models/material.model');
const ApiError = require('../../utils/ApiError');

jest.mock('../../models/material.model');

describe('Material Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getMaterials', () => {
    it('should return materials matching a query', async () => {
      const mockMaterials = [{ title: 'Lecture Notes' }];
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockMaterials),
      };
      Material.find.mockReturnValue(mockQuery);

      const materials = await materialService.getMaterials({ type: 'notes' });
      expect(materials).toEqual(mockMaterials);
    });

    it('should throw a 404 ApiError if no materials are found', async () => {
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue([]),
      };
      Material.find.mockReturnValue(mockQuery);

      await expect(materialService.getMaterials({})).rejects.toThrow('No materials found');
    });
  });

  describe('addMaterial', () => {
    it('should create new material', async () => {
      const materialData = { title: 'Assignment 1' };
      const file = { filename: 'assignment.pdf' };
      const userId = 'faculty-123';
      const createdMaterial = { _id: 'mat-123', ...materialData };

      Material.create.mockResolvedValue(createdMaterial);

      // Fix the mock chain for findById().populate().populate().populate()
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
      };
      // The final populate should resolve to the material
      mockQuery.populate.mockImplementation((field) => {
        if (field === 'branch') {
          return Promise.resolve(createdMaterial);
        }
        return mockQuery;
      });

      Material.findById.mockReturnValue(mockQuery);

      const result = await materialService.addMaterial(materialData, file, userId);
      expect(Material.create).toHaveBeenCalled();
      expect(result).toEqual(createdMaterial);
    });

    it('should throw a 400 ApiError if no file is provided', async () => {
      await expect(materialService.addMaterial({}, null, 'user-id')).rejects.toThrow('Material file is required');
    });
  });
});
