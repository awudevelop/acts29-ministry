'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@acts29/ui';
import {
  Breadcrumbs,
  StatCard,
  Badge,
} from '@acts29/admin-ui';
import {
  Plus,
  Search,
  QrCode,
  Link as LinkIcon,
  Copy,
  Check,
  Edit,
  Trash2,
  MoreVertical,
  Download,
  CreditCard,
  Building2,
  ExternalLink,
} from 'lucide-react';

// Mock payment links data
const mockPaymentLinks = [
  {
    id: 'pl_001',
    shortCode: 'GIVE2024',
    description: 'General Donation Link',
    url: 'https://acts29.org/donate/GIVE2024',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://acts29.org/donate/GIVE2024',
    amount: null, // Flexible amount
    allowedPaymentMethods: ['card', 'ach'] as const,
    coverFeesOption: 'donor_choice' as const,
    status: 'active' as const,
    totalCollected: 1524700, // in cents
    donationCount: 47,
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'pl_002',
    shortCode: 'SHELTER50',
    description: 'Emergency Shelter Fund - $50',
    url: 'https://acts29.org/donate/SHELTER50',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://acts29.org/donate/SHELTER50',
    amount: 5000, // $50 in cents
    allowedPaymentMethods: ['card', 'ach'] as const,
    coverFeesOption: 'always' as const,
    status: 'active' as const,
    totalCollected: 325000,
    donationCount: 65,
    createdAt: '2024-02-01T14:30:00Z',
  },
  {
    id: 'pl_003',
    shortCode: 'MEALS100',
    description: 'Meal Program - $100',
    url: 'https://acts29.org/donate/MEALS100',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://acts29.org/donate/MEALS100',
    amount: 10000, // $100 in cents
    allowedPaymentMethods: ['card'] as const,
    coverFeesOption: 'donor_choice' as const,
    status: 'active' as const,
    totalCollected: 890000,
    donationCount: 89,
    createdAt: '2024-03-10T09:15:00Z',
  },
  {
    id: 'pl_004',
    shortCode: 'WINTER23',
    description: 'Winter Warmth Campaign 2023',
    url: 'https://acts29.org/donate/WINTER23',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://acts29.org/donate/WINTER23',
    amount: null,
    allowedPaymentMethods: ['card', 'ach'] as const,
    coverFeesOption: 'never' as const,
    status: 'expired' as const,
    totalCollected: 1250000,
    donationCount: 156,
    createdAt: '2023-11-01T00:00:00Z',
  },
];

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
}

