const { z } = require('zod');

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const addSubjectSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    code: z.string().min(1, { message: 'Code is required' }),
    branch: z.string().regex(objectIdRegex, 'Invalid Branch ID format'),
    semester: z.coerce.number().int().min(1).max(8),
    credits: z.coerce.number().int().min(1),
  }),
});

const updateSubjectSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    code: z.string().min(1).optional(),
    branch: z
      .string()
      .regex(objectIdRegex, 'Invalid Branch ID format')
      .optional(),
    semester: z.coerce.number().int().min(1).max(8).optional(),
    credits: z.coerce.number().int().min(1).optional(),
  }),
  params: z.object({
    id: z.string().regex(objectIdRegex, 'Invalid ID format'),
  }),
});

const deleteSubjectSchema = z.object({
  params: z.object({
    id: z.string().regex(objectIdRegex, 'Invalid ID format'),
  }),
});

module.exports = {
  addSubjectSchema,
  updateSubjectSchema,
  deleteSubjectSchema,
};
