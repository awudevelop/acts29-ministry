import { z } from 'zod';

// ============================================
// Core Types
// ============================================

export type TriggerType =
  | 'donation.created'
  | 'donation.recurring.created'
  | 'donation.recurring.cancelled'
  | 'donation.failed'
  | 'volunteer.signed_up'
  | 'volunteer.shift_assigned'
  | 'volunteer.shift_completed'
  | 'volunteer.shift_upcoming'
  | 'event.created'
  | 'event.registration'
  | 'event.reminder'
  | 'event.cancelled'
  | 'case.created'
  | 'case.status_changed'
  | 'case.assigned'
  | 'prayer.submitted'
  | 'prayer.answered'
  | 'newsletter.subscribed'
  | 'newsletter.unsubscribed'
  | 'schedule.daily'
  | 'schedule.weekly'
  | 'schedule.monthly'
  | 'webhook.received';

export type ActionType =
  | 'send_email'
  | 'send_sms'
  | 'send_slack'
  | 'send_webhook'
  | 'create_task'
  | 'update_record'
  | 'add_to_list'
  | 'remove_from_list'
  | 'delay'
  | 'condition'
  | 'send_push_notification';

export interface TriggerConfig {
  type: TriggerType;
  filters?: Record<string, unknown>;
  schedule?: {
    time?: string; // HH:MM format
    dayOfWeek?: number; // 0-6
    dayOfMonth?: number; // 1-31
    timezone?: string;
  };
}

export interface ActionConfig {
  type: ActionType;
  config: Record<string, unknown>;
}

export interface Condition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'is_empty' | 'is_not_empty';
  value: unknown;
}

export interface AutomationStep {
  id: string;
  action: ActionConfig;
  conditions?: Condition[];
  onSuccess?: string; // Next step ID
  onFailure?: string; // Step ID on failure
}

