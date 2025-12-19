import { z } from 'zod';

/**
 * Content and teaching validation schemas
 */

export const contentTypeSchema = z.enum([
  'sermon',
  'devotional',
  'testimony',
  'article',
  'video',
  'audio',
]);

export const createContentSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters'),
  type: contentTypeSchema,
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  body: z.string().max(50000, 'Content is too long').optional(),
  mediaUrl: z.string().url('Please enter a valid URL').optional(),
  thumbnailUrl: z.string().url('Please enter a valid URL').optional(),
  tags: z.array(z.string().max(50)).max(10, 'Maximum 10 tags allowed').optional(),
  isPublished: z.boolean().default(false),
  publishedAt: z.string().datetime().optional(),
  scripture: z.string().max(200).optional(),
  speaker: z.string().max(100).optional(),
  duration: z.number().positive().optional(), // in seconds
});

export const updateContentSchema = createContentSchema.partial();

export const searchContentSchema = z.object({
  query: z.string().optional(),
  type: contentTypeSchema.optional(),
  tags: z.array(z.string()).optional(),
  speaker: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  limit: z.number().int().positive().max(50).default(20),
  offset: z.number().int().nonnegative().default(0),
});

// Prayer requests
export const createPrayerRequestSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters'),
  description: z
    .string()
    .min(1, 'Please describe your prayer request')
    .max(2000, 'Description must be less than 2000 characters'),
  isAnonymous: z.boolean().default(false),
  category: z
    .enum(['health', 'family', 'financial', 'spiritual', 'work', 'relationships', 'other'])
    .optional(),
});

export const updatePrayerRequestSchema = z.object({
  isAnswered: z.boolean().optional(),
  updateNote: z.string().max(1000).optional(),
});

// Type exports
export type ContentType = z.infer<typeof contentTypeSchema>;
export type CreateContentInput = z.infer<typeof createContentSchema>;
export type UpdateContentInput = z.infer<typeof updateContentSchema>;
export type SearchContentInput = z.infer<typeof searchContentSchema>;
export type CreatePrayerRequestInput = z.infer<typeof createPrayerRequestSchema>;
export type UpdatePrayerRequestInput = z.infer<typeof updatePrayerRequestSchema>;
