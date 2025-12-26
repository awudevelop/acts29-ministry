import { parseTemplateVariables } from '../index';
import type { ActionConfig } from '../index';

// ============================================
// Email Template Types
// ============================================

export type EmailTemplateType =
  | 'donation_receipt'
  | 'annual_statement'
  | 'welcome'
  | 'newsletter'
  | 'donor_update'
  | 'event_reminder'
  | 'event_registration'
  | 'shift_reminder'
  | 'volunteer_digest'
  | 'case_update'
  | 'prayer_received'
  | 'prayer_update'
  | 'custom';

export interface EmailExecutorConfig {
  to: string;
  subject: string;
  templateId?: EmailTemplateType;
  body?: string;
  replyTo?: string;
  cc?: string[];
  bcc?: string[];
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
  }>;
}

export interface EmailExecutorResult {
  success: boolean;
  emailId?: string;
  error?: string;
  recipientEmail?: string;
  templateUsed?: string;
}

// ============================================
// Template Data Mappers
// ============================================

/**
 * Maps automation trigger data to email template props
 * Each template has specific props it expects
 */
export function mapTriggerDataToTemplateProps(
  templateId: EmailTemplateType,
  triggerData: Record<string, unknown>,
  organizationData: OrganizationData
): Record<string, unknown> {
  switch (templateId) {
    case 'donation_receipt':
      return {
        organization: organizationData,
        donor: {
          name: triggerData.donorName || 'Valued Donor',
          email: triggerData.donorEmail,
        },
        donation: {
          id: triggerData.donationId,
          date: triggerData.donationDate || new Date().toISOString(),
          type: triggerData.donationType || 'monetary',
          amount: triggerData.amount,
          description: triggerData.description,
        },
        receiptNumber: triggerData.receiptNumber || generateReceiptNumber(),
      };

    case 'shift_reminder':
      return {
        organization: organizationData,
        volunteer: {
          name: triggerData.volunteerName,
          email: triggerData.volunteerEmail,
        },
        shift: {
          id: triggerData.shiftId,
          title: triggerData.shiftTitle,
          date: triggerData.shiftDate,
          startTime: triggerData.shiftTime || triggerData.shiftStartTime,
          endTime: triggerData.shiftEndTime,
          location: triggerData.shiftLocation,
          description: triggerData.shiftDescription,
          teamName: triggerData.teamName,
          contactName: triggerData.contactName,
          contactPhone: triggerData.contactPhone,
        },
        reminderType: (triggerData.hoursUntilShift as number) <= 2 ? '2h' : '24h',
        calendarUrl: triggerData.calendarUrl,
      };

    case 'event_registration':
      return {
        organization: organizationData,
        attendee: {
          name: triggerData.attendeeName,
          email: triggerData.attendeeEmail,
        },
        event: {
          id: triggerData.eventId,
          title: triggerData.eventTitle,
          date: triggerData.eventDate,
          time: triggerData.eventTime,
          location: triggerData.eventLocation,
          description: triggerData.eventDescription,
        },
        registration: {
          confirmationNumber: triggerData.confirmationNumber || generateConfirmationNumber(),
          ticketCount: triggerData.ticketCount || 1,
          registeredAt: new Date().toISOString(),
        },
      };

    case 'event_reminder':
      return {
        organization: organizationData,
        attendee: {
          name: triggerData.attendeeName,
          email: triggerData.attendeeEmail,
        },
        event: {
          id: triggerData.eventId,
          title: triggerData.eventTitle,
          date: triggerData.eventDate,
          time: triggerData.eventTime,
          location: triggerData.eventLocation,
          description: triggerData.eventDescription,
          parkingInfo: triggerData.parkingInfo,
          whatToBring: triggerData.whatToBring,
        },
        reminderType: (triggerData.hoursUntilEvent as number) <= 1 ? '1h' : '24h',
      };

    case 'volunteer_digest':
      return {
        organization: organizationData,
        volunteer: {
          name: triggerData.volunteerName,
          email: triggerData.volunteerEmail,
        },
        period: triggerData.period || 'weekly',
        stats: {
          hoursLogged: triggerData.hoursLogged || 0,
          shiftsCompleted: triggerData.shiftsCompleted || 0,
          upcomingShifts: triggerData.upcomingShiftsCount || 0,
          impactScore: triggerData.impactScore,
        },
        upcomingShifts: triggerData.upcomingShifts || [],
        openOpportunities: triggerData.openOpportunities || [],
        teamUpdates: triggerData.teamUpdates || [],
      };

    case 'case_update':
      return {
        organization: organizationData,
        client: {
          name: triggerData.clientName,
          email: triggerData.clientEmail,
        },
        caseDetails: {
          id: triggerData.caseId,
          previousStatus: triggerData.previousStatus,
          newStatus: triggerData.newStatus,
        },
        update: {
          message: triggerData.updateMessage,
          appointments: triggerData.appointments || [],
          referrals: triggerData.referrals || [],
          nextSteps: triggerData.nextSteps || [],
        },
        caseWorker: {
          name: triggerData.caseWorkerName,
          email: triggerData.caseWorkerEmail,
          phone: triggerData.caseWorkerPhone,
        },
      };

    case 'prayer_received':
      return {
        organization: organizationData,
        requester: {
          name: triggerData.requesterName || 'Friend',
          email: triggerData.requesterEmail,
        },
        prayerRequest: {
          id: triggerData.prayerId,
          request: triggerData.request,
          submittedAt: new Date().toISOString(),
          isPrivate: triggerData.isAnonymous || false,
        },
        prayerTeamSize: triggerData.prayerTeamSize,
      };

    case 'prayer_update':
      return {
        organization: organizationData,
        requester: {
          name: triggerData.requesterName || 'Friend',
          email: triggerData.requesterEmail,
        },
        prayerRequest: {
          id: triggerData.prayerId,
          originalRequest: triggerData.request,
          submittedAt: triggerData.submittedAt,
        },
        update: {
          type: triggerData.updateType || 'praying',
          message: triggerData.updateMessage,
          scripture: triggerData.scripture,
          prayerCount: triggerData.prayerCount,
        },
      };

    case 'welcome':
      return {
        organization: organizationData,
        subscriber: {
          name: triggerData.name,
          email: triggerData.email,
        },
      };

    case 'donor_update':
      return {
        organization: organizationData,
        donor: {
          name: triggerData.donorName,
          email: triggerData.donorEmail,
        },
        update: {
          title: triggerData.updateTitle,
          message: triggerData.updateMessage,
          impactStats: triggerData.impactStats,
          storyTitle: triggerData.storyTitle,
          storyContent: triggerData.storyContent,
          ctaText: triggerData.ctaText,
          ctaUrl: triggerData.ctaUrl,
        },
      };

    case 'newsletter':
      return {
        organization: organizationData,
        subscriber: {
          name: triggerData.subscriberName,
          email: triggerData.subscriberEmail || triggerData.email,
        },
        newsletter: {
          subject: triggerData.subject,
          preheader: triggerData.preheader,
          sections: triggerData.sections || [],
        },
      };

    case 'custom':
    default:
      return triggerData;
  }
}

