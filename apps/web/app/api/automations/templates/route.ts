import { NextResponse } from 'next/server';

// Automation templates library
const templates = [
  {
    id: 'welcome_new_donor',
    name: 'Welcome New Donor',
    description: 'Send a thank you email and add to donor list when someone makes their first donation',
    category: 'Donations',
    popularity: 95,
    trigger: { type: 'donation.created' },
    steps: [
      {
        id: 'step1',
        action: {
          type: 'send_email',
          config: {
            to: '{{donorEmail}}',
            subject: 'Thank you for your generous gift!',
            templateId: 'donation_receipt',
          },
        },
      },
      {
        id: 'step2',
        action: {
          type: 'add_to_list',
          config: {
            email: '{{donorEmail}}',
            listId: 'donor-updates',
          },
        },
      },
      {
        id: 'step3',
        action: {
          type: 'send_slack',
          config: {
            channel: '#donations',
            message: '🎉 New donation received from {{donorName}}: ${{amount}}',
          },
        },
      },
    ],
  },
  {
    id: 'volunteer_shift_reminder_24h',
    name: 'Shift Reminder (24 Hours)',
    description: 'Send SMS and email reminders 24 hours before a scheduled shift',
    category: 'Volunteers',
    popularity: 88,
    trigger: {
      type: 'volunteer.shift_upcoming',
      filters: { hoursUntilShift: 24 },
    },
    steps: [
      {
        id: 'step1',
        action: {
          type: 'send_email',
          config: {
            to: '{{volunteerEmail}}',
            subject: 'Reminder: Your shift tomorrow at {{shiftTime}}',
            templateId: 'event_reminder',
          },
        },
      },
      {
        id: 'step2',
        action: {
          type: 'send_sms',
          config: {
            to: '{{volunteerPhone}}',
            message: 'Hi {{volunteerName}}! Reminder: {{shiftTitle}} tomorrow at {{shiftTime}}. Location: {{shiftLocation}}',
          },
        },
        conditions: [{ field: 'volunteerPhone', operator: 'is_not_empty', value: null }],
      },
    ],
  },
  {
    id: 'volunteer_shift_reminder_2h',
    name: 'Shift Reminder (2 Hours)',
    description: 'Send a final SMS reminder 2 hours before a shift',
    category: 'Volunteers',
    popularity: 72,
    trigger: {
      type: 'volunteer.shift_upcoming',
      filters: { hoursUntilShift: 2 },
    },
    steps: [
      {
        id: 'step1',
        action: {
          type: 'send_sms',
          config: {
            to: '{{volunteerPhone}}',
            message: 'Hi {{volunteerName}}! Just a reminder - {{shiftTitle}} starts in 2 hours at {{shiftLocation}}. See you soon!',
          },
        },
      },
    ],
  },
  {
    id: 'new_prayer_request',
    name: 'New Prayer Request Notification',
    description: 'Notify the prayer team and send confirmation to requester',
    category: 'Prayer',
    popularity: 85,
    trigger: { type: 'prayer.submitted' },
    steps: [
      {
        id: 'step1',
        action: {
          type: 'send_email',
          config: {
            to: 'prayer-team@acts29ministry.org',
            subject: 'New Prayer Request',
            body: 'A new prayer request has been submitted:\n\n{{request}}\n\nPlease lift this up in prayer.',
          },
        },
      },
      {
        id: 'step2',
        action: {
          type: 'send_email',
          config: {
            to: '{{requesterEmail}}',
            subject: 'We received your prayer request',
            body: 'Dear {{requesterName}},\n\nThank you for sharing your prayer request with us. Our prayer team has received it and is lifting you up in prayer.\n\n"Cast all your anxiety on him because he cares for you." - 1 Peter 5:7\n\nBlessings,\nActs 29 Prayer Team',
          },
        },
        conditions: [{ field: 'requesterEmail', operator: 'is_not_empty', value: null }],
      },
    ],
  },
  {
    id: 'recurring_donation_setup',
    name: 'New Recurring Donor Welcome',
    description: 'Welcome new recurring donors with a special email series',
    category: 'Donations',
    popularity: 78,
    trigger: { type: 'donation.recurring.created' },
    steps: [
      {
        id: 'step1',
        action: {
          type: 'send_email',
          config: {
            to: '{{donorEmail}}',
            subject: 'Thank you for becoming a monthly partner!',
            templateId: 'recurring_welcome',
          },
        },
      },
      {
        id: 'step2',
        action: {
          type: 'add_to_list',
          config: {
            email: '{{donorEmail}}',
            listId: 'recurring-donors',
          },
        },
      },
      {
        id: 'step3',
        action: {
          type: 'create_task',
          config: {
            title: 'Send handwritten thank you to {{donorName}}',
            description: 'New recurring donor at ${{amount}}/{{interval}}. Consider a personal thank you card.',
            dueIn: 3,
            priority: 'high',
          },
        },
      },
    ],
  },
  {
    id: 'recurring_donation_cancelled',
    name: 'Recurring Donation Cancellation Follow-up',
    description: 'Send a follow-up email and create task when a recurring donation is cancelled',
    category: 'Donations',
    popularity: 65,
    trigger: { type: 'donation.recurring.cancelled' },
    steps: [
      {
        id: 'step1',
        action: {
          type: 'delay',
          config: { duration: 1, unit: 'days' },
        },
      },
      {
        id: 'step2',
        action: {
          type: 'send_email',
          config: {
            to: '{{donorEmail}}',
            subject: 'We appreciate your past support',
            body: 'Dear {{donorName}},\n\nWe noticed you cancelled your recurring donation. We understand that circumstances change, and we want to thank you for your past support.\n\nYour generosity has made a real difference. If you ever want to resume your giving, we would be grateful.\n\nGod bless you,\nActs 29 Ministry',
          },
        },
      },
      {
        id: 'step3',
        action: {
          type: 'create_task',
          config: {
            title: 'Follow up with cancelled donor: {{donorName}}',
            description: 'Recurring donation cancelled. Consider a personal follow-up call.',
            dueIn: 7,
            priority: 'medium',
          },
        },
      },
    ],
  },
  {
    id: 'urgent_case_alert',
    name: 'Urgent Case Alert',
    description: 'Immediately notify team via SMS and Slack when an urgent case is created',
    category: 'Cases',
    popularity: 82,
    trigger: {
      type: 'case.created',
      filters: { priority: 'urgent' },
    },
    steps: [
      {
        id: 'step1',
        action: {
          type: 'send_slack',
          config: {
            channel: '#urgent-cases',
            message: '🚨 URGENT CASE: {{clientName}} needs immediate assistance. Needs: {{needs}}',
          },
        },
      },
      {
        id: 'step2',
        action: {
          type: 'send_sms',
          config: {
            to: '+15551234567', // Configure with on-call coordinator
            message: 'URGENT: New case for {{clientName}}. Check Slack #urgent-cases.',
          },
        },
      },
    ],
  },
  {
    id: 'case_assigned_notification',
    name: 'Case Assignment Notification',
    description: 'Notify team member when a case is assigned to them',
    category: 'Cases',
    popularity: 70,
    trigger: { type: 'case.assigned' },
    steps: [
      {
        id: 'step1',
        action: {
          type: 'send_email',
          config: {
            to: '{{assignedToEmail}}',
            subject: 'New case assigned to you: {{clientName}}',
            body: 'Hi {{assignedToName}},\n\nA new case has been assigned to you.\n\nClient: {{clientName}}\nCase ID: {{caseId}}\n\nPlease review the case details and reach out to the client within 24 hours.',
          },
        },
      },
      {
        id: 'step2',
        action: {
          type: 'send_slack',
          config: {
            channel: '@{{assignedToId}}',
            message: 'You have been assigned a new case: {{clientName}} ({{caseId}})',
          },
        },
      },
    ],
  },
  {
    id: 'event_registration_confirmation',
    name: 'Event Registration Confirmation',
    description: 'Send confirmation email and calendar invite when someone registers for an event',
    category: 'Events',
    popularity: 90,
    trigger: { type: 'event.registration' },
    steps: [
      {
        id: 'step1',
        action: {
          type: 'send_email',
          config: {
            to: '{{attendeeEmail}}',
            subject: 'You\'re registered: {{eventTitle}}',
            templateId: 'event_registration',
          },
        },
      },
      {
        id: 'step2',
        action: {
          type: 'add_to_list',
          config: {
            email: '{{attendeeEmail}}',
            listId: 'event-reminders',
          },
        },
      },
    ],
  },
  {
    id: 'event_cancelled_notification',
    name: 'Event Cancellation Notification',
    description: 'Notify all registered attendees when an event is cancelled',
    category: 'Events',
    popularity: 60,
    trigger: { type: 'event.cancelled' },
    steps: [
      {
        id: 'step1',
        action: {
          type: 'send_email',
          config: {
            to: '{{attendeeEmails}}',
            subject: 'Event Cancelled: {{eventTitle}}',
            body: 'We regret to inform you that {{eventTitle}} scheduled for {{eventDate}} has been cancelled.\n\n{{reason}}\n\nWe apologize for any inconvenience and hope to see you at future events.',
          },
        },
      },
    ],
  },
  {
    id: 'weekly_volunteer_digest',
    name: 'Weekly Volunteer Digest',
    description: 'Send a weekly summary email to all volunteers every Monday',
    category: 'Volunteers',
    popularity: 55,
    trigger: {
      type: 'schedule.weekly',
      schedule: { dayOfWeek: 1, time: '09:00', timezone: 'America/Chicago' },
    },
    steps: [
      {
        id: 'step1',
        action: {
          type: 'send_email',
          config: {
            to: 'volunteers@acts29ministry.org',
            subject: 'Weekly Volunteer Update',
            templateId: 'weekly_digest',
          },
        },
      },
    ],
  },
  {
    id: 'monthly_donor_impact',
    name: 'Monthly Donor Impact Report',
    description: 'Send monthly impact report to all donors on the 1st of each month',
    category: 'Donations',
    popularity: 68,
    trigger: {
      type: 'schedule.monthly',
      schedule: { dayOfMonth: 1, time: '10:00', timezone: 'America/Chicago' },
    },
    steps: [
      {
        id: 'step1',
        action: {
          type: 'send_email',
          config: {
            to: 'donor-updates@acts29ministry.org',
            subject: 'Your Impact This Month',
            templateId: 'monthly_impact',
          },
        },
      },
    ],
  },
  {
    id: 'new_volunteer_onboarding',
    name: 'New Volunteer Onboarding',
    description: 'Welcome new volunteers with an email series and Slack notification',
    category: 'Volunteers',
    popularity: 75,
    trigger: { type: 'volunteer.signed_up' },
    steps: [
      {
        id: 'step1',
        action: {
          type: 'send_email',
          config: {
            to: '{{email}}',
            subject: 'Welcome to Acts 29 Ministry!',
            templateId: 'volunteer_welcome',
          },
        },
      },
      {
        id: 'step2',
        action: {
          type: 'send_slack',
          config: {
            channel: '#volunteers',
            message: '👋 Welcome {{name}} to the volunteer team!',
          },
        },
      },
      {
        id: 'step3',
        action: {
          type: 'delay',
          config: { duration: 3, unit: 'days' },
        },
      },
      {
        id: 'step4',
        action: {
          type: 'send_email',
          config: {
            to: '{{email}}',
            subject: 'Ready to get started?',
            body: 'Hi {{name}},\n\nWe hope you\'re excited to start volunteering with us! Here are some available shifts you might be interested in...',
          },
        },
      },
    ],
  },
  {
    id: 'newsletter_welcome',
    name: 'Newsletter Welcome Series',
    description: 'Welcome new newsletter subscribers with an intro email',
    category: 'Marketing',
    popularity: 80,
    trigger: { type: 'newsletter.subscribed' },
    steps: [
      {
        id: 'step1',
        action: {
          type: 'send_email',
          config: {
            to: '{{email}}',
            subject: 'Welcome to the Acts 29 community!',
            templateId: 'welcome',
          },
        },
      },
    ],
  },
  {
    id: 'failed_payment_notification',
    name: 'Failed Payment Notification',
    description: 'Notify donor and team when a payment fails',
    category: 'Donations',
    popularity: 62,
    trigger: { type: 'donation.failed' },
    steps: [
      {
        id: 'step1',
        action: {
          type: 'send_email',
          config: {
            to: '{{donorEmail}}',
            subject: 'Payment issue with your donation',
            body: 'Dear Donor,\n\nWe encountered an issue processing your recent donation. Please update your payment method to ensure your gift can be processed.\n\nReason: {{failureReason}}\n\nUpdate payment: https://acts29ministry.org/donor/update-payment',
          },
        },
      },
      {
        id: 'step2',
        action: {
          type: 'send_slack',
          config: {
            channel: '#donations',
            message: '⚠️ Payment failed for donation {{donationId}}: {{failureReason}}',
          },
        },
      },
    ],
  },
];

/**
 * GET /api/automations/templates
 * Get automation templates library
 */
export async function GET() {
  try {
    // Group templates by category
    const categories = [...new Set(templates.map((t) => t.category))];
    const grouped = categories.map((category) => ({
      category,
      templates: templates
        .filter((t) => t.category === category)
        .sort((a, b) => b.popularity - a.popularity),
    }));

    return NextResponse.json({
      success: true,
      templates: grouped,
      totalCount: templates.length,
    });
  } catch (error) {
    console.error('Get templates error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch templates' },
      { status: 500 }
    );
  }
}
