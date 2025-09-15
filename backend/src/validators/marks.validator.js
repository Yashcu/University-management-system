const { z } = require('zod');

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const addBulkMarksSchema = z.object({
  body: z.object({
    examId: z.string().trim().regex(objectIdRegex, 'Invalid Exam ID format'),
    subjectId: z.string().trim().regex(objectIdRegex, 'Invalid Subject ID format'),
    semester: z.coerce.number().int().min(1).max(8),
    marks: z
      .array(
        z.object({
          studentId: z
            .string()
            .trim()
            .regex(objectIdRegex, 'Invalid Student ID format'),
          obtainedMarks: z.coerce.number().int().min(0),
        })
      )
      .min(1, 'Marks array cannot be empty'),
  }),
});

const getStudentsWithMarksSchema = z.object({
  query: z.object({
    branch: z.string().trim().regex(objectIdRegex, 'Invalid Branch ID format'),
    subject: z.string().trim().regex(objectIdRegex, 'Invalid Subject ID format'),
    semester: z.string().trim().regex(/^[1-8]$/, 'Semester must be between 1 and 8'),
    examId: z.string().trim().regex(objectIdRegex, 'Invalid Exam ID format'),
  }),
});

const getStudentMarksSchema = z.object({
  query: z.object({
    semester: z.string().trim().regex(/^[1-8]$/, 'Semester must be between 1 and 8'),
  }),
});

const deleteMarksSchema = z.object({
  params: z.object({
    id: z.string().trim().regex(objectIdRegex, 'Invalid ID format'),
  }),
});

module.exports = {
  addBulkMarksSchema,
  getStudentsWithMarksSchema,
  getStudentMarksSchema,
  deleteMarksSchema,
};
