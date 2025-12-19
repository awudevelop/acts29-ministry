'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@acts29/ui';
import {
  Breadcrumbs,
  FormSection,
  Select,
  Alert,
  Badge,
  formatDate,
} from '@acts29/admin-ui';
import { ArrowLeft, Download, Database, FileSpreadsheet, Check } from 'lucide-react';

// Mock export history
const exportHistory = [
  { id: '1', type: 'Donations', format: 'CSV', date: '2024-12-15T10:30:00Z', size: '245 KB', status: 'completed' },
  { id: '2', type: 'Volunteers', format: 'Excel', date: '2024-12-10T14:15:00Z', size: '128 KB', status: 'completed' },
  { id: '3', type: 'Full Backup', format: 'JSON', date: '2024-12-01T02:00:00Z', size: '12.4 MB', status: 'completed' },
  { id: '4', type: 'Cases', format: 'CSV', date: '2024-11-28T09:45:00Z', size: '89 KB', status: 'completed' },
];

interface ExportOption {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
}

const exportOptions: ExportOption[] = [
  {
    id: 'donations',
    name: 'Donations',
    description: 'All donation records including donor info and amounts',
    icon: FileSpreadsheet,
  },
  {
    id: 'donors',
    name: 'Donors',
    description: 'Donor contact information and giving history',
    icon: FileSpreadsheet,
  },
  {
    id: 'volunteers',
    name: 'Volunteers',
    description: 'Volunteer profiles and shift history',
    icon: FileSpreadsheet,
  },
  {
    id: 'cases',
    name: 'Cases',
    description: 'Case records and service history',
    icon: FileSpreadsheet,
  },
  {
    id: 'events',
    name: 'Events',
    description: 'Event details and registration data',
    icon: FileSpreadsheet,
  },
  {
    id: 'full_backup',
    name: 'Full Data Backup',
    description: 'Complete backup of all organization data',
    icon: Database,
  },
];

export default function DataExportPage() {
  const router = useRouter();
  const [selectedExport, setSelectedExport] = React.useState<string | null>(null);
  const [format, setFormat] = React.useState('csv');
  const [dateRange, setDateRange] = React.useState('all');
  const [isExporting, setIsExporting] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const handleExport = async () => {
    if (!selectedExport) return;

    setIsExporting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setSuccess(true);
    setIsExporting(false);
    setTimeout(() => setSuccess(false), 5000);
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Settings', href: '/admin/settings' },
          { label: 'Data Export' },
        ]}
      />

      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Data Export</h1>
          <p className="mt-1 text-sm text-gray-600">
            Export your organization's data for backup or migration
          </p>
        </div>
      </div>

      {success && (
        <Alert variant="success" onClose={() => setSuccess(false)}>
          Export completed! Your download should begin automatically.
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Export Options */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border bg-white p-6">
            <FormSection
              title="Select Data to Export"
              description="Choose which data you want to export"
            >
              <div className="grid gap-3 sm:grid-cols-2">
                {exportOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSelectedExport(option.id)}
                    className={`rounded-lg border p-4 text-left transition-colors ${
                      selectedExport === option.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`rounded-lg p-2 ${
                        selectedExport === option.id
                          ? 'bg-primary-100'
                          : 'bg-gray-100'
                      }`}>
                        <option.icon className={`h-5 w-5 ${
                          selectedExport === option.id
                            ? 'text-primary-600'
                            : 'text-gray-600'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{option.name}</p>
                        <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </FormSection>
          </div>

          {selectedExport && (
            <div className="rounded-xl border bg-white p-6">
              <FormSection
                title="Export Options"
                description="Configure your export settings"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <Select
                    label="File Format"
                    options={[
                      { value: 'csv', label: 'CSV (Comma Separated)' },
                      { value: 'xlsx', label: 'Excel (.xlsx)' },
                      { value: 'json', label: 'JSON' },
                    ]}
                    value={format}
                    onChange={setFormat}
                  />
                  <Select
                    label="Date Range"
                    options={[
                      { value: 'all', label: 'All Time' },
                      { value: 'year', label: 'This Year' },
                      { value: 'quarter', label: 'This Quarter' },
                      { value: 'month', label: 'This Month' },
                      { value: 'custom', label: 'Custom Range' },
                    ]}
                    value={dateRange}
                    onChange={setDateRange}
                  />
                </div>

                <div className="mt-6 flex gap-3">
                  <Button onClick={handleExport} loading={isExporting}>
                    <Download className="mr-2 h-4 w-4" />
                    Export Data
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedExport(null)}>
                    Cancel
                  </Button>
                </div>
              </FormSection>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Info */}
          <div className="rounded-xl border bg-gray-50 p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Export Information</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Exports are generated in real-time</li>
              <li>• Large exports may take a few minutes</li>
              <li>• Sensitive data is included - handle securely</li>
              <li>• Exports are logged for audit purposes</li>
            </ul>
          </div>

          {/* Scheduled Backups */}
          <div className="rounded-xl border bg-white p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Automated Backups</h3>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="font-medium text-gray-900">Weekly Full Backup</p>
                <p className="text-sm text-gray-500">Every Sunday at 2:00 AM</p>
              </div>
              <Badge variant="success">Active</Badge>
            </div>
            <Button variant="outline" className="w-full mt-4">
              Configure Backups
            </Button>
          </div>
        </div>
      </div>

      {/* Export History */}
      <div className="rounded-xl border bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Export History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm text-gray-500">
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium">Format</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Size</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {exportHistory.map((entry) => (
                <tr key={entry.id} className="text-sm">
                  <td className="py-3 font-medium text-gray-900">{entry.type}</td>
                  <td className="py-3 text-gray-500">{entry.format}</td>
                  <td className="py-3 text-gray-500">{formatDate(entry.date)}</td>
                  <td className="py-3 text-gray-500">{entry.size}</td>
                  <td className="py-3">
                    <Badge variant="success">
                      <Check className="mr-1 h-3 w-3" />
                      Completed
                    </Badge>
                  </td>
                  <td className="py-3">
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
