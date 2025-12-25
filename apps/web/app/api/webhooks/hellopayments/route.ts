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

/**
 * Verify webhook signature from HelloPayments
 */
function verifySignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

/**
 * POST /api/webhooks/hellopayments
 * Receive webhook events from HelloPayments
 */
export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('x-hellopayments-signature');
    const payload = await request.text();

    // Verify signature in production
    if (process.env.NODE_ENV === 'production') {
      const webhookSecret = process.env.HELLOPAYMENTS_WEBHOOK_SECRET;

      if (!webhookSecret || !signature) {
        console.error('Missing webhook secret or signature');
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const isValid = verifySignature(payload, signature, webhookSecret);
      if (!isValid) {
        console.error('Invalid webhook signature');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const event: WebhookEvent = JSON.parse(payload);
    console.log(`Received webhook: ${event.type}`, event.id);

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
