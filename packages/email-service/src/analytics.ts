// ============================================
// Email Analytics Types and Tracking
// ============================================

/**
 * Email event types for analytics tracking
 */
export type EmailEventType =
  | 'sent'
  | 'delivered'
  | 'opened'
  | 'clicked'
  | 'bounced'
  | 'complained'
  | 'unsubscribed'
  | 'failed';

/**
 * Email analytics event
 */
export interface EmailEvent {
  id: string;
  emailId: string;
  eventType: EmailEventType;
  timestamp: Date;
  metadata?: {
    userAgent?: string;
    ipAddress?: string;
    linkUrl?: string;
    bounceType?: 'hard' | 'soft';
    bounceReason?: string;
    failureReason?: string;
    location?: {
      city?: string;
      region?: string;
      country?: string;
    };
  };
}

/**
 * Email record with full tracking data
 */
export interface EmailRecord {
  id: string;
  organizationId: string;
  templateId: string;
  templateName: string;
  recipientEmail: string;
  recipientName?: string;
  subject: string;
  sentAt: Date;
  status: 'pending' | 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'failed';
  events: EmailEvent[];
  metadata?: {
    triggeredBy?: string; // Automation ID or manual
    campaignId?: string;
    tags?: string[];
  };
}

/**
 * Email analytics summary for a time period
 */
export interface EmailAnalyticsSummary {
  period: {
    start: Date;
    end: Date;
  };
  totals: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
    complained: number;
    unsubscribed: number;
    failed: number;
  };
  rates: {
    deliveryRate: number; // delivered / sent
    openRate: number; // opened / delivered
    clickRate: number; // clicked / opened
    bounceRate: number; // bounced / sent
    complaintRate: number; // complained / delivered
    unsubscribeRate: number; // unsubscribed / delivered
  };
  byTemplate: Array<{
    templateId: string;
    templateName: string;
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    openRate: number;
    clickRate: number;
  }>;
  byDay: Array<{
    date: string;
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
  }>;
}

/**
 * Template performance metrics
 */
export interface TemplatePerformance {
  templateId: string;
  templateName: string;
  totalSent: number;
  totalDelivered: number;
  totalOpened: number;
  totalClicked: number;
  uniqueOpens: number;
  uniqueClicks: number;
  openRate: number;
  clickRate: number;
  clickToOpenRate: number;
  averageTimeToOpen?: number; // seconds
  topLinks?: Array<{
    url: string;
    clicks: number;
    uniqueClicks: number;
  }>;
  deviceBreakdown?: {
    desktop: number;
    mobile: number;
    tablet: number;
    unknown: number;
  };
  locationBreakdown?: Array<{
    country: string;
    opens: number;
    percentage: number;
  }>;
}

/**
 * Recipient engagement score
 */
export interface RecipientEngagement {
  email: string;
  name?: string;
  totalReceived: number;
  totalOpened: number;
  totalClicked: number;
  lastOpenedAt?: Date;
  lastClickedAt?: Date;
  engagementScore: number; // 0-100
  engagementLevel: 'highly_engaged' | 'engaged' | 'passive' | 'at_risk' | 'inactive';
  subscriptionStatus: 'active' | 'unsubscribed' | 'bounced' | 'complained';
}

// ============================================
// Analytics Calculator Functions
// ============================================

/**
 * Calculate email analytics summary from events
 */
