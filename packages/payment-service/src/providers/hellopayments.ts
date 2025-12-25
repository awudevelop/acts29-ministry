import { BasePaymentProvider } from '../provider';
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
  PaymentMethodFees,
  CreatePaymentLinkRequest,
  PaymentLink,
} from '../types';

/**
 * HelloPayments provider implementation
 *
 * HelloPayments fee structure:
 * - Card payments: 5% processing fee
 * - ACH payments: 1% processing fee
 *
 * Donors can choose to cover the fee or have it deducted from the donation.
 */
export class HelloPaymentsProvider extends BasePaymentProvider {
  readonly name = 'hellopayments';
  private apiBaseUrl = 'https://api.hellopayments.com/v1';

  // HelloPayments fee structure
  readonly fees: PaymentMethodFees = {
    card: {
      percentage: 5.0, // 5% for card payments
      fixedCents: 0,
    },
    ach: {
      percentage: 1.0, // 1% for ACH payments
      fixedCents: 0,
      maxFeeCents: 500, // $5 max fee for ACH
    },
  };

  async initialize(config: PaymentProviderConfig): Promise<void> {
    await super.initialize(config);

    // Default fee for card payments (used by base provider)
    this.feePercentage = this.fees.card.percentage;
    this.fixedFee = this.fees.card.fixedCents;

    if (config.testMode) {
      this.apiBaseUrl = 'https://sandbox.api.hellopayments.com/v1';
    }
  }

  /**
   * Calculate fee for a specific payment method
   */
  calculateFeeForMethod(
    amount: number,
    method: 'card' | 'ach'
  ): { feeAmount: number; netAmount: number; totalWithCoverage: number } {
    const feeConfig = this.fees[method];
    let feeAmount = Math.ceil((amount * feeConfig.percentage) / 100) + feeConfig.fixedCents;

    // Apply max fee cap for ACH
    if (method === 'ach') {
      const achConfig = this.fees.ach;
      if (achConfig.maxFeeCents && feeAmount > achConfig.maxFeeCents) {
        feeAmount = achConfig.maxFeeCents;
      }
    }

    const netAmount = amount - feeAmount;

    // Calculate total if donor covers fees
    // totalWithCoverage - fee(totalWithCoverage) = amount
    // For percentage only: totalWithCoverage = amount / (1 - percentage/100)
    const rate = feeConfig.percentage / 100;
    let totalWithCoverage = Math.ceil((amount + feeConfig.fixedCents) / (1 - rate));

    // Apply max fee cap for ACH coverage calculation
    if (method === 'ach') {
      const achConfig = this.fees.ach;
      if (achConfig.maxFeeCents) {
        const coverageFee = Math.ceil((totalWithCoverage * feeConfig.percentage) / 100);
        if (coverageFee > achConfig.maxFeeCents) {
          totalWithCoverage = amount + achConfig.maxFeeCents;
        }
      }
    }

    return {
      feeAmount,
      netAmount,
      totalWithCoverage,
    };
  }

  // ============================================
  // Payment Methods
  // ============================================

  async createPayment(request: CreatePaymentRequest): Promise<Payment> {
    this.ensureInitialized();

    // TODO: Replace with actual HelloPayments API call
    // const response = await fetch(`${this.apiBaseUrl}/payments`, {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${this.config!.apiKey}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(request),
    // });

    // Mock implementation
    const paymentId = `hp_pay_${Date.now().toString(36)}`;
    const feeInfo = this.calculateFee(request.amount);

    return {
      id: paymentId,
      amount: request.amount,
      currency: request.currency,
      status: 'succeeded',
      customer: request.customer,
      description: request.description,
      metadata: request.metadata,
      feeAmount: feeInfo.feeAmount,
      netAmount: feeInfo.netAmount,
      createdAt: new Date(),
      updatedAt: new Date(),
      receiptUrl: `https://hellopayments.com/receipts/${paymentId}`,
    };
  }

  async getPayment(paymentId: string): Promise<Payment | null> {
    this.ensureInitialized();

    // TODO: Replace with actual API call
    // Mock: return null to simulate not found
    return null;
  }

  async listPayments(
    customerId: string,
    options?: { limit?: number; startingAfter?: string }
  ): Promise<Payment[]> {
    this.ensureInitialized();

    // TODO: Replace with actual API call
    return [];
  }

  async createRefund(request: CreateRefundRequest): Promise<Refund> {
    this.ensureInitialized();

    // TODO: Replace with actual API call
    return {
      id: `hp_ref_${Date.now().toString(36)}`,
      paymentId: request.paymentId,
      amount: request.amount ?? 0,
      status: 'succeeded',
      reason: request.reason,
      createdAt: new Date(),
    };
  }

