import { z } from 'zod';

// Common validation schemas
export const emailSchema = z
  .string()
  .email('Please enter a valid email address')
  .min(1, 'Email is required');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

export const phoneSchema = z
  .string()
  .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number')
  .optional();

export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must not exceed 50 characters')
  .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces');

// Login form validation
export const loginSchema = z.object({
  username: z
    .string()
    .min(1, 'Username is required')
    .min(3, 'Username must be at least 3 characters'),
  password: z
    .string()
    .min(1, 'Password is required'),
});

// User profile validation
export const userProfileSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  department: z.string().min(1, 'Department is required'),
  position: z.string().min(1, 'Position is required'),
});

// Ticket creation validation
export const ticketSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must not exceed 100 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must not exceed 1000 characters'),
  priority: z.enum(['low', 'medium', 'high', 'urgent'], {
    required_error: 'Priority is required',
  }),
  category: z.string().min(1, 'Category is required'),
});

// Contact form validation
export const contactSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  subject: z
    .string()
    .min(5, 'Subject must be at least 5 characters')
    .max(100, 'Subject must not exceed 100 characters'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(500, 'Message must not exceed 500 characters'),
});

// File upload validation
export const fileUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, 'File size must be less than 5MB')
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'].includes(file.type),
      'File must be an image (JPEG, PNG, GIF) or PDF'
    ),
});

// Generic validation helper
export const createValidationHelper = <T>(schema: z.ZodSchema<T>) => {
  return {
    validate: (data: unknown): { success: true; data: T } | { success: false; errors: string[] } => {
      const result = schema.safeParse(data);
      
      if (result.success) {
        return { success: true, data: result.data };
      }
      
      const errors = result.error.errors.map(err => err.message);
      return { success: false, errors };
    },
    
    validateField: (field: string, value: unknown): string | null => {
      try {
        const fieldSchema = (schema as any).shape[field];
        if (!fieldSchema) return null;
        
        fieldSchema.parse(value);
        return null;
      } catch (error) {
        if (error instanceof z.ZodError) {
          return error.errors[0]?.message || 'Invalid value';
        }
        return 'Validation error';
      }
    }
  };
};

// Export validation helpers for common forms
export const validateLogin = createValidationHelper(loginSchema);
export const validateUserProfile = createValidationHelper(userProfileSchema);
export const validateTicket = createValidationHelper(ticketSchema);
export const validateContact = createValidationHelper(contactSchema);
export const validateFileUpload = createValidationHelper(fileUploadSchema);