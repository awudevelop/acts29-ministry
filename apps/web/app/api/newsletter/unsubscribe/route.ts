import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const UnsubscribeSchema = z.object({
  token: z.string().min(1, 'Unsubscribe token is required'),
  lists: z.array(z.enum(['newsletter', 'donor-updates', 'event-reminders'])).optional(),
  unsubscribeAll: z.boolean().default(false),
});

/**
 * POST /api/newsletter/unsubscribe
 * Unsubscribe from mailing lists
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = UnsubscribeSchema.parse(body);

    const { token, lists, unsubscribeAll } = validatedData;

    // In production, this would:
    // 1. Decode the unsubscribe token to get subscriber ID
    // 2. Update subscriber status or remove from specific lists
    // 3. Log the unsubscribe action

    // const subscriberId = decodeUnsubscribeToken(token);
    // const subscriber = await db.subscribers.findUnique({
    //   where: { id: subscriberId },
    // });
    //
    // if (!subscriber) {
    //   return NextResponse.json(
    //     { success: false, error: 'Subscriber not found' },
    //     { status: 404 }
    //   );
    // }
    //
    // if (unsubscribeAll) {
    //   await db.subscribers.update({
    //     where: { id: subscriberId },
    //     data: { status: 'unsubscribed', lists: [] },
    //   });
    // } else if (lists) {
    //   await db.subscribers.update({
    //     where: { id: subscriberId },
    //     data: {
    //       lists: subscriber.lists.filter(l => !lists.includes(l)),
    //     },
    //   });
    // }

    console.log('Unsubscribe request:', { token, lists, unsubscribeAll });

    return NextResponse.json({
      success: true,
      message: unsubscribeAll
        ? 'You have been unsubscribed from all emails.'
        : 'You have been unsubscribed from the selected mailing lists.',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Unsubscribe error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to unsubscribe' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/newsletter/unsubscribe
 * Get unsubscribe page data (for rendering unsubscribe preferences)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unsubscribe token is required' },
        { status: 400 }
      );
    }

    // In production, decode token and get subscriber info
    // const subscriberId = decodeUnsubscribeToken(token);
    // const subscriber = await db.subscribers.findUnique({
    //   where: { id: subscriberId },
    // });

    // Mock response
    return NextResponse.json({
      success: true,
      subscriber: {
        email: 'subscriber@example.com',
        lists: ['newsletter', 'donor-updates'],
      },
      availableLists: [
        { id: 'newsletter', name: 'Newsletter', description: 'Monthly ministry updates' },
        { id: 'donor-updates', name: 'Donor Updates', description: 'Updates for financial supporters' },
        { id: 'event-reminders', name: 'Event Reminders', description: 'Reminders for upcoming events' },
      ],
    });
  } catch (error) {
    console.error('Get unsubscribe info error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get subscriber info' },
      { status: 500 }
    );
  }
}
