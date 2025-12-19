import { z } from 'zod';

/**
 * Volunteer coordination validation schemas
 */

export const shiftStatusSchema = z.enum(['scheduled', 'completed', 'cancelled', 'no_show']);

export const volunteerSkillSchema = z.enum([
  'driving',
  'cooking',
  'counseling',
  'medical',
  'childcare',
  'teaching',
  'construction',
  'administrative',
  'technology',
  'music',
  'translation',
  'other',
]);

export const createVolunteerProfileSchema = z.object({
  skills: z.array(volunteerSkillSchema).min(1, 'Please select at least one skill'),
  availability: z.object({
    weekdays: z.boolean().default(false),
    weekends: z.boolean().default(false),
    evenings: z.boolean().default(false),
    mornings: z.boolean().default(false),
  }),
  preferredLocations: z.array(z.string().uuid()).optional(),
  hasVehicle: z.boolean().default(false),
  canDriveOthers: z.boolean().default(false),
  languages: z.array(z.string()).optional(),
  backgroundCheckCompleted: z.boolean().default(false),
  emergencyContact: z.object({
    name: z.string().min(1, 'Emergency contact name is required'),
    phone: z.string().min(1, 'Emergency contact phone is required'),
    relationship: z.string().min(1, 'Relationship is required'),
  }),
  bio: z.string().max(1000).optional(),
});

export const updateVolunteerProfileSchema = createVolunteerProfileSchema.partial();

export const createShiftSchema = z.object({
  resourceId: z.string().uuid().optional(),
  startTime: z.string().datetime('Invalid start time'),
  endTime: z.string().datetime('Invalid end time'),
  role: z.string().min(1, 'Role is required').max(100),
  description: z.string().max(500).optional(),
  requiredSkills: z.array(volunteerSkillSchema).optional(),
  maxVolunteers: z.number().int().positive().default(1),
  isRecurring: z.boolean().default(false),
  recurringPattern: z
    .object({
      frequency: z.enum(['daily', 'weekly', 'biweekly', 'monthly']),
      endDate: z.string().datetime().optional(),
      daysOfWeek: z.array(z.number().int().min(0).max(6)).optional(),
    })
    .optional(),
});

export const signUpForShiftSchema = z.object({
  shiftId: z.string().uuid('Invalid shift ID'),
  notes: z.string().max(500).optional(),
});

export const logVolunteerHoursSchema = z.object({
  shiftId: z.string().uuid('Invalid shift ID'),
  actualStartTime: z.string().datetime(),
  actualEndTime: z.string().datetime(),
  notes: z.string().max(1000).optional(),
  status: shiftStatusSchema,
});

// Type exports
export type ShiftStatus = z.infer<typeof shiftStatusSchema>;
export type VolunteerSkill = z.infer<typeof volunteerSkillSchema>;
export type CreateVolunteerProfileInput = z.infer<typeof createVolunteerProfileSchema>;
export type UpdateVolunteerProfileInput = z.infer<typeof updateVolunteerProfileSchema>;
export type CreateShiftInput = z.infer<typeof createShiftSchema>;
export type SignUpForShiftInput = z.infer<typeof signUpForShiftSchema>;
export type LogVolunteerHoursInput = z.infer<typeof logVolunteerHoursSchema>;
