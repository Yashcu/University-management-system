const timetableService = require('../../services/timetable.service');
const Timetable = require('../../models/timetable.model');
const ApiError = require('../../utils/ApiError');

jest.mock('../../models/timetable.model');

describe('Timetable Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getTimetables', () => {
    it('should return timetables matching a query', async () => {
      const mockTimetables = [{ link: 'timetable.pdf' }];
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockTimetables),
      };
      Timetable.find.mockReturnValue(mockQuery);

      const result = await timetableService.getTimetables({ semester: 1 });
      expect(result).toEqual(mockTimetables);
    });

    it('should throw a 404 ApiError if no timetables are found', async () => {
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue([]),
      };
      Timetable.find.mockReturnValue(mockQuery);
      await expect(timetableService.getTimetables({})).rejects.toThrow('No timetables found');
    });
  });

  describe('addTimetable', () => {
    it('should create a new timetable if one does not exist for the branch and semester', async () => {
      const timetableData = { semester: 1, branch: 'branch-123' };
      const file = { filename: 'new.pdf' };
      Timetable.findOne.mockResolvedValue(null);
      Timetable.create.mockResolvedValue({ ...timetableData, link: file.filename });

      await timetableService.addTimetable(timetableData, file);
      expect(Timetable.create).toHaveBeenCalled();
    });

    it('should update an existing timetable if one is found', async () => {
        const timetableData = { semester: 1, branch: 'branch-123' };
        const file = { filename: 'updated.pdf' };
        const existingTimetable = { _id: 'tt-123', ...timetableData, link: 'old.pdf' };

        Timetable.findOne.mockResolvedValue(existingTimetable);
        Timetable.findByIdAndUpdate.mockResolvedValue({ ...existingTimetable, link: file.filename });

        await timetableService.addTimetable(timetableData, file);
        expect(Timetable.findByIdAndUpdate).toHaveBeenCalled();
        expect(Timetable.create).not.toHaveBeenCalled();
    });

    it('should throw a 400 ApiError if no file is provided', async () => {
      await expect(timetableService.addTimetable({}, null)).rejects.toThrow('Timetable file is required');
    });
  });

  describe('deleteTimetable', () => {
    it('should delete the timetable successfully', async () => {
        const timetableId = 'tt-123';
        Timetable.findByIdAndDelete.mockResolvedValue({ _id: timetableId });
        await timetableService.deleteTimetable(timetableId);
        expect(Timetable.findByIdAndDelete).toHaveBeenCalledWith(timetableId);
    });

    it('should throw a 404 ApiError if timetable is not found', async () => {
        Timetable.findByIdAndDelete.mockResolvedValue(null);
        await expect(timetableService.deleteTimetable('non-existent-id')).rejects.toThrow('Timetable not found');
    });
  });
});
