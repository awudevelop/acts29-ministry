import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Webhook event types from HelloPayments
type WebhookEventType =
  | 'payment.succeeded'
  | 'payment.failed'
  | 'payment.refunded'
  | 'subscription.created'
  | 'subscription.updated'
  | 'subscription.cancelled'
  | 'subscription.payment_failed';

interface WebhookEvent {
  id: string;
  type: WebhookEventType;
  data: Record<string, unknown>;
  created_at: string;
}

// Track processed webhook IDs to prevent replay attacks (in production, use Redis/database)
const processedWebhooks = new Set<string>();
const MAX_WEBHOOK_AGE_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Verify webhook signature from HelloPayments using HMAC-SHA256
 * Uses timing-safe comparison to prevent timing attacks
 */
function verifySignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload, 'utf8')
      .digest('hex');

    // Ensure both signatures are the same length before comparing
    if (signature.length !== expectedSignature.length) {
      return false;
    }

    return crypto.timingSafeEqual(
      Buffer.from(signature, 'utf8'),
      Buffer.from(expectedSignature, 'utf8')
    );
  } catch {
    return false;
  }
}

/**
 * Validate webhook timestamp to prevent replay attacks
 */
function isTimestampValid(timestamp: string): boolean {
  try {
    const webhookTime = new Date(timestamp).getTime();
    const now = Date.now();
    const age = Math.abs(now - webhookTime);
    return age < MAX_WEBHOOK_AGE_MS;
  } catch {
    return false;
  }
}

/**
 * Check if webhook has already been processed (idempotency)
 */
function isWebhookProcessed(webhookId: string): boolean {
  return processedWebhooks.has(webhookId);
}

/**
 * Mark webhook as processed
 */
function markWebhookProcessed(webhookId: string): void {
  processedWebhooks.add(webhookId);
  // In production, store in Redis/database with TTL
  // Clean up old entries periodically
  if (processedWebhooks.size > 10000) {
    const iterator = processedWebhooks.values();
    for (let i = 0; i < 5000; i++) {
      const value = iterator.next().value;
      if (value) processedWebhooks.delete(value);
    }
  }
}

/**
 * POST /api/webhooks/hellopayments
 * Receive webhook events from HelloPayments
 *
 * Security measures:
 * - HMAC-SHA256 signature verification with timing-safe comparison
 * - Timestamp validation to prevent replay attacks
 * - Idempotency check to prevent duplicate processing
 * - SSL enforcement via middleware
 */
