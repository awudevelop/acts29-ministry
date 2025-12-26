// ============================================
// Twilio Webhook Handling for Two-Way SMS
// ============================================

import crypto from 'crypto';
import {
  ConsentManager,
  parseKeywordType,
} from './consent';

// ============================================
// Twilio Webhook Types
// ============================================

/**
 * Incoming SMS message from Twilio
 */
export interface TwilioIncomingMessage {
  MessageSid: string;
  AccountSid: string;
  MessagingServiceSid?: string;
  From: string;
  To: string;
  Body: string;
  NumMedia: string;
  MediaContentType0?: string;
  MediaUrl0?: string;
  // Location data (if user shares)
  FromCity?: string;
  FromState?: string;
  FromZip?: string;
  FromCountry?: string;
  // Additional metadata
  ApiVersion?: string;
  SmsMessageSid?: string;
  NumSegments?: string;
  ReferralNumMedia?: string;
}

/**
 * Twilio message status webhook
 */
export interface TwilioStatusCallback {
  MessageSid: string;
  AccountSid: string;
  MessageStatus: 'queued' | 'failed' | 'sent' | 'delivered' | 'undelivered' | 'read';
  ErrorCode?: string;
  ErrorMessage?: string;
  To: string;
  From: string;
  ApiVersion?: string;
}

/**
 * Response to send back to Twilio
 */
export interface TwilioWebhookResponse {
  shouldRespond: boolean;
  responseMessage?: string;
  twiml?: string;
}

// ============================================
// Conversation Types
// ============================================

export interface SMSConversation {
  id: string;
  phoneNumber: string;
  organizationId: string;
  context?: ConversationContext;
  messages: SMSMessage[];
  status: 'active' | 'closed' | 'waiting_response';
  assignedTo?: string; // Staff user ID
  createdAt: Date;
  updatedAt: Date;
  lastMessageAt: Date;
}

export interface SMSMessage {
  id: string;
  conversationId: string;
  messageSid: string;
  direction: 'inbound' | 'outbound';
  from: string;
  to: string;
  body: string;
  status?: string;
  timestamp: Date;
  metadata?: {
    mediaUrls?: string[];
    location?: {
      city?: string;
      state?: string;
      zip?: string;
      country?: string;
    };
  };
}

export interface ConversationContext {
  type: 'shift_confirmation' | 'event_rsvp' | 'case_update' | 'prayer_request' | 'general';
  relatedId?: string; // Shift ID, Event ID, Case ID, etc.
  awaitingResponse?: string; // What we're waiting for
  expiresAt?: Date;
}

// ============================================
// Keyword Response Handlers
// ============================================

export type KeywordHandler = (params: {
  message: TwilioIncomingMessage;
  keyword: string;
  context?: ConversationContext;
}) => Promise<{ response: string; updateContext?: Partial<ConversationContext> }>;

export interface KeywordConfig {
  keywords: string[];
  handler: KeywordHandler;
  description: string;
  requiresContext?: string; // Only trigger in specific context
}

