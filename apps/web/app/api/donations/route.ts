import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Donation request schema
const CreateDonationSchema = z.object({
  amount: z.number().positive().min(100, 'Minimum donation is $1'), // in cents
  currency: z.enum(['USD']).default('USD'),
  paymentMethod: z.enum(['card', 'ach']),
  coverFees: z.boolean().default(false),
  donationType: z.enum(['one-time', 'monthly']),
  donor: z.object({
    email: z.string().email(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phone: z.string().optional(),
  }),
  campaignId: z.string().optional(),
  paymentMethodToken: z.string().optional(), // Token from HelloPayments.js
});

// HelloPayments fee structure
const FEES = {
  card: { percentage: 5.0, fixedCents: 0 },
  ach: { percentage: 1.0, fixedCents: 0, maxCents: 500 },
};

function calculateFee(amountCents: number, method: 'card' | 'ach') {
  const feeConfig = FEES[method];
  let feeCents = Math.ceil((amountCents * feeConfig.percentage) / 100);

  // Apply max fee cap for ACH
  if (method === 'ach' && feeCents > FEES.ach.maxCents) {
    feeCents = FEES.ach.maxCents;
  }

  return feeCents;
}

/**
 * POST /api/donations
 * Create a new donation
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = CreateDonationSchema.parse(body);

    const {
      amount,
      paymentMethod,
      coverFees,
      donationType,
      donor,
      campaignId,
    } = validatedData;

    // Calculate fees
    const feeCents = calculateFee(amount, paymentMethod);
    let finalAmount = amount;

    if (coverFees) {
      // Calculate amount with fee coverage
      const rate = FEES[paymentMethod].percentage / 100;
      finalAmount = Math.ceil(amount / (1 - rate));

      // Apply max fee cap for ACH
      if (paymentMethod === 'ach') {
        const coverageFee = Math.ceil((finalAmount * FEES.ach.percentage) / 100);
        if (coverageFee > FEES.ach.maxCents) {
          finalAmount = amount + FEES.ach.maxCents;
        }
      }
    }

    // In production, this would call HelloPayments API
    // const provider = new HelloPaymentsProvider();
    // await provider.initialize({
    //   apiKey: process.env.HELLOPAYMENTS_API_KEY!,
    //   testMode: process.env.NODE_ENV !== 'production',
    // });

    // For now, generate a mock payment
    const paymentId = `hp_pay_${Date.now().toString(36)}`;
    const donationId = `don_${Date.now().toString(36)}`;

    // Mock response - in production this would be from HelloPayments
    const payment = {
      id: paymentId,
      amount: finalAmount,
      feeAmount: feeCents,
      netAmount: finalAmount - feeCents,
      status: 'succeeded',
      createdAt: new Date().toISOString(),
    };

    // Create donation record
    const donation = {
      id: donationId,
      paymentId: payment.id,
      amount: amount, // Original donation amount
      finalAmount: finalAmount, // Amount charged (with fee coverage)
      feeAmount: feeCents,
      netAmount: amount, // Ministry receives full donation when fees covered
      paymentMethod,
      donationType,
      donor: {
        email: donor.email,
        firstName: donor.firstName,
        lastName: donor.lastName,
      },
      campaignId,
      status: 'completed',
      createdAt: new Date().toISOString(),
    };

    // In production, save to database and send receipt email
    // await db.donations.create(donation);
    // await sendDonationReceiptEmail({...});

    return NextResponse.json({
      success: true,
      donation,
      payment,
      message: donationType === 'monthly'
        ? 'Thank you! Your monthly giving has been set up.'
        : 'Thank you for your generous donation!',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Donation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process donation' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/donations
 * List donations (for admin)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    // Future: filter by email, status, and limit
    void searchParams.get('email');
    void searchParams.get('status');
    void parseInt(searchParams.get('limit') || '10', 10);

    // In production, fetch from database with filters
    // const donations = await db.donations.findMany({
    //   where: { donorEmail: _donorEmail, status: _status },
    //   take: _limit,
    //   orderBy: { createdAt: 'desc' },
    // });

    // Mock response
    const donations: unknown[] = [];

    return NextResponse.json({
      success: true,
      donations,
      count: donations.length,
    });
  } catch (error) {
    console.error('Error fetching donations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch donations' },
      { status: 500 }
    );
  }
}
