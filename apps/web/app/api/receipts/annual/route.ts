import { NextRequest, NextResponse } from 'next/server';
import {
  sendAnnualStatementEmail,
  generateStatementNumber,
} from '@acts29/email-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      donorEmail,
      donorName,
      organization,
      donations,
      taxYear,
    } = body;

    // Validate required fields
    if (!donorEmail || !donorName || !organization || !donations || !taxYear) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Calculate total amount
    const totalAmount = donations
      .filter((d: { type: string }) => d.type === 'monetary')
      .reduce((sum: number, d: { total_amount?: number; amount?: number }) =>
        sum + (d.total_amount ?? d.amount ?? 0), 0);

    // Generate statement number
    const statementNumber = generateStatementNumber(taxYear);

    // Format donations for email
    const formattedDonations = donations.map((d: {
      id: string;
      created_at: string;
      type: 'monetary' | 'goods' | 'time';
      description?: string;
      amount?: number;
      total_amount?: number;
    }) => ({
      id: d.id,
      date: d.created_at,
      type: d.type,
      description: d.description,
      amount: d.amount,
      totalAmount: d.total_amount,
    }));

    // Send the email
    const result = await sendAnnualStatementEmail({
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
      donations: formattedDonations,
      taxYear,
      statementNumber,
      totalAmount,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      statementNumber,
      emailId: result.id,
      totalAmount,
      donationCount: donations.length,
      message: `Annual statement sent to ${donorEmail}`,
    });
  } catch (error) {
    console.error('Annual statement send error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Bulk send endpoint for multiple donors
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      donors, // Array of { email, name, donations }
      organization,
      taxYear,
    } = body;

    if (!donors || !Array.isArray(donors) || !organization || !taxYear) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const results = {
      success: [] as string[],
      failed: [] as { email: string; error: string }[],
    };

    // Send emails to each donor
    for (const donor of donors) {
      const totalAmount = donor.donations
        .filter((d: { type: string }) => d.type === 'monetary')
        .reduce((sum: number, d: { total_amount?: number; amount?: number }) =>
          sum + (d.total_amount ?? d.amount ?? 0), 0);

      const statementNumber = generateStatementNumber(taxYear);

      const formattedDonations = donor.donations.map((d: {
        id: string;
        created_at: string;
        type: 'monetary' | 'goods' | 'time';
        description?: string;
        amount?: number;
        total_amount?: number;
      }) => ({
        id: d.id,
        date: d.created_at,
        type: d.type,
        description: d.description,
        amount: d.amount,
        totalAmount: d.total_amount,
      }));

      const result = await sendAnnualStatementEmail({
        to: donor.email,
        organization: {
          name: organization.name,
          address: organization.address,
          phone: organization.phone,
          email: organization.email,
          ein: organization.ein || '47-1234567',
        },
        donor: {
          name: donor.name,
          email: donor.email,
        },
        donations: formattedDonations,
        taxYear,
        statementNumber,
        totalAmount,
      });

      if (result.success) {
        results.success.push(donor.email);
      } else {
        results.failed.push({ email: donor.email, error: result.error || 'Unknown error' });
      }
    }

    return NextResponse.json({
      success: true,
      sent: results.success.length,
      failed: results.failed.length,
      results,
    });
  } catch (error) {
    console.error('Bulk annual statement send error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