export interface Automation {
  id: string;
  name: string;
  description?: string;
  trigger: TriggerConfig;
  steps: AutomationStep[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastRunAt?: Date;
  runCount: number;
  organizationId: string;
}

export interface AutomationRun {
  id: string;
  automationId: string;
  triggeredBy: string;
  triggerData: Record<string, unknown>;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  steps: Array<{
    stepId: string;
    status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
    startedAt?: Date;
    completedAt?: Date;
    error?: string;
    output?: Record<string, unknown>;
  }>;
  startedAt: Date;
  completedAt?: Date;
  error?: string;
}

// ============================================
// Trigger Definitions
// ============================================

export const TRIGGER_DEFINITIONS: Record<TriggerType, {
  name: string;
  description: string;
  category: string;
  dataSchema: z.ZodObject<z.ZodRawShape>;
  availableFilters: Array<{ field: string; label: string; type: 'string' | 'number' | 'boolean' | 'select'; options?: string[] }>;
}> = {
  'donation.created': {
    name: 'New Donation',
    description: 'Triggers when a new donation is received',
    category: 'Donations',
    dataSchema: z.object({
      donationId: z.string(),
      amount: z.number(),
      donorEmail: z.string(),
      donorName: z.string().optional(),
      paymentMethod: z.enum(['card', 'ach']),
      isRecurring: z.boolean(),
    }),
    availableFilters: [
      { field: 'amount', label: 'Amount (cents)', type: 'number' },
      { field: 'paymentMethod', label: 'Payment Method', type: 'select', options: ['card', 'ach'] },
      { field: 'isRecurring', label: 'Is Recurring', type: 'boolean' },
    ],
  },
  'donation.recurring.created': {
    name: 'New Recurring Donation',
    description: 'Triggers when a recurring donation subscription is set up',
    category: 'Donations',
    dataSchema: z.object({
      subscriptionId: z.string(),
      amount: z.number(),
      interval: z.enum(['weekly', 'monthly', 'quarterly', 'yearly']),
      donorEmail: z.string(),
      donorName: z.string().optional(),
    }),
    availableFilters: [
      { field: 'amount', label: 'Amount (cents)', type: 'number' },
      { field: 'interval', label: 'Interval', type: 'select', options: ['weekly', 'monthly', 'quarterly', 'yearly'] },
    ],
  },
  'donation.recurring.cancelled': {
    name: 'Recurring Donation Cancelled',
    description: 'Triggers when a recurring donation is cancelled',
    category: 'Donations',
    dataSchema: z.object({
      subscriptionId: z.string(),
      donorEmail: z.string(),
      donorName: z.string().optional(),
      reason: z.string().optional(),
    }),
    availableFilters: [],
  },
  'donation.failed': {
    name: 'Donation Failed',
    description: 'Triggers when a donation payment fails',
    category: 'Donations',
    dataSchema: z.object({
      donationId: z.string(),
      donorEmail: z.string(),
      failureReason: z.string(),
    }),
    availableFilters: [],
  },
  'volunteer.signed_up': {
    name: 'New Volunteer Signup',
    description: 'Triggers when someone signs up to volunteer',
    category: 'Volunteers',
    dataSchema: z.object({
      volunteerId: z.string(),
      name: z.string(),
      email: z.string(),
      phone: z.string().optional(),
      interests: z.array(z.string()).optional(),
    }),
    availableFilters: [],
  },
  'volunteer.shift_assigned': {
    name: 'Shift Assigned',
    description: 'Triggers when a volunteer is assigned to a shift',
    category: 'Volunteers',
    dataSchema: z.object({
      volunteerId: z.string(),
      volunteerName: z.string(),
      volunteerEmail: z.string(),
      shiftId: z.string(),
      shiftTitle: z.string(),
      shiftDate: z.string(),
      shiftTime: z.string(),
      shiftLocation: z.string(),
    }),
    availableFilters: [],
  },
  'volunteer.shift_completed': {
    name: 'Shift Completed',
    description: 'Triggers when a volunteer completes a shift',
    category: 'Volunteers',
    dataSchema: z.object({
      volunteerId: z.string(),
      volunteerName: z.string(),
      volunteerEmail: z.string(),
      shiftId: z.string(),
      hoursWorked: z.number(),
    }),
    availableFilters: [
      { field: 'hoursWorked', label: 'Hours Worked', type: 'number' },
    ],
  },
  'volunteer.shift_upcoming': {
    name: 'Upcoming Shift Reminder',
    description: 'Triggers before a scheduled shift (configurable time)',
    category: 'Volunteers',
    dataSchema: z.object({
      volunteerId: z.string(),
      volunteerName: z.string(),
      volunteerEmail: z.string(),
      volunteerPhone: z.string().optional(),
      shiftId: z.string(),
      shiftTitle: z.string(),
      shiftDate: z.string(),
      shiftTime: z.string(),
      shiftLocation: z.string(),
      hoursUntilShift: z.number(),
    }),
    availableFilters: [
      { field: 'hoursUntilShift', label: 'Hours Before Shift', type: 'number' },
    ],
  },
  'event.created': {
    name: 'New Event Created',
    description: 'Triggers when a new event is created',
    category: 'Events',
    dataSchema: z.object({
      eventId: z.string(),
      title: z.string(),
      date: z.string(),
      location: z.string(),
      isPublic: z.boolean(),
    }),
    availableFilters: [
      { field: 'isPublic', label: 'Is Public', type: 'boolean' },
    ],
  },
  'event.registration': {
    name: 'Event Registration',
    description: 'Triggers when someone registers for an event',
    category: 'Events',
    dataSchema: z.object({
      eventId: z.string(),
      eventTitle: z.string(),
      eventDate: z.string(),
      attendeeName: z.string(),
      attendeeEmail: z.string(),
    }),
    availableFilters: [],
  },
  'event.reminder': {
    name: 'Event Reminder',
    description: 'Triggers before an event (configurable time)',
    category: 'Events',
    dataSchema: z.object({
      eventId: z.string(),
      eventTitle: z.string(),
      eventDate: z.string(),
      eventLocation: z.string(),
      attendees: z.array(z.object({
        name: z.string(),
        email: z.string(),
      })),
    }),
    availableFilters: [],
  },
  'event.cancelled': {
    name: 'Event Cancelled',
    description: 'Triggers when an event is cancelled',
    category: 'Events',
    dataSchema: z.object({
      eventId: z.string(),
      eventTitle: z.string(),
      eventDate: z.string(),
      reason: z.string().optional(),
      attendeeEmails: z.array(z.string()),
    }),
    availableFilters: [],
  },
  'case.created': {
    name: 'New Case Created',
    description: 'Triggers when a new case is created',
    category: 'Cases',
    dataSchema: z.object({
      caseId: z.string(),
      clientName: z.string(),
      priority: z.enum(['low', 'medium', 'high', 'urgent']),
      needs: z.array(z.string()),
    }),
    availableFilters: [
      { field: 'priority', label: 'Priority', type: 'select', options: ['low', 'medium', 'high', 'urgent'] },
    ],
  },
  'case.status_changed': {
    name: 'Case Status Changed',
    description: 'Triggers when a case status is updated',
    category: 'Cases',
    dataSchema: z.object({
      caseId: z.string(),
      clientName: z.string(),
      previousStatus: z.string(),
      newStatus: z.string(),
    }),
    availableFilters: [
      { field: 'newStatus', label: 'New Status', type: 'string' },
    ],
  },
  'case.assigned': {
    name: 'Case Assigned',
    description: 'Triggers when a case is assigned to a team member',
    category: 'Cases',
    dataSchema: z.object({
      caseId: z.string(),
      clientName: z.string(),
      assignedToId: z.string(),
      assignedToName: z.string(),
      assignedToEmail: z.string(),
    }),
    availableFilters: [],
  },
  'prayer.submitted': {
    name: 'Prayer Request Submitted',
    description: 'Triggers when a new prayer request is submitted',
    category: 'Prayer',
    dataSchema: z.object({
      prayerId: z.string(),
      requesterName: z.string(),
      requesterEmail: z.string().optional(),
      request: z.string(),
      isAnonymous: z.boolean(),
    }),
    availableFilters: [
      { field: 'isAnonymous', label: 'Is Anonymous', type: 'boolean' },
    ],
  },
  'prayer.answered': {
    name: 'Prayer Marked Answered',
    description: 'Triggers when a prayer request is marked as answered',
    category: 'Prayer',
    dataSchema: z.object({
      prayerId: z.string(),
      requesterName: z.string(),
      requesterEmail: z.string().optional(),
    }),
    availableFilters: [],
  },
  'newsletter.subscribed': {
    name: 'Newsletter Subscription',
    description: 'Triggers when someone subscribes to the newsletter',
    category: 'Marketing',
    dataSchema: z.object({
      subscriberId: z.string(),
      email: z.string(),
      name: z.string().optional(),
      lists: z.array(z.string()),
    }),
    availableFilters: [],
  },
  'newsletter.unsubscribed': {
    name: 'Newsletter Unsubscription',
    description: 'Triggers when someone unsubscribes from the newsletter',
    category: 'Marketing',
    dataSchema: z.object({
      email: z.string(),
      lists: z.array(z.string()),
    }),
    availableFilters: [],
  },
  'schedule.daily': {
    name: 'Daily Schedule',
    description: 'Triggers at a specific time every day',
    category: 'Schedule',
    dataSchema: z.object({
      timestamp: z.string(),
    }),
    availableFilters: [],
  },
  'schedule.weekly': {
    name: 'Weekly Schedule',
    description: 'Triggers at a specific time on a specific day each week',
    category: 'Schedule',
    dataSchema: z.object({
      timestamp: z.string(),
      dayOfWeek: z.number(),
    }),
    availableFilters: [],
  },
  'schedule.monthly': {
    name: 'Monthly Schedule',
    description: 'Triggers at a specific time on a specific day each month',
    category: 'Schedule',
    dataSchema: z.object({
      timestamp: z.string(),
      dayOfMonth: z.number(),
    }),
    availableFilters: [],
  },
  'webhook.received': {
    name: 'Webhook Received',
    description: 'Triggers when a webhook is received from an external service',
    category: 'Integrations',
    dataSchema: z.object({
      source: z.string(),
      payload: z.record(z.unknown()),
    }),
    availableFilters: [
      { field: 'source', label: 'Source', type: 'string' },
    ],
  },
};

// ============================================
// Action Definitions
// ============================================

export const ACTION_DEFINITIONS: Record<ActionType, {
  name: string;
  description: string;
  category: string;
  configSchema: z.ZodObject<z.ZodRawShape>;
  configFields: Array<{
    field: string;
    label: string;
    type: 'text' | 'textarea' | 'email' | 'select' | 'number' | 'boolean' | 'template';
    required?: boolean;
    placeholder?: string;
    options?: Array<{ value: string; label: string }>;
    helpText?: string;
  }>;
}> = {
  'send_email': {
    name: 'Send Email',
    description: 'Send an email to one or more recipients',
    category: 'Communication',
    configSchema: z.object({
      to: z.string(), // Can use {{donorEmail}} style variables
      subject: z.string(),
      templateId: z.string().optional(),
      body: z.string().optional(),
      replyTo: z.string().optional(),
    }),
    configFields: [
      { field: 'to', label: 'To', type: 'text', required: true, placeholder: '{{donorEmail}}', helpText: 'Use {{variable}} for dynamic values' },
      { field: 'subject', label: 'Subject', type: 'text', required: true },
      { field: 'templateId', label: 'Email Template', type: 'select', options: [
        { value: 'donation_receipt', label: 'Donation Receipt' },
        { value: 'welcome', label: 'Welcome Email' },
        { value: 'event_reminder', label: 'Event Reminder' },
        { value: 'custom', label: 'Custom Message' },
      ]},
      { field: 'body', label: 'Message Body', type: 'template', helpText: 'Use {{variable}} for dynamic values' },
      { field: 'replyTo', label: 'Reply To', type: 'email' },
    ],
  },
  'send_sms': {
    name: 'Send SMS',
    description: 'Send an SMS message',
    category: 'Communication',
    configSchema: z.object({
      to: z.string(),
      message: z.string(),
    }),
    configFields: [
      { field: 'to', label: 'Phone Number', type: 'text', required: true, placeholder: '{{volunteerPhone}}' },
      { field: 'message', label: 'Message', type: 'textarea', required: true, helpText: 'Max 160 characters for single SMS' },
    ],
  },
  'send_slack': {
    name: 'Send Slack Message',
    description: 'Send a message to a Slack channel or user',
    category: 'Communication',
    configSchema: z.object({
      channel: z.string(),
      message: z.string(),
      mentionUsers: z.array(z.string()).optional(),
    }),
    configFields: [
      { field: 'channel', label: 'Channel', type: 'text', required: true, placeholder: '#general or @username' },
      { field: 'message', label: 'Message', type: 'textarea', required: true },
    ],
  },
  'send_webhook': {
    name: 'Send Webhook',
    description: 'Send data to an external URL',
    category: 'Integrations',
    configSchema: z.object({
      url: z.string().url(),
      method: z.enum(['GET', 'POST', 'PUT', 'PATCH']),
      headers: z.record(z.string()).optional(),
      body: z.string().optional(),
    }),
    configFields: [
      { field: 'url', label: 'Webhook URL', type: 'text', required: true },
      { field: 'method', label: 'HTTP Method', type: 'select', required: true, options: [
        { value: 'POST', label: 'POST' },
        { value: 'GET', label: 'GET' },
        { value: 'PUT', label: 'PUT' },
        { value: 'PATCH', label: 'PATCH' },
      ]},
      { field: 'body', label: 'Request Body (JSON)', type: 'textarea', helpText: 'Use {{variable}} for dynamic values' },
    ],
  },
  'create_task': {
    name: 'Create Task',
    description: 'Create a follow-up task for the team',
    category: 'Tasks',
    configSchema: z.object({
      title: z.string(),
      description: z.string().optional(),
      assignTo: z.string().optional(),
      dueIn: z.number().optional(), // Days from now
      priority: z.enum(['low', 'medium', 'high']).optional(),
    }),
    configFields: [
      { field: 'title', label: 'Task Title', type: 'text', required: true },
      { field: 'description', label: 'Description', type: 'textarea' },
      { field: 'assignTo', label: 'Assign To', type: 'text', placeholder: 'User ID or email' },
      { field: 'dueIn', label: 'Due In (days)', type: 'number' },
      { field: 'priority', label: 'Priority', type: 'select', options: [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' },
      ]},
    ],
  },
  'update_record': {
    name: 'Update Record',
    description: 'Update a database record',
    category: 'Data',
    configSchema: z.object({
      recordType: z.enum(['donor', 'volunteer', 'case', 'event']),
      recordId: z.string(),
      updates: z.record(z.unknown()),
    }),
    configFields: [
      { field: 'recordType', label: 'Record Type', type: 'select', required: true, options: [
        { value: 'donor', label: 'Donor' },
        { value: 'volunteer', label: 'Volunteer' },
        { value: 'case', label: 'Case' },
        { value: 'event', label: 'Event' },
      ]},
      { field: 'recordId', label: 'Record ID', type: 'text', required: true, placeholder: '{{donorId}}' },
    ],
  },
  'add_to_list': {
    name: 'Add to List',
    description: 'Add a contact to a mailing list or segment',
    category: 'Marketing',
    configSchema: z.object({
      email: z.string(),
      listId: z.string(),
    }),
    configFields: [
      { field: 'email', label: 'Email', type: 'text', required: true, placeholder: '{{donorEmail}}' },
      { field: 'listId', label: 'List', type: 'select', required: true, options: [
        { value: 'newsletter', label: 'Newsletter' },
        { value: 'donor-updates', label: 'Donor Updates' },
        { value: 'event-reminders', label: 'Event Reminders' },
        { value: 'volunteers', label: 'Volunteers' },
      ]},
    ],
  },
  'remove_from_list': {
    name: 'Remove from List',
    description: 'Remove a contact from a mailing list',
    category: 'Marketing',
    configSchema: z.object({
      email: z.string(),
      listId: z.string(),
    }),
    configFields: [
      { field: 'email', label: 'Email', type: 'text', required: true },
      { field: 'listId', label: 'List', type: 'select', required: true, options: [
        { value: 'newsletter', label: 'Newsletter' },
        { value: 'donor-updates', label: 'Donor Updates' },
        { value: 'event-reminders', label: 'Event Reminders' },
      ]},
    ],
  },
  'delay': {
    name: 'Delay',
    description: 'Wait before executing the next step',
    category: 'Flow Control',
    configSchema: z.object({
      duration: z.number(),
      unit: z.enum(['minutes', 'hours', 'days']),
    }),
    configFields: [
      { field: 'duration', label: 'Duration', type: 'number', required: true },
      { field: 'unit', label: 'Unit', type: 'select', required: true, options: [
        { value: 'minutes', label: 'Minutes' },
        { value: 'hours', label: 'Hours' },
        { value: 'days', label: 'Days' },
      ]},
    ],
  },
  'condition': {
    name: 'Condition',
    description: 'Branch based on a condition',
    category: 'Flow Control',
    configSchema: z.object({
      conditions: z.array(z.object({
        field: z.string(),
        operator: z.enum(['equals', 'not_equals', 'contains', 'greater_than', 'less_than']),
        value: z.unknown(),
      })),
      matchType: z.enum(['all', 'any']),
    }),
    configFields: [
      { field: 'matchType', label: 'Match', type: 'select', required: true, options: [
        { value: 'all', label: 'All conditions (AND)' },
        { value: 'any', label: 'Any condition (OR)' },
      ]},
    ],
  },
  'send_push_notification': {
    name: 'Send Push Notification',
    description: 'Send a push notification to mobile app users',
    category: 'Communication',
    configSchema: z.object({
      userId: z.string(),
      title: z.string(),
      body: z.string(),
      data: z.record(z.unknown()).optional(),
    }),
    configFields: [
      { field: 'userId', label: 'User ID', type: 'text', required: true },
      { field: 'title', label: 'Title', type: 'text', required: true },
      { field: 'body', label: 'Message', type: 'textarea', required: true },
    ],
  },
};

// ============================================
// Automation Templates
// ============================================

export const AUTOMATION_TEMPLATES: Array<{
  id: string;
  name: string;
  description: string;
  category: string;
  trigger: TriggerConfig;
  steps: AutomationStep[];
}> = [
  {
    id: 'welcome_new_donor',
    name: 'Welcome New Donor',
    description: 'Send a thank you email and add to donor list when someone makes their first donation',
    category: 'Donations',
    trigger: { type: 'donation.created' },
    steps: [
      {
        id: 'step1',
        action: {
          type: 'send_email',
          config: {
            to: '{{donorEmail}}',
            subject: 'Thank you for your generous gift!',
            templateId: 'donation_receipt',
          },
        },
      },
      {
        id: 'step2',
        action: {
          type: 'add_to_list',
          config: {
            email: '{{donorEmail}}',
            listId: 'donor-updates',
          },
        },
      },
      {
        id: 'step3',
        action: {
          type: 'send_slack',
          config: {
            channel: '#donations',
            message: 'New donation received from {{donorName}}: ${{amount}}',
          },
        },
      },
    ],
  },
  {
    id: 'volunteer_shift_reminder',
    name: 'Volunteer Shift Reminder',
    description: 'Send SMS and email reminders 24 hours before a scheduled shift',
    category: 'Volunteers',
    trigger: {
      type: 'volunteer.shift_upcoming',
      filters: { hoursUntilShift: 24 },
    },
    steps: [
      {
        id: 'step1',
        action: {
          type: 'send_email',
          config: {
            to: '{{volunteerEmail}}',
            subject: 'Reminder: Your shift tomorrow',
            templateId: 'event_reminder',
          },
        },
      },
      {
        id: 'step2',
        action: {
          type: 'send_sms',
          config: {
            to: '{{volunteerPhone}}',
            message: 'Hi {{volunteerName}}! Reminder: {{shiftTitle}} tomorrow at {{shiftTime}}. Location: {{shiftLocation}}',
          },
        },
        conditions: [{ field: 'volunteerPhone', operator: 'is_not_empty', value: null }],
      },
    ],
  },
  {
    id: 'new_prayer_request_notification',
    name: 'New Prayer Request Notification',
    description: 'Notify the prayer team when a new request is submitted',
    category: 'Prayer',
    trigger: { type: 'prayer.submitted' },
    steps: [
      {
        id: 'step1',
        action: {
          type: 'send_email',
          config: {
            to: 'prayer-team@acts29ministry.org',
            subject: 'New Prayer Request',
            body: 'A new prayer request has been submitted:\n\n{{request}}\n\nPlease lift this up in prayer.',
          },
        },
      },
      {
        id: 'step2',
        action: {
          type: 'send_email',
          config: {
            to: '{{requesterEmail}}',
            subject: 'We received your prayer request',
            body: 'Dear {{requesterName}},\n\nThank you for sharing your prayer request with us. Our prayer team has received it and is lifting you up in prayer.\n\n"Cast all your anxiety on him because he cares for you." - 1 Peter 5:7\n\nBlessings,\nActs 29 Prayer Team',
          },
        },
        conditions: [{ field: 'requesterEmail', operator: 'is_not_empty', value: null }],
      },
    ],
  },
  {
    id: 'recurring_donation_cancelled',
    name: 'Recurring Donation Cancellation Follow-up',
    description: 'Send a follow-up email when a recurring donation is cancelled',
    category: 'Donations',
    trigger: { type: 'donation.recurring.cancelled' },
    steps: [
      {
        id: 'step1',
        action: {
          type: 'delay',
          config: { duration: 1, unit: 'days' },
        },
      },
      {
        id: 'step2',
        action: {
          type: 'send_email',
          config: {
            to: '{{donorEmail}}',
            subject: 'We appreciate your past support',
            body: 'Dear {{donorName}},\n\nWe noticed you cancelled your recurring donation. We understand that circumstances change, and we want to thank you for your past support.\n\nYour generosity has made a real difference in our community. If you ever want to resume your giving or have questions, please don\'t hesitate to reach out.\n\nGod bless you,\nActs 29 Ministry',
          },
        },
      },
      {
        id: 'step3',
        action: {
          type: 'create_task',
          config: {
            title: 'Follow up with cancelled donor: {{donorName}}',
            description: 'Recurring donation cancelled. Consider a personal follow-up call.',
            dueIn: 7,
            priority: 'medium',
          },
        },
      },
    ],
  },
  {
    id: 'urgent_case_alert',
    name: 'Urgent Case Alert',
    description: 'Immediately notify team via SMS and Slack when an urgent case is created',
    category: 'Cases',
    trigger: {
      type: 'case.created',
      filters: { priority: 'urgent' },
    },
    steps: [
      {
        id: 'step1',
        action: {
          type: 'send_slack',
          config: {
            channel: '#urgent-cases',
            message: '🚨 URGENT CASE: {{clientName}} needs immediate assistance. Needs: {{needs}}',
          },
        },
      },
      {
        id: 'step2',
        action: {
          type: 'send_sms',
          config: {
            to: '+15551234567', // On-call coordinator
            message: 'URGENT: New case created for {{clientName}}. Please check Slack #urgent-cases immediately.',
          },
        },
      },
    ],
  },
  {
    id: 'weekly_volunteer_digest',
    name: 'Weekly Volunteer Digest',
    description: 'Send a weekly summary email to all volunteers every Monday',
    category: 'Volunteers',
    trigger: {
      type: 'schedule.weekly',
      schedule: { dayOfWeek: 1, time: '09:00', timezone: 'America/Chicago' },
    },
    steps: [
      {
        id: 'step1',
        action: {
          type: 'send_email',
          config: {
            to: 'volunteers@acts29ministry.org',
            subject: 'Weekly Volunteer Update',
            templateId: 'weekly_digest',
          },
        },
      },
    ],
  },
];

// ============================================
// Automation Engine Functions
// ============================================

/**
 * Parse template variables in a string
 * e.g., "Hello {{name}}" with { name: "John" } => "Hello John"
 */
export function parseTemplateVariables(
  template: string,
  data: Record<string, unknown>
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    const value = data[key];
    if (value === undefined || value === null) return match;
    return String(value);
  });
}

