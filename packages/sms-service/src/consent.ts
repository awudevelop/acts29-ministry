// ============================================
// SMS Consent Management
// ============================================
// TCPA-compliant SMS consent tracking and opt-in/opt-out handling

export type ConsentStatus = 'opted_in' | 'opted_out' | 'pending' | 'never_consented';
export type ConsentSource = 'web_form' | 'sms_keyword' | 'admin' | 'import' | 'api';

export interface SMSConsent {
  id: string;
  phoneNumber: string; // E.164 format
  userId?: string;
  status: ConsentStatus;
  consentedAt?: Date;
  revokedAt?: Date;
  source: ConsentSource;
  ipAddress?: string; // For web opt-ins
  consentText?: string; // The exact disclosure shown
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
  metadata?: {
    userAgent?: string;
    formId?: string;
    campaignId?: string;
  };
}

export interface ConsentHistory {
  id: string;
  consentId: string;
  phoneNumber: string;
  action: 'opted_in' | 'opted_out' | 'updated';
  source: ConsentSource;
  timestamp: Date;
  details?: string;
}

// ============================================
// TCPA Compliance Constants
// ============================================

export const TCPA_DISCLOSURE = `By providing your phone number, you consent to receive text messages from Acts 29 Ministry. Message frequency varies. Message and data rates may apply. Reply STOP to unsubscribe, HELP for help. View our Privacy Policy at acts29ministry.org/privacy.`;

export const TCPA_OPT_IN_CONFIRMATION = `You're now subscribed to Acts 29 Ministry text updates! Reply STOP to unsubscribe anytime. Msg & data rates may apply.`;

export const TCPA_OPT_OUT_CONFIRMATION = `You've been unsubscribed from Acts 29 Ministry texts. Reply START to re-subscribe. We're here if you need us!`;

export const TCPA_HELP_RESPONSE = `Acts 29 Ministry: For help, call (217) 555-0129 or visit acts29ministry.org. Reply STOP to unsubscribe. Msg & data rates may apply.`;

export const TCPA_ALREADY_OPTED_OUT = `You're already unsubscribed. Reply START to re-subscribe to Acts 29 Ministry texts.`;

export const TCPA_ALREADY_OPTED_IN = `You're already subscribed to Acts 29 Ministry texts! Reply STOP to unsubscribe or HELP for assistance.`;

// ============================================
// Opt-in/Opt-out Keywords
// ============================================

export const OPT_OUT_KEYWORDS = ['STOP', 'STOPALL', 'UNSUBSCRIBE', 'CANCEL', 'END', 'QUIT'];
export const OPT_IN_KEYWORDS = ['START', 'SUBSCRIBE', 'YES', 'UNSTOP'];
export const HELP_KEYWORDS = ['HELP', 'INFO', 'SUPPORT'];

/**
 * Determine the keyword type from an incoming message
 */
export function parseKeywordType(
  message: string
): 'opt_out' | 'opt_in' | 'help' | 'other' {
  const normalized = message.trim().toUpperCase();

  if (OPT_OUT_KEYWORDS.includes(normalized)) {
    return 'opt_out';
  }

  if (OPT_IN_KEYWORDS.includes(normalized)) {
    return 'opt_in';
  }

  if (HELP_KEYWORDS.includes(normalized)) {
    return 'help';
  }

  return 'other';
}

// ============================================
// Consent Manager Class
// ============================================

export interface ConsentStore {
  getConsentByPhone(phoneNumber: string, organizationId: string): Promise<SMSConsent | null>;
  createConsent(consent: Omit<SMSConsent, 'id' | 'createdAt' | 'updatedAt'>): Promise<SMSConsent>;
  updateConsent(id: string, updates: Partial<SMSConsent>): Promise<SMSConsent>;
  addConsentHistory(history: Omit<ConsentHistory, 'id'>): Promise<ConsentHistory>;
  getConsentHistory(phoneNumber: string, organizationId: string): Promise<ConsentHistory[]>;
  listConsentsByStatus(organizationId: string, status: ConsentStatus): Promise<SMSConsent[]>;
}

export interface ConsentManagerConfig {
  store: ConsentStore;
  organizationId: string;
  smsService?: {
    sendSMS: (params: { to: string; message: string }) => Promise<{ success: boolean }>;
  };
}

export class ConsentManager {
  private store: ConsentStore;
  private organizationId: string;
  private smsService?: ConsentManagerConfig['smsService'];

  constructor(config: ConsentManagerConfig) {
    this.store = config.store;
    this.organizationId = config.organizationId;
    this.smsService = config.smsService;
  }

