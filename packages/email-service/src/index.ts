import { Resend } from 'resend';
import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  DonationReceiptEmail,
  getDonationReceiptEmailText,
} from './templates/donation-receipt';
import {
  AnnualStatementEmail,
  getAnnualStatementEmailText,
} from './templates/annual-statement';

// Initialize Resend - API key should be set in environment
const resend = new Resend(process.env.RESEND_API_KEY);

// Default from email - should be configured per organization
const DEFAULT_FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@acts29ministry.org';

export interface SendDonationReceiptEmailParams {
  to: string;
  organization: {
    name: string;
    address: string;
    phone: string;
    email: string;
    ein: string;
  };
  donor: {
    name: string;
    email: string;
  };
  donation: {
    id: string;
    date: string;
    type: 'monetary' | 'goods' | 'time';
    amount?: number;
    description?: string;
    feeAmount?: number;
    totalAmount?: number;
  };
  receiptNumber: string;
  pdfAttachment?: {
    filename: string;
    content: Buffer;
  };
}

export interface SendAnnualStatementEmailParams {
  to: string;
  organization: {
    name: string;
    address: string;
    phone: string;
    email: string;
    ein: string;
  };
  donor: {
    name: string;
    email: string;
  };
  donations: Array<{
    id: string;
    date: string;
    type: 'monetary' | 'goods' | 'time';
    description?: string;
    amount?: number;
    totalAmount?: number;
  }>;
  taxYear: number;
  statementNumber: string;
  totalAmount: number;
  pdfAttachment?: {
    filename: string;
    content: Buffer;
  };
}

export interface EmailResult {
  success: boolean;
  id?: string;
  error?: string;
}

/**
 * Send a donation receipt email
 */
