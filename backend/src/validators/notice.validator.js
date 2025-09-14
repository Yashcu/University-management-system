const { z } = require('zod');

const addNoticeSchema = z.object({
  body: z.object({
    title: z
      .string({ required_error: 'Title is required' })
      .min(1, { message: 'Title cannot be empty' }),
    description: z
      .string({ required_error: 'Description is required' })
      .min(1, { message: 'Description cannot be empty' }),
    type: z.enum(['student', 'faculty', 'both'], {
      required_error: 'Type is required',
      invalid_type_error: "Type must be one of 'student', 'faculty', or 'both'",
    }),
    link: z.string().url().optional(),
  }),
});

const updateNoticeSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    type: z.enum(['student', 'faculty', 'both']).optional(),
    link: z.string().url().optional(),
  }),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format'),
  }),
});

const deleteNoticeSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format'),
  }),
});

module.exports = {
  addNoticeSchema,
  updateNoticeSchema,
  deleteNoticeSchema,
};
