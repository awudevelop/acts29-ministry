import { z } from 'zod';

/**
 * Donation validation schemas
 */

export const donationTypeSchema = z.enum(['monetary', 'goods', 'time']);

// Fee coverage configuration
export const DEFAULT_FEE_COVERAGE_PERCENTAGE = 5;

export const feeCoverageSchema = z.object({
  coverFees: z.boolean().default(true),
  feePercentage: z
    .number()
    .min(0, 'Fee percentage cannot be negative')
    .max(25, 'Fee percentage cannot exceed 25%')
    .default(DEFAULT_FEE_COVERAGE_PERCENTAGE),
});

export const monetaryDonationSchema = z.object({
  type: z.literal('monetary'),
  amount: z
    .number()
    .positive('Amount must be greater than 0')
    .max(1000000, 'Amount exceeds maximum allowed'),
  isRecurring: z.boolean().default(false),
  recurringFrequency: z.enum(['weekly', 'monthly', 'quarterly', 'yearly']).optional(),
  dedicatedTo: z.string().max(200).optional(),
  isAnonymous: z.boolean().default(false),
  // Fee coverage - allows donors to offset processing fees
  coverFees: z.boolean().default(true),
  feePercentage: z
    .number()
    .min(0)
    .max(25)
    .default(DEFAULT_FEE_COVERAGE_PERCENTAGE),
});

export const goodsDonationSchema = z.object({
  type: z.literal('goods'),
  description: z
    .string()
    .min(1, 'Please describe the items you are donating')
    .max(1000, 'Description must be less than 1000 characters'),
  category: z.enum([
    'clothing',
    'food',
    'hygiene',
    'bedding',
    'furniture',
    'electronics',
    'other',
  ]),
  quantity: z.number().int().positive('Quantity must be at least 1').optional(),
  estimatedValue: z.number().positive().optional(),
  pickupRequired: z.boolean().default(false),
  pickupAddress: z.string().optional(),
  availableDate: z.string().optional(),
});

export const timeDonationSchema = z.object({
  type: z.literal('time'),
  hoursOffered: z.number().positive('Hours must be greater than 0'),
  skills: z.array(z.string()).optional(),
  availability: z.string().min(1, 'Please describe your availability'),
  preferredActivities: z.array(z.string()).optional(),
});

export const createDonationSchema = z.discriminatedUnion('type', [
  monetaryDonationSchema,
  goodsDonationSchema,
  timeDonationSchema,
]);

export const donorInfoSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  wantsReceipt: z.boolean().default(true),
  wantsNewsletter: z.boolean().default(false),
});

// Type exports
export type DonationType = z.infer<typeof donationTypeSchema>;
export type FeeCoverageInput = z.infer<typeof feeCoverageSchema>;
export type MonetaryDonationInput = z.infer<typeof monetaryDonationSchema>;
export type GoodsDonationInput = z.infer<typeof goodsDonationSchema>;
export type TimeDonationInput = z.infer<typeof timeDonationSchema>;
export type CreateDonationInput = z.infer<typeof createDonationSchema>;
export type DonorInfoInput = z.infer<typeof donorInfoSchema>;

/**
 * Calculate the total donation amount including fee coverage
 * @param baseAmount - The base donation amount
 * @param coverFees - Whether to cover processing fees
 * @param feePercentage - The fee percentage (default 5%)
 * @returns Object with fee details
 */
export function calculateDonationWithFees(
  baseAmount: number,
  coverFees: boolean = true,
  feePercentage: number = DEFAULT_FEE_COVERAGE_PERCENTAGE
): {
  baseAmount: number;
  feeAmount: number;
  totalAmount: number;
  feePercentage: number;
  coverFees: boolean;
} {
  const feeAmount = coverFees ? Math.round(baseAmount * (feePercentage / 100) * 100) / 100 : 0;
  const totalAmount = Math.round((baseAmount + feeAmount) * 100) / 100;

  return {
    baseAmount,
    feeAmount,
    totalAmount,
    feePercentage,
    coverFees,
  };
}
