// ============================================
// Calendar OAuth Integration
// ============================================
// OAuth 2.0 flows for Google Calendar and Microsoft Outlook

// ============================================
// Types
// ============================================

export type CalendarProvider = 'google' | 'microsoft' | 'apple';

export interface OAuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  tokenType: string;
  scope: string[];
}

export interface ConnectedCalendar {
  id: string;
  userId: string;
  provider: CalendarProvider;
  providerAccountId: string;
  email: string;
  displayName?: string;
  tokens: OAuthTokens;
  calendars: CalendarInfo[];
  primaryCalendarId?: string;
  syncSettings: SyncSettings;
  lastSyncAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CalendarInfo {
  id: string;
  name: string;
  color?: string;
  isPrimary: boolean;
  isWritable: boolean;
  isSelected: boolean; // User has selected this for sync
}

export interface SyncSettings {
  enabled: boolean;
  syncDirection: 'read_only' | 'write_only' | 'bidirectional';
  writeBackCalendarId?: string;
  conflictDetection: boolean;
  syncFrequencyMinutes: number;
  syncShifts: boolean;
  syncEvents: boolean;
}

export interface ExternalEvent {
  id: string;
  calendarId: string;
  provider: CalendarProvider;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  allDay: boolean;
  location?: string;
  status: 'confirmed' | 'tentative' | 'cancelled';
  isRecurring: boolean;
  recurringEventId?: string;
}

export interface ConflictResult {
  hasConflict: boolean;
  conflicts: Array<{
    externalEvent: ExternalEvent;
    overlapStart: Date;
    overlapEnd: Date;
    overlapMinutes: number;
  }>;
}

// ============================================
// OAuth Configuration
// ============================================

export interface OAuthConfig {
  google?: {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
  };
  microsoft?: {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    tenantId?: string; // 'common' for multi-tenant
  };
}

// ============================================
// Google Calendar OAuth
// ============================================

export class GoogleCalendarOAuth {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;

  // Google OAuth endpoints
  private static AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
  private static TOKEN_URL = 'https://oauth2.googleapis.com/token';
  private static USERINFO_URL = 'https://www.googleapis.com/oauth2/v2/userinfo';
  private static CALENDAR_BASE = 'https://www.googleapis.com/calendar/v3';

  // Required scopes
  private static SCOPES = [
    'https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/calendar.events',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
  ];

  constructor(config: NonNullable<OAuthConfig['google']>) {
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.redirectUri = config.redirectUri;
  }

