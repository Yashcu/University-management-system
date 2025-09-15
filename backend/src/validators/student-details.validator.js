const { z } = require('zod');

const objectIdRegex = /^[0-9a-fA-F]{24}$/;
const phoneRegex = /^\d{10}$/;
const pincodeRegex = /^\d{6}$/;

const loginStudentSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
  }),
});

const registerStudentSchema = z.object({
  body: z.object({
    firstName: z.string().min(1, 'First name is required'),
    middleName: z.string().optional(),
    lastName: z.string().min(1, 'Last name is required'),
    phone: z.string().regex(phoneRegex, 'Phone number must be 10 digits'),
    semester: z.coerce.number().int().min(1).max(8),
    branchId: z.string().regex(objectIdRegex, 'Invalid Branch ID format'),
    gender: z.enum(['male', 'female', 'other']),
    dob: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid date of birth format',
    }),
    address: z.string().min(1, 'Address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    pincode: z.string().regex(pincodeRegex, 'Pincode must be 6 digits'),
    country: z.string().min(1, 'Country is required'),
    bloodGroup: z
      .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
      .optional(),
    emergencyContact: z
      .object({
        name: z.string().min(1),
        relationship: z.string().min(1),
        phone: z
          .string()
          .regex(phoneRegex, 'Emergency phone must be 10 digits'),
      })
      .optional(),
  }),
});

const updateDetailsSchema = z.object({
  params: z.object({
    id: z.string().regex(objectIdRegex, 'Invalid ID format'),
  }),
  body: z.object({
    email: z.string().email('Invalid email format').optional(),
    phone: z
      .string()
      .regex(phoneRegex, 'Phone number must be 10 digits')
      .optional(),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .optional(),
    enrollmentNo: z.coerce.number().int().positive().optional(),
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    semester: z.coerce.number().int().min(1).max(8).optional(),
    branchId: z
      .string()
      .regex(objectIdRegex, 'Invalid Branch ID format')
      .optional(),
    address: z.string().min(1).optional(),
    city: z.string().min(1).optional(),
    state: z.string().min(1).optional(),
    pincode: z
      .string()
      .regex(pincodeRegex, 'Pincode must be 6 digits')
      .optional(),
    country: z.string().min(1).optional(),
  }),
});

const forgetPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
  }),
});

const updatePasswordSchema = z.object({
  params: z.object({
    resetId: z.string().regex(objectIdRegex, 'Invalid Reset ID format'),
  }),
  body: z.object({
    password: z.string().min(8, 'Password must be at least 8 characters long'),
  }),
});

const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'New password must be at least 8 characters long'),
  }),
});

const searchStudentsSchema = z.object({
  query: z
    .object({
      enrollmentNo: z.coerce.number().int().positive().optional(),
      name: z.string().min(1).optional(),
      semester: z.coerce.number().int().min(1).max(8).optional(),
      branch: z
        .string()
        .regex(objectIdRegex, 'Invalid Branch ID format')
        .optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'Select at least one filter',
    }),
});

const deleteStudentSchema = z.object({
  params: z.object({
    id: z.string().regex(objectIdRegex, 'Invalid ID format'),
  }),
});

module.exports = {
  loginStudentSchema,
  registerStudentSchema,
  updateDetailsSchema,
  forgetPasswordSchema,
  updatePasswordSchema,
  changePasswordSchema,
  searchStudentsSchema,
  deleteStudentSchema,
};
