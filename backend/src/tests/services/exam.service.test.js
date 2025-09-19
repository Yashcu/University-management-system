const examService = require('../../services/exam.service');
const Exam = require('../../models/exam.model');
const ApiError = require('../../utils/ApiError');

jest.mock('../../models/exam.model');

describe('Exam Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllExams', () => {
    it('should return all exams', async () => {
      const mockExams = [{ name: 'Mid-Term' }];
      Exam.find.mockResolvedValue(mockExams);
      const exams = await examService.getAllExams({});
      expect(exams).toEqual(mockExams);
    });

    it('should throw a 404 ApiError if no exams are found', async () => {
      Exam.find.mockResolvedValue([]);
      await expect(examService.getAllExams({})).rejects.toThrow('No Exams Found');
    });
  });

  describe('addExam', () => {
    it('should create a new exam with a file', async () => {
      const examData = { name: 'Final Exam' };
      const file = { filename: 'timetable.pdf' };
      const expectedData = { ...examData, timetableLink: file.filename };
      Exam.create.mockResolvedValue(expectedData);

      const result = await examService.addExam(examData, file);
      expect(result).toEqual(expectedData);
      expect(Exam.create).toHaveBeenCalledWith(expectedData);
    });
  });

  describe('updateExam', () => {
    it('should update and return the exam', async () => {
        const examId = 'exam-123';
        const updateData = { name: 'Updated Exam' };
        Exam.findByIdAndUpdate.mockResolvedValue({ _id: examId, ...updateData });
        const result = await examService.updateExam(examId, updateData);
        expect(result.name).toBe('Updated Exam');
    });

    it('should throw a 404 ApiError if the exam to update is not found', async () => {
        Exam.findByIdAndUpdate.mockResolvedValue(null);
        await expect(examService.updateExam('non-existent-id', {})).rejects.toThrow('Exam Not Found!');
    });
  });

  describe('deleteExam', () => {
    it('should delete the exam successfully', async () => {
        const examId = 'exam-123';
        Exam.findByIdAndDelete.mockResolvedValue({ _id: examId });
        await examService.deleteExam(examId);
        expect(Exam.findByIdAndDelete).toHaveBeenCalledWith(examId);
    });

    it('should throw a 404 ApiError if the exam to delete is not found', async () => {
        Exam.findByIdAndDelete.mockResolvedValue(null);
        await expect(examService.deleteExam('non-existent-id')).rejects.toThrow('Exam Not Found!');
    });
  });
});
