import { z } from 'zod';

/**
 * Resource validation schemas
 */

export const resourceTypeSchema = z.enum([
  'shelter',
  'food_bank',
  'clinic',
  'clothing',
  'employment',
  'counseling',
  'church',
  'other',
]);

export const hoursSchema = z.object({
  monday: z.string().optional(),
  tuesday: z.string().optional(),
  wednesday: z.string().optional(),
  thursday: z.string().optional(),
  friday: z.string().optional(),
  saturday: z.string().optional(),
  sunday: z.string().optional(),
});

export const createResourceSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  type: resourceTypeSchema,
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  address: z.string().min(1, 'Address is required'),
  phone: z
    .string()
    .regex(/^[\d\s\-\+\(\)]+$/, 'Please enter a valid phone number')
    .optional()
    .or(z.literal('')),
  email: z.string().email('Please enter a valid email').optional().or(z.literal('')),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  hours: hoursSchema.optional(),
  capacity: z.number().int().positive('Capacity must be a positive number').optional(),
  isActive: z.boolean().default(true),
});

export const updateResourceSchema = createResourceSchema.partial();

export const searchResourcesSchema = z.object({
  query: z.string().optional(),
  type: resourceTypeSchema.optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  radiusKm: z.number().positive().max(500).default(50),
  limit: z.number().int().positive().max(100).default(20),
  offset: z.number().int().nonnegative().default(0),
});

// Type exports
export type ResourceType = z.infer<typeof resourceTypeSchema>;
export type Hours = z.infer<typeof hoursSchema>;
export type CreateResourceInput = z.infer<typeof createResourceSchema>;
export type UpdateResourceInput = z.infer<typeof updateResourceSchema>;
export type SearchResourcesInput = z.infer<typeof searchResourcesSchema>;