export function calculateAnalyticsSummary(
  emails: EmailRecord[],
  period: { start: Date; end: Date }
): EmailAnalyticsSummary {
  const filteredEmails = emails.filter(
    (e) => e.sentAt >= period.start && e.sentAt <= period.end
  );

  const totals = {
    sent: filteredEmails.length,
    delivered: 0,
    opened: 0,
    clicked: 0,
    bounced: 0,
    complained: 0,
    unsubscribed: 0,
    failed: 0,
  };

  // Count events
  for (const email of filteredEmails) {
    for (const event of email.events) {
      switch (event.eventType) {
        case 'delivered':
          totals.delivered++;
          break;
        case 'opened':
          totals.opened++;
          break;
        case 'clicked':
          totals.clicked++;
          break;
        case 'bounced':
          totals.bounced++;
          break;
        case 'complained':
          totals.complained++;
          break;
        case 'unsubscribed':
          totals.unsubscribed++;
          break;
        case 'failed':
          totals.failed++;
          break;
      }
    }
  }

  // Calculate rates
  const rates = {
    deliveryRate: totals.sent > 0 ? totals.delivered / totals.sent : 0,
    openRate: totals.delivered > 0 ? totals.opened / totals.delivered : 0,
    clickRate: totals.opened > 0 ? totals.clicked / totals.opened : 0,
    bounceRate: totals.sent > 0 ? totals.bounced / totals.sent : 0,
    complaintRate: totals.delivered > 0 ? totals.complained / totals.delivered : 0,
    unsubscribeRate: totals.delivered > 0 ? totals.unsubscribed / totals.delivered : 0,
  };

  // Group by template
  const templateMap = new Map<string, {
    templateId: string;
    templateName: string;
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
  }>();

  for (const email of filteredEmails) {
    if (!templateMap.has(email.templateId)) {
      templateMap.set(email.templateId, {
        templateId: email.templateId,
        templateName: email.templateName,
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
      });
    }
    const stats = templateMap.get(email.templateId)!;
    stats.sent++;

    for (const event of email.events) {
      if (event.eventType === 'delivered') stats.delivered++;
      if (event.eventType === 'opened') stats.opened++;
      if (event.eventType === 'clicked') stats.clicked++;
    }
  }

  const byTemplate = Array.from(templateMap.values()).map((t) => ({
    ...t,
    openRate: t.delivered > 0 ? t.opened / t.delivered : 0,
    clickRate: t.opened > 0 ? t.clicked / t.opened : 0,
  }));

  // Group by day
  const dayMap = new Map<string, {
    date: string;
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
  }>();

  for (const email of filteredEmails) {
    const dateKey = email.sentAt.toISOString().split('T')[0] || '';
    if (!dayMap.has(dateKey)) {
      dayMap.set(dateKey, {
        date: dateKey,
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
      });
    }
    const stats = dayMap.get(dateKey);
    if (stats) {
      stats.sent++;

      for (const event of email.events) {
        if (event.eventType === 'delivered') stats.delivered++;
        if (event.eventType === 'opened') stats.opened++;
        if (event.eventType === 'clicked') stats.clicked++;
      }
    }
  }

  const byDay = Array.from(dayMap.values()).sort((a, b) => a.date.localeCompare(b.date));

  return {
    period,
    totals,
    rates,
    byTemplate,
    byDay,
  };
}

/**
 * Calculate template performance metrics
 */
