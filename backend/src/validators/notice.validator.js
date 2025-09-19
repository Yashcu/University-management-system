const { z } = require('zod');

const addNoticeSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1, { message: 'Title cannot be empty' }).max(255),
    description: z.string().trim().min(1, { message: 'Description cannot be empty' }).max(2000),
    type: z.enum(['student', 'faculty', 'both'], {
      required_error: 'Type is required',
      invalid_type_error: "Type must be one of 'student', 'faculty', or 'both'",
    }),
    link: z.string().trim().url().optional(),
  }),
});

const updateNoticeSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1).optional(),
    description: z.string().trim().min(1).optional(),
    type: z.enum(['student', 'faculty', 'both']).optional(),
    link: z.string().trim().url().optional(),
  }),
  params: z.object({
    id: z.string().trim().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format'),
  }),
});

const deleteNoticeSchema = z.object({
  params: z.object({
    id: z.string().trim().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format'),
  }),
});

module.exports = {
  addNoticeSchema,
  updateNoticeSchema,
  deleteNoticeSchema,
};