  async getRefund(refundId: string): Promise<Refund | null> {
    this.ensureInitialized();
    return null;
  }

  // ============================================
  // Customer Methods
  // ============================================

  async upsertCustomer(customer: Customer): Promise<Customer> {
    this.ensureInitialized();

    // TODO: Replace with actual API call
    return {
      ...customer,
      id: customer.id ?? `hp_cus_${Date.now().toString(36)}`,
    };
  }

  async getCustomer(customerId: string): Promise<Customer | null> {
    this.ensureInitialized();
    return null;
  }

  async deleteCustomer(customerId: string): Promise<void> {
    this.ensureInitialized();
    // TODO: Replace with actual API call
  }

  // ============================================
  // Payment Method Methods
  // ============================================

  async attachPaymentMethod(
    customerId: string,
    paymentMethodToken: string
  ): Promise<PaymentMethod> {
    this.ensureInitialized();

    // TODO: Replace with actual API call
    return {
      id: `hp_pm_${Date.now().toString(36)}`,
      type: 'card',
      card: {
        brand: 'visa',
        last4: '4242',
        expMonth: 12,
        expYear: 2025,
      },
      isDefault: true,
      createdAt: new Date(),
    };
  }

  async listPaymentMethods(customerId: string): Promise<PaymentMethod[]> {
    this.ensureInitialized();
    return [];
  }

  async detachPaymentMethod(paymentMethodId: string): Promise<void> {
    this.ensureInitialized();
    // TODO: Replace with actual API call
  }

  async setDefaultPaymentMethod(
    customerId: string,
    paymentMethodId: string
  ): Promise<void> {
    this.ensureInitialized();
    // TODO: Replace with actual API call
  }

  // ============================================
  // Subscription Methods
  // ============================================

  async createSubscription(request: CreateSubscriptionRequest): Promise<Subscription> {
    this.ensureInitialized();

    const subscriptionId = `hp_sub_${Date.now().toString(36)}`;
    const now = new Date();
    const periodEnd = this.calculatePeriodEnd(now, request.interval);

    // TODO: Replace with actual API call
    return {
      id: subscriptionId,
      customer: request.customer,
      paymentMethod: {
        id: request.paymentMethodId,
        type: 'card',
        card: {
          brand: 'visa',
          last4: '4242',
          expMonth: 12,
          expYear: 2025,
        },
        isDefault: true,
        createdAt: now,
      },
      amount: request.amount,
      currency: request.currency,
      interval: request.interval,
      status: 'active',
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd,
      nextPaymentDate: periodEnd,
      metadata: request.metadata,
      createdAt: now,
      updatedAt: now,
    };
  }

  async getSubscription(subscriptionId: string): Promise<Subscription | null> {
    this.ensureInitialized();
    return null;
  }

  async listSubscriptions(customerId: string): Promise<Subscription[]> {
    this.ensureInitialized();
    return [];
  }

  async updateSubscription(
    subscriptionId: string,
    updates: Partial<{
      amount: number;
      paymentMethodId: string;
      metadata: Record<string, string>;
    }>
  ): Promise<Subscription> {
    this.ensureInitialized();

    // TODO: Replace with actual API call
    const subscription = await this.getSubscription(subscriptionId);
    if (!subscription) {
      throw new Error(`Subscription ${subscriptionId} not found`);
    }

    return {
      ...subscription,
      ...updates,
      updatedAt: new Date(),
    };
  }

  async cancelSubscription(
    subscriptionId: string,
    options?: { cancelImmediately?: boolean; reason?: string }
  ): Promise<Subscription> {
    this.ensureInitialized();

    const subscription = await this.getSubscription(subscriptionId);
    if (!subscription) {
      throw new Error(`Subscription ${subscriptionId} not found`);
    }

    return {
      ...subscription,
      status: 'cancelled',
      cancelledAt: new Date(),
      updatedAt: new Date(),
    };
  }

  async pauseSubscription(subscriptionId: string): Promise<Subscription> {
    this.ensureInitialized();

    const subscription = await this.getSubscription(subscriptionId);
    if (!subscription) {
      throw new Error(`Subscription ${subscriptionId} not found`);
    }

    return {
      ...subscription,
      status: 'paused',
      updatedAt: new Date(),
    };
  }

  async resumeSubscription(subscriptionId: string): Promise<Subscription> {
    this.ensureInitialized();

    const subscription = await this.getSubscription(subscriptionId);
    if (!subscription) {
      throw new Error(`Subscription ${subscriptionId} not found`);
    }

    return {
      ...subscription,
      status: 'active',
      updatedAt: new Date(),
    };
  }

