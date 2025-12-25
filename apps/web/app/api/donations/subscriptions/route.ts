import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Subscription request schema
const CreateSubscriptionSchema = z.object({
  amount: z.number().positive().min(100, 'Minimum donation is $1'), // in cents
  currency: z.enum(['USD']).default('USD'),
  interval: z.enum(['weekly', 'monthly', 'quarterly', 'yearly']),
  paymentMethod: z.enum(['card', 'ach']),
  coverFees: z.boolean().default(false),
  donor: z.object({
    email: z.string().email(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phone: z.string().optional(),
  }),
  paymentMethodToken: z.string(), // Required for subscriptions
  startDate: z.string().datetime().optional(),
});

const UpdateSubscriptionSchema = z.object({
  amount: z.number().positive().min(100).optional(),
  paymentMethodToken: z.string().optional(),
  interval: z.enum(['weekly', 'monthly', 'quarterly', 'yearly']).optional(),
});

// HelloPayments fee structure
const FEES = {
  card: { percentage: 5.0, fixedCents: 0 },
  ach: { percentage: 1.0, fixedCents: 0, maxCents: 500 },
};

function calculateTotalWithFees(amountCents: number, method: 'card' | 'ach'): number {
  const rate = FEES[method].percentage / 100;
  let total = Math.ceil(amountCents / (1 - rate));

  if (method === 'ach') {
    const coverageFee = Math.ceil((total * FEES.ach.percentage) / 100);
    if (coverageFee > FEES.ach.maxCents) {
      total = amountCents + FEES.ach.maxCents;
    }
  }

  return total;
}

function calculatePeriodEnd(start: Date, interval: string): Date {
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

/**
 * POST /api/donations/subscriptions
 * Create a recurring donation subscription
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = CreateSubscriptionSchema.parse(body);

    const {
      amount,
      interval,
      paymentMethod,
      coverFees,
      donor,
    } = validatedData;

    // Calculate final amount with optional fee coverage
    const finalAmount = coverFees
      ? calculateTotalWithFees(amount, paymentMethod)
      : amount;

    // In production, this would call HelloPayments API
    // const provider = new HelloPaymentsProvider();
    // await provider.initialize({
    //   apiKey: process.env.HELLOPAYMENTS_API_KEY!,
    //   testMode: process.env.NODE_ENV !== 'production',
    // });
    // const subscription = await provider.createSubscription({...});

    const subscriptionId = `hp_sub_${Date.now().toString(36)}`;
    const now = new Date();
    const periodEnd = calculatePeriodEnd(now, interval);

    // Mock subscription response
    const subscription = {
      id: subscriptionId,
      amount: amount,
      finalAmount: finalAmount,
      interval,
      paymentMethod,
      coverFees,
      status: 'active',
      donor: {
        email: donor.email,
        firstName: donor.firstName,
        lastName: donor.lastName,
      },
      currentPeriodStart: now.toISOString(),
      currentPeriodEnd: periodEnd.toISOString(),
      nextPaymentDate: periodEnd.toISOString(),
      createdAt: now.toISOString(),
    };

    // In production, save to database and send confirmation email
    // await db.subscriptions.create(subscription);
    // await sendSubscriptionConfirmationEmail({...});

    const intervalLabel = {
      weekly: 'week',
      monthly: 'month',
      quarterly: 'quarter',
      yearly: 'year',
    }[interval];

    return NextResponse.json({
      success: true,
      subscription,
      message: `Thank you! Your ${intervalLabel}ly giving of $${(amount / 100).toFixed(2)} has been set up.`,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Subscription error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create subscription' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/donations/subscriptions
 * List subscriptions (for admin or donor portal)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    // Future: filter by email and status
    void searchParams.get('email');
    void searchParams.get('status');

    // In production, fetch from database
    // const subscriptions = await db.subscriptions.findMany({
    //   where: { donorEmail: _donorEmail, status: _status },
    //   orderBy: { createdAt: 'desc' },
    // });

    // Mock response
    const subscriptions: unknown[] = [];

    return NextResponse.json({
      success: true,
      subscriptions,
      count: subscriptions.length,
    });
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch subscriptions' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/donations/subscriptions
 * Update a subscription
 */
export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subscriptionId = searchParams.get('id');

    if (!subscriptionId) {
      return NextResponse.json(
        { success: false, error: 'Subscription ID required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    // Validate updates (will be used in production)
    UpdateSubscriptionSchema.parse(body);

    // In production, update via HelloPayments API and database
    // const provider = new HelloPaymentsProvider();
    // await provider.updateSubscription(subscriptionId, updates);

    return NextResponse.json({
      success: true,
      message: 'Subscription updated successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Update subscription error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update subscription' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/donations/subscriptions
 * Cancel a subscription
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subscriptionId = searchParams.get('id');
    const cancelImmediately = searchParams.get('immediate') === 'true';

    if (!subscriptionId) {
      return NextResponse.json(
        { success: false, error: 'Subscription ID required' },
        { status: 400 }
      );
    }

    // In production, cancel via HelloPayments API
    // const provider = new HelloPaymentsProvider();
    // await provider.cancelSubscription(subscriptionId, { cancelImmediately });

    return NextResponse.json({
      success: true,
      message: cancelImmediately
        ? 'Subscription cancelled immediately'
        : 'Subscription will be cancelled at the end of the current period',
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to cancel subscription' },
      { status: 500 }
    );
  }
}
