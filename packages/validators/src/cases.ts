import { z } from 'zod';

/**
 * Case management validation schemas
 */

export const caseStatusSchema = z.enum(['active', 'pending', 'closed', 'referred']);

export const needsCategorySchema = z.enum([
  'housing',
  'food',
  'clothing',
  'medical',
  'mental_health',
  'substance_abuse',
  'employment',
  'legal',
  'transportation',
  'childcare',
  'education',
  'spiritual',
  'other',
]);

export const createCaseSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Please use YYYY-MM-DD format')
    .optional(),
  status: caseStatusSchema.default('pending'),
  needs: z.array(needsCategorySchema).min(1, 'Please select at least one need'),
  notes: z.string().max(5000, 'Notes must be less than 5000 characters').optional(),
  assignedTo: z.string().uuid('Invalid user ID').optional(),
});

export const updateCaseSchema = createCaseSchema.partial();

export const addCaseNoteSchema = z.object({
  caseId: z.string().uuid('Invalid case ID'),
  note: z.string().min(1, 'Note is required').max(2000, 'Note must be less than 2000 characters'),
  isPrivate: z.boolean().default(false),
});

export const referCaseSchema = z.object({
  caseId: z.string().uuid('Invalid case ID'),
  toOrganizationId: z.string().uuid('Invalid organization ID'),
  reason: z.string().min(1, 'Referral reason is required'),
  notes: z.string().optional(),
});

// Type exports
export type CaseStatus = z.infer<typeof caseStatusSchema>;
export type NeedsCategory = z.infer<typeof needsCategorySchema>;
export type CreateCaseInput = z.infer<typeof createCaseSchema>;
export type UpdateCaseInput = z.infer<typeof updateCaseSchema>;
export type AddCaseNoteInput = z.infer<typeof addCaseNoteSchema>;
export type ReferCaseInput = z.infer<typeof referCaseSchema>;
