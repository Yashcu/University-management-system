const { z } = require('zod');

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const addExamSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, { message: 'Exam name is required' }),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid date format',
    }),
    semester: z.coerce.number().int().min(1).max(8),
    examType: z.enum(['mid', 'end']),
    totalMarks: z.coerce.number().int().min(1),
  }),
});

const updateExamSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1).optional(),
    date: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid date format',
      })
      .optional(),
    semester: z.coerce.number().int().min(1).max(8).optional(),
    examType: z.enum(['mid', 'end']).optional(),
    totalMarks: z.coerce.number().int().min(1).optional(),
  }),
  params: z.object({
    id: z.string().trim().regex(objectIdRegex, 'Invalid ID format'),
  }),
});

const deleteExamSchema = z.object({
  params: z.object({
    id: z.string().trim().regex(objectIdRegex, 'Invalid ID format'),
  }),
});

module.exports = {
  addExamSchema,
  updateExamSchema,
  deleteExamSchema,
};
