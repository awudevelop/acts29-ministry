import { NextRequest, NextResponse } from 'next/server';
import {
  sendDonationReceiptEmail,
  generateReceiptNumber,
} from '@acts29/email-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      donorEmail,
      donorName,
      organization,
      donation,
    } = body;

    // Validate required fields
    if (!donorEmail || !donorName || !organization || !donation) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate receipt number
    const receiptNumber = generateReceiptNumber();

    // Send the email
    const result = await sendDonationReceiptEmail({
      to: donorEmail,
      organization: {
        name: organization.name,
        address: organization.address,
        phone: organization.phone,
        email: organization.email,
        ein: organization.ein || '47-1234567',
      },
      donor: {
        name: donorName,
        email: donorEmail,
      },
      donation: {
        id: donation.id,
        date: donation.date || donation.created_at,
        type: donation.type,
        amount: donation.amount,
        description: donation.description,
        feeAmount: donation.fee_amount,
        totalAmount: donation.total_amount,
      },
      receiptNumber,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      receiptNumber,
      emailId: result.id,
      message: `Receipt sent to ${donorEmail}`,
    });
  } catch (error) {
    console.error('Receipt send error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