export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('x-hellopayments-signature');
    const timestamp = request.headers.get('x-hellopayments-timestamp');
    const payload = await request.text();

    // Security: Verify signature (always in production, optional in development)
    const webhookSecret = process.env.HELLOPAYMENTS_WEBHOOK_SECRET;

    if (process.env.NODE_ENV === 'production' || webhookSecret) {
      if (!webhookSecret) {
        console.error('HELLOPAYMENTS_WEBHOOK_SECRET not configured');
        return NextResponse.json(
          { error: 'Webhook not configured' },
          { status: 500 }
        );
      }

      if (!signature) {
        console.error('Missing webhook signature');
        return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
      }

      // Verify HMAC signature
      const isValid = verifySignature(payload, signature, webhookSecret);
      if (!isValid) {
        console.error('Invalid webhook signature - possible tampering detected');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }

      // Security: Validate timestamp to prevent replay attacks
      if (timestamp && !isTimestampValid(timestamp)) {
        console.error('Webhook timestamp too old - possible replay attack');
        return NextResponse.json({ error: 'Webhook expired' }, { status: 401 });
      }
    }

    // Parse the webhook payload
    let event: WebhookEvent;
    try {
      event = JSON.parse(payload);
    } catch {
      console.error('Invalid JSON payload');
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // Validate required fields
    if (!event.id || !event.type) {
      console.error('Missing required webhook fields');
      return NextResponse.json({ error: 'Invalid webhook format' }, { status: 400 });
    }

    // Security: Idempotency check - prevent duplicate processing
    if (isWebhookProcessed(event.id)) {
      console.log(`Webhook ${event.id} already processed - skipping`);
      return NextResponse.json({ received: true, duplicate: true });
    }

    console.log(`Processing webhook: ${event.type}`, event.id);

    // Handle different event types
    switch (event.type) {
      case 'payment.succeeded':
        await handlePaymentSucceeded(event.data);
        break;

      case 'payment.failed':
        await handlePaymentFailed(event.data);
        break;

      case 'payment.refunded':
        await handlePaymentRefunded(event.data);
        break;

      case 'subscription.created':
        await handleSubscriptionCreated(event.data);
        break;

      case 'subscription.updated':
        await handleSubscriptionUpdated(event.data);
        break;

      case 'subscription.cancelled':
        await handleSubscriptionCancelled(event.data);
        break;

      case 'subscription.payment_failed':
        await handleSubscriptionPaymentFailed(event.data);
        break;

      default:
        console.log(`Unhandled webhook event type: ${event.type}`);
    }

    // Mark webhook as processed for idempotency
    markWebhookProcessed(event.id);

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

/**
 * Handle successful payment
 */
async function handlePaymentSucceeded(data: Record<string, unknown>) {
  console.log('Payment succeeded:', data);

  // In production:
  // 1. Update donation record status to 'completed'
  // 2. Send tax receipt email
  // 3. Create activity record for dashboard feed
  // 4. Update donation statistics

  // await db.donations.update({
  //   where: { paymentId: data.id },
  //   data: { status: 'completed' },
  // });

  // await sendDonationReceiptEmail({
  //   to: data.customer.email,
  //   donation: { ... },
  // });
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(data: Record<string, unknown>) {
  console.log('Payment failed:', data);

  // In production:
  // 1. Update donation record status to 'failed'
  // 2. Send notification to donor
  // 3. Log failure reason

  // await db.donations.update({
  //   where: { paymentId: data.id },
  //   data: { status: 'failed', failureReason: data.failure_reason },
  // });
}

/**
 * Handle refunded payment
 */
async function handlePaymentRefunded(data: Record<string, unknown>) {
  console.log('Payment refunded:', data);

  // In production:
  // 1. Update donation record status to 'refunded'
  // 2. Send refund confirmation email
  // 3. Update statistics

  // await db.donations.update({
  //   where: { paymentId: data.id },
  //   data: { status: 'refunded' },
  // });
}

/**
 * Handle new subscription
 */
async function handleSubscriptionCreated(data: Record<string, unknown>) {
  console.log('Subscription created:', data);

  // In production:
  // 1. Create subscription record in database
  // 2. Send welcome/confirmation email to donor
  // 3. Create activity record
}

/**
 * Handle subscription update
 */
async function handleSubscriptionUpdated(data: Record<string, unknown>) {
  console.log('Subscription updated:', data);

  // In production:
  // 1. Update subscription record in database
  // 2. Send confirmation email if amount changed
}

/**
 * Handle subscription cancellation
 */
async function handleSubscriptionCancelled(data: Record<string, unknown>) {
  console.log('Subscription cancelled:', data);

  // In production:
  // 1. Update subscription status to 'cancelled'
  // 2. Send cancellation confirmation email
  // 3. Optionally send re-engagement email

  // await db.subscriptions.update({
  //   where: { id: data.id },
  //   data: { status: 'cancelled', cancelledAt: new Date() },
  // });
}

/**
 * Handle failed subscription payment
 */
async function handleSubscriptionPaymentFailed(data: Record<string, unknown>) {
  console.log('Subscription payment failed:', data);

  // In production:
  // 1. Update subscription status to 'past_due'
  // 2. Send payment failed email with update payment link
  // 3. Schedule retry or dunning process

  // await db.subscriptions.update({
  //   where: { id: data.subscription_id },
  //   data: { status: 'past_due' },
  // });

  // await sendPaymentFailedEmail({
  //   to: data.customer.email,
  //   updatePaymentUrl: `${process.env.NEXT_PUBLIC_APP_URL}/donor/subscription/${data.subscription_id}/update-payment`,
  // });
}
