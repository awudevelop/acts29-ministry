import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Automation schemas
const TriggerConfigSchema = z.object({
  type: z.string(),
  filters: z.record(z.unknown()).optional(),
  schedule: z.object({
    time: z.string().optional(),
    dayOfWeek: z.number().optional(),
    dayOfMonth: z.number().optional(),
    timezone: z.string().optional(),
  }).optional(),
});

const ActionConfigSchema = z.object({
  type: z.string(),
  config: z.record(z.unknown()),
});

const ConditionSchema = z.object({
  field: z.string(),
  operator: z.enum(['equals', 'not_equals', 'contains', 'greater_than', 'less_than', 'is_empty', 'is_not_empty']),
  value: z.unknown(),
});

const AutomationStepSchema = z.object({
  id: z.string(),
  action: ActionConfigSchema,
  conditions: z.array(ConditionSchema).optional(),
  onSuccess: z.string().optional(),
  onFailure: z.string().optional(),
});

const CreateAutomationSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  trigger: TriggerConfigSchema,
  steps: z.array(AutomationStepSchema).min(1),
  isActive: z.boolean().default(true),
});

const UpdateAutomationSchema = CreateAutomationSchema.partial().extend({
  id: z.string(),
});

// Mock data store
const mockAutomations = [
  {
    id: 'auto_1',
    name: 'Welcome New Donor',
    description: 'Send a thank you email and add to donor list when someone makes their first donation',
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
    ],
    isActive: true,
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString(),
    runCount: 47,
    lastRunAt: new Date('2024-12-23').toISOString(),
  },
  {
    id: 'auto_2',
    name: 'Volunteer Shift Reminder',
    description: 'Send SMS and email reminders 24 hours before a scheduled shift',
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
            subject: 'Reminder: Your shift tomorrow',
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
            message: 'Hi {{volunteerName}}! Reminder: {{shiftTitle}} tomorrow at {{shiftTime}}.',
          },
        },
        conditions: [{ field: 'volunteerPhone', operator: 'is_not_empty', value: null }],
      },
    ],
    isActive: true,
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-02-10').toISOString(),
    runCount: 156,
    lastRunAt: new Date('2024-12-24').toISOString(),
  },
  {
    id: 'auto_3',
    name: 'Urgent Case Alert',
    description: 'Immediately notify team via Slack when an urgent case is created',
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
            message: '🚨 URGENT CASE: {{clientName}} needs immediate assistance.',
          },
        },
      },
    ],
    isActive: true,
    createdAt: new Date('2024-03-01').toISOString(),
    updatedAt: new Date('2024-03-01').toISOString(),
    runCount: 12,
    lastRunAt: new Date('2024-12-20').toISOString(),
  },
];

/**
 * GET /api/automations
 * List all automations
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // 'active', 'inactive', or null for all
    const triggerType = searchParams.get('trigger');

    let automations = [...mockAutomations];

    if (status === 'active') {
      automations = automations.filter((a) => a.isActive);
    } else if (status === 'inactive') {
      automations = automations.filter((a) => !a.isActive);
    }

    if (triggerType) {
      automations = automations.filter((a) => a.trigger.type === triggerType);
    }

    return NextResponse.json({
      success: true,
      automations,
      count: automations.length,
    });
  } catch (error) {
    console.error('Get automations error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch automations' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/automations
 * Create a new automation
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = CreateAutomationSchema.parse(body);

    const automationId = `auto_${Date.now().toString(36)}`;
    const now = new Date().toISOString();

    const newAutomation = {
      id: automationId,
      ...validatedData,
      createdAt: now,
      updatedAt: now,
      runCount: 0,
      lastRunAt: null,
    };

    // In production:
    // await db.automations.create({ data: newAutomation });

    console.log('Created automation:', newAutomation);

    return NextResponse.json({
      success: true,
      automation: newAutomation,
      message: 'Automation created successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid automation data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Create automation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create automation' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/automations
 * Update an automation
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = UpdateAutomationSchema.parse(body);

    const { id, ...updates } = validatedData;

    // In production:
    // const automation = await db.automations.findUnique({ where: { id } });
    // if (!automation) return 404;
    // await db.automations.update({ where: { id }, data: { ...updates, updatedAt: new Date() } });

    console.log('Updated automation:', id, updates);

    return NextResponse.json({
      success: true,
      message: 'Automation updated successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid automation data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Update automation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update automation' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/automations
 * Delete an automation
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Automation ID required' },
        { status: 400 }
      );
    }

    // In production:
    // await db.automations.delete({ where: { id } });

    console.log('Deleted automation:', id);

    return NextResponse.json({
      success: true,
      message: 'Automation deleted successfully',
    });
  } catch (error) {
    console.error('Delete automation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete automation' },
      { status: 500 }
    );
  }
}
