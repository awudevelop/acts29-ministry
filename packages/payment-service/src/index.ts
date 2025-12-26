// Types
export * from './types';

// Provider interface
export { PaymentProvider, BasePaymentProvider } from './provider';

// Provider implementations
export { HelloPaymentsProvider } from './providers/hellopayments';
export { StripeProvider } from './providers/stripe';

// Payment service factory
import type { PaymentProvider } from './provider';
import type { PaymentProviderConfig } from './types';
import { HelloPaymentsProvider } from './providers/hellopayments';
import { StripeProvider } from './providers/stripe';

export type ProviderName = 'hellopayments' | 'stripe';

/**
 * Create a payment provider instance
 *
 * @example
 * ```ts
 * const provider = createPaymentProvider('hellopayments', {
 *   apiKey: process.env.HELLOPAYMENTS_API_KEY!,
 *   webhookSecret: process.env.HELLOPAYMENTS_WEBHOOK_SECRET,
 *   testMode: process.env.NODE_ENV !== 'production',
 * });
 *
 * await provider.initialize();
 *
 * const payment = await provider.createPayment({
 *   amount: 5000, // $50.00 in cents
 *   currency: 'USD',
 *   customer: {
 *     email: 'donor@example.com',
 *     firstName: 'John',
 *     lastName: 'Doe',
 *   },
 *   description: 'Donation to Helping Hands',
 * });
 * ```
 */
export async function createPaymentProvider(
  name: ProviderName,
  config: PaymentProviderConfig
): Promise<PaymentProvider> {
  let provider: PaymentProvider;

  switch (name) {
    case 'hellopayments':
      provider = new HelloPaymentsProvider();
      break;
    case 'stripe':
      provider = new StripeProvider();
      break;
    default:
      throw new Error(`Unknown payment provider: ${name}`);
  }

  await provider.initialize(config);
  return provider;
}

/**
 * Utility functions
 */

/**
 * Convert amount in dollars to cents
 */
export function dollarsToCents(dollars: number): number {
  return Math.round(dollars * 100);
}

/**
 * Convert amount in cents to dollars
 */
export function centsToDollars(cents: number): number {
  return cents / 100;
}

/**
 * Format amount in cents as currency string
 */
export function formatCurrency(
  cents: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(centsToDollars(cents));
}

/**
 * Calculate total with fee coverage
 *
 * When a donor chooses to cover processing fees, this calculates
 * the total amount they should be charged so that the organization
 * receives the original donation amount.
 */
export function calculateTotalWithFeeCoverage(
  donationAmount: number,
  feePercentage: number = 5.0,
  fixedFee: number = 0
): {
  donationAmount: number;
  feeAmount: number;
  totalAmount: number;
} {
  // To ensure org receives donationAmount after fees:
  // totalAmount - (totalAmount * feePercentage + fixedFee) = donationAmount
  // totalAmount * (1 - feePercentage) - fixedFee = donationAmount
  // totalAmount = (donationAmount + fixedFee) / (1 - feePercentage)

  const rate = feePercentage / 100;
  const totalAmount = Math.ceil((donationAmount + fixedFee) / (1 - rate));
  const feeAmount = totalAmount - donationAmount;

  return {
    donationAmount,
    feeAmount,
    totalAmount,
  };
}

/**
 * HelloPayments-specific fee calculations
 * Card: 5% | ACH: 1% (capped at $5)
 */
export const HELLOPAYMENTS_FEES = {
  card: { percentage: 5.0, fixedCents: 0 },
  ach: { percentage: 1.0, fixedCents: 0, maxFeeCents: 500 },
} as const;

/**
 * Calculate fee for a specific payment method with HelloPayments rates
 */
export function calculateHelloPaymentsFee(
  amountCents: number,
  method: 'card' | 'ach'
): {
  feeAmount: number;
  netAmount: number;
  totalWithCoverage: number;
  feePercentage: number;
} {
  const feeConfig = HELLOPAYMENTS_FEES[method];
  let feeAmount = Math.ceil((amountCents * feeConfig.percentage) / 100) + feeConfig.fixedCents;

  // Apply max fee cap for ACH
  if (method === 'ach' && 'maxFeeCents' in feeConfig && feeAmount > feeConfig.maxFeeCents) {
    feeAmount = feeConfig.maxFeeCents;
  }

  const netAmount = amountCents - feeAmount;

  // Calculate total if donor covers fees
  const rate = feeConfig.percentage / 100;
  let totalWithCoverage = Math.ceil((amountCents + feeConfig.fixedCents) / (1 - rate));

  // Apply max fee cap for ACH coverage calculation
  if (method === 'ach' && 'maxFeeCents' in feeConfig) {
    const coverageFee = Math.ceil((totalWithCoverage * feeConfig.percentage) / 100);
    if (coverageFee > feeConfig.maxFeeCents) {
      totalWithCoverage = amountCents + feeConfig.maxFeeCents;
    }
  }

  return {
    feeAmount,
    netAmount,
    totalWithCoverage,
    feePercentage: feeConfig.percentage,
  };
}

/**
 * Get a human-readable fee description
 */
export function getFeeDescription(method: 'card' | 'ach'): string {
  if (method === 'card') {
    return '5% processing fee';
  }
  return '1% processing fee (max $5)';
}