// Built-in keyword handlers
export const BUILT_IN_KEYWORDS: KeywordConfig[] = [
  {
    keywords: ['YES', 'Y', 'CONFIRM'],
    description: 'Confirm an action (shift, event, etc.)',
    handler: async ({ context }) => {
      if (!context) {
        return { response: "Thanks for your response! If you need assistance, reply HELP." };
      }

      switch (context.type) {
        case 'shift_confirmation':
          return {
            response: "Great! Your shift is confirmed. We'll see you there! Reply HELP for assistance.",
            updateContext: { awaitingResponse: undefined },
          };
        case 'event_rsvp':
          return {
            response: "You're confirmed for the event! We look forward to seeing you. Reply HELP for assistance.",
            updateContext: { awaitingResponse: undefined },
          };
        default:
          return { response: "Thanks for confirming! Reply HELP for assistance." };
      }
    },
  },
  {
    keywords: ['NO', 'N', 'CANCEL'],
    description: 'Cancel or decline an action',
    handler: async ({ context }) => {
      if (!context) {
        return { response: "Understood. If you need assistance, reply HELP." };
      }

      switch (context.type) {
        case 'shift_confirmation':
          return {
            response: "We've noted that you can't make it. Thanks for letting us know! Reply HELP for assistance.",
            updateContext: { awaitingResponse: undefined },
          };
        case 'event_rsvp':
          return {
            response: "Sorry you can't make it. We hope to see you next time! Reply HELP for assistance.",
            updateContext: { awaitingResponse: undefined },
          };
        default:
          return { response: "Understood. Reply HELP for assistance." };
      }
    },
  },
  {
    keywords: ['RESCHEDULE'],
    description: 'Request to reschedule a shift',
    requiresContext: 'shift_confirmation',
    handler: async ({ context }) => {
      return {
        response: "We'll have someone reach out to help reschedule your shift. Reply HELP for immediate assistance.",
        updateContext: {
          ...context,
          awaitingResponse: 'staff_callback',
        },
      };
    },
  },
  {
    keywords: ['STATUS'],
    description: 'Check case status',
    requiresContext: 'case_update',
    handler: async () => {
      // In real implementation, would look up case status
      return {
        response: `Your case is being processed. A case worker will contact you soon. Reply HELP for immediate assistance.`,
      };
    },
  },
  {
    keywords: ['PRAYER', 'PRAY'],
    description: 'Submit a prayer request',
    handler: async () => {
      return {
        response: "We'd love to pray for you! Please share your prayer request in a reply, and our prayer team will lift you up. 🙏",
        updateContext: {
          type: 'prayer_request',
          awaitingResponse: 'prayer_text',
        },
      };
    },
  },
  {
    keywords: ['MORE', 'INFO', 'DETAILS'],
    description: 'Request more information',
    handler: async ({ context }) => {
      if (context?.type === 'shift_confirmation') {
        return {
          response: "For shift details, check your email or visit acts29ministry.org/volunteer. Reply HELP for assistance.",
        };
      }
      if (context?.type === 'event_rsvp') {
        return {
          response: "For event details, visit acts29ministry.org/calendar. Reply HELP for assistance.",
        };
      }
      return {
        response: "Visit acts29ministry.org for more information, or reply HELP for assistance.",
      };
    },
  },
];

// ============================================
// Webhook Handler Class
// ============================================

export interface WebhookHandlerConfig {
  twilioAuthToken: string;
  consentManager: ConsentManager;
  conversationStore?: ConversationStore;
  customKeywords?: KeywordConfig[];
  webhookUrl: string; // Your webhook URL for signature validation
  onUnhandledMessage?: (message: TwilioIncomingMessage) => Promise<string | null>;
}

export interface ConversationStore {
  getConversation(phoneNumber: string, organizationId: string): Promise<SMSConversation | null>;
  createConversation(conversation: Omit<SMSConversation, 'id' | 'createdAt' | 'updatedAt'>): Promise<SMSConversation>;
  updateConversation(id: string, updates: Partial<SMSConversation>): Promise<SMSConversation>;
  addMessage(message: Omit<SMSMessage, 'id'>): Promise<SMSMessage>;
  getMessages(conversationId: string, limit?: number): Promise<SMSMessage[]>;
}

export class TwilioWebhookHandler {
  private config: WebhookHandlerConfig;
  private keywordHandlers: Map<string, KeywordConfig> = new Map();

  constructor(config: WebhookHandlerConfig) {
    this.config = config;

    // Register built-in keywords
    for (const keyword of BUILT_IN_KEYWORDS) {
      for (const k of keyword.keywords) {
        this.keywordHandlers.set(k.toUpperCase(), keyword);
      }
    }

    // Register custom keywords
    if (config.customKeywords) {
      for (const keyword of config.customKeywords) {
        for (const k of keyword.keywords) {
          this.keywordHandlers.set(k.toUpperCase(), keyword);
        }
      }
    }
  }

