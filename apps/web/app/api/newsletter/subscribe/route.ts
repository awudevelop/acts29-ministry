import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const SubscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().optional(),
  lists: z.array(z.enum(['newsletter', 'donor-updates', 'event-reminders'])).default(['newsletter']),
});

/**
 * POST /api/newsletter/subscribe
 * Subscribe to the newsletter and mailing lists
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = SubscribeSchema.parse(body);

    const { email, name, lists } = validatedData;

    // In production, this would:
    // 1. Check if subscriber already exists
    // 2. Create/update subscriber in database
    // 3. Send welcome email via email-service
    // 4. Add to email marketing platform (Resend contacts, Mailchimp, etc.)

    // const existingSubscriber = await db.subscribers.findUnique({
    //   where: { email },
    // });
    //
    // if (existingSubscriber) {
    //   await db.subscribers.update({
    //     where: { email },
    //     data: { lists, status: 'active', name },
    //   });
    // } else {
    //   await db.subscribers.create({
    //     data: { email, name, lists, status: 'active' },
    //   });
    //
    //   await sendWelcomeEmail({
    //     to: email,
    //     organization: { ... },
    //     subscriber: { name, email },
    //     unsubscribeUrl: `${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?token=...`,
    //   });
    // }

    const subscriberId = `sub_${Date.now().toString(36)}`;

    console.log('Newsletter subscription:', { email, name, lists });

    return NextResponse.json({
      success: true,
      subscriberId,
      message: 'Thank you for subscribing! Check your email for a welcome message.',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Subscribe error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to subscribe' },
      { status: 500 }
    );
  }
}
