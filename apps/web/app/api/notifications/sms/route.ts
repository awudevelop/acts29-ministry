import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// SMS notification schemas
const ShiftReminderSchema = z.object({
  type: z.literal('shift_reminder'),
  volunteerName: z.string(),
  volunteerPhone: z.string(),
  shiftTitle: z.string(),
  shiftDate: z.string(),
  shiftTime: z.string(),
  shiftLocation: z.string(),
});

const EmergencyAlertSchema = z.object({
  type: z.literal('emergency_alert'),
  recipients: z.array(z.string()).min(1),
  alertType: z.enum(['weather', 'safety', 'resource', 'general']),
  title: z.string(),
  message: z.string(),
  actionRequired: z.string().optional(),
});

const EventReminderSchema = z.object({
  type: z.literal('event_reminder'),
  recipientName: z.string(),
  recipientPhone: z.string(),
  eventTitle: z.string(),
  eventDate: z.string(),
  eventTime: z.string(),
  eventLocation: z.string(),
});

const PrayerUpdateSchema = z.object({
  type: z.literal('prayer_update'),
  requesterName: z.string(),
  requesterPhone: z.string(),
  updateType: z.enum(['received', 'praying', 'answered']),
  originalRequest: z.string().optional(),
});

const CaseStatusSchema = z.object({
  type: z.literal('case_status'),
  clientName: z.string(),
  clientPhone: z.string(),
  caseId: z.string(),
  status: z.string(),
  nextSteps: z.string().optional(),
});

const DonationConfirmationSchema = z.object({
  type: z.literal('donation_confirmation'),
  donorName: z.string(),
  donorPhone: z.string(),
  amount: z.number().positive(),
  isRecurring: z.boolean(),
  interval: z.enum(['weekly', 'monthly', 'quarterly', 'yearly']).optional(),
});

const SMSRequestSchema = z.discriminatedUnion('type', [
  ShiftReminderSchema,
  EmergencyAlertSchema,
  EventReminderSchema,
  PrayerUpdateSchema,
  CaseStatusSchema,
  DonationConfirmationSchema,
]);

/**
 * POST /api/notifications/sms
 * Send SMS notifications of various types
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = SMSRequestSchema.parse(body);

    // In production, this would call the sms-service
    // import { sendShiftReminder, sendEmergencyAlert, ... } from '@acts29/sms-service';

    // Mock response for development
    const mockMessageId = `sms_${Date.now().toString(36)}`;

    switch (validatedData.type) {
      case 'shift_reminder':
        // await sendShiftReminder(validatedData);
        console.log('Shift reminder:', validatedData);
        return NextResponse.json({
          success: true,
          messageId: mockMessageId,
          message: `Shift reminder sent to ${validatedData.volunteerName}`,
        });

      case 'emergency_alert':
        // await sendEmergencyAlert(validatedData.recipients, validatedData);
        console.log('Emergency alert:', validatedData);
        return NextResponse.json({
          success: true,
          sent: validatedData.recipients.length,
          failed: 0,
          message: `Emergency alert sent to ${validatedData.recipients.length} recipients`,
        });

      case 'event_reminder':
        // await sendEventReminder(validatedData);
        console.log('Event reminder:', validatedData);
        return NextResponse.json({
          success: true,
          messageId: mockMessageId,
          message: `Event reminder sent to ${validatedData.recipientName}`,
        });

      case 'prayer_update':
        // await sendPrayerUpdate(validatedData);
        console.log('Prayer update:', validatedData);
        return NextResponse.json({
          success: true,
          messageId: mockMessageId,
          message: `Prayer update sent to ${validatedData.requesterName}`,
        });

      case 'case_status':
        // await sendCaseStatusUpdate(validatedData);
        console.log('Case status update:', validatedData);
        return NextResponse.json({
          success: true,
          messageId: mockMessageId,
          message: `Case status update sent for case ${validatedData.caseId}`,
        });

      case 'donation_confirmation':
        // await sendDonationConfirmation(validatedData);
        console.log('Donation confirmation:', validatedData);
        return NextResponse.json({
          success: true,
          messageId: mockMessageId,
          message: `Donation confirmation sent to ${validatedData.donorName}`,
        });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('SMS notification error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send SMS notification' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/notifications/sms
 * Get SMS notification history/status (admin only)
 */
export async function GET(_request: NextRequest) {
  try {
    // In production, this would fetch from database and check auth
    // const session = await getSession(request);
    // if (!hasRole(session, 'admin')) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // Mock response
    const notifications = [
      {
        id: 'sms_mock1',
        type: 'shift_reminder',
        recipient: '+1555555555',
        status: 'delivered',
        sentAt: new Date().toISOString(),
      },
      {
        id: 'sms_mock2',
        type: 'event_reminder',
        recipient: '+1555555556',
        status: 'delivered',
        sentAt: new Date().toISOString(),
      },
    ];

    return NextResponse.json({
      success: true,
      notifications,
      count: notifications.length,
    });
  } catch (error) {
    console.error('Error fetching SMS notifications:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch SMS notifications' },
      { status: 500 }
    );
  }
}