// ============================================
// Organization Data
// ============================================

export interface OrganizationData {
  name: string;
  address: string;
  phone: string;
  email: string;
  ein?: string;
  websiteUrl?: string;
}

// Default organization for development/fallback
const DEFAULT_ORGANIZATION: OrganizationData = {
  name: 'Acts 29 Ministry',
  address: '123 Ministry Lane, Springfield, IL 62701',
  phone: '(217) 555-0129',
  email: 'contact@acts29ministry.org',
  ein: '12-3456789',
  websiteUrl: 'https://acts29ministry.org',
};

// ============================================
// Helper Functions
// ============================================

function generateReceiptNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `RCP-${timestamp}-${random}`;
}

function generateConfirmationNumber(): string {
  const random = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `EVT-${random}`;
}

// ============================================
// Email Executor Class
// ============================================

export class EmailExecutor {
  private organizationData: OrganizationData;
  private emailService: EmailServiceAdapter;

  constructor(
    emailService: EmailServiceAdapter,
    organizationData?: OrganizationData
  ) {
    this.emailService = emailService;
    this.organizationData = organizationData || DEFAULT_ORGANIZATION;
  }

  /**
   * Execute an email action from an automation step
   */
  async execute(
    actionConfig: ActionConfig,
    triggerData: Record<string, unknown>
  ): Promise<EmailExecutorResult> {
    const config = actionConfig.config as unknown as EmailExecutorConfig;

    // Parse template variables in recipient and subject
    const to = parseTemplateVariables(config.to, triggerData);
    const subject = parseTemplateVariables(config.subject, triggerData);
    const replyTo = config.replyTo
      ? parseTemplateVariables(config.replyTo, triggerData)
      : undefined;

    // Validate email address
    if (!to || !isValidEmail(to)) {
      return {
        success: false,
        error: `Invalid or missing recipient email: ${to}`,
      };
    }

    try {
      // If using a template, map the trigger data to template props
      if (config.templateId && config.templateId !== 'custom') {
        const templateProps = mapTriggerDataToTemplateProps(
          config.templateId,
          triggerData,
          this.organizationData
        );

        const result = await this.emailService.sendTemplatedEmail({
          to,
          subject,
          templateId: config.templateId,
          templateProps,
          replyTo,
          cc: config.cc,
          bcc: config.bcc,
          attachments: config.attachments,
        });

        return {
          success: result.success,
          emailId: result.id,
          error: result.error,
          recipientEmail: to,
          templateUsed: config.templateId,
        };
      } else {
        // Custom email with body text
        const body = config.body
          ? parseTemplateVariables(config.body, triggerData)
          : '';

        const result = await this.emailService.sendCustomEmail({
          to,
          subject,
          body,
          replyTo,
          cc: config.cc,
          bcc: config.bcc,
          attachments: config.attachments,
        });

        return {
          success: result.success,
          emailId: result.id,
          error: result.error,
          recipientEmail: to,
          templateUsed: 'custom',
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        recipientEmail: to,
        templateUsed: config.templateId,
      };
    }
  }

  /**
   * Get supported email templates
   */
  static getSupportedTemplates(): Array<{
    id: EmailTemplateType;
    name: string;
    description: string;
    category: string;
  }> {
    return [
      {
        id: 'donation_receipt',
        name: 'Donation Receipt',
        description: 'Tax-deductible receipt for donations',
        category: 'Donations',
      },
      {
        id: 'annual_statement',
        name: 'Annual Statement',
        description: 'Year-end contribution summary',
        category: 'Donations',
      },
      {
        id: 'welcome',
        name: 'Welcome Email',
        description: 'Welcome message for new subscribers',
        category: 'Marketing',
      },
      {
        id: 'newsletter',
        name: 'Newsletter',
        description: 'General newsletter template',
        category: 'Marketing',
      },
      {
        id: 'donor_update',
        name: 'Donor Update',
        description: 'Impact update for donors',
        category: 'Donations',
      },
      {
        id: 'event_reminder',
        name: 'Event Reminder',
        description: 'Reminder before events',
        category: 'Events',
      },
      {
        id: 'event_registration',
        name: 'Event Registration',
        description: 'Registration confirmation',
        category: 'Events',
      },
      {
        id: 'shift_reminder',
        name: 'Shift Reminder',
        description: 'Volunteer shift reminders',
        category: 'Volunteers',
      },
      {
        id: 'volunteer_digest',
        name: 'Volunteer Digest',
        description: 'Weekly/monthly volunteer summary',
        category: 'Volunteers',
      },
      {
        id: 'case_update',
        name: 'Case Update',
        description: 'Case status notifications',
        category: 'Cases',
      },
      {
        id: 'prayer_received',
        name: 'Prayer Received',
        description: 'Prayer request confirmation',
        category: 'Prayer',
      },
      {
        id: 'prayer_update',
        name: 'Prayer Update',
        description: 'Prayer request updates',
        category: 'Prayer',
      },
      {
        id: 'custom',
        name: 'Custom Email',
        description: 'Custom message with variables',
        category: 'General',
      },
    ];
  }
}

// ============================================
// Email Service Adapter Interface
// ============================================

/**
 * Interface for email service integration
 * Implement this to connect to actual email-service package
 */
export interface EmailServiceAdapter {
  sendTemplatedEmail(params: {
    to: string;
    subject: string;
    templateId: EmailTemplateType;
    templateProps: Record<string, unknown>;
    replyTo?: string;
    cc?: string[];
    bcc?: string[];
    attachments?: Array<{ filename: string; content: Buffer | string }>;
  }): Promise<{ success: boolean; id?: string; error?: string }>;