export async function sendDonationReceiptEmail(
  params: SendDonationReceiptEmailParams
): Promise<EmailResult> {
  try {
    const { to, organization, donor, donation, receiptNumber, pdfAttachment } = params;

    const emailProps = { organization, donor, donation, receiptNumber };
    const htmlContent = renderToStaticMarkup(
      React.createElement(DonationReceiptEmail, emailProps)
    );
    const textContent = getDonationReceiptEmailText(emailProps);

    const attachments = pdfAttachment
      ? [
          {
            filename: pdfAttachment.filename,
            content: pdfAttachment.content,
          },
        ]
      : undefined;

    const { data, error } = await resend.emails.send({
      from: `${organization.name} <${DEFAULT_FROM_EMAIL}>`,
      to: [to],
      subject: `Donation Receipt - ${organization.name}`,
      html: htmlContent,
      text: textContent,
      attachments,
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (err) {
    console.error('Email send error:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

/**
 * Send an annual contribution statement email
 */
export async function sendAnnualStatementEmail(
  params: SendAnnualStatementEmailParams
): Promise<EmailResult> {
  try {
    const {
      to,
      organization,
      donor,
      donations,
      taxYear,
      statementNumber,
      totalAmount,
      pdfAttachment,
    } = params;

    const emailProps = {
      organization,
      donor,
      donations,
      taxYear,
      statementNumber,
      totalAmount,
    };
    const htmlContent = renderToStaticMarkup(
      React.createElement(AnnualStatementEmail, emailProps)
    );
    const textContent = getAnnualStatementEmailText(emailProps);

    const attachments = pdfAttachment
      ? [
          {
            filename: pdfAttachment.filename,
            content: pdfAttachment.content,
          },
        ]
      : undefined;

    const { data, error } = await resend.emails.send({
      from: `${organization.name} <${DEFAULT_FROM_EMAIL}>`,
      to: [to],
      subject: `${taxYear} Annual Contribution Statement - ${organization.name}`,
      html: htmlContent,
      text: textContent,
      attachments,
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (err) {
    console.error('Email send error:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

/**
 * Generate a unique receipt number
 */
export function generateReceiptNumber(prefix: string = 'RCP'): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

/**
 * Generate a unique statement number
 */
export function generateStatementNumber(taxYear: number, prefix: string = 'STM'): string {
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${taxYear}-${random}`;
}

// Re-export templates for use in other contexts
export { DonationReceiptEmail, getDonationReceiptEmailText } from './templates/donation-receipt';
export { AnnualStatementEmail, getAnnualStatementEmailText } from './templates/annual-statement';
export {
  NewsletterEmail,
  getNewsletterEmailText,
  WelcomeEmail,
  getWelcomeEmailText,
  DonorUpdateEmail,
  getDonorUpdateEmailText,
  EventReminderEmail as NewsletterEventReminderEmail,
  getEventReminderEmailText as getNewsletterEventReminderEmailText,
} from './templates/newsletter';

// New notification email templates
export {
  ShiftReminderEmail,
  getShiftReminderEmailText,
} from './templates/shift-reminder';

export {
  EventRegistrationEmail,
  getEventRegistrationEmailText,
  EventReminderEmail,
  getEventReminderEmailText,
} from './templates/event-emails';

export {
  VolunteerDigestEmail,
  getVolunteerDigestEmailText,
} from './templates/volunteer-digest';

export {
  CaseUpdateEmail,
  getCaseUpdateEmailText,
} from './templates/case-update';

export {
  PrayerReceivedEmail,
  getPrayerReceivedEmailText,
  PrayerUpdateEmail,
  getPrayerUpdateEmailText,
} from './templates/prayer-update';

// ============================================
// Email Analytics
// ============================================

export {
  // Types
  type EmailEventType,
  type EmailEvent,
  type EmailRecord,
  type EmailAnalyticsSummary,
  type TemplatePerformance,
  type RecipientEngagement,
  type ResendWebhookPayload,
  type DashboardAnalytics,
  // Functions
  calculateAnalyticsSummary,
  calculateTemplatePerformance,
  calculateRecipientEngagement,
  processWebhookEvent,
  generateDashboardAnalytics,
} from './analytics';

// ============================================
// Newsletter & Subscriber Management
// ============================================

export interface Subscriber {
  id: string;
  email: string;
  name?: string;
  subscribedAt: Date;
  status: 'active' | 'unsubscribed' | 'bounced';
  lists: string[]; // e.g., ['newsletter', 'donor-updates', 'event-reminders']
}

export interface SendNewsletterParams {
  to: string;
  organization: {
    name: string;
    address: string;
    phone: string;
    email: string;
    websiteUrl: string;
  };
  subscriber: {
    name?: string;
    email: string;
  };
  newsletter: {
    subject: string;
    preheader?: string;
    sections: Array<{
      type: 'heading' | 'text' | 'image' | 'button' | 'divider' | 'event' | 'donation-cta';
      content: string;
      imageUrl?: string;
      buttonUrl?: string;
      buttonText?: string;
      eventDate?: string;
      eventLocation?: string;
    }>;
  };
  unsubscribeUrl: string;
}

export interface SendWelcomeEmailParams {
  to: string;
  organization: {
    name: string;
    address: string;
    websiteUrl: string;
  };
  subscriber: {
    name?: string;
    email: string;
  };
  unsubscribeUrl: string;
}

export interface SendDonorUpdateParams {
  to: string;
  organization: {
    name: string;
    address: string;
    websiteUrl: string;
  };
  donor: {
    name: string;
    email: string;
  };
  update: {
    title: string;
    message: string;
    impactStats?: Array<{ label: string; value: string }>;
    storyTitle?: string;
    storyContent?: string;
    ctaText?: string;
    ctaUrl?: string;
  };
  unsubscribeUrl: string;
}

export interface SendEventReminderParams {
  to: string;
  organization: {
    name: string;
    websiteUrl: string;
  };
  recipient: {
    name?: string;
    email: string;
  };
  event: {
    title: string;
    date: string;
    time: string;
    location: string;
    description?: string;
    calendarUrl?: string;
  };
  unsubscribeUrl: string;
}

import {
  NewsletterEmail,
  getNewsletterEmailText,
  WelcomeEmail,
  getWelcomeEmailText,
  DonorUpdateEmail,
  getDonorUpdateEmailText,
  EventReminderEmail,
  getEventReminderEmailText,
} from './templates/newsletter';

/**
 * Send a newsletter to a subscriber
 */
export async function sendNewsletter(
  params: SendNewsletterParams
): Promise<EmailResult> {
  try {
    const { to, organization, subscriber, newsletter, unsubscribeUrl } = params;

    const emailProps = { organization, subscriber, newsletter, unsubscribeUrl };
    const htmlContent = renderToStaticMarkup(
      React.createElement(NewsletterEmail, emailProps)
    );
    const textContent = getNewsletterEmailText(emailProps);

    const { data, error } = await resend.emails.send({
      from: `${organization.name} <${DEFAULT_FROM_EMAIL}>`,
      to: [to],
      subject: newsletter.subject,
      html: htmlContent,
      text: textContent,
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (err) {
    console.error('Newsletter send error:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

/**
 * Send a welcome email to a new subscriber
 */
export async function sendWelcomeEmail(
  params: SendWelcomeEmailParams
): Promise<EmailResult> {
  try {
    const { to, organization, subscriber, unsubscribeUrl } = params;

    const emailProps = { organization, subscriber, unsubscribeUrl };
    const htmlContent = renderToStaticMarkup(
      React.createElement(WelcomeEmail, emailProps)
    );
    const textContent = getWelcomeEmailText(emailProps);

    const { data, error } = await resend.emails.send({
      from: `${organization.name} <${DEFAULT_FROM_EMAIL}>`,
      to: [to],
      subject: `Welcome to ${organization.name}!`,
      html: htmlContent,
      text: textContent,
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (err) {
    console.error('Welcome email send error:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

/**
 * Send a donor update email
 */
export async function sendDonorUpdate(
  params: SendDonorUpdateParams
): Promise<EmailResult> {
  try {
    const { to, organization, donor, update, unsubscribeUrl } = params;

    const emailProps = { organization, donor, update, unsubscribeUrl };
    const htmlContent = renderToStaticMarkup(
      React.createElement(DonorUpdateEmail, emailProps)
    );
    const textContent = getDonorUpdateEmailText(emailProps);

    const { data, error } = await resend.emails.send({
      from: `${organization.name} <${DEFAULT_FROM_EMAIL}>`,
      to: [to],
      subject: update.title,
      html: htmlContent,
      text: textContent,
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (err) {
    console.error('Donor update send error:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

/**
 * Send an event reminder email
 */
export async function sendEventReminderEmail(
  params: SendEventReminderParams
): Promise<EmailResult> {
  try {
    const { to, organization, recipient, event, unsubscribeUrl } = params;

    const emailProps = { organization, recipient, event, unsubscribeUrl };
    const htmlContent = renderToStaticMarkup(
      React.createElement(EventReminderEmail, emailProps)
    );
    const textContent = getEventReminderEmailText(emailProps);

    const { data, error } = await resend.emails.send({
      from: `${organization.name} <${DEFAULT_FROM_EMAIL}>`,
      to: [to],
      subject: `Reminder: ${event.title}`,
      html: htmlContent,
      text: textContent,
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (err) {
    console.error('Event reminder send error:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}
