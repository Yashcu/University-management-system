const { z } = require('zod');

const addBranchSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, { message: 'Branch name is required' }),
    branchId: z.string().trim().min(1, { message: 'Branch ID is required' }),
  }),
});

const updateBranchSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1).optional(),
    branchId: z.string().trim().min(1).optional(),
  }),
  params: z.object({
    id: z.string().trim().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format'),
  }),
});

const deleteBranchSchema = z.object({
  params: z.object({
    id: z.string().trim().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format'),
  }),
});

module.exports = {
  addBranchSchema,
  updateBranchSchema,
  deleteBranchSchema,
};
