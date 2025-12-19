import type {
  Payment,
  PaymentMethod,
  Subscription,
  Refund,
  CreatePaymentRequest,
  CreateSubscriptionRequest,
  CreateRefundRequest,
  Customer,
  PaymentProviderConfig,
  WebhookEvent,
} from './types';

/**
 * Abstract payment provider interface
 *
 * All payment providers must implement this interface to ensure
 * consistent behavior across different payment processors.
 */
export interface PaymentProvider {
  /**
   * Provider name (e.g., 'hellopayments', 'stripe')
   */
  readonly name: string;

  /**
   * Initialize the provider with configuration
   */
  initialize(config: PaymentProviderConfig): Promise<void>;

  // ============================================
  // Payment Methods
  // ============================================

  /**
   * Create a one-time payment
   */
  createPayment(request: CreatePaymentRequest): Promise<Payment>;

  /**
   * Get payment by ID
   */
  getPayment(paymentId: string): Promise<Payment | null>;

  /**
   * List payments for a customer
   */
  listPayments(customerId: string, options?: {
    limit?: number;
    startingAfter?: string;
  }): Promise<Payment[]>;

  /**
   * Create a refund for a payment
   */
  createRefund(request: CreateRefundRequest): Promise<Refund>;

  /**
   * Get refund by ID
   */
  getRefund(refundId: string): Promise<Refund | null>;

  // ============================================
  // Customer Methods
  // ============================================

  /**
   * Create or update a customer
   */
  upsertCustomer(customer: Customer): Promise<Customer>;

  /**
   * Get customer by ID
   */
  getCustomer(customerId: string): Promise<Customer | null>;

  /**
   * Delete a customer
   */
  deleteCustomer(customerId: string): Promise<void>;

  // ============================================
  // Payment Method Methods
  // ============================================

  /**
   * Attach a payment method to a customer
   */
  attachPaymentMethod(
    customerId: string,
    paymentMethodToken: string
  ): Promise<PaymentMethod>;

  /**
   * List payment methods for a customer
   */
  listPaymentMethods(customerId: string): Promise<PaymentMethod[]>;

  /**
   * Detach a payment method from a customer
   */
  detachPaymentMethod(paymentMethodId: string): Promise<void>;

  /**
   * Set default payment method for a customer
   */
  setDefaultPaymentMethod(
    customerId: string,
    paymentMethodId: string
  ): Promise<void>;

  // ============================================
  // Subscription Methods
  // ============================================

  /**
   * Create a recurring subscription
   */
  createSubscription(request: CreateSubscriptionRequest): Promise<Subscription>;

  /**
   * Get subscription by ID
   */
  getSubscription(subscriptionId: string): Promise<Subscription | null>;

  /**
   * List subscriptions for a customer
   */
  listSubscriptions(customerId: string): Promise<Subscription[]>;

  /**
   * Update subscription (change amount, payment method, etc.)
   */
  updateSubscription(
    subscriptionId: string,
    updates: Partial<{
      amount: number;
      paymentMethodId: string;
      metadata: Record<string, string>;
    }>
  ): Promise<Subscription>;

  /**
   * Cancel a subscription
   */
  cancelSubscription(
    subscriptionId: string,
    options?: {
      cancelImmediately?: boolean;
      reason?: string;
    }
  ): Promise<Subscription>;

  /**
   * Pause a subscription
   */
  pauseSubscription(subscriptionId: string): Promise<Subscription>;

  /**
   * Resume a paused subscription
   */
  resumeSubscription(subscriptionId: string): Promise<Subscription>;

  // ============================================
  // Webhook Methods
  // ============================================

  /**
   * Parse and verify a webhook event
   */
  parseWebhookEvent(
    payload: string | Buffer,
    signature: string
  ): Promise<WebhookEvent>;

  // ============================================
  // Utility Methods
  // ============================================

  /**
   * Calculate processing fee for an amount
   */
  calculateFee(amount: number): {
    feeAmount: number;
    netAmount: number;
    feePercentage: number;
    fixedFee: number;
  };

  /**
   * Check if provider is in test mode
   */
  isTestMode(): boolean;
}

/**
 * Base class with common functionality
 */
export abstract class BasePaymentProvider implements PaymentProvider {
  abstract readonly name: string;
  protected config: PaymentProviderConfig | null = null;
  protected feePercentage = 2.9; // Default 2.9%
  protected fixedFee = 30; // Default $0.30 in cents

  async initialize(config: PaymentProviderConfig): Promise<void> {
    this.config = config;
  }

  abstract createPayment(request: CreatePaymentRequest): Promise<Payment>;
  abstract getPayment(paymentId: string): Promise<Payment | null>;
  abstract listPayments(customerId: string, options?: {
    limit?: number;
    startingAfter?: string;
  }): Promise<Payment[]>;
  abstract createRefund(request: CreateRefundRequest): Promise<Refund>;
  abstract getRefund(refundId: string): Promise<Refund | null>;
  abstract upsertCustomer(customer: Customer): Promise<Customer>;
  abstract getCustomer(customerId: string): Promise<Customer | null>;
  abstract deleteCustomer(customerId: string): Promise<void>;
  abstract attachPaymentMethod(
    customerId: string,
    paymentMethodToken: string
  ): Promise<PaymentMethod>;
  abstract listPaymentMethods(customerId: string): Promise<PaymentMethod[]>;
  abstract detachPaymentMethod(paymentMethodId: string): Promise<void>;
  abstract setDefaultPaymentMethod(
    customerId: string,
    paymentMethodId: string
  ): Promise<void>;
  abstract createSubscription(request: CreateSubscriptionRequest): Promise<Subscription>;
  abstract getSubscription(subscriptionId: string): Promise<Subscription | null>;
  abstract listSubscriptions(customerId: string): Promise<Subscription[]>;
  abstract updateSubscription(
    subscriptionId: string,
    updates: Partial<{
      amount: number;
      paymentMethodId: string;
      metadata: Record<string, string>;
    }>
  ): Promise<Subscription>;
  abstract cancelSubscription(
    subscriptionId: string,
    options?: {
      cancelImmediately?: boolean;
      reason?: string;
    }
  ): Promise<Subscription>;
  abstract pauseSubscription(subscriptionId: string): Promise<Subscription>;
  abstract resumeSubscription(subscriptionId: string): Promise<Subscription>;
  abstract parseWebhookEvent(
    payload: string | Buffer,
    signature: string
  ): Promise<WebhookEvent>;

  calculateFee(amount: number): {
    feeAmount: number;
    netAmount: number;
    feePercentage: number;
    fixedFee: number;
  } {
    const percentageFee = Math.round(amount * (this.feePercentage / 100));
    const feeAmount = percentageFee + this.fixedFee;
    const netAmount = amount - feeAmount;

    return {
      feeAmount,
      netAmount,
      feePercentage: this.feePercentage,
      fixedFee: this.fixedFee,
    };
  }

  isTestMode(): boolean {
    return this.config?.testMode ?? false;
  }

  protected ensureInitialized(): void {
    if (!this.config) {
      throw new Error(`${this.name} provider not initialized. Call initialize() first.`);
    }
  }
}
