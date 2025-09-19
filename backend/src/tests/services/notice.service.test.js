const noticeService = require('../../services/notice.service');
const Notice = require('../../models/notice.model');
const ApiError = require('../../utils/ApiError');

jest.mock('../../models/notice.model');

describe('Notice Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllNotices', () => {
    it('should return all notices', async () => {
      const mockNotices = [{ title: 'Holiday' }];
      Notice.find.mockResolvedValue(mockNotices);
      const notices = await noticeService.getAllNotices();
      expect(notices).toEqual(mockNotices);
    });

    it('should throw a 404 ApiError if no notices are found', async () => {
      Notice.find.mockResolvedValue([]);
      await expect(noticeService.getAllNotices()).rejects.toThrow('No Notices Found');
    });
  });

  describe('addNotice', () => {
    it('should create a new notice', async () => {
      const noticeData = { title: 'Exam Schedule', description: 'Exams start next week.' };
      Notice.create.mockResolvedValue(noticeData);
      const result = await noticeService.addNotice(noticeData);
      expect(result).toEqual(noticeData);
      expect(Notice.create).toHaveBeenCalledWith(noticeData);
    });
  });

  describe('updateNotice', () => {
    it('should update and return the notice', async () => {
        const noticeId = 'notice-123';
        const updateData = { title: 'Updated Title' };
        Notice.findByIdAndUpdate.mockResolvedValue({ _id: noticeId, ...updateData });
        const result = await noticeService.updateNotice(noticeId, updateData);
        expect(result.title).toBe('Updated Title');
    });

    it('should throw a 404 ApiError if the notice to update is not found', async () => {
        Notice.findByIdAndUpdate.mockResolvedValue(null);
        await expect(noticeService.updateNotice('non-existent-id', { title: 'New' })).rejects.toThrow('Notice Not Found!');
    });
  });

  describe('deleteNotice', () => {
    it('should delete the notice successfully', async () => {
        const noticeId = 'notice-123';
        Notice.findByIdAndDelete.mockResolvedValue({ _id: noticeId });
        await noticeService.deleteNotice(noticeId);
        expect(Notice.findByIdAndDelete).toHaveBeenCalledWith(noticeId);
    });

    it('should throw a 404 ApiError if the notice to delete is not found', async () => {
        Notice.findByIdAndDelete.mockResolvedValue(null);
        await expect(noticeService.deleteNotice('non-existent-id')).rejects.toThrow('Notice Not Found!');
    });
  });
});