export function calculateTemplatePerformance(
  emails: EmailRecord[],
  templateId: string
): TemplatePerformance | null {
  const templateEmails = emails.filter((e) => e.templateId === templateId);

  const firstEmail = templateEmails[0];
  if (!firstEmail || templateEmails.length === 0) {
    return null;
  }
  const uniqueOpeners = new Set<string>();
  const uniqueClickers = new Set<string>();
  const linkClicks = new Map<string, { total: number; unique: Set<string> }>();
  const devices = { desktop: 0, mobile: 0, tablet: 0, unknown: 0 };
  const countries = new Map<string, number>();

  let totalDelivered = 0;
  let totalOpened = 0;
  let totalClicked = 0;
  let totalOpenTime = 0;
  let openTimeCount = 0;

  for (const email of templateEmails) {
    let wasOpened = false;
    let deliveredAt: Date | null = null;
    let openedAt: Date | null = null;

    for (const event of email.events) {
      switch (event.eventType) {
        case 'delivered':
          totalDelivered++;
          deliveredAt = event.timestamp;
          break;

        case 'opened':
          if (!wasOpened) {
            wasOpened = true;
            uniqueOpeners.add(email.recipientEmail);
          }
          totalOpened++;
          openedAt = event.timestamp;

          // Calculate time to open
          if (deliveredAt && openedAt) {
            const timeToOpen = (openedAt.getTime() - deliveredAt.getTime()) / 1000;
            totalOpenTime += timeToOpen;
            openTimeCount++;
          }

          // Track device
          if (event.metadata?.userAgent) {
            const ua = event.metadata.userAgent.toLowerCase();
            if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
              devices.mobile++;
            } else if (ua.includes('tablet') || ua.includes('ipad')) {
              devices.tablet++;
            } else if (ua.includes('windows') || ua.includes('macintosh') || ua.includes('linux')) {
              devices.desktop++;
            } else {
              devices.unknown++;
            }
          }

          // Track location
          if (event.metadata?.location?.country) {
            const country = event.metadata.location.country;
            countries.set(country, (countries.get(country) || 0) + 1);
          }
          break;

        case 'clicked':
          uniqueClickers.add(email.recipientEmail);
          totalClicked++;

          // Track link clicks
          if (event.metadata?.linkUrl) {
            const url = event.metadata.linkUrl;
            if (!linkClicks.has(url)) {
              linkClicks.set(url, { total: 0, unique: new Set() });
            }
            const link = linkClicks.get(url)!;
            link.total++;
            link.unique.add(email.recipientEmail);
          }
          break;
      }
    }
  }

  const uniqueOpens = uniqueOpeners.size;
  const uniqueClicks = uniqueClickers.size;

  // Sort links by clicks
  const topLinks = Array.from(linkClicks.entries())
    .map(([url, data]) => ({
      url,
      clicks: data.total,
      uniqueClicks: data.unique.size,
    }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 10);

  // Sort countries by opens
  const totalLocationOpens = Array.from(countries.values()).reduce((a, b) => a + b, 0);
  const locationBreakdown = Array.from(countries.entries())
    .map(([country, opens]) => ({
      country,
      opens,
      percentage: totalLocationOpens > 0 ? opens / totalLocationOpens : 0,
    }))
    .sort((a, b) => b.opens - a.opens)
    .slice(0, 10);

  return {
    templateId,
    templateName: firstEmail.templateName,
    totalSent: templateEmails.length,
    totalDelivered,
    totalOpened,
    totalClicked,
    uniqueOpens,
    uniqueClicks,
    openRate: totalDelivered > 0 ? uniqueOpens / totalDelivered : 0,
    clickRate: totalDelivered > 0 ? uniqueClicks / totalDelivered : 0,
    clickToOpenRate: uniqueOpens > 0 ? uniqueClicks / uniqueOpens : 0,
    averageTimeToOpen: openTimeCount > 0 ? totalOpenTime / openTimeCount : undefined,
    topLinks: topLinks.length > 0 ? topLinks : undefined,
    deviceBreakdown: devices,
    locationBreakdown: locationBreakdown.length > 0 ? locationBreakdown : undefined,
  };
}

/**
 * Calculate recipient engagement score
 */
