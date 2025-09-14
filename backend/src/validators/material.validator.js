const { z } = require('zod');

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const addMaterialSchema = z.object({
  body: z.object({
    title: z.string().min(1, { message: 'Title is required' }),
    subject: z.string().regex(objectIdRegex, 'Invalid Subject ID format'),
    semester: z.coerce.number().int().min(1).max(8),
    branch: z.string().regex(objectIdRegex, 'Invalid Branch ID format'),
    type: z.enum(['notes', 'assignment', 'syllabus', 'other']),
  }),
});

const updateMaterialSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    subject: z
      .string()
      .regex(objectIdRegex, 'Invalid Subject ID format')
      .optional(),
    semester: z.coerce.number().int().min(1).max(8).optional(),
    branch: z
      .string()
      .regex(objectIdRegex, 'Invalid Branch ID format')
      .optional(),
    type: z.enum(['notes', 'assignment', 'syllabus', 'other']).optional(),
  }),
  params: z.object({
    id: z.string().regex(objectIdRegex, 'Invalid ID format'),
  }),
});

const deleteMaterialSchema = z.object({
  params: z.object({
    id: z.string().regex(objectIdRegex, 'Invalid ID format'),
  }),
});

module.exports = {
  addMaterialSchema,
  updateMaterialSchema,
  deleteMaterialSchema,
};
