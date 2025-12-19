/**
 * Acts29 Ministry - Analytics Agent
 * Supabase Edge Function for tracking and reporting
 *
 * Handles:
 * - Event tracking
 * - Usage metrics
 * - Report generation
 * - Dashboard data aggregation
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalyticsEvent {
  event: string;
  properties?: Record<string, unknown>;
  userId?: string;
  organizationId?: string;
  timestamp?: string;
}

interface ReportRequest {
  type: 'dashboard' | 'donations' | 'volunteers' | 'cases' | 'resources';
  organizationId: string;
  startDate?: string;
  endDate?: string;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  try {
    const url = new URL(req.url);
    const action = url.pathname.split('/').pop();

    let result;

    switch (action) {
      case 'track':
        const event: AnalyticsEvent = await req.json();
        result = await trackEvent(supabaseClient, event);
        break;

      case 'report':
        const reportReq: ReportRequest = await req.json();
        result = await generateReport(supabaseClient, reportReq);
        break;

      case 'dashboard':
        const dashboardReq = await req.json();
        result = await getDashboardData(supabaseClient, dashboardReq.organizationId);
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ success: false, error: message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

async function trackEvent(
  supabase: ReturnType<typeof createClient>,
  event: AnalyticsEvent
): Promise<{ success: boolean }> {
  const { error } = await supabase.from('analytics_events').insert({
    event_name: event.event,
    properties: event.properties,
    user_id: event.userId,
    organization_id: event.organizationId,
    created_at: event.timestamp ?? new Date().toISOString(),
  });

  if (error) {
    console.error('Failed to track event:', error);
    throw error;
  }

  return { success: true };
}

async function generateReport(
  supabase: ReturnType<typeof createClient>,
  request: ReportRequest
): Promise<{ success: boolean; data: Record<string, unknown> }> {
  const { type, organizationId, startDate, endDate } = request;

  const start = startDate ?? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const end = endDate ?? new Date().toISOString();

  let data: Record<string, unknown> = {};

  switch (type) {
    case 'donations':
      data = await getDonationsReport(supabase, organizationId, start, end);
      break;

    case 'volunteers':
      data = await getVolunteersReport(supabase, organizationId, start, end);
      break;

    case 'cases':
      data = await getCasesReport(supabase, organizationId, start, end);
      break;

    case 'resources':
      data = await getResourcesReport(supabase, organizationId, start, end);
      break;

    case 'dashboard':
      data = await getDashboardData(supabase, organizationId);
      break;
  }

  return { success: true, data };
}

async function getDonationsReport(
  supabase: ReturnType<typeof createClient>,
  organizationId: string,
  startDate: string,
  endDate: string
): Promise<Record<string, unknown>> {
  const { data: donations } = await supabase
    .from('donations')
    .select('*')
    .eq('organization_id', organizationId)
    .eq('status', 'completed')
    .gte('created_at', startDate)
    .lte('created_at', endDate);

  const totalAmount = donations?.reduce((sum, d) => sum + (d.amount || 0), 0) ?? 0;
  const donationCount = donations?.length ?? 0;

  const byType = donations?.reduce(
    (acc, d) => {
      acc[d.type] = (acc[d.type] || 0) + (d.amount || 0);
      return acc;
    },
    {} as Record<string, number>
  );

  return {
    totalAmount,
    donationCount,
    averageDonation: donationCount > 0 ? totalAmount / donationCount : 0,
    byType,
    donations,
  };
}

async function getVolunteersReport(
  supabase: ReturnType<typeof createClient>,
  organizationId: string,
  startDate: string,
  endDate: string
): Promise<Record<string, unknown>> {
  const { data: shifts } = await supabase
    .from('shift_signups')
    .select(
      `
      *,
      volunteer_shifts!inner(organization_id, start_time, end_time)
    `
    )
    .eq('volunteer_shifts.organization_id', organizationId)
    .eq('status', 'completed')
    .gte('volunteer_shifts.start_time', startDate)
    .lte('volunteer_shifts.end_time', endDate);

  const totalHours = shifts?.reduce((sum, s) => sum + (s.hours_logged || 0), 0) ?? 0;
  const uniqueVolunteers = new Set(shifts?.map((s) => s.volunteer_id)).size;
  const shiftCount = shifts?.length ?? 0;

  return {
    totalHours,
    uniqueVolunteers,
    shiftCount,
    averageHoursPerShift: shiftCount > 0 ? totalHours / shiftCount : 0,
  };
}

async function getCasesReport(
  supabase: ReturnType<typeof createClient>,
  organizationId: string,
  startDate: string,
  endDate: string
): Promise<Record<string, unknown>> {
  const { data: cases } = await supabase
    .from('cases')
    .select('*')
    .eq('organization_id', organizationId)
    .gte('created_at', startDate)
    .lte('created_at', endDate);

  const byStatus = cases?.reduce(
    (acc, c) => {
      acc[c.status] = (acc[c.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return {
    totalCases: cases?.length ?? 0,
    byStatus,
    activeCases: byStatus?.active ?? 0,
    closedCases: byStatus?.closed ?? 0,
  };
}

async function getResourcesReport(
  supabase: ReturnType<typeof createClient>,
  organizationId: string,
  _startDate: string,
  _endDate: string
): Promise<Record<string, unknown>> {
  const { data: resources } = await supabase
    .from('resources')
    .select('*')
    .eq('organization_id', organizationId)
    .eq('is_active', true);

  const byType = resources?.reduce(
    (acc, r) => {
      acc[r.type] = (acc[r.type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const totalCapacity = resources?.reduce((sum, r) => sum + (r.capacity || 0), 0) ?? 0;
  const currentAvailability =
    resources?.reduce((sum, r) => sum + (r.current_availability || 0), 0) ?? 0;

  return {
    totalResources: resources?.length ?? 0,
    byType,
    totalCapacity,
    currentAvailability,
    utilizationRate: totalCapacity > 0 ? ((totalCapacity - currentAvailability) / totalCapacity) * 100 : 0,
  };
}

async function getDashboardData(
  supabase: ReturnType<typeof createClient>,
  organizationId: string
): Promise<Record<string, unknown>> {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const now = new Date().toISOString();

  const [donations, volunteers, cases, resources] = await Promise.all([
    getDonationsReport(supabase, organizationId, thirtyDaysAgo, now),
    getVolunteersReport(supabase, organizationId, thirtyDaysAgo, now),
    getCasesReport(supabase, organizationId, thirtyDaysAgo, now),
    getResourcesReport(supabase, organizationId, thirtyDaysAgo, now),
  ]);

  return {
    period: {
      start: thirtyDaysAgo,
      end: now,
    },
    summary: {
      totalDonations: donations.totalAmount,
      volunteerHours: volunteers.totalHours,
      activeCases: cases.activeCases,
      activeResources: resources.totalResources,
    },
    donations,
    volunteers,
    cases,
    resources,
  };
}