/**
 * Evaluate a condition against data
 */
export function evaluateCondition(
  condition: Condition,
  data: Record<string, unknown>
): boolean {
  const fieldValue = data[condition.field];

  switch (condition.operator) {
    case 'equals':
      return fieldValue === condition.value;
    case 'not_equals':
      return fieldValue !== condition.value;
    case 'contains':
      return String(fieldValue).includes(String(condition.value));
    case 'greater_than':
      return Number(fieldValue) > Number(condition.value);
    case 'less_than':
      return Number(fieldValue) < Number(condition.value);
    case 'is_empty':
      return fieldValue === null || fieldValue === undefined || fieldValue === '';
    case 'is_not_empty':
      return fieldValue !== null && fieldValue !== undefined && fieldValue !== '';
    default:
      return false;
  }
}

/**
 * Evaluate multiple conditions
 */
export function evaluateConditions(
  conditions: Condition[],
  data: Record<string, unknown>,
  matchType: 'all' | 'any' = 'all'
): boolean {
  if (conditions.length === 0) return true;

  if (matchType === 'all') {
    return conditions.every((c) => evaluateCondition(c, data));
  } else {
    return conditions.some((c) => evaluateCondition(c, data));
  }
}

/**
 * Get available triggers grouped by category
 */
export function getTriggersByCategory(): Record<string, Array<{ type: TriggerType; name: string; description: string }>> {
  const grouped: Record<string, Array<{ type: TriggerType; name: string; description: string }>> = {};

  for (const [type, def] of Object.entries(TRIGGER_DEFINITIONS)) {
    if (!grouped[def.category]) {
      grouped[def.category] = [];
    }
    grouped[def.category].push({
      type: type as TriggerType,
      name: def.name,
      description: def.description,
    });
  }

  return grouped;
}

/**
 * Get available actions grouped by category
 */
export function getActionsByCategory(): Record<string, Array<{ type: ActionType; name: string; description: string }>> {
  const grouped: Record<string, Array<{ type: ActionType; name: string; description: string }>> = {};

  for (const [type, def] of Object.entries(ACTION_DEFINITIONS)) {
    if (!grouped[def.category]) {
      grouped[def.category] = [];
    }
    grouped[def.category].push({
      type: type as ActionType,
      name: def.name,
      description: def.description,
    });
  }

  return grouped;
}
