import { z } from 'zod';

// Payment amount in cents
export type AmountInCents = number;

// Currency codes
export type Currency = 'USD' | 'EUR' | 'GBP' | 'CAD';

// Payment status
export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'succeeded'
  | 'failed'
  | 'cancelled'
  | 'refunded';

// Card brands
export type CardBrand =
  | 'visa'
  | 'mastercard'
  | 'amex'
  | 'discover'
  | 'diners'
  | 'jcb'
  | 'unknown';

// Customer information
export interface Customer {
  id?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: Address;
}

// Address
export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

// Payment method types
export type PaymentMethodType = 'card' | 'bank_account' | 'ach';

// Card details (for display only, never store full card numbers)
export interface CardDetails {
  brand: CardBrand;
  last4: string;
  expMonth: number;
  expYear: number;
}

// Bank account details
export interface BankAccountDetails {
  bankName: string;
  accountType: 'checking' | 'savings';
  last4: string;
}

// Payment method
export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  card?: CardDetails;
  bankAccount?: BankAccountDetails;
  isDefault: boolean;
  createdAt: Date;
}

// Create payment request
export interface CreatePaymentRequest {
  amount: AmountInCents;
  currency: Currency;
  customer: Customer;
  paymentMethodId?: string;
  description?: string;
  metadata?: Record<string, string>;
  statementDescriptor?: string;
  idempotencyKey?: string;
}

// Payment response
export interface Payment {
  id: string;
  amount: AmountInCents;
  currency: Currency;
  status: PaymentStatus;
  customer: Customer;
  paymentMethod?: PaymentMethod;
  description?: string;
  metadata?: Record<string, string>;
  feeAmount?: AmountInCents;
  netAmount?: AmountInCents;
  createdAt: Date;
  updatedAt: Date;
  failureReason?: string;
  receiptUrl?: string;
}

// Recurring/Subscription types
export type SubscriptionStatus =
  | 'active'
  | 'past_due'
  | 'cancelled'
  | 'paused'
  | 'incomplete';

export type SubscriptionInterval = 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export interface CreateSubscriptionRequest {
  customer: Customer;
  paymentMethodId: string;
  amount: AmountInCents;
  currency: Currency;
  interval: SubscriptionInterval;
  description?: string;
  metadata?: Record<string, string>;
  startDate?: Date;
}

export interface Subscription {
  id: string;
  customer: Customer;
  paymentMethod: PaymentMethod;
  amount: AmountInCents;
  currency: Currency;
  interval: SubscriptionInterval;
  status: SubscriptionStatus;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  nextPaymentDate?: Date;
  cancelledAt?: Date;
  metadata?: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

// Refund request
export interface CreateRefundRequest {
  paymentId: string;
  amount?: AmountInCents; // Partial refund, defaults to full amount
  reason?: string;
}

export interface Refund {
  id: string;
  paymentId: string;
  amount: AmountInCents;
  status: 'pending' | 'succeeded' | 'failed';
  reason?: string;
  createdAt: Date;
}

// Webhook event types
export type WebhookEventType =
  | 'payment.succeeded'
  | 'payment.failed'
  | 'payment.refunded'
  | 'subscription.created'
  | 'subscription.updated'
  | 'subscription.cancelled'
  | 'subscription.payment_failed';

export interface WebhookEvent {
  id: string;
  type: WebhookEventType;
  data: Payment | Subscription | Refund;
  createdAt: Date;
}

// Provider configuration
export interface PaymentProviderConfig {
  apiKey: string;
  webhookSecret?: string;
  testMode?: boolean;
}

// Zod schemas for validation
export const CreatePaymentRequestSchema = z.object({
  amount: z.number().positive(),
  currency: z.enum(['USD', 'EUR', 'GBP', 'CAD']),
  customer: z.object({
    id: z.string().optional(),
    email: z.string().email(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phone: z.string().optional(),
    address: z.object({
      line1: z.string(),
      line2: z.string().optional(),
      city: z.string(),
      state: z.string(),
      postalCode: z.string(),
      country: z.string(),
    }).optional(),
  }),
  paymentMethodId: z.string().optional(),
  description: z.string().optional(),
  metadata: z.record(z.string()).optional(),
  statementDescriptor: z.string().max(22).optional(),
  idempotencyKey: z.string().optional(),
});

export const CreateSubscriptionRequestSchema = z.object({
  customer: z.object({
    id: z.string().optional(),
    email: z.string().email(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
  }),
  paymentMethodId: z.string(),
  amount: z.number().positive(),
  currency: z.enum(['USD', 'EUR', 'GBP', 'CAD']),
  interval: z.enum(['weekly', 'monthly', 'quarterly', 'yearly']),
  description: z.string().optional(),
  metadata: z.record(z.string()).optional(),
  startDate: z.date().optional(),
});

// Payment link types for QR code / shareable link donations
export type PaymentLinkStatus = 'active' | 'expired' | 'disabled';

export interface CreatePaymentLinkRequest {
  amount?: AmountInCents; // Optional - donor can choose amount if not set
  currency: Currency;
  description: string;
  organizationId: string;
  campaignId?: string;
  allowedPaymentMethods: ('card' | 'ach')[]; // Which methods are allowed
  coverFeesOption: 'donor_choice' | 'always' | 'never'; // Fee coverage behavior
  expiresAt?: Date;
  metadata?: Record<string, string>;
  successUrl?: string;
  cancelUrl?: string;
}

export interface PaymentLink {
  id: string;
  url: string;
  shortCode: string; // For QR code generation and short URLs
  qrCodeUrl: string; // Pre-generated QR code image URL
  amount?: AmountInCents;
  currency: Currency;
  description: string;
  organizationId: string;
  campaignId?: string;
  allowedPaymentMethods: ('card' | 'ach')[];
  coverFeesOption: 'donor_choice' | 'always' | 'never';
  status: PaymentLinkStatus;
  expiresAt?: Date;
  metadata?: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
  totalCollected: AmountInCents; // Running total of donations via this link
  donationCount: number; // Number of donations via this link
}

// Fee structure for different payment methods
export interface PaymentMethodFees {
  card: {
    percentage: number; // e.g., 5.0 for 5%
    fixedCents: number; // e.g., 0 for no fixed fee
  };
  ach: {
    percentage: number; // e.g., 1.0 for 1%
    fixedCents: number;
    maxFeeCents?: number; // Optional cap on ACH fees
  };
}

export const CreatePaymentLinkRequestSchema = z.object({
  amount: z.number().positive().optional(),
  currency: z.enum(['USD', 'EUR', 'GBP', 'CAD']),
  description: z.string().min(1).max(500),
  organizationId: z.string(),
  campaignId: z.string().optional(),
  allowedPaymentMethods: z.array(z.enum(['card', 'ach'])).min(1),
  coverFeesOption: z.enum(['donor_choice', 'always', 'never']),
  expiresAt: z.date().optional(),
  metadata: z.record(z.string()).optional(),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
});
