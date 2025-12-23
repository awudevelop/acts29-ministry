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