  /**
   * Validate Twilio webhook signature
   */
  validateSignature(signature: string, url: string, params: Record<string, string>): boolean {
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((acc, key) => acc + key + params[key], url);

    const expectedSignature = crypto
      .createHmac('sha1', this.config.twilioAuthToken)
      .update(Buffer.from(sortedParams, 'utf-8'))
      .digest('base64');

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  }

  /**
   * Handle incoming SMS message
   */
  async handleIncomingMessage(
    message: TwilioIncomingMessage
  ): Promise<TwilioWebhookResponse> {
    const phoneNumber = message.From;
    const messageBody = message.Body.trim();

    // First, check for consent keywords (STOP, START, HELP)
    const consentKeywordType = parseKeywordType(messageBody);
    if (consentKeywordType !== 'other') {
      const result = await this.config.consentManager.handleKeyword({
        phoneNumber,
        message: messageBody,
      });

      // Store the message if we have a conversation store
      if (this.config.conversationStore) {
        await this.recordMessage(message, 'inbound');
      }

      return {
        shouldRespond: true,
        responseMessage: result.response || undefined,
        twiml: result.response ? this.generateTwiML(result.response) : undefined,
      };
    }

    // Get or create conversation
    let conversation: SMSConversation | null = null;
    if (this.config.conversationStore) {
      conversation = await this.config.conversationStore.getConversation(
        phoneNumber,
        // Organization ID would come from looking up the To number
        'default'
      );

      // Record the message
      await this.recordMessage(message, 'inbound', conversation?.id);
    }

    // Check for keyword handlers
    const normalizedMessage = messageBody.toUpperCase();
    const words = normalizedMessage.split(/\s+/);
    const firstWord = words[0];

    const keywordConfig = firstWord ? this.keywordHandlers.get(firstWord) : undefined;
    if (keywordConfig && firstWord) {
      // Check if keyword requires specific context
      if (keywordConfig.requiresContext && conversation?.context?.type !== keywordConfig.requiresContext) {
        // Keyword not applicable in current context
      } else {
        const result = await keywordConfig.handler({
          message,
          keyword: firstWord,
          context: conversation?.context,
        });

        // Update conversation context if needed
        if (this.config.conversationStore && conversation && result.updateContext) {
          await this.config.conversationStore.updateConversation(conversation.id, {
            context: { ...conversation.context, ...result.updateContext } as ConversationContext,
            lastMessageAt: new Date(),
          });
        }

        return {
          shouldRespond: true,
          responseMessage: result.response,
          twiml: this.generateTwiML(result.response),
        };
      }
    }

    // Check if we're awaiting a specific response in context
    if (conversation?.context?.awaitingResponse === 'prayer_text') {
      // This is a prayer request submission
      // In real implementation, would create prayer request
      const response = "Thank you for sharing your prayer request. Our prayer team has received it and is lifting you up. 🙏 - Acts 29 Ministry";

      if (this.config.conversationStore) {
        await this.config.conversationStore.updateConversation(conversation.id, {
          context: undefined, // Clear context
          lastMessageAt: new Date(),
        });
      }

      return {
        shouldRespond: true,
        responseMessage: response,
        twiml: this.generateTwiML(response),
      };
    }

    // Check for custom unhandled message handler
    if (this.config.onUnhandledMessage) {
      const response = await this.config.onUnhandledMessage(message);
      if (response) {
        return {
          shouldRespond: true,
          responseMessage: response,
          twiml: this.generateTwiML(response),
        };
      }
    }

    // Default response for unrecognized messages
    const defaultResponse = "Thanks for your message! Reply HELP for assistance or visit acts29ministry.org.";
    return {
      shouldRespond: true,
      responseMessage: defaultResponse,
      twiml: this.generateTwiML(defaultResponse),
    };
  }

  /**
   * Handle message status callback
   */
  async handleStatusCallback(
    status: TwilioStatusCallback
  ): Promise<void> {
    console.log(`Message ${status.MessageSid} status: ${status.MessageStatus}`);

    if (status.MessageStatus === 'failed' || status.MessageStatus === 'undelivered') {
      console.error(`Message delivery failed: ${status.ErrorCode} - ${status.ErrorMessage}`);
      // In real implementation, would update message record and potentially retry
    }

    // In real implementation, would update the message status in the database
  }

