'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@acts29/ui';
import {
  Breadcrumbs,
  FormSection,
  Input,
  Select,
  Alert,
  Badge,
} from '@acts29/admin-ui';
import { ArrowLeft, Save, CreditCard, Check, ExternalLink } from 'lucide-react';

export default function PaymentSettingsPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const [formData, setFormData] = React.useState({
    provider: 'hellopayments',
    api_key: '••••••••••••••••',
    default_fee_coverage: 'ask',
    fee_percentage: '2.9',
    fee_fixed: '0.30',
    currency: 'USD',
    test_mode: true,
  });

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSuccess(true);
    setIsSaving(false);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Settings', href: '/admin/settings' },
          { label: 'Payment Integration' },
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
          <h1 className="text-2xl font-bold text-gray-900">Payment Integration</h1>
          <p className="mt-1 text-sm text-gray-600">
            Configure payment processing for online donations
          </p>
        </div>
      </div>

      {success && (
        <Alert variant="success" onClose={() => setSuccess(false)}>
          Payment settings saved successfully!
        </Alert>
      )}

      {/* Connection Status */}
      <div className="rounded-xl border bg-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-green-100 p-3">
              <CreditCard className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900">HelloPayments</h3>
                <Badge variant="success">Connected</Badge>
                {formData.test_mode && <Badge variant="warning">Test Mode</Badge>}
              </div>
              <p className="text-sm text-gray-500">
                Your payment provider is configured and ready to accept donations
              </p>
            </div>
          </div>
          <Button variant="outline">
            <ExternalLink className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Provider Selection */}
        <div className="rounded-xl border bg-white p-6">
          <FormSection
            title="Payment Provider"
            description="Select your payment processing provider"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { id: 'hellopayments', name: 'HelloPayments', desc: 'Built for nonprofits' },
                { id: 'stripe', name: 'Stripe', desc: 'Popular payment processor' },
              ].map((provider) => (
                <button
                  key={provider.id}
                  type="button"
                  onClick={() => handleChange('provider', provider.id)}
                  className={`rounded-lg border p-4 text-left transition-colors ${
                    formData.provider === provider.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{provider.name}</p>
                      <p className="text-sm text-gray-500">{provider.desc}</p>
                    </div>
                    {formData.provider === provider.id && (
                      <Check className="h-5 w-5 text-primary-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </FormSection>
        </div>

        {/* API Credentials */}
        <div className="rounded-xl border bg-white p-6">
          <FormSection
            title="API Credentials"
            description="Your payment provider API keys"
          >
            <div className="grid gap-4">
              <Input
                label="API Key"
                type="password"
                value={formData.api_key}
                onChange={(e) => handleChange('api_key', e.target.value)}
              />
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="test_mode"
                  checked={formData.test_mode}
                  onChange={(e) => handleChange('test_mode', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="test_mode" className="text-sm text-gray-700">
                  Enable test mode (no real charges will be made)
                </label>
              </div>
            </div>
          </FormSection>
        </div>

        {/* Fee Settings */}
        <div className="rounded-xl border bg-white p-6">
          <FormSection
            title="Processing Fees"
            description="Configure how processing fees are handled"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label="Fee Coverage Option"
                options={[
                  { value: 'ask', label: 'Ask donors to cover fees' },
                  { value: 'always', label: 'Always cover fees (donors pay extra)' },
                  { value: 'never', label: 'Never ask (organization absorbs fees)' },
                ]}
                value={formData.default_fee_coverage}
                onChange={(value) => handleChange('default_fee_coverage', value)}
              />
              <Select
                label="Currency"
                options={[
                  { value: 'USD', label: 'USD - US Dollar' },
                  { value: 'EUR', label: 'EUR - Euro' },
                  { value: 'GBP', label: 'GBP - British Pound' },
                ]}
                value={formData.currency}
                onChange={(value) => handleChange('currency', value)}
              />
              <Input
                label="Fee Percentage"
                type="number"
                step="0.1"
                value={formData.fee_percentage}
                onChange={(e) => handleChange('fee_percentage', e.target.value)}
                suffix="%"
              />
              <Input
                label="Fixed Fee"
                type="number"
                step="0.01"
                value={formData.fee_fixed}
                onChange={(e) => handleChange('fee_fixed', e.target.value)}
                prefix="$"
              />
            </div>
          </FormSection>
        </div>

        {/* Webhook Info */}
        <div className="rounded-xl border bg-gray-50 p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Webhook Configuration</h3>
          <p className="text-sm text-gray-600 mb-4">
            Add this webhook URL to your payment provider to receive real-time updates:
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value="https://acts29.org/api/webhooks/payments"
              className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-mono"
            />
            <Button type="button" variant="outline">
              Copy
            </Button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button type="submit" loading={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
