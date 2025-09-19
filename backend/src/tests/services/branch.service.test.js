const branchService = require('../../services/branch.service');
const Branch = require('../../models/branch.model');
const ApiError = require('../../utils/ApiError');

// Mock the Mongoose Branch model to prevent actual database calls
jest.mock('../../models/branch.model');

describe('Branch Service', () => {
  // Clear all mocks after each test to ensure a clean slate
  afterEach(() => {
    jest.clearAllMocks();
  });

  // --- Test Suite for getAllBranches ---
  describe('getAllBranches', () => {
    it('should return all branches found by the model', async () => {
      const mockBranches = [{ name: 'CSE', code: '01' }, { name: 'ME', code: '02' }];
      // Simulate the Branch.find method returning our mock data
      Branch.find.mockResolvedValue(mockBranches);

      const branches = await branchService.getAllBranches();

      expect(branches).toEqual(mockBranches);
      expect(Branch.find).toHaveBeenCalledWith({}); // Verify it was called with an empty query
    });
  });

  // --- Test Suite for addBranch ---
  describe('addBranch', () => {
    it('should create and return a new branch if it does not already exist', async () => {
      const newBranchData = { name: 'Civil Engineering', code: 'CE' };
      const createdBranch = { _id: 'some-unique-id', ...newBranchData };

      Branch.findOne.mockResolvedValue(null); // Simulate that no branch was found
      Branch.create.mockResolvedValue(createdBranch);

      const result = await branchService.addBranch(newBranchData);

      expect(result).toEqual(createdBranch);
      expect(Branch.findOne).toHaveBeenCalledWith({ $or: [{ name: newBranchData.name }, { code: newBranchData.code }] });
      expect(Branch.create).toHaveBeenCalledWith(newBranchData);
    });

    it('should throw a 409 ApiError if a branch with the same name or code exists', async () => {
      const newBranchData = { name: 'Civil Engineering', code: 'CE' };
      Branch.findOne.mockResolvedValue(newBranchData); // Simulate finding an existing branch

      // We expect this call to be rejected with an ApiError
      await expect(branchService.addBranch(newBranchData)).rejects.toThrow(ApiError);
      await expect(branchService.addBranch(newBranchData)).rejects.toThrow('Branch with this name or code already exists!');
    });
  });

  // --- Test Suite for updateBranch ---
  describe('updateBranch', () => {
      it('should update and return the branch if it exists', async () => {
          const branchId = 'branch-123';
          const updateData = { name: 'New Branch Name' };
          const updatedBranch = { _id: branchId, ...updateData };

          Branch.findOne.mockResolvedValue(null); // Simulate no naming conflicts
          Branch.findByIdAndUpdate.mockResolvedValue(updatedBranch);

          const result = await branchService.updateBranch(branchId, updateData);

          expect(result).toEqual(updatedBranch);
          expect(Branch.findByIdAndUpdate).toHaveBeenCalledWith(branchId, updateData, { new: true });
      });

      it('should throw a 404 ApiError if the branch to update is not found', async () => {
          Branch.findByIdAndUpdate.mockResolvedValue(null); // Simulate branch not found

          await expect(branchService.updateBranch('non-existent-id', { name: 'New Name' })).rejects.toThrow(ApiError);
          await expect(branchService.updateBranch('non-existent-id', { name: 'New Name' })).rejects.toThrow('Branch Not Found!');
      });
  });

  // --- Test Suite for deleteBranch ---
  describe('deleteBranch', () => {
      it('should delete the branch successfully if it exists', async () => {
          const branchId = 'branch-123';
          Branch.findByIdAndDelete.mockResolvedValue({ _id: branchId }); // Simulate successful deletion

          await branchService.deleteBranch(branchId);

          expect(Branch.findByIdAndDelete).toHaveBeenCalledWith(branchId);
      });

      it('should throw a 404 ApiError if the branch to delete is not found', async () => {
          Branch.findByIdAndDelete.mockResolvedValue(null); // Simulate branch not found

          await expect(branchService.deleteBranch('non-existent-id')).rejects.toThrow(ApiError);
          await expect(branchService.deleteBranch('non-existent-id')).rejects.toThrow('Branch Not Found!');
      });
  });
});