  /**
   * Generate authorization URL for OAuth consent flow
   */
  getAuthorizationUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: GoogleCalendarOAuth.SCOPES.join(' '),
      access_type: 'offline',
      prompt: 'consent',
      state,
    });

    return `${GoogleCalendarOAuth.AUTH_URL}?${params.toString()}`;
  }

  /**
   * Exchange authorization code for tokens
   */
  async exchangeCodeForTokens(code: string): Promise<OAuthTokens> {
    const response = await fetch(GoogleCalendarOAuth.TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: this.redirectUri,
        code,
        grant_type: 'authorization_code',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Token exchange failed: ${error.error_description || error.error}`);
    }

    const data = await response.json();
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: new Date(Date.now() + data.expires_in * 1000),
      tokenType: data.token_type,
      scope: data.scope.split(' '),
    };
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(refreshToken: string): Promise<OAuthTokens> {
    const response = await fetch(GoogleCalendarOAuth.TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Token refresh failed: ${error.error_description || error.error}`);
    }

    const data = await response.json();
    return {
      accessToken: data.access_token,
      refreshToken: refreshToken, // Refresh token doesn't change
      expiresAt: new Date(Date.now() + data.expires_in * 1000),
      tokenType: data.token_type,
      scope: data.scope.split(' '),
    };
  }

  /**
   * Get user profile information
   */
  async getUserProfile(accessToken: string): Promise<{ email: string; name?: string }> {
    const response = await fetch(GoogleCalendarOAuth.USERINFO_URL, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      throw new Error('Failed to get user profile');
    }

    const data = await response.json();
    return {
      email: data.email,
      name: data.name,
    };
  }

  /**
   * List user's calendars
   */
  async listCalendars(accessToken: string): Promise<CalendarInfo[]> {
    const response = await fetch(`${GoogleCalendarOAuth.CALENDAR_BASE}/users/me/calendarList`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      throw new Error('Failed to list calendars');
    }

    const data = await response.json();
    return data.items.map((cal: Record<string, unknown>) => ({
      id: cal.id as string,
      name: cal.summary as string,
      color: cal.backgroundColor as string | undefined,
      isPrimary: cal.primary === true,
      isWritable: cal.accessRole === 'owner' || cal.accessRole === 'writer',
      isSelected: cal.primary === true, // Default to primary selected
    }));
  }

  /**
   * Get events from a calendar
   */
  async getEvents(
    accessToken: string,
    calendarId: string,
    timeMin: Date,
    timeMax: Date
  ): Promise<ExternalEvent[]> {
    const params = new URLSearchParams({
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      singleEvents: 'true',
      orderBy: 'startTime',
    });

    const response = await fetch(
      `${GoogleCalendarOAuth.CALENDAR_BASE}/calendars/${encodeURIComponent(calendarId)}/events?${params}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    if (!response.ok) {
      throw new Error('Failed to get events');
    }

    const data = await response.json();
    return (data.items || []).map((event: Record<string, unknown>) => {
      const start = event.start as Record<string, string>;
      const end = event.end as Record<string, string>;
      return {
        id: event.id as string,
        calendarId,
        provider: 'google' as const,
        title: (event.summary as string) || '(No title)',
        description: event.description as string | undefined,
        start: new Date(start.dateTime || start.date || new Date()),
        end: new Date(end.dateTime || end.date || new Date()),
        allDay: !start.dateTime,
        location: event.location as string | undefined,
        status: (event.status as string) === 'cancelled' ? 'cancelled' : (event.status as string) === 'tentative' ? 'tentative' : 'confirmed',
        isRecurring: !!event.recurringEventId,
        recurringEventId: event.recurringEventId as string | undefined,
      };
    });
  }

  /**
   * Create an event on a calendar
   */
  async createEvent(
    accessToken: string,
    calendarId: string,
    event: {
      title: string;
      description?: string;
      start: Date;
      end: Date;
      location?: string;
      allDay?: boolean;
    }
  ): Promise<string> {
    const body = {
      summary: event.title,
      description: event.description,
      location: event.location,
      start: event.allDay
        ? { date: event.start.toISOString().split('T')[0] }
        : { dateTime: event.start.toISOString() },
      end: event.allDay
        ? { date: event.end.toISOString().split('T')[0] }
        : { dateTime: event.end.toISOString() },
    };

    const response = await fetch(
      `${GoogleCalendarOAuth.CALENDAR_BASE}/calendars/${encodeURIComponent(calendarId)}/events`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to create event: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.id;
  }

  /**
   * Delete an event from a calendar
   */
  async deleteEvent(accessToken: string, calendarId: string, eventId: string): Promise<void> {
    const response = await fetch(
      `${GoogleCalendarOAuth.CALENDAR_BASE}/calendars/${encodeURIComponent(calendarId)}/events/${eventId}`,
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!response.ok && response.status !== 410) {
      // 410 Gone is OK - event already deleted
      throw new Error('Failed to delete event');
    }
  }
}

// ============================================
// Microsoft Calendar OAuth
// ============================================

export class MicrosoftCalendarOAuth {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;
  private tenantId: string;

  // Microsoft OAuth endpoints
  private get AUTH_URL() {
    return `https://login.microsoftonline.com/${this.tenantId}/oauth2/v2.0/authorize`;
  }
  private get TOKEN_URL() {
    return `https://login.microsoftonline.com/${this.tenantId}/oauth2/v2.0/token`;
  }
  private static GRAPH_BASE = 'https://graph.microsoft.com/v1.0';

  // Required scopes
  private static SCOPES = [
    'User.Read',
    'Calendars.Read',
    'Calendars.ReadWrite',
    'offline_access',
  ];

  constructor(config: NonNullable<OAuthConfig['microsoft']>) {
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.redirectUri = config.redirectUri;
    this.tenantId = config.tenantId || 'common';
  }

  /**
   * Generate authorization URL for OAuth consent flow
   */
  getAuthorizationUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: MicrosoftCalendarOAuth.SCOPES.join(' '),
      response_mode: 'query',
      state,
    });

    return `${this.AUTH_URL}?${params.toString()}`;
  }

  /**
   * Exchange authorization code for tokens
   */
  async exchangeCodeForTokens(code: string): Promise<OAuthTokens> {
    const response = await fetch(this.TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: this.redirectUri,
        code,
        grant_type: 'authorization_code',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Token exchange failed: ${error.error_description || error.error}`);
    }

    const data = await response.json();
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: new Date(Date.now() + data.expires_in * 1000),
      tokenType: data.token_type,
      scope: data.scope.split(' '),
    };
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(refreshToken: string): Promise<OAuthTokens> {
    const response = await fetch(this.TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Token refresh failed: ${error.error_description || error.error}`);
    }

    const data = await response.json();
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token || refreshToken,
      expiresAt: new Date(Date.now() + data.expires_in * 1000),
      tokenType: data.token_type,
      scope: data.scope.split(' '),
    };
  }

  /**
   * Get user profile information
   */
  async getUserProfile(accessToken: string): Promise<{ email: string; name?: string }> {
    const response = await fetch(`${MicrosoftCalendarOAuth.GRAPH_BASE}/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      throw new Error('Failed to get user profile');
    }

    const data = await response.json();
    return {
      email: data.mail || data.userPrincipalName,
      name: data.displayName,
    };
  }

  /**
   * List user's calendars
   */
  async listCalendars(accessToken: string): Promise<CalendarInfo[]> {
    const response = await fetch(`${MicrosoftCalendarOAuth.GRAPH_BASE}/me/calendars`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      throw new Error('Failed to list calendars');
    }

    const data = await response.json();
    return data.value.map((cal: Record<string, unknown>) => ({
      id: cal.id as string,
      name: cal.name as string,
      color: cal.hexColor as string | undefined,
      isPrimary: cal.isDefaultCalendar === true,
      isWritable: cal.canEdit === true,
      isSelected: cal.isDefaultCalendar === true,
    }));
  }

  /**
   * Get events from a calendar
   */
  async getEvents(
    accessToken: string,
    calendarId: string,
    timeMin: Date,
    timeMax: Date
  ): Promise<ExternalEvent[]> {
    const params = new URLSearchParams({
      startDateTime: timeMin.toISOString(),
      endDateTime: timeMax.toISOString(),
      $orderby: 'start/dateTime',
    });

    const response = await fetch(
      `${MicrosoftCalendarOAuth.GRAPH_BASE}/me/calendars/${calendarId}/events?${params}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    if (!response.ok) {
      throw new Error('Failed to get events');
    }

    const data = await response.json();
    return (data.value || []).map((event: Record<string, unknown>) => {
      const start = event.start as Record<string, string>;
      const end = event.end as Record<string, string>;
      return {
        id: event.id as string,
        calendarId,
        provider: 'microsoft' as const,
        title: (event.subject as string) || '(No title)',
        description: (event.body as Record<string, string>)?.content,
        start: new Date(start.dateTime + 'Z'),
        end: new Date(end.dateTime + 'Z'),
        allDay: event.isAllDay === true,
        location: (event.location as Record<string, string>)?.displayName,
        status: event.isCancelled ? 'cancelled' : (event.showAs as string) === 'tentative' ? 'tentative' : 'confirmed',
        isRecurring: !!event.seriesMasterId,
        recurringEventId: event.seriesMasterId as string | undefined,
      };
    });
  }

  /**
   * Create an event on a calendar
   */
  async createEvent(
    accessToken: string,
    calendarId: string,
    event: {
      title: string;
      description?: string;
      start: Date;
      end: Date;
      location?: string;
      allDay?: boolean;
    }
  ): Promise<string> {
    const body = {
      subject: event.title,
      body: event.description ? { contentType: 'text', content: event.description } : undefined,
      location: event.location ? { displayName: event.location } : undefined,
      start: {
        dateTime: event.start.toISOString().replace('Z', ''),
        timeZone: 'UTC',
      },
      end: {
        dateTime: event.end.toISOString().replace('Z', ''),
        timeZone: 'UTC',
      },
      isAllDay: event.allDay,
    };

    const response = await fetch(
      `${MicrosoftCalendarOAuth.GRAPH_BASE}/me/calendars/${calendarId}/events`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to create event: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.id;
  }

  /**
   * Delete an event from a calendar
   */
  async deleteEvent(accessToken: string, calendarId: string, eventId: string): Promise<void> {
    const response = await fetch(
      `${MicrosoftCalendarOAuth.GRAPH_BASE}/me/calendars/${calendarId}/events/${eventId}`,
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!response.ok && response.status !== 404) {
      throw new Error('Failed to delete event');
    }
  }
}

// ============================================
// Calendar Sync Manager
// ============================================

export interface CalendarStore {
  getConnectedCalendar(userId: string, provider: CalendarProvider): Promise<ConnectedCalendar | null>;
  listConnectedCalendars(userId: string): Promise<ConnectedCalendar[]>;
  saveConnectedCalendar(calendar: ConnectedCalendar): Promise<void>;
  updateConnectedCalendar(id: string, updates: Partial<ConnectedCalendar>): Promise<void>;
  deleteConnectedCalendar(id: string): Promise<void>;
}

export class CalendarSyncManager {
  private googleOAuth?: GoogleCalendarOAuth;
  private microsoftOAuth?: MicrosoftCalendarOAuth;
  private store: CalendarStore;

  constructor(config: OAuthConfig, store: CalendarStore) {
    if (config.google) {
      this.googleOAuth = new GoogleCalendarOAuth(config.google);
    }
    if (config.microsoft) {
      this.microsoftOAuth = new MicrosoftCalendarOAuth(config.microsoft);
    }
    this.store = store;
  }

  /**
   * Get authorization URL for a provider
   */
  getAuthorizationUrl(provider: CalendarProvider, state: string): string {
    switch (provider) {
      case 'google':
        if (!this.googleOAuth) throw new Error('Google OAuth not configured');
        return this.googleOAuth.getAuthorizationUrl(state);
      case 'microsoft':
        if (!this.microsoftOAuth) throw new Error('Microsoft OAuth not configured');
        return this.microsoftOAuth.getAuthorizationUrl(state);
      default:
        throw new Error(`Provider ${provider} not supported for OAuth`);
    }
  }

  /**
   * Complete OAuth flow and save connected calendar
   */
  async completeOAuthFlow(
    provider: CalendarProvider,
    code: string,
    userId: string
  ): Promise<ConnectedCalendar> {
    let tokens: OAuthTokens;
    let profile: { email: string; name?: string };
    let calendars: CalendarInfo[];

    switch (provider) {
      case 'google':
        if (!this.googleOAuth) throw new Error('Google OAuth not configured');
        tokens = await this.googleOAuth.exchangeCodeForTokens(code);
        profile = await this.googleOAuth.getUserProfile(tokens.accessToken);
        calendars = await this.googleOAuth.listCalendars(tokens.accessToken);
        break;
      case 'microsoft':
        if (!this.microsoftOAuth) throw new Error('Microsoft OAuth not configured');
        tokens = await this.microsoftOAuth.exchangeCodeForTokens(code);
        profile = await this.microsoftOAuth.getUserProfile(tokens.accessToken);
        calendars = await this.microsoftOAuth.listCalendars(tokens.accessToken);
        break;
      default:
        throw new Error(`Provider ${provider} not supported`);
    }

    const primaryCalendar = calendars.find((c) => c.isPrimary);

    const connectedCalendar: ConnectedCalendar = {
      id: `${provider}_${userId}_${Date.now()}`,
      userId,
      provider,
      providerAccountId: profile.email,
      email: profile.email,
      displayName: profile.name,
      tokens,
      calendars,
      primaryCalendarId: primaryCalendar?.id,
      syncSettings: {
        enabled: true,
        syncDirection: 'read_only',
        conflictDetection: true,
        syncFrequencyMinutes: 60,
        syncShifts: true,
        syncEvents: false,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.store.saveConnectedCalendar(connectedCalendar);
    return connectedCalendar;
  }

  /**
   * Ensure tokens are valid, refresh if needed
   */
  async ensureValidTokens(connectedCalendar: ConnectedCalendar): Promise<OAuthTokens> {
    // If token expires in less than 5 minutes, refresh
    const expiresIn = connectedCalendar.tokens.expiresAt.getTime() - Date.now();
    if (expiresIn > 5 * 60 * 1000) {
      return connectedCalendar.tokens;
    }

    let newTokens: OAuthTokens;
    switch (connectedCalendar.provider) {
      case 'google':
        if (!this.googleOAuth) throw new Error('Google OAuth not configured');
        newTokens = await this.googleOAuth.refreshAccessToken(connectedCalendar.tokens.refreshToken);
        break;
      case 'microsoft':
        if (!this.microsoftOAuth) throw new Error('Microsoft OAuth not configured');
        newTokens = await this.microsoftOAuth.refreshAccessToken(connectedCalendar.tokens.refreshToken);
        break;
      default:
        throw new Error(`Provider ${connectedCalendar.provider} not supported`);
    }

    await this.store.updateConnectedCalendar(connectedCalendar.id, {
      tokens: newTokens,
      updatedAt: new Date(),
    });

    return newTokens;
  }

  /**
   * Get events from connected calendar for conflict detection
   */
  async getEventsForConflictCheck(
    connectedCalendar: ConnectedCalendar,
    shiftStart: Date,
    shiftEnd: Date
  ): Promise<ExternalEvent[]> {
    const tokens = await this.ensureValidTokens(connectedCalendar);
    const allEvents: ExternalEvent[] = [];

    // Get events from all selected calendars
    for (const calendar of connectedCalendar.calendars) {
      if (!calendar.isSelected) continue;

      let events: ExternalEvent[];
      switch (connectedCalendar.provider) {
        case 'google':
          if (!this.googleOAuth) continue;
          events = await this.googleOAuth.getEvents(
            tokens.accessToken,
            calendar.id,
            shiftStart,
            shiftEnd
          );
          break;
        case 'microsoft':
          if (!this.microsoftOAuth) continue;
          events = await this.microsoftOAuth.getEvents(
            tokens.accessToken,
            calendar.id,
            shiftStart,
            shiftEnd
          );
          break;
        default:
          continue;
      }
      allEvents.push(...events);
    }

    return allEvents;
  }

  /**
   * Check for conflicts between a shift and user's calendar
   */
  async checkForConflicts(
    connectedCalendar: ConnectedCalendar,
    shiftStart: Date,
    shiftEnd: Date
  ): Promise<ConflictResult> {
    if (!connectedCalendar.syncSettings.conflictDetection) {
      return { hasConflict: false, conflicts: [] };
    }

    const events = await this.getEventsForConflictCheck(connectedCalendar, shiftStart, shiftEnd);
    const conflicts: ConflictResult['conflicts'] = [];

    for (const event of events) {
      // Skip cancelled events
      if (event.status === 'cancelled') continue;

      // Check for overlap
      const overlapStart = new Date(Math.max(shiftStart.getTime(), event.start.getTime()));
      const overlapEnd = new Date(Math.min(shiftEnd.getTime(), event.end.getTime()));

      if (overlapStart < overlapEnd) {
        const overlapMinutes = (overlapEnd.getTime() - overlapStart.getTime()) / (1000 * 60);
        conflicts.push({
          externalEvent: event,
          overlapStart,
          overlapEnd,
          overlapMinutes,
        });
      }
    }

    return {
      hasConflict: conflicts.length > 0,
      conflicts,
    };
  }

  /**
   * Write a shift to user's calendar
   */
  async writeShiftToCalendar(
    connectedCalendar: ConnectedCalendar,
    shift: {
      title: string;
      description?: string;
      start: Date;
      end: Date;
      location?: string;
    }
  ): Promise<string | null> {
    if (!connectedCalendar.syncSettings.enabled) return null;
    if (connectedCalendar.syncSettings.syncDirection === 'read_only') return null;
    if (!connectedCalendar.syncSettings.syncShifts) return null;
    if (!connectedCalendar.syncSettings.writeBackCalendarId) return null;

    const tokens = await this.ensureValidTokens(connectedCalendar);
    const calendarId = connectedCalendar.syncSettings.writeBackCalendarId;

    switch (connectedCalendar.provider) {
      case 'google':
        if (!this.googleOAuth) return null;
        return this.googleOAuth.createEvent(tokens.accessToken, calendarId, shift);
      case 'microsoft':
        if (!this.microsoftOAuth) return null;
        return this.microsoftOAuth.createEvent(tokens.accessToken, calendarId, shift);
      default:
        return null;
    }
  }

  /**
   * Delete a shift from user's calendar
   */
  async deleteShiftFromCalendar(
    connectedCalendar: ConnectedCalendar,
    eventId: string
  ): Promise<void> {
    if (!connectedCalendar.syncSettings.writeBackCalendarId) return;

    const tokens = await this.ensureValidTokens(connectedCalendar);
    const calendarId = connectedCalendar.syncSettings.writeBackCalendarId;

    switch (connectedCalendar.provider) {
      case 'google':
        if (!this.googleOAuth) return;
        await this.googleOAuth.deleteEvent(tokens.accessToken, calendarId, eventId);
        break;
      case 'microsoft':
        if (!this.microsoftOAuth) return;
        await this.microsoftOAuth.deleteEvent(tokens.accessToken, calendarId, eventId);
        break;
    }
  }

  /**
   * Disconnect a calendar
   */
  async disconnectCalendar(calendarId: string): Promise<void> {
    await this.store.deleteConnectedCalendar(calendarId);
  }
}

// ============================================
// In-Memory Calendar Store (for dev/testing)
// ============================================

export class InMemoryCalendarStore implements CalendarStore {
  private calendars: Map<string, ConnectedCalendar> = new Map();

  async getConnectedCalendar(userId: string, provider: CalendarProvider): Promise<ConnectedCalendar | null> {
    for (const cal of this.calendars.values()) {
      if (cal.userId === userId && cal.provider === provider) {
        return cal;
      }
    }
    return null;
  }

  async listConnectedCalendars(userId: string): Promise<ConnectedCalendar[]> {
    return Array.from(this.calendars.values()).filter((cal) => cal.userId === userId);
  }

  async saveConnectedCalendar(calendar: ConnectedCalendar): Promise<void> {
    this.calendars.set(calendar.id, calendar);
  }

  async updateConnectedCalendar(id: string, updates: Partial<ConnectedCalendar>): Promise<void> {
    const existing = this.calendars.get(id);
    if (existing) {
      this.calendars.set(id, { ...existing, ...updates });
    }
  }

  async deleteConnectedCalendar(id: string): Promise<void> {
    this.calendars.delete(id);
  }
}
