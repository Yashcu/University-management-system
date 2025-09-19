const { z } = require('zod');
const { passwordSchema } = require('./common.validator');

const objectIdRegex = /^[0-9a-fA-F]{24}$/;
const phoneRegex = /^\d{10}$/;
const pincodeRegex = /^\d{6}$/;

const loginAdminSchema = z.object({
  body: z.object({
    email: z.string().trim().email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
  }),
});

const registerAdminSchema = z.object({
  body: z.object({
    firstName: z
      .string()
      .trim()
      .min(1, 'First name is required')
      .max(50, 'First name cannot exceed 50 characters'),
    lastName: z
      .string()
      .trim()
      .min(1, 'Last name is required')
      .max(50, 'Last name cannot exceed 50 characters'),
    email: z
      .string()
      .trim()
      .email('Invalid email format')
      .max(100, 'Email cannot exceed 100 characters'),
    phone: z
      .string()
      .trim()
      .regex(phoneRegex, 'Phone number must be 10 digits'),
    address: z
      .string()
      .trim()
      .min(1, 'Address is required')
      .max(255, 'Address cannot exceed 255 characters'),
    city: z
      .string()
      .trim()
      .min(1, 'City is required')
      .max(100, 'City cannot exceed 100 characters'),
    state: z
      .string()
      .trim()
      .min(1, 'State is required')
      .max(100, 'State cannot exceed 100 characters'),
    pincode: z.string().trim().regex(pincodeRegex, 'Pincode must be 6 digits'),
    country: z
      .string()
      .trim()
      .min(1, 'Country is required')
      .max(100, 'Country cannot exceed 100 characters'),
    gender: z.enum(['male', 'female', 'other']),
    dob: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid date of birth format',
    }),
    designation: z
      .string()
      .trim()
      .min(1, 'Designation is required')
      .max(100, 'Designation cannot exceed 100 characters'),
    joiningDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid joining date format',
    }),
    salary: z.coerce
      .number()
      .int()
      .positive('Salary must be a positive number'),
    bloodGroup: z
      .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
      .optional(),
    emergencyContact: z
      .object({
        name: z.string().trim().min(1),
        relationship: z.string().trim().min(1),
        phone: z
          .string()
          .trim()
          .regex(phoneRegex, 'Emergency phone must be 10 digits'),
      })
      .optional(),
  }),
});

const updateDetailsSchema = z.object({
  params: z.object({
    id: z.string().trim().regex(objectIdRegex, 'Invalid ID format'),
  }),
  body: z.object({
    email: z
      .string()
      .trim()
      .email('Invalid email format')
      .max(100, 'Email cannot exceed 100 characters')
      .optional(),
    phone: z
      .string()
      .trim()
      .regex(phoneRegex, 'Phone number must be 10 digits')
      .optional(),
    firstName: z
      .string()
      .trim()
      .min(1)
      .max(50, 'First name cannot exceed 50 characters')
      .optional(),
    lastName: z
      .string()
      .trim()
      .min(1)
      .max(50, 'Last name cannot exceed 50 characters')
      .optional(),
    address: z
      .string()
      .trim()
      .min(1)
      .max(255, 'Address cannot exceed 255 characters')
      .optional(),
    city: z
      .string()
      .trim()
      .min(1)
      .max(100, 'City cannot exceed 100 characters')
      .optional(),
    state: z
      .string()
      .trim()
      .min(1)
      .max(100, 'State cannot exceed 100 characters')
      .optional(),
    pincode: z
      .string()
      .trim()
      .regex(pincodeRegex, 'Pincode must be 6 digits')
      .optional(),
    country: z
      .string()
      .trim()
      .min(1)
      .max(100, 'Country cannot exceed 100 characters')
      .optional(),
    designation: z
      .string()
      .trim()
      .min(1)
      .max(100, 'Designation cannot exceed 100 characters')
      .optional(),
    password: passwordSchema.optional(),
    salary: z.coerce
      .number()
      .int()
      .positive('Salary must be a positive number')
      .optional(),
  }),
});

const forgetPasswordSchema = z.object({
  body: z.object({
    email: z.string().trim().email('Invalid email format'),
  }),
});

const updatePasswordSchema = z.object({
  params: z.object({
    resetId: z.string().trim().regex(objectIdRegex, 'Invalid Reset ID format'),
  }),
  body: z.object({
    password: passwordSchema,
  }),
});

const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
  }),
});

const deleteAdminSchema = z.object({
  params: z.object({
    id: z.string().trim().regex(objectIdRegex, 'Invalid ID format'),
  }),
});

module.exports = {
  loginAdminSchema,
  registerAdminSchema,
  updateDetailsSchema,
  forgetPasswordSchema,
  updatePasswordSchema,
  changePasswordSchema,
  deleteAdminSchema,
};