  /**
   * Check if a phone number has valid SMS consent
   */
  async hasConsent(phoneNumber: string): Promise<boolean> {
    const consent = await this.store.getConsentByPhone(phoneNumber, this.organizationId);
    return consent?.status === 'opted_in';
  }

  /**
   * Get consent status for a phone number
   */
  async getConsentStatus(phoneNumber: string): Promise<ConsentStatus> {
    const consent = await this.store.getConsentByPhone(phoneNumber, this.organizationId);
    return consent?.status || 'never_consented';
  }

  /**
   * Record opt-in consent
   */
  async recordOptIn(params: {
    phoneNumber: string;
    userId?: string;
    source: ConsentSource;
    ipAddress?: string;
    consentText?: string;
    metadata?: SMSConsent['metadata'];
  }): Promise<{ success: boolean; consent: SMSConsent; isNew: boolean }> {
    const existingConsent = await this.store.getConsentByPhone(
      params.phoneNumber,
      this.organizationId
    );

    if (existingConsent) {
      if (existingConsent.status === 'opted_in') {
        // Already opted in
        return { success: true, consent: existingConsent, isNew: false };
      }

      // Re-opt-in
      const updatedConsent = await this.store.updateConsent(existingConsent.id, {
        status: 'opted_in',
        consentedAt: new Date(),
        revokedAt: undefined,
        source: params.source,
        ipAddress: params.ipAddress,
        consentText: params.consentText || TCPA_DISCLOSURE,
        metadata: params.metadata,
        updatedAt: new Date(),
      });

      await this.store.addConsentHistory({
        consentId: existingConsent.id,
        phoneNumber: params.phoneNumber,
        action: 'opted_in',
        source: params.source,
        timestamp: new Date(),
        details: 'Re-opted in after previous opt-out',
      });

      return { success: true, consent: updatedConsent, isNew: false };
    }

    // New consent
    const newConsent = await this.store.createConsent({
      phoneNumber: params.phoneNumber,
      userId: params.userId,
      status: 'opted_in',
      consentedAt: new Date(),
      source: params.source,
      ipAddress: params.ipAddress,
      consentText: params.consentText || TCPA_DISCLOSURE,
      organizationId: this.organizationId,
      metadata: params.metadata,
    });

    await this.store.addConsentHistory({
      consentId: newConsent.id,
      phoneNumber: params.phoneNumber,
      action: 'opted_in',
      source: params.source,
      timestamp: new Date(),
      details: 'Initial opt-in',
    });

    return { success: true, consent: newConsent, isNew: true };
  }

  /**
   * Record opt-out (STOP)
   */
  async recordOptOut(params: {
    phoneNumber: string;
    source: ConsentSource;
  }): Promise<{ success: boolean; wasOptedIn: boolean }> {
    const existingConsent = await this.store.getConsentByPhone(
      params.phoneNumber,
      this.organizationId
    );

    if (!existingConsent) {
      // No consent record - create one in opted_out state
      const newConsent = await this.store.createConsent({
        phoneNumber: params.phoneNumber,
        status: 'opted_out',
        revokedAt: new Date(),
        source: params.source,
        organizationId: this.organizationId,
      });

      await this.store.addConsentHistory({
        consentId: newConsent.id,
        phoneNumber: params.phoneNumber,
        action: 'opted_out',
        source: params.source,
        timestamp: new Date(),
        details: 'Opted out without prior consent record',
      });

      return { success: true, wasOptedIn: false };
    }

    const wasOptedIn = existingConsent.status === 'opted_in';

    if (existingConsent.status === 'opted_out') {
      // Already opted out
      return { success: true, wasOptedIn: false };
    }

    await this.store.updateConsent(existingConsent.id, {
      status: 'opted_out',
      revokedAt: new Date(),
      updatedAt: new Date(),
    });

    await this.store.addConsentHistory({
      consentId: existingConsent.id,
      phoneNumber: params.phoneNumber,
      action: 'opted_out',
      source: params.source,
      timestamp: new Date(),
      details: 'User opted out via ' + params.source,
    });

    return { success: true, wasOptedIn };
  }

