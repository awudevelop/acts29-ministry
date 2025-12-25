'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PageHeader } from '@acts29/admin-ui';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Mail,
  MessageSquare,
  Webhook,
  Clock,
  ListPlus,
  ListMinus,
  CheckSquare,
  GitBranch,
  Bell,
  Save,
  Play,
  GripVertical,
} from 'lucide-react';

// Trigger categories and options
const triggerCategories = [
  {
    name: 'Donations',
    triggers: [
      { type: 'donation.created', name: 'New Donation', description: 'When a donation is received' },
      { type: 'donation.recurring.created', name: 'New Recurring Donation', description: 'When a recurring donation is set up' },
      { type: 'donation.recurring.cancelled', name: 'Recurring Cancelled', description: 'When a recurring donation is cancelled' },
      { type: 'donation.failed', name: 'Donation Failed', description: 'When a payment fails' },
    ],
  },
  {
    name: 'Volunteers',
    triggers: [
      { type: 'volunteer.signed_up', name: 'New Volunteer', description: 'When someone signs up to volunteer' },
      { type: 'volunteer.shift_assigned', name: 'Shift Assigned', description: 'When a volunteer is assigned a shift' },
      { type: 'volunteer.shift_upcoming', name: 'Upcoming Shift', description: 'Before a scheduled shift' },
      { type: 'volunteer.shift_completed', name: 'Shift Completed', description: 'When a volunteer completes a shift' },
    ],
  },
  {
    name: 'Events',
    triggers: [
      { type: 'event.created', name: 'New Event', description: 'When an event is created' },
      { type: 'event.registration', name: 'Event Registration', description: 'When someone registers' },
      { type: 'event.cancelled', name: 'Event Cancelled', description: 'When an event is cancelled' },
    ],
  },
  {
    name: 'Cases',
    triggers: [
      { type: 'case.created', name: 'New Case', description: 'When a case is created' },
      { type: 'case.assigned', name: 'Case Assigned', description: 'When a case is assigned' },
      { type: 'case.status_changed', name: 'Status Changed', description: 'When case status changes' },
    ],
  },
  {
    name: 'Other',
    triggers: [
      { type: 'prayer.submitted', name: 'Prayer Request', description: 'When a prayer request is submitted' },
      { type: 'newsletter.subscribed', name: 'Newsletter Signup', description: 'When someone subscribes' },
    ],
  },
  {
    name: 'Schedule',
    triggers: [
      { type: 'schedule.daily', name: 'Daily', description: 'Run at a specific time every day' },
      { type: 'schedule.weekly', name: 'Weekly', description: 'Run on a specific day each week' },
      { type: 'schedule.monthly', name: 'Monthly', description: 'Run on a specific day each month' },
    ],
  },
];

// Action options
const actionOptions = [
  { type: 'send_email', name: 'Send Email', icon: Mail, category: 'Communication' },
  { type: 'send_sms', name: 'Send SMS', icon: MessageSquare, category: 'Communication' },
  { type: 'send_slack', name: 'Send Slack Message', icon: MessageSquare, category: 'Communication' },
  { type: 'send_webhook', name: 'Send Webhook', icon: Webhook, category: 'Integrations' },
  { type: 'create_task', name: 'Create Task', icon: CheckSquare, category: 'Tasks' },
  { type: 'add_to_list', name: 'Add to List', icon: ListPlus, category: 'Marketing' },
  { type: 'remove_from_list', name: 'Remove from List', icon: ListMinus, category: 'Marketing' },
  { type: 'delay', name: 'Delay', icon: Clock, category: 'Flow' },
  { type: 'condition', name: 'Condition', icon: GitBranch, category: 'Flow' },
  { type: 'send_push_notification', name: 'Push Notification', icon: Bell, category: 'Communication' },
];

interface Step {
  id: string;
  actionType: string;
  config: Record<string, string>;
}

