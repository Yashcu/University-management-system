const subjectService = require('../../services/subject.service');
const Subject = require('../../models/subject.model');
const ApiError = require('../../utils/ApiError');

// Mock the Mongoose Subject model
jest.mock('../../models/subject.model');

describe('Subject Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getSubjects', () => {
    it('should return subjects matching the query', async () => {
      const mockSubjects = [{ name: 'Data Structures', code: 'CS301' }];
      const mockQuery = { populate: jest.fn().mockResolvedValue(mockSubjects) };
      Subject.find.mockReturnValue(mockQuery);

      const queryParams = { semester: 3 };
      const subjects = await subjectService.getSubjects(queryParams);

      expect(subjects).toEqual(mockSubjects);
      expect(Subject.find).toHaveBeenCalledWith(queryParams);
      expect(mockQuery.populate).toHaveBeenCalledWith('branch');
    });
  });

  describe('addSubject', () => {
    it('should create a new subject if the code does not exist', async () => {
      const subjectData = { name: 'Thermodynamics', code: 'ME301' };
      Subject.findOne.mockResolvedValue(null);
      Subject.create.mockResolvedValue(subjectData);

      const result = await subjectService.addSubject(subjectData);

      expect(result).toEqual(subjectData);
    });

    it('should throw a 409 ApiError if the subject code already exists', async () => {
      const subjectData = { name: 'Thermodynamics', code: 'ME301' };
      Subject.findOne.mockResolvedValue(subjectData);

      await expect(subjectService.addSubject(subjectData)).rejects.toThrow(ApiError);
      await expect(subjectService.addSubject(subjectData)).rejects.toThrow('Subject Already Exists');
    });
  });

  describe('updateSubject', () => {
    it('should update and return the subject', async () => {
      const subjectId = 'subject-123';
      const updateData = { name: 'Advanced Thermodynamics' };
      Subject.findByIdAndUpdate.mockResolvedValue({ _id: subjectId, ...updateData });

      const result = await subjectService.updateSubject(subjectId, updateData);

      expect(result.name).toBe('Advanced Thermodynamics');
    });

    it('should throw a 404 ApiError if the subject is not found', async () => {
      Subject.findByIdAndUpdate.mockResolvedValue(null);

      await expect(subjectService.updateSubject('non-existent-id', { name: 'New Name' })).rejects.toThrow('Subject Not Found!');
    });
  });

  describe('deleteSubject', () => {
    it('should delete the subject successfully', async () => {
        const subjectId = 'subject-123';
        Subject.findByIdAndDelete.mockResolvedValue({ _id: subjectId });

        await subjectService.deleteSubject(subjectId);

        expect(Subject.findByIdAndDelete).toHaveBeenCalledWith(subjectId);
    });

    it('should throw a 404 ApiError if the subject to delete is not found', async () => {
        Subject.findByIdAndDelete.mockResolvedValue(null);

        await expect(subjectService.deleteSubject('non-existent-id')).rejects.toThrow('Subject Not Found!');
    });
  });
});
