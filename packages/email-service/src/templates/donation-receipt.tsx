import * as React from 'react';

interface DonationReceiptEmailProps {
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
}

export function DonationReceiptEmail({
  organization,
  donor,
  donation,
  receiptNumber,
}: DonationReceiptEmailProps) {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      {/* Header */}
      <div style={{ borderBottom: '3px solid #0284c7', paddingBottom: '20px', marginBottom: '20px' }}>
        <h1 style={{ color: '#0284c7', margin: '0 0 5px 0', fontSize: '24px' }}>
          {organization.name}
        </h1>
        <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>
          {organization.address}<br />
          Phone: {organization.phone} | Email: {organization.email}
        </p>
      </div>

      {/* Title */}
      <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>
        Donation Receipt
      </h2>

      {/* Greeting */}
      <p style={{ fontSize: '16px', color: '#333' }}>
        Dear {donor.name},
      </p>
      <p style={{ fontSize: '16px', color: '#333', lineHeight: '1.6' }}>
        Thank you for your generous donation to {organization.name}. Your contribution makes a meaningful difference in our mission to serve those in need.
      </p>

      {/* Receipt Details Box */}
      <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', margin: '20px 0' }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#0284c7', fontSize: '16px' }}>Receipt Details</h3>
        <table style={{ width: '100%', fontSize: '14px' }}>
          <tbody>
            <tr>
              <td style={{ padding: '8px 0', color: '#666' }}>Receipt Number:</td>
              <td style={{ padding: '8px 0', fontWeight: 'bold', textAlign: 'right' }}>{receiptNumber}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', color: '#666' }}>Date:</td>
              <td style={{ padding: '8px 0', fontWeight: 'bold', textAlign: 'right' }}>{formatDate(donation.date)}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', color: '#666' }}>Type:</td>
              <td style={{ padding: '8px 0', fontWeight: 'bold', textAlign: 'right', textTransform: 'capitalize' }}>
                {donation.type === 'monetary' ? 'Monetary Donation' : donation.type === 'goods' ? 'In-Kind Donation' : 'Volunteer Time'}
              </td>
            </tr>
            {donation.description && (
              <tr>
                <td style={{ padding: '8px 0', color: '#666' }}>Description:</td>
                <td style={{ padding: '8px 0', fontWeight: 'bold', textAlign: 'right' }}>{donation.description}</td>
              </tr>
            )}
          </tbody>
        </table>

        {donation.type === 'monetary' && donation.amount && (
          <div style={{ borderTop: '2px solid #0284c7', marginTop: '15px', paddingTop: '15px' }}>
            <table style={{ width: '100%', fontSize: '14px' }}>
              <tbody>
                <tr>
                  <td style={{ padding: '5px 0', color: '#666' }}>Donation Amount:</td>
                  <td style={{ padding: '5px 0', fontWeight: 'bold', textAlign: 'right' }}>{formatCurrency(donation.amount)}</td>
                </tr>
                {donation.feeAmount && donation.feeAmount > 0 && (
                  <tr>
                    <td style={{ padding: '5px 0', color: '#666' }}>Processing Fee Covered:</td>
                    <td style={{ padding: '5px 0', fontWeight: 'bold', textAlign: 'right' }}>{formatCurrency(donation.feeAmount)}</td>
                  </tr>
                )}
                <tr>
                  <td style={{ padding: '10px 0 5px', fontSize: '16px', fontWeight: 'bold' }}>Total Contribution:</td>
                  <td style={{ padding: '10px 0 5px', fontSize: '20px', fontWeight: 'bold', color: '#0284c7', textAlign: 'right' }}>
                    {formatCurrency(donation.totalAmount ?? donation.amount)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Tax Deductibility Statement */}
      <div style={{ backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px', padding: '15px', margin: '20px 0' }}>
        <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#0369a1' }}>Tax Deductibility Statement</h4>
        <p style={{ fontSize: '12px', color: '#0369a1', margin: 0, lineHeight: '1.5' }}>
          {organization.name} is a tax-exempt organization under Section 501(c)(3) of the Internal Revenue Code.
          Our EIN is {organization.ein}. No goods or services were provided in exchange for this contribution,
          making it fully tax-deductible to the extent allowed by law.
        </p>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
        <p style={{ color: '#666', fontSize: '14px', margin: '0 0 10px 0' }}>
          Thank you for your generous support of {organization.name}.
        </p>
        <p style={{ color: '#999', fontSize: '12px', margin: 0 }}>
          Together, we are making a difference in our community.
        </p>
      </div>
    </div>
  );
}

export function getDonationReceiptEmailText(props: DonationReceiptEmailProps): string {
  const { organization, donor, donation, receiptNumber } = props;
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  return `
${organization.name}
${organization.address}
Phone: ${organization.phone} | Email: ${organization.email}

DONATION RECEIPT
================

Receipt Number: ${receiptNumber}

Dear ${donor.name},

Thank you for your generous donation to ${organization.name}. Your contribution makes a meaningful difference in our mission to serve those in need.

RECEIPT DETAILS
---------------
Date: ${new Date(donation.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
Type: ${donation.type === 'monetary' ? 'Monetary Donation' : donation.type === 'goods' ? 'In-Kind Donation' : 'Volunteer Time'}
${donation.description ? `Description: ${donation.description}` : ''}
${donation.type === 'monetary' && donation.amount ? `
Amount: ${formatCurrency(donation.amount)}${donation.feeAmount ? `\nProcessing Fee Covered: ${formatCurrency(donation.feeAmount)}` : ''}
Total Contribution: ${formatCurrency(donation.totalAmount ?? donation.amount)}` : ''}

TAX DEDUCTIBILITY STATEMENT
---------------------------
${organization.name} is a tax-exempt organization under Section 501(c)(3) of the Internal Revenue Code. Our EIN is ${organization.ein}. No goods or services were provided in exchange for this contribution, making it fully tax-deductible to the extent allowed by law.

Thank you for your generous support!

${organization.name}
  `.trim();
}