export default function PaymentLinksPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<'all' | 'active' | 'expired' | 'disabled'>('all');
  const [showActionsMenu, setShowActionsMenu] = React.useState<string | null>(null);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const [showQRModal, setShowQRModal] = React.useState<string | null>(null);

  // Filter payment links
  const filteredLinks = React.useMemo(() => {
    let result = [...mockPaymentLinks];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (link) =>
          link.description.toLowerCase().includes(query) ||
          link.shortCode.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter((link) => link.status === statusFilter);
    }

    return result.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [searchQuery, statusFilter]);

  // Calculate stats
  const stats = {
    totalLinks: mockPaymentLinks.length,
    activeLinks: mockPaymentLinks.filter((l) => l.status === 'active').length,
    totalCollected: mockPaymentLinks.reduce((sum, l) => sum + l.totalCollected, 0),
    totalDonations: mockPaymentLinks.reduce((sum, l) => sum + l.donationCount, 0),
  };

  const handleCopyLink = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      console.error('Failed to copy');
    }
  };

  const selectedLink = showQRModal
    ? mockPaymentLinks.find((l) => l.id === showQRModal)
    : null;

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Donations', href: '/admin/donations' },
          { label: 'Payment Links' },
        ]}
      />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Links & QR Codes</h1>
          <p className="mt-1 text-sm text-gray-600">
            Create shareable donation links and QR codes for events and campaigns
          </p>
        </div>
        <Link href="/admin/donations/payment-links/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Link
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Links" value={stats.totalLinks} icon={LinkIcon} />
        <StatCard title="Active Links" value={stats.activeLinks} icon={QrCode} />
        <StatCard
          title="Total Collected"
          value={formatCurrency(stats.totalCollected)}
          icon={CreditCard}
        />
        <StatCard title="Total Donations" value={stats.totalDonations} icon={Building2} />
      </div>

      {/* Filters and Table */}
      <div className="rounded-xl border bg-white">
        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between border-b">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search payment links..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as 'all' | 'active' | 'expired' | 'disabled')
            }
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="disabled">Disabled</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50 text-left text-sm text-gray-500">
                <th className="px-4 py-3 font-medium">Link</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Methods</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Collected</th>
                <th className="px-4 py-3 font-medium">Donations</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredLinks.map((link) => (
                <tr key={link.id} className="text-sm hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => setShowQRModal(link.id)}
                        className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-700 hover:bg-primary-200 transition"
                      >
                        <QrCode className="h-5 w-5" />
                      </button>
                      <div>
                        <p className="font-medium text-gray-900">{link.description}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">
                            {link.shortCode}
                          </code>
                          <button
                            onClick={() => handleCopyLink(link.url, link.id)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            {copiedId === link.id ? (
                              <Check className="h-3.5 w-3.5 text-green-500" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {link.amount ? formatCurrency(link.amount) : 'Flexible'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {link.allowedPaymentMethods.includes('card') && (
                        <span className="rounded bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-700">
                          Card
                        </span>
                      )}
                      {(link.allowedPaymentMethods as readonly string[]).includes('ach') && (
                        <span className="rounded bg-green-100 px-1.5 py-0.5 text-xs font-medium text-green-700">
                          ACH
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {link.status === 'active' ? (
                      <Badge variant="success">Active</Badge>
                    ) : link.status === 'expired' ? (
                      <Badge variant="warning">Expired</Badge>
                    ) : (
                      <Badge variant="default">Disabled</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {formatCurrency(link.totalCollected)}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{link.donationCount}</td>
                  <td className="px-4 py-3">
                    <div className="relative">
                      <button
                        onClick={() =>
                          setShowActionsMenu(showActionsMenu === link.id ? null : link.id)
                        }
                        className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                      {showActionsMenu === link.id && (
                        <>
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => setShowActionsMenu(null)}
                          />
                          <div className="absolute right-0 z-50 mt-1 w-48 rounded-lg border bg-white py-1 shadow-lg">
                            <button
                              onClick={() => {
                                setShowQRModal(link.id);
                                setShowActionsMenu(null);
                              }}
                              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <QrCode className="h-4 w-4" />
                              View QR Code
                            </button>
                            <button
                              onClick={() => {
                                handleCopyLink(link.url, link.id);
                                setShowActionsMenu(null);
                              }}
                              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Copy className="h-4 w-4" />
                              Copy Link
                            </button>
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <ExternalLink className="h-4 w-4" />
                              Open Link
                            </a>
                            <hr className="my-1" />
                            <Link
                              href={`/admin/donations/payment-links/${link.id}/edit`}
                              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Edit className="h-4 w-4" />
                              Edit
                            </Link>
                            <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                              <Trash2 className="h-4 w-4" />
                              Disable
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredLinks.length === 0 && (
            <div className="py-12 text-center">
              <QrCode className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No payment links found</h3>
              <p className="mt-2 text-gray-500">
                {searchQuery || statusFilter !== 'all'
                  ? 'Try adjusting your search or filters.'
                  : 'Get started by creating your first payment link.'}
              </p>
              {!searchQuery && statusFilter === 'all' && (
                <Link href="/admin/donations/payment-links/new">
                  <Button className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Link
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>

        {filteredLinks.length > 0 && (
          <div className="flex items-center justify-between border-t px-4 py-3">
            <p className="text-sm text-gray-500">
              Showing {filteredLinks.length} of {mockPaymentLinks.length} payment links
            </p>
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      {showQRModal && selectedLink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">QR Code</h3>
              <button
                onClick={() => setShowQRModal(null)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <span className="sr-only">Close</span>
                &times;
              </button>
            </div>

            <div className="mt-4 text-center">
              <p className="font-medium text-gray-900">{selectedLink.description}</p>
              <p className="text-sm text-gray-500">
                {selectedLink.amount
                  ? formatCurrency(selectedLink.amount)
                  : 'Flexible amount'}
              </p>

              {/* QR Code Display */}
              <div className="mx-auto mt-6 w-48 h-48 bg-gray-100 rounded-xl flex items-center justify-center border-2 border-gray-200">
                <div className="text-center">
                  <QrCode className="mx-auto h-24 w-24 text-gray-400" />
                  <p className="mt-1 text-xs text-gray-400">{selectedLink.shortCode}</p>
                </div>
              </div>

              <div className="mt-4">
                <code className="rounded bg-gray-100 px-2 py-1 text-sm text-gray-600">
                  {selectedLink.url}
                </code>
              </div>

              <div className="mt-6 flex justify-center gap-3">
                <button
                  onClick={() => handleCopyLink(selectedLink.url, selectedLink.id)}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  {copiedId === selectedLink.id ? (
                    <>
                      <Check className="h-4 w-4 text-green-500" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy Link
                    </>
                  )}
                </button>
                <button className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-700">
                  <Download className="h-4 w-4" />
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