export function calculateRecipientEngagement(
  emails: EmailRecord[],
  recipientEmail: string
): RecipientEngagement {
  const recipientEmails = emails.filter((e) => e.recipientEmail === recipientEmail);

  const firstEmail = recipientEmails[0];
  if (!firstEmail || recipientEmails.length === 0) {
    return {
      email: recipientEmail,
      totalReceived: 0,
      totalOpened: 0,
      totalClicked: 0,
      engagementScore: 0,
      engagementLevel: 'inactive',
      subscriptionStatus: 'active',
    };
  }
  let totalOpened = 0;
  let totalClicked = 0;
  let lastOpenedAt: Date | undefined;
  let lastClickedAt: Date | undefined;
  let subscriptionStatus: RecipientEngagement['subscriptionStatus'] = 'active';

  // Look at last 90 days of activity
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  let recentOpens = 0;
  let recentEmails = 0;

  for (const email of recipientEmails) {
    const isRecent = email.sentAt >= ninetyDaysAgo;
    if (isRecent) recentEmails++;

    for (const event of email.events) {
      switch (event.eventType) {
        case 'opened':
          totalOpened++;
          if (isRecent) recentOpens++;
          if (!lastOpenedAt || event.timestamp > lastOpenedAt) {
            lastOpenedAt = event.timestamp;
          }
          break;
        case 'clicked':
          totalClicked++;
          if (!lastClickedAt || event.timestamp > lastClickedAt) {
            lastClickedAt = event.timestamp;
          }
          break;
        case 'bounced':
          subscriptionStatus = 'bounced';
          break;
        case 'complained':
          subscriptionStatus = 'complained';
          break;
        case 'unsubscribed':
          subscriptionStatus = 'unsubscribed';
          break;
      }
    }
  }

  // Calculate engagement score (0-100)
  // Factors: open rate, click rate, recency of engagement
  const openRate = recipientEmails.length > 0 ? totalOpened / recipientEmails.length : 0;
  const clickRate = totalOpened > 0 ? totalClicked / totalOpened : 0;
  const recentOpenRate = recentEmails > 0 ? recentOpens / recentEmails : 0;

  // Recency bonus: more recent engagement = higher score
  let recencyBonus = 0;
  if (lastOpenedAt) {
    const daysSinceOpen = (Date.now() - lastOpenedAt.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceOpen < 7) recencyBonus = 30;
    else if (daysSinceOpen < 30) recencyBonus = 20;
    else if (daysSinceOpen < 90) recencyBonus = 10;
  }

  const engagementScore = Math.min(100, Math.round(
    (openRate * 30) + // Open rate contribution (max 30)
    (clickRate * 20) + // Click rate contribution (max 20)
    (recentOpenRate * 20) + // Recent engagement (max 20)
    recencyBonus // Recency bonus (max 30)
  ));

  // Determine engagement level
  let engagementLevel: RecipientEngagement['engagementLevel'];
  if (subscriptionStatus !== 'active') {
    engagementLevel = 'inactive';
  } else if (engagementScore >= 70) {
    engagementLevel = 'highly_engaged';
  } else if (engagementScore >= 50) {
    engagementLevel = 'engaged';
  } else if (engagementScore >= 25) {
    engagementLevel = 'passive';
  } else if (engagementScore > 0) {
    engagementLevel = 'at_risk';
  } else {
    engagementLevel = 'inactive';
  }

  return {
    email: recipientEmail,
    name: firstEmail.recipientName,
    totalReceived: recipientEmails.length,
    totalOpened,
    totalClicked,
    lastOpenedAt,
    lastClickedAt,
    engagementScore,
    engagementLevel,
    subscriptionStatus,
  };
}

// ============================================
// Webhook Event Processing
// ============================================

/**
 * Process incoming webhook event from email provider (e.g., Resend)
 */
export function processWebhookEvent(
  webhookPayload: ResendWebhookPayload
): EmailEvent | null {
  const eventTypeMap: Record<string, EmailEventType> = {
    'email.sent': 'sent',
    'email.delivered': 'delivered',
    'email.opened': 'opened',
    'email.clicked': 'clicked',
    'email.bounced': 'bounced',
    'email.complained': 'complained',
  };

  const eventType = eventTypeMap[webhookPayload.type];
  if (!eventType) {
    return null;
  }

  return {
    id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    emailId: webhookPayload.data.email_id,
    eventType,
    timestamp: new Date(webhookPayload.created_at),
    metadata: {
      userAgent: webhookPayload.data.user_agent,
      ipAddress: webhookPayload.data.ip,
      linkUrl: webhookPayload.data.click?.link,
      bounceType: webhookPayload.data.bounce?.type as 'hard' | 'soft' | undefined,
      bounceReason: webhookPayload.data.bounce?.message,
    },
  };
}

