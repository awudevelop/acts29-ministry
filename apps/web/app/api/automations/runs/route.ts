import { NextRequest, NextResponse } from 'next/server';

// Mock automation run history
const mockRuns = [
  {
    id: 'run_1',
    automationId: 'auto_1',
    automationName: 'Welcome New Donor',
    triggeredBy: 'donation.created',
    triggerData: {
      donationId: 'don_123',
      amount: 5000,
      donorEmail: 'john@example.com',
      donorName: 'John Smith',
    },
    status: 'completed',
    steps: [
      {
        stepId: 'step1',
        action: 'send_email',
        status: 'completed',
        startedAt: '2024-12-24T10:00:00Z',
        completedAt: '2024-12-24T10:00:02Z',
        output: { emailId: 'email_abc123' },
      },
      {
        stepId: 'step2',
        action: 'add_to_list',
        status: 'completed',
        startedAt: '2024-12-24T10:00:02Z',
        completedAt: '2024-12-24T10:00:03Z',
      },
    ],
    startedAt: '2024-12-24T10:00:00Z',
    completedAt: '2024-12-24T10:00:03Z',
    duration: 3000,
  },
  {
    id: 'run_2',
    automationId: 'auto_2',
    automationName: 'Volunteer Shift Reminder',
    triggeredBy: 'volunteer.shift_upcoming',
    triggerData: {
      volunteerId: 'vol_456',
      volunteerName: 'Jane Doe',
      volunteerEmail: 'jane@example.com',
      volunteerPhone: '+15551234567',
      shiftTitle: 'Food Distribution',
      shiftDate: '2024-12-25',
      shiftTime: '9:00 AM',
    },
    status: 'completed',
    steps: [
      {
        stepId: 'step1',
        action: 'send_email',
        status: 'completed',
        startedAt: '2024-12-24T09:00:00Z',
        completedAt: '2024-12-24T09:00:01Z',
      },
      {
        stepId: 'step2',
        action: 'send_sms',
        status: 'completed',
        startedAt: '2024-12-24T09:00:01Z',
        completedAt: '2024-12-24T09:00:02Z',
      },
    ],
    startedAt: '2024-12-24T09:00:00Z',
    completedAt: '2024-12-24T09:00:02Z',
    duration: 2000,
  },
  {
    id: 'run_3',
    automationId: 'auto_1',
    automationName: 'Welcome New Donor',
    triggeredBy: 'donation.created',
    triggerData: {
      donationId: 'don_789',
      amount: 10000,
      donorEmail: 'invalid-email',
      donorName: 'Test User',
    },
    status: 'failed',
    steps: [
      {
        stepId: 'step1',
        action: 'send_email',
        status: 'failed',
        startedAt: '2024-12-23T15:30:00Z',
        completedAt: '2024-12-23T15:30:01Z',
        error: 'Invalid email address',
      },
      {
        stepId: 'step2',
        action: 'add_to_list',
        status: 'skipped',
      },
    ],
    startedAt: '2024-12-23T15:30:00Z',
    completedAt: '2024-12-23T15:30:01Z',
    duration: 1000,
    error: 'Step 1 failed: Invalid email address',
  },
];

/**
 * GET /api/automations/runs
 * Get automation run history
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const automationId = searchParams.get('automationId');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let runs = [...mockRuns];

    if (automationId) {
      runs = runs.filter((r) => r.automationId === automationId);
    }

    if (status) {
      runs = runs.filter((r) => r.status === status);
    }

    // Sort by most recent first
    runs.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());

    // Pagination
    const total = runs.length;
    runs = runs.slice(offset, offset + limit);

    // Calculate stats
    const stats = {
      total: mockRuns.length,
      completed: mockRuns.filter((r) => r.status === 'completed').length,
      failed: mockRuns.filter((r) => r.status === 'failed').length,
      avgDuration: Math.round(
        mockRuns.reduce((sum, r) => sum + (r.duration || 0), 0) / mockRuns.length
      ),
    };

    return NextResponse.json({
      success: true,
      runs,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
      stats,
    });
  } catch (error) {
    console.error('Get automation runs error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch automation runs' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/automations/runs
 * Manually trigger an automation run
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { automationId, testData } = body;

    if (!automationId) {
      return NextResponse.json(
        { success: false, error: 'Automation ID required' },
        { status: 400 }
      );
    }

    // In production:
    // 1. Fetch the automation
    // 2. Validate test data against trigger schema
    // 3. Execute the automation with test data
    // 4. Return run results

    const runId = `run_${Date.now().toString(36)}`;

    console.log('Manual automation run:', { automationId, testData });

    return NextResponse.json({
      success: true,
      runId,
      message: 'Automation triggered successfully',
      status: 'running',
    });
  } catch (error) {
    console.error('Manual run error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to trigger automation' },
      { status: 500 }
    );
  }
}