  /**
   * Handle an incoming SMS keyword (STOP, START, HELP)
   */
  async handleKeyword(params: {
    phoneNumber: string;
    message: string;
  }): Promise<{
    keywordType: 'opt_out' | 'opt_in' | 'help' | 'other';
    response: string | null;
    actionTaken: string;
  }> {
    const keywordType = parseKeywordType(params.message);

    switch (keywordType) {
      case 'opt_out': {
        const { wasOptedIn } = await this.recordOptOut({
          phoneNumber: params.phoneNumber,
          source: 'sms_keyword',
        });

        // Send confirmation if we have SMS service
        if (this.smsService) {
          await this.smsService.sendSMS({
            to: params.phoneNumber,
            message: TCPA_OPT_OUT_CONFIRMATION,
          });
        }

        return {
          keywordType,
          response: TCPA_OPT_OUT_CONFIRMATION,
          actionTaken: wasOptedIn ? 'opted_out' : 'already_opted_out',
        };
      }

      case 'opt_in': {
        const status = await this.getConsentStatus(params.phoneNumber);

        if (status === 'opted_in') {
          if (this.smsService) {
            await this.smsService.sendSMS({
              to: params.phoneNumber,
              message: TCPA_ALREADY_OPTED_IN,
            });
          }
          return {
            keywordType,
            response: TCPA_ALREADY_OPTED_IN,
            actionTaken: 'already_opted_in',
          };
        }

        const { isNew } = await this.recordOptIn({
          phoneNumber: params.phoneNumber,
          source: 'sms_keyword',
        });

        if (this.smsService) {
          await this.smsService.sendSMS({
            to: params.phoneNumber,
            message: TCPA_OPT_IN_CONFIRMATION,
          });
        }

        return {
          keywordType,
          response: TCPA_OPT_IN_CONFIRMATION,
          actionTaken: isNew ? 'new_opt_in' : 're_opted_in',
        };
      }

      case 'help': {
        if (this.smsService) {
          await this.smsService.sendSMS({
            to: params.phoneNumber,
            message: TCPA_HELP_RESPONSE,
          });
        }

        return {
          keywordType,
          response: TCPA_HELP_RESPONSE,
          actionTaken: 'sent_help',
        };
      }

      default:
        return {
          keywordType,
          response: null,
          actionTaken: 'no_action',
        };
    }
  }

  /**
   * Get consent history for a phone number
   */
  async getHistory(phoneNumber: string): Promise<ConsentHistory[]> {
    return this.store.getConsentHistory(phoneNumber, this.organizationId);
  }

  /**
   * List all opted-in phone numbers
   */
  async listOptedIn(): Promise<SMSConsent[]> {
    return this.store.listConsentsByStatus(this.organizationId, 'opted_in');
  }

  /**
   * List all opted-out phone numbers
   */
  async listOptedOut(): Promise<SMSConsent[]> {
    return this.store.listConsentsByStatus(this.organizationId, 'opted_out');
  }
}

// ============================================
// In-Memory Consent Store (for development/testing)
// ============================================

export class InMemoryConsentStore implements ConsentStore {
  private consents: Map<string, SMSConsent> = new Map();
  private history: ConsentHistory[] = [];
  private idCounter = 1;

  private getKey(phoneNumber: string, organizationId: string): string {
    return `${organizationId}:${phoneNumber}`;
  }

  async getConsentByPhone(
    phoneNumber: string,
    organizationId: string
  ): Promise<SMSConsent | null> {
    return this.consents.get(this.getKey(phoneNumber, organizationId)) || null;
  }

  async createConsent(
    consent: Omit<SMSConsent, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<SMSConsent> {
    const id = `consent_${this.idCounter++}`;
    const now = new Date();
    const newConsent: SMSConsent = {
      ...consent,
      id,
      createdAt: now,
      updatedAt: now,
    };

    this.consents.set(this.getKey(consent.phoneNumber, consent.organizationId), newConsent);
    return newConsent;
  }

  async updateConsent(id: string, updates: Partial<SMSConsent>): Promise<SMSConsent> {
    for (const [key, consent] of this.consents) {
      if (consent.id === id) {
        const updated = { ...consent, ...updates, updatedAt: new Date() };
        this.consents.set(key, updated);
        return updated;
      }
    }
    throw new Error(`Consent with id ${id} not found`);
  }

  async addConsentHistory(
    historyEntry: Omit<ConsentHistory, 'id'>
  ): Promise<ConsentHistory> {
    const entry: ConsentHistory = {
      ...historyEntry,
      id: `history_${this.idCounter++}`,
    };
    this.history.push(entry);
    return entry;
  }

  async getConsentHistory(
    phoneNumber: string,
    _organizationId: string
  ): Promise<ConsentHistory[]> {
    return this.history.filter((h) => h.phoneNumber === phoneNumber);
  }

  async listConsentsByStatus(
    organizationId: string,
    status: ConsentStatus
  ): Promise<SMSConsent[]> {
    return Array.from(this.consents.values()).filter(
      (c) => c.organizationId === organizationId && c.status === status
    );
  }
}
