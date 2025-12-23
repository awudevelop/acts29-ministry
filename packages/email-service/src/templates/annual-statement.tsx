import * as React from 'react';

interface Donation {
  id: string;
  date: string;
  type: 'monetary' | 'goods' | 'time';
  description?: string;
  amount?: number;
  totalAmount?: number;
}

interface AnnualStatementEmailProps {
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
  donations: Donation[];
  taxYear: number;
  statementNumber: string;
  totalAmount: number;
}

export function AnnualStatementEmail({
  organization,
  donor,
  donations,
  taxYear,
  statementNumber,
  totalAmount,
}: AnnualStatementEmailProps) {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  const monetaryDonations = donations.filter((d) => d.type === 'monetary');
  const goodsDonations = donations.filter((d) => d.type === 'goods');

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
      <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '5px' }}>
        Annual Contribution Statement
      </h2>
      <p style={{ textAlign: 'center', color: '#666', marginTop: 0, marginBottom: '30px' }}>
        Tax Year {taxYear}
      </p>

      {/* Greeting */}
      <p style={{ fontSize: '16px', color: '#333' }}>
        Dear {donor.name},
      </p>
      <p style={{ fontSize: '16px', color: '#333', lineHeight: '1.6' }}>
        Thank you for your generous support of {organization.name} throughout {taxYear}.
        This statement provides a summary of your tax-deductible contributions for your records.
      </p>

      {/* Statement Info */}
      <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '15px', margin: '20px 0' }}>
        <table style={{ width: '100%', fontSize: '14px' }}>
          <tbody>
            <tr>
              <td style={{ padding: '5px 0', color: '#666' }}>Statement Number:</td>
              <td style={{ padding: '5px 0', fontWeight: 'bold', textAlign: 'right' }}>{statementNumber}</td>
            </tr>
            <tr>
              <td style={{ padding: '5px 0', color: '#666' }}>Tax Year:</td>
              <td style={{ padding: '5px 0', fontWeight: 'bold', textAlign: 'right' }}>{taxYear}</td>
            </tr>
            <tr>
              <td style={{ padding: '5px 0', color: '#666' }}>Total Donations:</td>
              <td style={{ padding: '5px 0', fontWeight: 'bold', textAlign: 'right' }}>{donations.length}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Monetary Donations */}
      {monetaryDonations.length > 0 && (
        <div style={{ margin: '20px 0' }}>
          <h3 style={{ color: '#0284c7', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px', fontSize: '16px' }}>
            Monetary Donations ({monetaryDonations.length})
          </h3>
          <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f9ff' }}>
                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>Date</th>
                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>Description</th>
                <th style={{ padding: '10px', textAlign: 'right', borderBottom: '1px solid #e2e8f0' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {monetaryDonations.map((donation, index) => (
                <tr key={index}>
                  <td style={{ padding: '10px', borderBottom: '1px solid #f1f5f9' }}>{formatDate(donation.date)}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #f1f5f9' }}>{donation.description || 'General Donation'}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #f1f5f9', textAlign: 'right', fontWeight: 'bold' }}>
                    {formatCurrency(donation.totalAmount ?? donation.amount ?? 0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* In-Kind Donations */}
      {goodsDonations.length > 0 && (
        <div style={{ margin: '20px 0' }}>
          <h3 style={{ color: '#0284c7', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px', fontSize: '16px' }}>
            In-Kind Donations ({goodsDonations.length})
          </h3>
          <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f9ff' }}>
                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>Date</th>
                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>Description</th>
              </tr>
            </thead>
            <tbody>
              {goodsDonations.map((donation, index) => (
                <tr key={index}>
                  <td style={{ padding: '10px', borderBottom: '1px solid #f1f5f9' }}>{formatDate(donation.date)}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #f1f5f9' }}>{donation.description || 'In-Kind Donation'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Total */}
      <div style={{ backgroundColor: '#0284c7', color: 'white', borderRadius: '8px', padding: '20px', margin: '20px 0', textAlign: 'center' }}>
        <p style={{ margin: '0 0 5px 0', fontSize: '14px', opacity: 0.9 }}>Total Tax-Deductible Contributions</p>
        <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>{formatCurrency(totalAmount)}</p>
      </div>

      {/* Tax Deductibility Statement */}
      <div style={{ backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px', padding: '15px', margin: '20px 0' }}>
        <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#0369a1' }}>Tax Deductibility Statement</h4>
        <p style={{ fontSize: '12px', color: '#0369a1', margin: 0, lineHeight: '1.5' }}>
          {organization.name} is a tax-exempt organization under Section 501(c)(3) of the Internal Revenue Code.
          Our EIN is {organization.ein}. No goods or services were provided in exchange for these contributions
          unless otherwise noted, making them fully tax-deductible to the extent allowed by law.
          Please retain this statement for your {taxYear} tax records.
        </p>
      </div>

      {/* Note about PDF */}
      <div style={{ backgroundColor: '#fef3c7', border: '1px solid #fcd34d', borderRadius: '8px', padding: '15px', margin: '20px 0' }}>
        <p style={{ fontSize: '13px', color: '#92400e', margin: 0 }}>
          <strong>Note:</strong> A detailed PDF version of this statement is attached to this email for your records.
        </p>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
        <p style={{ color: '#666', fontSize: '14px', margin: '0 0 10px 0' }}>
          Thank you for your partnership with {organization.name} in {taxYear}.
        </p>
        <p style={{ color: '#999', fontSize: '12px', margin: 0 }}>
          Together, we are making a difference in our community.
        </p>
      </div>
    </div>
  );
}

export function getAnnualStatementEmailText(props: AnnualStatementEmailProps): string {
  const { organization, donor, donations, taxYear, statementNumber, totalAmount } = props;
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const monetaryDonations = donations.filter((d) => d.type === 'monetary');
  const goodsDonations = donations.filter((d) => d.type === 'goods');

  return `
${organization.name}
${organization.address}
Phone: ${organization.phone} | Email: ${organization.email}

ANNUAL CONTRIBUTION STATEMENT
=============================
Tax Year ${taxYear}
Statement Number: ${statementNumber}

Dear ${donor.name},

Thank you for your generous support of ${organization.name} throughout ${taxYear}. This statement provides a summary of your tax-deductible contributions for your records.

${monetaryDonations.length > 0 ? `
MONETARY DONATIONS (${monetaryDonations.length})
${'-'.repeat(40)}
${monetaryDonations.map((d) => `${new Date(d.date).toLocaleDateString()} - ${d.description || 'General Donation'} - ${formatCurrency(d.totalAmount ?? d.amount ?? 0)}`).join('\n')}
` : ''}
${goodsDonations.length > 0 ? `
IN-KIND DONATIONS (${goodsDonations.length})
${'-'.repeat(40)}
${goodsDonations.map((d) => `${new Date(d.date).toLocaleDateString()} - ${d.description || 'In-Kind Donation'}`).join('\n')}
` : ''}
TOTAL TAX-DEDUCTIBLE CONTRIBUTIONS: ${formatCurrency(totalAmount)}

TAX DEDUCTIBILITY STATEMENT
---------------------------
${organization.name} is a tax-exempt organization under Section 501(c)(3) of the Internal Revenue Code. Our EIN is ${organization.ein}. No goods or services were provided in exchange for these contributions unless otherwise noted, making them fully tax-deductible to the extent allowed by law.

Please retain this statement for your ${taxYear} tax records.

A detailed PDF version of this statement is attached to this email.

Thank you for your partnership with ${organization.name}!
  `.trim();
}