/**
 * Resend webhook payload type
 */
export interface ResendWebhookPayload {
  type: string;
  created_at: string;
  data: {
    email_id: string;
    from: string;
    to: string[];
    subject: string;
    user_agent?: string;
    ip?: string;
    click?: {
      link: string;
      timestamp: string;
    };
    bounce?: {
      type: string;
      message: string;
    };
  };
}

// ============================================
// Export Analytics Dashboard Data
// ============================================

export interface DashboardAnalytics {
  overview: {
    totalSent: number;
    deliveryRate: number;
    openRate: number;
    clickRate: number;
    trend: {
      sent: number; // percentage change
      deliveryRate: number;
      openRate: number;
      clickRate: number;
    };
  };
  recentEmails: Array<{
    id: string;
    subject: string;
    recipientEmail: string;
    templateName: string;
    sentAt: Date;
    status: EmailRecord['status'];
  }>;
  topTemplates: Array<{
    templateId: string;
    templateName: string;
    sent: number;
    openRate: number;
  }>;
  engagementBreakdown: {
    highly_engaged: number;
    engaged: number;
    passive: number;
    at_risk: number;
    inactive: number;
  };
}

/**
 * Generate dashboard analytics data
 */
export function generateDashboardAnalytics(
  emails: EmailRecord[],
  previousPeriodEmails: EmailRecord[]
): DashboardAnalytics {
  const currentSummary = calculateAnalyticsSummary(emails, {
    start: new Date(0),
    end: new Date(),
  });
  const previousSummary = calculateAnalyticsSummary(previousPeriodEmails, {
    start: new Date(0),
    end: new Date(),
  });

  // Calculate trends
  const calculateTrend = (current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const overview = {
    totalSent: currentSummary.totals.sent,
    deliveryRate: currentSummary.rates.deliveryRate,
    openRate: currentSummary.rates.openRate,
    clickRate: currentSummary.rates.clickRate,
    trend: {
      sent: calculateTrend(currentSummary.totals.sent, previousSummary.totals.sent),
      deliveryRate: calculateTrend(currentSummary.rates.deliveryRate, previousSummary.rates.deliveryRate),
      openRate: calculateTrend(currentSummary.rates.openRate, previousSummary.rates.openRate),
      clickRate: calculateTrend(currentSummary.rates.clickRate, previousSummary.rates.clickRate),
    },
  };

  // Recent emails
  const recentEmails = emails
    .sort((a, b) => b.sentAt.getTime() - a.sentAt.getTime())
    .slice(0, 10)
    .map((e) => ({
      id: e.id,
      subject: e.subject,
      recipientEmail: e.recipientEmail,
      templateName: e.templateName,
      sentAt: e.sentAt,
      status: e.status,
    }));

  // Top templates by open rate
  const topTemplates = currentSummary.byTemplate
    .filter((t) => t.sent >= 10) // Only templates with meaningful volume
    .sort((a, b) => b.openRate - a.openRate)
    .slice(0, 5)
    .map((t) => ({
      templateId: t.templateId,
      templateName: t.templateName,
      sent: t.sent,
      openRate: t.openRate,
    }));

  // Calculate engagement breakdown
  const uniqueRecipients = new Set(emails.map((e) => e.recipientEmail));
  const engagementBreakdown = {
    highly_engaged: 0,
    engaged: 0,
    passive: 0,
    at_risk: 0,
    inactive: 0,
  };

  for (const email of uniqueRecipients) {
    const engagement = calculateRecipientEngagement(emails, email);
    engagementBreakdown[engagement.engagementLevel]++;
  }

  return {
    overview,
    recentEmails,
    topTemplates,
    engagementBreakdown,
  };
}