  sendCustomEmail(params: {
    to: string;
    subject: string;
    body: string;
    replyTo?: string;
    cc?: string[];
    bcc?: string[];
    attachments?: Array<{ filename: string; content: Buffer | string }>;
  }): Promise<{ success: boolean; id?: string; error?: string }>;
}

// ============================================
// Validation Helpers
// ============================================

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ============================================
// Create Email Service Adapter from @acts29/email-service
// ============================================

/**
 * Factory function to create an EmailServiceAdapter from the email-service package
 * This bridges the automation-service to the actual email sending implementation
 */
export function createEmailServiceAdapter(): EmailServiceAdapter {
  // This would be imported from @acts29/email-service in actual implementation
  // For now, we define the adapter interface that connects them

  return {
    async sendTemplatedEmail(params) {
      // In real implementation, this would:
      // 1. Import the correct template component from email-service
      // 2. Call the corresponding send function (sendDonationReceiptEmail, etc.)
      // 3. Return the result

      // Example pseudo-code:
      // const { sendDonationReceiptEmail, sendShiftReminderEmail, ... } = await import('@acts29/email-service');
      // switch (params.templateId) {
      //   case 'donation_receipt':
      //     return sendDonationReceiptEmail(params.templateProps);
      //   case 'shift_reminder':
      //     return sendShiftReminderEmail(params.templateProps);
      //   ...
      // }

      console.log(`[Email Executor] Would send templated email:`, {
        to: params.to,
        template: params.templateId,
      });

      return {
        success: true,
        id: `email_${Date.now()}`,
      };
    },

    async sendCustomEmail(params) {
      // In real implementation, this would use Resend to send a custom email
      console.log(`[Email Executor] Would send custom email:`, {
        to: params.to,
        subject: params.subject,
      });

      return {
        success: true,
        id: `email_${Date.now()}`,
      };
    },
  };
}
