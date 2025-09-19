const marksService = require('../../services/marks.service');
const Marks = require('../../models/marks.model');
const Student = require('../../models/student.model');
const ApiError = require('../../utils/ApiError');

jest.mock('../../models/marks.model');
jest.mock('../../models/student.model');

describe('Marks Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addBulkMarks', () => {
    it('should create a new mark if one does not exist', async () => {
      const bulkData = { marks: [{ studentId: 'student-1', obtainedMarks: 90 }] };
      Marks.findOne.mockResolvedValue(null);
      Marks.create.mockResolvedValue({});

      await marksService.addBulkMarks(bulkData);
      expect(Marks.create).toHaveBeenCalled();
    });

    it('should update an existing mark', async () => {
      const bulkData = { marks: [{ studentId: 'student-1', obtainedMarks: 95 }] };
      const mockExistingMark = { marksObtained: 90, save: jest.fn().mockResolvedValue(true) };
      Marks.findOne.mockResolvedValue(mockExistingMark);

      await marksService.addBulkMarks(bulkData);
      expect(mockExistingMark.save).toHaveBeenCalled();
    });
  });

  describe('getStudentsWithMarks', () => {
    it('should return students with their marks for a given exam', async () => {
      const queryParams = { branch: 'branch-1', subject: 'subject-1', semester: '1', examId: 'exam-1' };
      const mockStudents = [{ _id: 'student-1', toObject: () => ({ _id: 'student-1' }) }];
      const mockMarks = [{ studentId: 'student-1', marksObtained: 88 }];

      const mockStudentQuery = { select: jest.fn().mockResolvedValue(mockStudents) };
      Student.find.mockReturnValue(mockStudentQuery);
      Marks.find.mockResolvedValue(mockMarks);

      const result = await marksService.getStudentsWithMarks(queryParams);
      expect(result[0].obtainedMarks).toBe(88);
    });
  });

  describe('getStudentMarks', () => {
    it("should return a student's marks for a given semester", async () => {
      const queryParams = { semester: '1' };
      const userId = 'student-1';
      const mockMarks = [{ marksObtained: 92 }];

      const mockMarksQuery = {
        populate: jest.fn().mockReturnThis(),
      };

      mockMarksQuery.populate.mockImplementation((field) => {
        if (field === 'examId') {
          return Promise.resolve(mockMarks);
        }
        return mockMarksQuery;
      });

      Marks.find.mockReturnValue(mockMarksQuery);

      const result = await marksService.getStudentMarks(queryParams, userId);
      expect(result).toEqual(mockMarks);
    });
  });
});
