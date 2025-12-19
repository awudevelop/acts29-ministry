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
    fontSize: 11,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 30,
    borderBottom: '2 solid #0284c7',
    paddingBottom: 20,
  },
  orgName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0284c7',
    marginBottom: 5,
  },
  orgDetails: {
    fontSize: 10,
    color: '#666',
    lineHeight: 1.5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#0284c7',
    borderBottom: '1 solid #e5e7eb',
    paddingBottom: 5,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    width: '40%',
    color: '#666',
  },
  value: {
    width: '60%',
    fontWeight: 'bold',
  },
  amountBox: {
    backgroundColor: '#f0f9ff',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTop: '1 solid #0284c7',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0284c7',
  },
  legalText: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#f9fafb',
    borderRadius: 5,
  },
  legalTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  legalBody: {
    fontSize: 9,
    color: '#666',
    lineHeight: 1.5,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 50,
    right: 50,
    textAlign: 'center',
    fontSize: 9,
    color: '#999',
    borderTop: '1 solid #e5e7eb',
    paddingTop: 10,
  },
  receiptNumber: {
    position: 'absolute',
    top: 50,
    right: 50,
    fontSize: 10,
    color: '#666',
  },
});

interface DonationReceiptProps {
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

export function DonationReceipt({
  organization,
  donor,
  donation,
  receiptNumber,
}: DonationReceiptProps) {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Receipt Number */}
        <Text style={styles.receiptNumber}>Receipt #{receiptNumber}</Text>

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
        <Text style={styles.title}>Donation Receipt</Text>

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
          {donor.email && (
            <View style={styles.row}>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}>{donor.email}</Text>
            </View>
          )}
        </View>

        {/* Donation Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Donation Details</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Date:</Text>
            <Text style={styles.value}>
              {format(new Date(donation.date), 'MMMM d, yyyy')}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Type:</Text>
            <Text style={styles.value}>
              {donation.type === 'monetary'
                ? 'Monetary Donation'
                : donation.type === 'goods'
                ? 'In-Kind Donation'
                : 'Volunteer Time'}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Reference ID:</Text>
            <Text style={styles.value}>{donation.id}</Text>
          </View>
          {donation.description && (
            <View style={styles.row}>
              <Text style={styles.label}>Description:</Text>
              <Text style={styles.value}>{donation.description}</Text>
            </View>
          )}
        </View>

        {/* Amount */}
        {donation.type === 'monetary' && donation.amount && (
          <View style={styles.amountBox}>
            <View style={styles.row}>
              <Text style={styles.label}>Donation Amount:</Text>
              <Text style={styles.value}>{formatCurrency(donation.amount)}</Text>
            </View>
            {donation.feeAmount && donation.feeAmount > 0 && (
              <View style={styles.row}>
                <Text style={styles.label}>Processing Fee Covered:</Text>
                <Text style={styles.value}>{formatCurrency(donation.feeAmount)}</Text>
              </View>
            )}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Contribution:</Text>
              <Text style={styles.totalAmount}>
                {formatCurrency(donation.totalAmount ?? donation.amount)}
              </Text>
            </View>
          </View>
        )}

        {/* Legal Text */}
        <View style={styles.legalText}>
          <Text style={styles.legalTitle}>Tax Deductibility Statement</Text>
          <Text style={styles.legalBody}>
            {organization.name} is a tax-exempt organization under Section 501(c)(3) of
            the Internal Revenue Code. Our EIN is {organization.ein}. No goods or services
            were provided in exchange for this contribution, making it fully tax-deductible
            to the extent allowed by law.
            {'\n\n'}
            Please retain this receipt for your tax records. Consult with your tax advisor
            regarding the deductibility of your contribution.
          </Text>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Thank you for your generous support of {organization.name}.
          {'\n'}
          Together, we are making a difference in our community.
        </Text>
      </Page>
    </Document>
  );
}
