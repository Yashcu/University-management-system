const { z } = require('zod');

const objectIdRegex = /^[0-9a-fA-F]{24}$/;
const phoneRegex = /^\d{10}$/;
const pincodeRegex = /^\d{6}$/;

const loginFacultySchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
  }),
});

const registerFacultySchema = z.object({
  body: z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email format'),
    phone: z.string().regex(phoneRegex, 'Phone number must be 10 digits'),
    address: z.string().min(1, 'Address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    pincode: z.string().regex(pincodeRegex, 'Pincode must be 6 digits'),
    country: z.string().min(1, 'Country is required'),
    gender: z.enum(['male', 'female', 'other']),
    dob: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid date of birth format',
    }),
    designation: z.string().min(1, 'Designation is required'),
    joiningDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid joining date format',
    }),
    salary: z.coerce
      .number()
      .int()
      .positive('Salary must be a positive number'),
    branchId: z.string().regex(objectIdRegex, 'Invalid Branch ID format'),
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

const updateFacultySchema = z.object({
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
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    address: z.string().min(1).optional(),
    city: z.string().min(1).optional(),
    state: z.string().min(1).optional(),
    pincode: z
      .string()
      .regex(pincodeRegex, 'Pincode must be 6 digits')
      .optional(),
    country: z.string().min(1).optional(),
    designation: z.string().min(1).optional(),
    salary: z.coerce
      .number()
      .int()
      .positive('Salary must be a positive number')
      .optional(),
    branchId: z
      .string()
      .regex(objectIdRegex, 'Invalid Branch ID format')
      .optional(),
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

const deleteFacultySchema = z.object({
  params: z.object({
    id: z.string().regex(objectIdRegex, 'Invalid ID format'),
  }),
});

module.exports = {
  loginFacultySchema,
  registerFacultySchema,
  updateFacultySchema,
  forgetPasswordSchema,
  updatePasswordSchema,
  changePasswordSchema,
  deleteFacultySchema,
};
