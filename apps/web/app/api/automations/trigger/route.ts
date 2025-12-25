import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Schema for triggering an automation manually or via webhook
const TriggerAutomationSchema = z.object({
  triggerType: z.string(),
  data: z.record(z.unknown()),
  source: z.enum(['manual', 'webhook', 'scheduled', 'system']).default('system'),
});

/**
 * POST /api/automations/trigger
 * Trigger automations based on an event
 * This is called internally when events occur (donations, signups, etc.)
 * or can be called via webhook from external services
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { triggerType, data, source } = TriggerAutomationSchema.parse(body);

    // In production, this would:
    // 1. Find all active automations with matching trigger type
    // 2. Filter by any trigger conditions
    // 3. Queue each matching automation for execution
    // 4. Return the number of automations triggered

    // const matchingAutomations = await db.automations.findMany({
    //   where: {
    //     isActive: true,
    //     'trigger.type': triggerType,
    //   },
    // });
    //
    // for (const automation of matchingAutomations) {
    //   // Check trigger filters
    //   if (automation.trigger.filters) {
    //     if (!matchesFilters(data, automation.trigger.filters)) continue;
    //   }
    //
    //   // Queue for execution
    //   await automationQueue.add({
    //     automationId: automation.id,
    //     triggerData: data,
    //     source,
    //   });
    // }

    console.log('Automation trigger:', { triggerType, data, source });

    // Mock response
    const triggeredCount = triggerType === 'donation.created' ? 2 : 1;

    return NextResponse.json({
      success: true,
      triggeredCount,
      message: `Triggered ${triggeredCount} automation(s)`,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid trigger data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Trigger automation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to trigger automations' },
      { status: 500 }
    );
  }
}