export default function NewAutomationPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTrigger, setSelectedTrigger] = useState<string | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [showTriggerPicker, setShowTriggerPicker] = useState(false);
  const [showActionPicker, setShowActionPicker] = useState(false);
  const [saving, setSaving] = useState(false);

  const addStep = (actionType: string) => {
    const newStep: Step = {
      id: `step_${Date.now()}`,
      actionType,
      config: {},
    };
    setSteps([...steps, newStep]);
    setShowActionPicker(false);
  };

  const removeStep = (stepId: string) => {
    setSteps(steps.filter((s) => s.id !== stepId));
  };

  const updateStepConfig = (stepId: string, field: string, value: string) => {
    setSteps(
      steps.map((s) =>
        s.id === stepId ? { ...s, config: { ...s.config, [field]: value } } : s
      )
    );
  };

  const handleSave = async (activate = false) => {
    if (!name || !selectedTrigger || steps.length === 0) {
      alert('Please fill in all required fields');
      return;
    }

    setSaving(true);

    try {
      const response = await fetch('/api/automations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          trigger: { type: selectedTrigger },
          steps: steps.map((s) => ({
            id: s.id,
            action: {
              type: s.actionType,
              config: s.config,
            },
          })),
          isActive: activate,
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push('/admin/automations');
      } else {
        alert(data.error || 'Failed to create automation');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save automation');
    } finally {
      setSaving(false);
    }
  };

  const getActionConfig = (actionType: string) => {
    switch (actionType) {
      case 'send_email':
        return [
          { field: 'to', label: 'To', placeholder: '{{donorEmail}}', type: 'text' },
          { field: 'subject', label: 'Subject', placeholder: 'Thank you for your donation!', type: 'text' },
          { field: 'body', label: 'Message', placeholder: 'Dear {{donorName}},...', type: 'textarea' },
        ];
      case 'send_sms':
        return [
          { field: 'to', label: 'Phone', placeholder: '{{volunteerPhone}}', type: 'text' },
          { field: 'message', label: 'Message', placeholder: 'Hi {{name}}! Reminder...', type: 'textarea' },
        ];
      case 'send_slack':
        return [
          { field: 'channel', label: 'Channel', placeholder: '#donations', type: 'text' },
          { field: 'message', label: 'Message', placeholder: 'New donation from {{donorName}}', type: 'textarea' },
        ];
      case 'send_webhook':
        return [
          { field: 'url', label: 'URL', placeholder: 'https://api.example.com/webhook', type: 'text' },
          { field: 'method', label: 'Method', placeholder: 'POST', type: 'select', options: ['POST', 'GET', 'PUT'] },
        ];
      case 'delay':
        return [
          { field: 'duration', label: 'Duration', placeholder: '1', type: 'number' },
          { field: 'unit', label: 'Unit', type: 'select', options: ['minutes', 'hours', 'days'] },
        ];
      case 'create_task':
        return [
          { field: 'title', label: 'Task Title', placeholder: 'Follow up with {{donorName}}', type: 'text' },
          { field: 'dueIn', label: 'Due In (days)', placeholder: '3', type: 'number' },
          { field: 'priority', label: 'Priority', type: 'select', options: ['low', 'medium', 'high'] },
        ];
      case 'add_to_list':
      case 'remove_from_list':
        return [
          { field: 'email', label: 'Email', placeholder: '{{donorEmail}}', type: 'text' },
          { field: 'listId', label: 'List', type: 'select', options: ['newsletter', 'donor-updates', 'event-reminders', 'volunteers'] },
        ];
      default:
        return [];
    }
  };

  const selectedTriggerInfo = triggerCategories
    .flatMap((c) => c.triggers)
    .find((t) => t.type === selectedTrigger);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/automations"
          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <PageHeader
          title="Create Automation"
          description="Build a workflow that runs automatically"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Builder */}
        <div className="lg:col-span-2 space-y-6">
          {/* Name & Description */}
          <div className="rounded-lg border bg-white p-6">
            <h3 className="font-medium text-gray-900 mb-4">Automation Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Welcome New Donor"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What does this automation do?"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Trigger */}
          <div className="rounded-lg border bg-white p-6">
            <h3 className="font-medium text-gray-900 mb-4">When this happens...</h3>

            {selectedTrigger ? (
              <div className="flex items-center justify-between rounded-lg border-2 border-primary-200 bg-primary-50 p-4">
                <div>
                  <p className="font-medium text-primary-900">{selectedTriggerInfo?.name}</p>
                  <p className="text-sm text-primary-700">{selectedTriggerInfo?.description}</p>
                </div>
                <button
                  onClick={() => setShowTriggerPicker(true)}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Change
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowTriggerPicker(true)}
                className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 p-6 text-gray-500 hover:border-primary-300 hover:text-primary-600"
              >
                <Plus className="h-5 w-5" />
                Choose a trigger
              </button>
            )}

            {/* Trigger Picker Modal */}
            {showTriggerPicker && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="max-h-[80vh] w-full max-w-2xl overflow-auto rounded-xl bg-white p-6 shadow-xl">
                  <h3 className="text-lg font-semibold mb-4">Choose a Trigger</h3>
                  <div className="space-y-4">
                    {triggerCategories.map((category) => (
                      <div key={category.name}>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">{category.name}</h4>
                        <div className="grid gap-2 md:grid-cols-2">
                          {category.triggers.map((trigger) => (
                            <button
                              key={trigger.type}
                              onClick={() => {
                                setSelectedTrigger(trigger.type);
                                setShowTriggerPicker(false);
                              }}
                              className={`flex flex-col items-start rounded-lg border-2 p-3 text-left transition ${
                                selectedTrigger === trigger.type
                                  ? 'border-primary-500 bg-primary-50'
                                  : 'border-gray-200 hover:border-primary-300'
                              }`}
                            >
                              <span className="font-medium text-gray-900">{trigger.name}</span>
                              <span className="text-sm text-gray-500">{trigger.description}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => setShowTriggerPicker(false)}
                      className="rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Steps */}
          <div className="rounded-lg border bg-white p-6">
            <h3 className="font-medium text-gray-900 mb-4">Then do this...</h3>

            <div className="space-y-4">
              {steps.map((step, index) => {
                const actionInfo = actionOptions.find((a) => a.type === step.actionType);
                const Icon = actionInfo?.icon || Mail;
                const configFields = getActionConfig(step.actionType);

                return (
                  <div key={step.id} className="rounded-lg border bg-gray-50 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <GripVertical className="h-4 w-4 text-gray-400 cursor-grab" />
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-xs font-medium text-primary-700">
                          {index + 1}
                        </span>
                        <Icon className="h-4 w-4 text-gray-600" />
                        <span className="font-medium">{actionInfo?.name}</span>
                      </div>
                      <button
                        onClick={() => removeStep(step.id)}
                        className="rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      {configFields.map((field) => (
                        <div key={field.field} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                          <label className="block text-sm text-gray-600">{field.label}</label>
                          {field.type === 'textarea' ? (
                            <textarea
                              value={step.config[field.field] || ''}
                              onChange={(e) => updateStepConfig(step.id, field.field, e.target.value)}
                              placeholder={field.placeholder}
                              rows={3}
                              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-primary-500"
                            />
                          ) : field.type === 'select' ? (
                            <select
                              value={step.config[field.field] || ''}
                              onChange={(e) => updateStepConfig(step.id, field.field, e.target.value)}
                              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-primary-500"
                            >
                              <option value="">Select...</option>
                              {field.options?.map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type={field.type}
                              value={step.config[field.field] || ''}
                              onChange={(e) => updateStepConfig(step.id, field.field, e.target.value)}
                              placeholder={field.placeholder}
                              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-primary-500"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Add Step Button */}
              <button
                onClick={() => setShowActionPicker(true)}
                className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 p-4 text-gray-500 hover:border-primary-300 hover:text-primary-600"
              >
                <Plus className="h-5 w-5" />
                Add a step
              </button>

              {/* Action Picker Modal */}
              {showActionPicker && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                  <div className="max-h-[80vh] w-full max-w-xl overflow-auto rounded-xl bg-white p-6 shadow-xl">
                    <h3 className="text-lg font-semibold mb-4">Choose an Action</h3>
                    <div className="grid gap-2 md:grid-cols-2">
                      {actionOptions.map((action) => {
                        const Icon = action.icon;
                        return (
                          <button
                            key={action.type}
                            onClick={() => addStep(action.type)}
                            className="flex items-center gap-3 rounded-lg border-2 border-gray-200 p-3 text-left transition hover:border-primary-300 hover:bg-primary-50"
                          >
                            <div className="rounded-lg bg-gray-100 p-2">
                              <Icon className="h-5 w-5 text-gray-600" />
                            </div>
                            <div>
                              <span className="font-medium text-gray-900">{action.name}</span>
                              <p className="text-xs text-gray-500">{action.category}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={() => setShowActionPicker(false)}
                        className="rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Save Actions */}
          <div className="rounded-lg border bg-white p-4">
            <div className="space-y-3">
              <button
                onClick={() => handleSave(true)}
                disabled={saving || !name || !selectedTrigger || steps.length === 0}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2 font-medium text-white transition hover:bg-primary-700 disabled:opacity-50"
              >
                <Play className="h-4 w-4" />
                {saving ? 'Saving...' : 'Save & Activate'}
              </button>
              <button
                onClick={() => handleSave(false)}
                disabled={saving || !name || !selectedTrigger || steps.length === 0}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                Save as Draft
              </button>
            </div>
          </div>

          {/* Variables Help */}
          <div className="rounded-lg border bg-white p-4">
            <h4 className="font-medium text-gray-900 mb-3">Available Variables</h4>
            <p className="text-sm text-gray-600 mb-3">
              Use these in your messages to personalize content:
            </p>
            <div className="space-y-1 text-xs font-mono">
              {selectedTrigger?.startsWith('donation') && (
                <>
                  <p className="text-gray-600">{'{{donorEmail}}'}</p>
                  <p className="text-gray-600">{'{{donorName}}'}</p>
                  <p className="text-gray-600">{'{{amount}}'}</p>
                </>
              )}
              {selectedTrigger?.startsWith('volunteer') && (
                <>
                  <p className="text-gray-600">{'{{volunteerName}}'}</p>
                  <p className="text-gray-600">{'{{volunteerEmail}}'}</p>
                  <p className="text-gray-600">{'{{volunteerPhone}}'}</p>
                  <p className="text-gray-600">{'{{shiftTitle}}'}</p>
                  <p className="text-gray-600">{'{{shiftDate}}'}</p>
                  <p className="text-gray-600">{'{{shiftTime}}'}</p>
                  <p className="text-gray-600">{'{{shiftLocation}}'}</p>
                </>
              )}
              {selectedTrigger?.startsWith('event') && (
                <>
                  <p className="text-gray-600">{'{{eventTitle}}'}</p>
                  <p className="text-gray-600">{'{{eventDate}}'}</p>
                  <p className="text-gray-600">{'{{attendeeName}}'}</p>
                  <p className="text-gray-600">{'{{attendeeEmail}}'}</p>
                </>
              )}
              {selectedTrigger?.startsWith('case') && (
                <>
                  <p className="text-gray-600">{'{{caseId}}'}</p>
                  <p className="text-gray-600">{'{{clientName}}'}</p>
                  <p className="text-gray-600">{'{{priority}}'}</p>
                </>
              )}
              {selectedTrigger?.startsWith('prayer') && (
                <>
                  <p className="text-gray-600">{'{{requesterName}}'}</p>
                  <p className="text-gray-600">{'{{requesterEmail}}'}</p>
                  <p className="text-gray-600">{'{{request}}'}</p>
                </>
              )}
              {!selectedTrigger && (
                <p className="text-gray-400">Select a trigger to see available variables</p>
              )}
            </div>
          </div>

          {/* Tips */}
          <div className="rounded-lg border bg-blue-50 p-4">
            <h4 className="font-medium text-blue-900 mb-2">Tips</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Add a delay step to space out emails</li>
              <li>• Use conditions to filter when actions run</li>
              <li>• Test with sample data before activating</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