  /**
   * Record a message in the conversation store
   */
  private async recordMessage(
    twilioMessage: TwilioIncomingMessage,
    direction: 'inbound' | 'outbound',
    conversationId?: string
  ): Promise<void> {
    if (!this.config.conversationStore) return;

    const phoneNumber = direction === 'inbound' ? twilioMessage.From : twilioMessage.To;

    // Get or create conversation
    let conversation = await this.config.conversationStore.getConversation(phoneNumber, 'default');

    if (!conversation) {
      conversation = await this.config.conversationStore.createConversation({
        phoneNumber,
        organizationId: 'default',
        messages: [],
        status: 'active',
        lastMessageAt: new Date(),
      });
    }

    await this.config.conversationStore.addMessage({
      conversationId: conversationId || conversation.id,
      messageSid: twilioMessage.MessageSid,
      direction,
      from: twilioMessage.From,
      to: twilioMessage.To,
      body: twilioMessage.Body,
      timestamp: new Date(),
      metadata: {
        mediaUrls: twilioMessage.MediaUrl0 ? [twilioMessage.MediaUrl0] : undefined,
        location: twilioMessage.FromCity
          ? {
              city: twilioMessage.FromCity,
              state: twilioMessage.FromState,
              zip: twilioMessage.FromZip,
              country: twilioMessage.FromCountry,
            }
          : undefined,
      },
    });

    // Update conversation timestamp
    await this.config.conversationStore.updateConversation(conversation.id, {
      lastMessageAt: new Date(),
      status: direction === 'inbound' ? 'waiting_response' : 'active',
    });
  }

  /**
   * Generate TwiML response for Twilio
   */
  generateTwiML(message: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${this.escapeXml(message)}</Message>
</Response>`;
  }

  /**
   * Generate empty TwiML response (no reply)
   */
  generateEmptyTwiML(): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<Response></Response>`;
  }

  /**
   * Escape XML special characters
   */
  private escapeXml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}

// ============================================
// In-Memory Conversation Store (for dev/testing)
// ============================================

export class InMemoryConversationStore implements ConversationStore {
  private conversations: Map<string, SMSConversation> = new Map();
  private messages: SMSMessage[] = [];
  private idCounter = 1;

  private getKey(phoneNumber: string, organizationId: string): string {
    return `${organizationId}:${phoneNumber}`;
  }

  async getConversation(
    phoneNumber: string,
    organizationId: string
  ): Promise<SMSConversation | null> {
    return this.conversations.get(this.getKey(phoneNumber, organizationId)) || null;
  }

  async createConversation(
    conv: Omit<SMSConversation, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<SMSConversation> {
    const id = `conv_${this.idCounter++}`;
    const now = new Date();
    const conversation: SMSConversation = {
      ...conv,
      id,
      createdAt: now,
      updatedAt: now,
    };

    this.conversations.set(this.getKey(conv.phoneNumber, conv.organizationId), conversation);
    return conversation;
  }

  async updateConversation(
    id: string,
    updates: Partial<SMSConversation>
  ): Promise<SMSConversation> {
    for (const [key, conv] of this.conversations) {
      if (conv.id === id) {
        const updated = { ...conv, ...updates, updatedAt: new Date() };
        this.conversations.set(key, updated);
        return updated;
      }
    }
    throw new Error(`Conversation ${id} not found`);
  }

  async addMessage(message: Omit<SMSMessage, 'id'>): Promise<SMSMessage> {
    const msg: SMSMessage = {
      ...message,
      id: `msg_${this.idCounter++}`,
    };
    this.messages.push(msg);
    return msg;
  }

  async getMessages(conversationId: string, limit = 50): Promise<SMSMessage[]> {
    return this.messages
      .filter((m) => m.conversationId === conversationId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }
}
