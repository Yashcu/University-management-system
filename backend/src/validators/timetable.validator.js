const { z } = require('zod');

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const addTimetableSchema = z.object({
  body: z.object({
    semester: z.coerce.number().int().min(1, 'Semester is required'),
    branch: z.string().trim().regex(objectIdRegex, 'Invalid Branch ID format'),
  }),
});

const updateTimetableSchema = z.object({
  body: z.object({
    semester: z.coerce.number().int().min(1).optional(),
    branch: z
      .string()
      .trim()
      .regex(objectIdRegex, 'Invalid Branch ID format')
      .optional(),
  }),
  params: z.object({
    id: z.string().trim().regex(objectIdRegex, 'Invalid ID format'),
  }),
});

const deleteTimetableSchema = z.object({
  params: z.object({
    id: z.string().trim().regex(objectIdRegex, 'Invalid ID format'),
  }),
});

module.exports = {
  addTimetableSchema,
  updateTimetableSchema,
  deleteTimetableSchema,
};