  // ============================================
  // Webhook Methods
  // ============================================

  async parseWebhookEvent(
    payload: string | Buffer,
    signature: string
  ): Promise<WebhookEvent> {
    this.ensureInitialized();

    // TODO: Implement webhook signature verification
    // const isValid = this.verifyWebhookSignature(payload, signature);
    // if (!isValid) throw new Error('Invalid webhook signature');

    const data = JSON.parse(
      typeof payload === 'string' ? payload : payload.toString()
    );

    return {
      id: data.id,
      type: data.type,
      data: data.data,
      createdAt: new Date(data.created_at),
    };
  }

  // ============================================
  // Payment Link Methods (QR Code / Shareable Links)
  // ============================================

  /**
   * Create a payment link for donations via QR code or shareable URL
   */
  async createPaymentLink(request: CreatePaymentLinkRequest): Promise<PaymentLink> {
    this.ensureInitialized();

    const linkId = `hp_link_${Date.now().toString(36)}`;
    const shortCode = this.generateShortCode();
    const now = new Date();

    // TODO: Replace with actual HelloPayments API call
    // const response = await fetch(`${this.apiBaseUrl}/payment-links`, {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${this.config!.apiKey}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     amount: request.amount,
    //     currency: request.currency,
    //     description: request.description,
    //     allowed_payment_methods: request.allowedPaymentMethods,
    //     cover_fees_option: request.coverFeesOption,
    //     expires_at: request.expiresAt?.toISOString(),
    //     success_url: request.successUrl,
    //     cancel_url: request.cancelUrl,
    //     metadata: request.metadata,
    //   }),
    // });

    const baseUrl = this.config?.testMode
      ? 'https://sandbox.pay.hellopayments.com'
      : 'https://pay.hellopayments.com';

    return {
      id: linkId,
      url: `${baseUrl}/donate/${shortCode}`,
      shortCode,
      qrCodeUrl: `${baseUrl}/qr/${shortCode}.png`,
      amount: request.amount,
      currency: request.currency,
      description: request.description,
      organizationId: request.organizationId,
      campaignId: request.campaignId,
      allowedPaymentMethods: request.allowedPaymentMethods,
      coverFeesOption: request.coverFeesOption,
      status: 'active',
      expiresAt: request.expiresAt,
      metadata: request.metadata,
      createdAt: now,
      updatedAt: now,
      totalCollected: 0,
      donationCount: 0,
    };
  }

  /**
   * Get a payment link by ID
   */
  async getPaymentLink(linkId: string): Promise<PaymentLink | null> {
    this.ensureInitialized();
    // TODO: Replace with actual API call
    return null;
  }

  /**
   * List payment links for an organization
   */
  async listPaymentLinks(
    organizationId: string,
    options?: { status?: 'active' | 'expired' | 'disabled'; limit?: number }
  ): Promise<PaymentLink[]> {
    this.ensureInitialized();
    // TODO: Replace with actual API call
    return [];
  }

  /**
   * Disable a payment link
   */
  async disablePaymentLink(linkId: string): Promise<PaymentLink> {
    this.ensureInitialized();

    const link = await this.getPaymentLink(linkId);
    if (!link) {
      throw new Error(`Payment link ${linkId} not found`);
    }

    // TODO: Replace with actual API call
    return {
      ...link,
      status: 'disabled',
      updatedAt: new Date(),
    };
  }

  /**
   * Generate QR code data URL for a payment link
   * Returns a data URL that can be displayed in an <img> tag
   */
  async generateQRCode(linkId: string): Promise<string> {
    this.ensureInitialized();

    const link = await this.getPaymentLink(linkId);
    if (!link) {
      throw new Error(`Payment link ${linkId} not found`);
    }

    // TODO: Replace with actual QR code generation
    // Could use a library like 'qrcode' or HelloPayments' API
    return link.qrCodeUrl;
  }

  // ============================================
  // Helper Methods
  // ============================================

  /**
   * Generate a short, URL-safe code for payment links
   */
  private generateShortCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  private calculatePeriodEnd(
    start: Date,
    interval: 'weekly' | 'monthly' | 'quarterly' | 'yearly'
  ): Date {
    const end = new Date(start);

    switch (interval) {
      case 'weekly':
        end.setDate(end.getDate() + 7);
        break;
      case 'monthly':
        end.setMonth(end.getMonth() + 1);
        break;
      case 'quarterly':
        end.setMonth(end.getMonth() + 3);
        break;
      case 'yearly':
        end.setFullYear(end.getFullYear() + 1);
        break;
    }

    return end;
  }
}
