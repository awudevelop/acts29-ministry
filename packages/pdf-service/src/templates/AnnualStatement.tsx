import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';
import { format } from 'date-fns';

const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 25,
    borderBottom: '2 solid #0284c7',
    paddingBottom: 15,
  },
  orgName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0284c7',
    marginBottom: 5,
  },
  orgDetails: {
    fontSize: 9,
    color: '#666',
    lineHeight: 1.4,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 12,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#0284c7',
    borderBottom: '1 solid #e5e7eb',
    paddingBottom: 4,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  label: {
    width: '35%',
    color: '#666',
  },
  value: {
    width: '65%',
    fontWeight: 'bold',
  },
  table: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f9ff',
    padding: 8,
    borderBottom: '1 solid #0284c7',
  },
  tableHeaderCell: {
    fontWeight: 'bold',
    color: '#0284c7',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottom: '1 solid #e5e7eb',
  },
  tableCell: {
    color: '#333',
  },
  col1: { width: '20%' },
  col2: { width: '35%' },
  col3: { width: '20%' },
  col4: { width: '25%', textAlign: 'right' },
  summaryBox: {
    backgroundColor: '#f0f9ff',
    padding: 15,
    borderRadius: 5,
    marginTop: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTop: '1 solid #0284c7',
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0284c7',
  },
  legalText: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 5,
  },
  legalTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  legalBody: {
    fontSize: 8,
    color: '#666',
    lineHeight: 1.4,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 50,
    right: 50,
    textAlign: 'center',
    fontSize: 8,
    color: '#999',
    borderTop: '1 solid #e5e7eb',
    paddingTop: 10,
  },
  statementNumber: {
    position: 'absolute',
    top: 50,
    right: 50,
    fontSize: 9,
    color: '#666',
  },
});

interface Donation {
  id: string;
  date: string;
  type: 'monetary' | 'goods' | 'time';
  description?: string;
  amount?: number;
  feeAmount?: number;
  totalAmount?: number;
}

interface AnnualStatementProps {
  organization: {
    name: string;
    address: string;
    phone: string;
    email: string;
    ein: string;
  };
  donor: {
    name: string;
    address?: string;
    email?: string;
  };
  donations: Donation[];
  taxYear: number;
  statementNumber: string;
}

export function AnnualStatement({
  organization,
  donor,
  donations,
  taxYear,
  statementNumber,
}: AnnualStatementProps) {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const monetaryDonations = donations.filter((d) => d.type === 'monetary');
  const goodsDonations = donations.filter((d) => d.type === 'goods');
  // Time donations tracking available but not currently displayed on statement
  const _timeDonations = donations.filter((d) => d.type === 'time');
  void _timeDonations; // Intentionally unused

  const totalMonetary = monetaryDonations.reduce(
    (sum, d) => sum + (d.totalAmount ?? d.amount ?? 0),
    0
  );

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Statement Number */}
        <Text style={styles.statementNumber}>Statement #{statementNumber}</Text>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.orgName}>{organization.name}</Text>
          <Text style={styles.orgDetails}>
            {organization.address}
            {'\n'}
            Phone: {organization.phone} | Email: {organization.email}
            {'\n'}
            EIN: {organization.ein}
          </Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>Annual Contribution Statement</Text>
        <Text style={styles.subtitle}>Tax Year {taxYear}</Text>

        {/* Donor Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Donor Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{donor.name}</Text>
          </View>
          {donor.address && (
            <View style={styles.row}>
              <Text style={styles.label}>Address:</Text>
              <Text style={styles.value}>{donor.address}</Text>
            </View>
          )}
        </View>

        {/* Monetary Donations Table */}
        {monetaryDonations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Monetary Donations ({monetaryDonations.length})
            </Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell, styles.col1]}>Date</Text>
                <Text style={[styles.tableHeaderCell, styles.col2]}>Description</Text>
                <Text style={[styles.tableHeaderCell, styles.col3]}>Type</Text>
                <Text style={[styles.tableHeaderCell, styles.col4]}>Amount</Text>
              </View>
              {monetaryDonations.map((donation, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.col1]}>
                    {format(new Date(donation.date), 'MM/dd/yyyy')}
                  </Text>
                  <Text style={[styles.tableCell, styles.col2]}>
                    {donation.description?.slice(0, 40) || 'General Donation'}
                  </Text>
                  <Text style={[styles.tableCell, styles.col3]}>Cash</Text>
                  <Text style={[styles.tableCell, styles.col4]}>
                    {formatCurrency(donation.totalAmount ?? donation.amount ?? 0)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* In-Kind Donations */}
        {goodsDonations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              In-Kind Donations ({goodsDonations.length})
            </Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell, styles.col1]}>Date</Text>
                <Text style={[styles.tableHeaderCell, { width: '55%' }]}>Description</Text>
                <Text style={[styles.tableHeaderCell, styles.col4]}>Est. Value</Text>
              </View>
              {goodsDonations.map((donation, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.col1]}>
                    {format(new Date(donation.date), 'MM/dd/yyyy')}
                  </Text>
                  <Text style={[styles.tableCell, { width: '55%' }]}>
                    {donation.description?.slice(0, 60) || 'In-Kind Donation'}
                  </Text>
                  <Text style={[styles.tableCell, styles.col4]}>
                    {donation.amount ? formatCurrency(donation.amount) : 'See attached'}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Summary */}
        <View style={styles.summaryBox}>
          <View style={styles.summaryRow}>
            <Text>Total Monetary Donations:</Text>
            <Text style={{ fontWeight: 'bold' }}>{formatCurrency(totalMonetary)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text>Number of Donations:</Text>
            <Text style={{ fontWeight: 'bold' }}>{donations.length}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Tax-Deductible Contributions:</Text>
            <Text style={styles.totalAmount}>{formatCurrency(totalMonetary)}</Text>
          </View>
        </View>

        {/* Legal Text */}
        <View style={styles.legalText}>
          <Text style={styles.legalTitle}>Tax Deductibility Statement</Text>
          <Text style={styles.legalBody}>
            {organization.name} is a tax-exempt organization under Section 501(c)(3) of
            the Internal Revenue Code. Our EIN is {organization.ein}. No goods or services
            were provided in exchange for these contributions unless otherwise noted,
            making them fully tax-deductible to the extent allowed by law.
            {'\n\n'}
            This statement is provided for your tax records for the {taxYear} tax year.
            For in-kind donations, please consult IRS Publication 561 for guidance on
            determining fair market value. Consult with your tax advisor regarding the
            deductibility of your contributions.
          </Text>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Generated on {format(new Date(), 'MMMM d, yyyy')} | {organization.name}
          {'\n'}
          Thank you for your generous support throughout {taxYear}.
        </Text>
      </Page>
    </Document>
  );
}
