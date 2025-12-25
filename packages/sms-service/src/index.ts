import Twilio from 'twilio';

// Initialize Twilio client - credentials should be set in environment
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

// Create client only when credentials are available
const getClient = () => {
  if (!accountSid || !authToken) {
    throw new Error('Twilio credentials not configured');
  }
  return Twilio(accountSid, authToken);
};

export interface SMSResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface SendSMSParams {
  to: string;
  message: string;
}

/**
 * Send a single SMS message
 */
export async function sendSMS(params: SendSMSParams): Promise<SMSResult> {
  try {
    if (!fromNumber) {
      throw new Error('Twilio phone number not configured');
    }

    const client = getClient();
    const message = await client.messages.create({
      body: params.message,
      from: fromNumber,
      to: params.to,
    });

    return { success: true, messageId: message.sid };
  } catch (err) {
    console.error('SMS send error:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

/**
 * Send SMS to multiple recipients
 */
export async function sendBulkSMS(
  recipients: string[],
  message: string
): Promise<{ sent: number; failed: number; results: SMSResult[] }> {
  const results: SMSResult[] = [];
  let sent = 0;
  let failed = 0;

  for (const to of recipients) {
    const result = await sendSMS({ to, message });
    results.push(result);
    if (result.success) {
      sent++;
    } else {
      failed++;
    }
  }

  return { sent, failed, results };
}

// ============================================
// Shift Reminders
// ============================================

export interface ShiftReminderParams {
  volunteerName: string;
  volunteerPhone: string;
  shiftTitle: string;
  shiftDate: string;
  shiftTime: string;
  shiftLocation: string;
}

/**
 * Send a shift reminder to a volunteer
 */
export async function sendShiftReminder(
  params: ShiftReminderParams
): Promise<SMSResult> {
  const message = getShiftReminderMessage(params);
  return sendSMS({ to: params.volunteerPhone, message });
}

export function getShiftReminderMessage(params: ShiftReminderParams): string {
  return `Hi ${params.volunteerName}! Reminder: You're scheduled for "${params.shiftTitle}" on ${params.shiftDate} at ${params.shiftTime}. Location: ${params.shiftLocation}. Reply HELP for assistance or STOP to unsubscribe.`;
}

// ============================================
// Emergency Alerts
// ============================================

export interface EmergencyAlertParams {
  alertType: 'weather' | 'safety' | 'resource' | 'general';
  title: string;
  message: string;
  actionRequired?: string;
}

/**
 * Send an emergency alert to a list of recipients
 */
export async function sendEmergencyAlert(
  recipients: string[],
  params: EmergencyAlertParams
): Promise<{ sent: number; failed: number }> {
  const message = getEmergencyAlertMessage(params);
  const result = await sendBulkSMS(recipients, message);
  return { sent: result.sent, failed: result.failed };
}

export function getEmergencyAlertMessage(params: EmergencyAlertParams): string {
  const typeLabels = {
    weather: 'WEATHER ALERT',
    safety: 'SAFETY ALERT',
    resource: 'RESOURCE ALERT',
    general: 'ALERT',
  };

  let message = `[${typeLabels[params.alertType]}] ${params.title}: ${params.message}`;

  if (params.actionRequired) {
    message += ` ACTION: ${params.actionRequired}`;
  }

  message += ' Reply STOP to unsubscribe.';

  return message;
}

// ============================================
// Prayer Request Updates
// ============================================

export interface PrayerUpdateParams {
  requesterName: string;
  requesterPhone: string;
  updateType: 'received' | 'praying' | 'answered';
  originalRequest?: string;
}

/**
 * Send a prayer request status update
 */
export async function sendPrayerUpdate(
  params: PrayerUpdateParams
): Promise<SMSResult> {
  const message = getPrayerUpdateMessage(params);
  return sendSMS({ to: params.requesterPhone, message });
}

export function getPrayerUpdateMessage(params: PrayerUpdateParams): string {
  switch (params.updateType) {
    case 'received':
      return `Hi ${params.requesterName}, we received your prayer request. Our prayer team is lifting you up. You are not alone. - Acts 29 Ministry`;
    case 'praying':
      return `Hi ${params.requesterName}, just wanted you to know that our prayer team is actively praying for you today. "Cast all your anxiety on him because he cares for you." - 1 Peter 5:7`;
    case 'answered':
      return `Hi ${params.requesterName}, we're rejoicing with you! If you'd like to share how God answered your prayer, we'd love to hear from you. - Acts 29 Ministry`;
    default:
      return `Hi ${params.requesterName}, thinking of you and praying for you. - Acts 29 Ministry`;
  }
}

// ============================================
// Event Reminders
// ============================================

export interface EventReminderParams {
  recipientName: string;
  recipientPhone: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
}

/**
 * Send an event reminder
 */
export async function sendEventReminder(
  params: EventReminderParams
): Promise<SMSResult> {
  const message = getEventReminderMessage(params);
  return sendSMS({ to: params.recipientPhone, message });
}

export function getEventReminderMessage(params: EventReminderParams): string {
  return `Hi ${params.recipientName}! Don't forget: "${params.eventTitle}" is coming up on ${params.eventDate} at ${params.eventTime}. Location: ${params.eventLocation}. We hope to see you there! - Acts 29 Ministry`;
}

// ============================================
// Case Status Updates
// ============================================

export interface CaseStatusUpdateParams {
  clientName: string;
  clientPhone: string;
  caseId: string;
  status: string;
  nextSteps?: string;
}

/**
 * Send a case status update to a client
 */
export async function sendCaseStatusUpdate(
  params: CaseStatusUpdateParams
): Promise<SMSResult> {
  const message = getCaseStatusUpdateMessage(params);
  return sendSMS({ to: params.clientPhone, message });
}

export function getCaseStatusUpdateMessage(
  params: CaseStatusUpdateParams
): string {
  let message = `Hi ${params.clientName}, update on your case: ${params.status}`;

  if (params.nextSteps) {
    message += ` Next steps: ${params.nextSteps}`;
  }

  message += ' Questions? Call us. - Acts 29 Ministry';

  return message;
}

// ============================================
// Donation Confirmation
// ============================================

export interface DonationConfirmationParams {
  donorName: string;
  donorPhone: string;
  amount: number;
  isRecurring: boolean;
  interval?: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
}

/**
 * Send a donation confirmation SMS
 */
export async function sendDonationConfirmation(
  params: DonationConfirmationParams
): Promise<SMSResult> {
  const message = getDonationConfirmationMessage(params);
  return sendSMS({ to: params.donorPhone, message });
}

export function getDonationConfirmationMessage(
  params: DonationConfirmationParams
): string {
  const amountFormatted = `$${(params.amount / 100).toFixed(2)}`;

  if (params.isRecurring && params.interval) {
    return `Thank you, ${params.donorName}! Your ${params.interval} gift of ${amountFormatted} has been set up. Your generosity helps us serve those in need. God bless you! - Acts 29 Ministry`;
  }

  return `Thank you, ${params.donorName}! Your gift of ${amountFormatted} has been received. Your generosity helps us serve those in need. God bless you! - Acts 29 Ministry`;
}

// ============================================
// Phone Number Validation
// ============================================

/**
 * Format a phone number to E.164 format for Twilio
 */
export function formatPhoneNumber(phone: string, countryCode: string = '1'): string {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');

  // If it's already in E.164 format (starts with country code)
  if (digits.length === 11 && digits.startsWith(countryCode)) {
    return `+${digits}`;
  }

  // If it's a 10-digit US number
  if (digits.length === 10) {
    return `+${countryCode}${digits}`;
  }

  // Return as-is with + prefix if we can't determine format
  return `+${digits}`;
}

/**
 * Validate a phone number format
 */
export function isValidPhoneNumber(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  // Valid US phone numbers should have 10-11 digits
  return digits.length >= 10 && digits.length <= 11;
}

// Export message template functions for testing
export {
  getShiftReminderMessage as shiftReminderTemplate,
  getEmergencyAlertMessage as emergencyAlertTemplate,
  getPrayerUpdateMessage as prayerUpdateTemplate,
  getEventReminderMessage as eventReminderTemplate,
  getCaseStatusUpdateMessage as caseStatusUpdateTemplate,
  getDonationConfirmationMessage as donationConfirmationTemplate,
};
