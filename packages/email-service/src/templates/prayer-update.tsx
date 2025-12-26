import * as React from 'react';

// ============================================
// Prayer Request Received Email
// ============================================

interface PrayerReceivedEmailProps {
  organization: {
    name: string;
    address: string;
    phone: string;
    email: string;
    websiteUrl?: string;
  };
  requester: {
    name: string;
    email: string;
  };
  prayerRequest: {
    id: string;
    title?: string;
    request: string;
    submittedAt: string;
    isPrivate: boolean;
  };
  prayerTeamSize?: number;
  unsubscribeUrl?: string;
}

export function PrayerReceivedEmail({
  organization,
  requester,
  prayerRequest,
  prayerTeamSize,
  unsubscribeUrl,
}: PrayerReceivedEmailProps) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      {/* Header */}
      <div style={{ borderBottom: '3px solid #0284c7', paddingBottom: '20px', marginBottom: '20px' }}>
        <h1 style={{ color: '#0284c7', margin: '0 0 5px 0', fontSize: '24px' }}>
          {organization.name}
        </h1>
        <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>
          Prayer Request Received
        </p>
      </div>

      {/* Confirmation Banner */}
      <div style={{ backgroundColor: '#ecfdf5', border: '1px solid #6ee7b7', borderRadius: '8px', padding: '20px', margin: '20px 0', textAlign: 'center' }}>
        <p style={{ color: '#047857', fontSize: '24px', margin: '0 0 5px 0' }}>🙏</p>
        <p style={{ color: '#047857', fontSize: '18px', fontWeight: 'bold', margin: 0 }}>
          We've Received Your Prayer Request
        </p>
      </div>

      {/* Main Content */}
      <div style={{ marginBottom: '20px' }}>
        <p style={{ fontSize: '16px', color: '#333', margin: '0 0 15px 0' }}>
          Dear {requester.name},
        </p>
        <p style={{ fontSize: '16px', color: '#333', lineHeight: '1.6', margin: 0 }}>
          Thank you for sharing your prayer request with us. We want you to know that you are not alone.
          {prayerTeamSize && prayerTeamSize > 0 && (
            <> Our prayer team of {prayerTeamSize} dedicated volunteers will be lifting you up in prayer.</>
          )}
        </p>
      </div>

      {/* Prayer Request Box */}
      <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', margin: '20px 0' }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#0284c7', fontSize: '14px' }}>
          Your Prayer Request:
        </h3>
        <p style={{ margin: 0, fontSize: '14px', color: '#333', lineHeight: '1.6', fontStyle: 'italic' }}>
          "{prayerRequest.request}"
        </p>
        {prayerRequest.isPrivate && (
          <p style={{ margin: '15px 0 0 0', fontSize: '12px', color: '#666' }}>
            🔒 This request is private and will only be shared with our prayer team.
          </p>
        )}
      </div>

      {/* Scripture Box */}
      <div style={{ backgroundColor: '#fef3c7', border: '1px solid #fcd34d', borderRadius: '8px', padding: '20px', margin: '20px 0' }}>
        <p style={{ fontSize: '14px', color: '#92400e', margin: 0, fontStyle: 'italic', lineHeight: '1.6' }}>
          "Cast all your anxiety on him because he cares for you."
        </p>
        <p style={{ fontSize: '12px', color: '#92400e', margin: '10px 0 0 0', fontWeight: 'bold' }}>
          — 1 Peter 5:7
        </p>
      </div>

      {/* What Happens Next */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ color: '#333', fontSize: '16px', margin: '0 0 10px 0' }}>What Happens Next?</h3>
        <ul style={{ margin: 0, paddingLeft: '20px', color: '#666', fontSize: '14px', lineHeight: '1.8' }}>
          <li>Our prayer team will pray for your request this week</li>
          <li>You may receive follow-up messages of encouragement</li>
          <li>If you'd like to share an update or answered prayer, simply reply to this email</li>
        </ul>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
        <p style={{ color: '#666', fontSize: '14px', margin: '0 0 10px 0' }}>
          You are loved and prayed for.
        </p>
        <p style={{ color: '#999', fontSize: '12px', margin: '0 0 10px 0' }}>
          {organization.name}<br />
          {organization.address}<br />
          Phone: {organization.phone} | Email: {organization.email}
        </p>
        {unsubscribeUrl && (
          <p style={{ color: '#999', fontSize: '11px', margin: 0 }}>
            <a href={unsubscribeUrl} style={{ color: '#999' }}>
              Update notification preferences
            </a>
          </p>
        )}
      </div>
    </div>
  );
}

export function getPrayerReceivedEmailText(props: PrayerReceivedEmailProps): string {
  const { organization, requester, prayerRequest, prayerTeamSize } = props;

  return `
${organization.name}
Prayer Request Received

Dear ${requester.name},

We've received your prayer request. Thank you for sharing with us.
${prayerTeamSize && prayerTeamSize > 0 ? `Our prayer team of ${prayerTeamSize} dedicated volunteers will be lifting you up in prayer.` : ''}

YOUR PRAYER REQUEST:
"${prayerRequest.request}"
${prayerRequest.isPrivate ? '\n(This request is private and will only be shared with our prayer team.)' : ''}

"Cast all your anxiety on him because he cares for you." — 1 Peter 5:7

WHAT HAPPENS NEXT?
- Our prayer team will pray for your request this week
- You may receive follow-up messages of encouragement
- If you'd like to share an update, simply reply to this email

You are loved and prayed for.

${organization.name}
${organization.address}
Phone: ${organization.phone} | Email: ${organization.email}
  `.trim();
}

// ============================================
// Prayer Update/Answered Email
// ============================================

interface PrayerUpdateEmailProps {
  organization: {
    name: string;
    address: string;
    phone: string;
    email: string;
    websiteUrl?: string;
  };
  requester: {
    name: string;
    email: string;
  };
  prayerRequest: {
    id: string;
    originalRequest: string;
    submittedAt: string;
  };
  update: {
    type: 'praying' | 'answered' | 'encouragement' | 'follow_up';
    message: string;
    scripture?: {
      text: string;
      reference: string;
    };
    prayerCount?: number;
  };
  shareTestimonyUrl?: string;
  unsubscribeUrl?: string;
}

export function PrayerUpdateEmail({
  organization,
  requester,
  prayerRequest,
  update,
  shareTestimonyUrl,
  unsubscribeUrl,
}: PrayerUpdateEmailProps) {
  const getUpdateTitle = () => {
    switch (update.type) {
      case 'praying': return 'We're Praying for You';
      case 'answered': return 'Celebrating Answered Prayer! 🎉';
      case 'encouragement': return 'A Word of Encouragement';
      case 'follow_up': return 'Checking In on Your Prayer Request';
      default: return 'Prayer Update';
    }
  };

  const getUpdateIcon = () => {
    switch (update.type) {
      case 'praying': return '🙏';
      case 'answered': return '🎉';
      case 'encouragement': return '💛';
      case 'follow_up': return '💬';
      default: return '✉️';
    }
  };

  const getUpdateBgColor = () => {
    switch (update.type) {
      case 'praying': return { bg: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8' };
      case 'answered': return { bg: '#ecfdf5', border: '#6ee7b7', text: '#047857' };
      case 'encouragement': return { bg: '#fef3c7', border: '#fcd34d', text: '#92400e' };
      case 'follow_up': return { bg: '#f3f4f6', border: '#d1d5db', text: '#374151' };
      default: return { bg: '#f8fafc', border: '#e2e8f0', text: '#333' };
    }
  };

  const colors = getUpdateBgColor();

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      {/* Header */}
      <div style={{ borderBottom: '3px solid #0284c7', paddingBottom: '20px', marginBottom: '20px' }}>
        <h1 style={{ color: '#0284c7', margin: '0 0 5px 0', fontSize: '24px' }}>
          {organization.name}
        </h1>
        <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>
          Prayer Update
        </p>
      </div>

      {/* Update Banner */}
      <div style={{ backgroundColor: colors.bg, border: `1px solid ${colors.border}`, borderRadius: '8px', padding: '20px', margin: '20px 0', textAlign: 'center' }}>
        <p style={{ color: colors.text, fontSize: '24px', margin: '0 0 5px 0' }}>{getUpdateIcon()}</p>
        <p style={{ color: colors.text, fontSize: '18px', fontWeight: 'bold', margin: 0 }}>
          {getUpdateTitle()}
        </p>
      </div>

      {/* Greeting */}
      <div style={{ marginBottom: '20px' }}>
        <p style={{ fontSize: '16px', color: '#333', margin: '0 0 15px 0' }}>
          Dear {requester.name},
        </p>
        <p style={{ fontSize: '16px', color: '#333', lineHeight: '1.6', margin: 0 }}>
          {update.message}
        </p>
      </div>

      {/* Prayer Count */}
      {update.prayerCount && update.prayerCount > 0 && (
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
            <strong>{update.prayerCount}</strong> people have prayed for your request
          </p>
        </div>
      )}

      {/* Original Request Reference */}
      <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '15px', margin: '20px 0' }}>
        <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#666' }}>Your original prayer request:</p>
        <p style={{ margin: 0, fontSize: '14px', color: '#333', fontStyle: 'italic' }}>
          "{prayerRequest.originalRequest.length > 150
            ? prayerRequest.originalRequest.substring(0, 150) + '...'
            : prayerRequest.originalRequest}"
        </p>
      </div>

      {/* Scripture */}
      {update.scripture && (
        <div style={{ backgroundColor: '#fef3c7', border: '1px solid #fcd34d', borderRadius: '8px', padding: '20px', margin: '20px 0' }}>
          <p style={{ fontSize: '14px', color: '#92400e', margin: 0, fontStyle: 'italic', lineHeight: '1.6' }}>
            "{update.scripture.text}"
          </p>
          <p style={{ fontSize: '12px', color: '#92400e', margin: '10px 0 0 0', fontWeight: 'bold' }}>
            — {update.scripture.reference}
          </p>
        </div>
      )}

      {/* Share Testimony Button (for answered prayers) */}
      {update.type === 'answered' && shareTestimonyUrl && (
        <div style={{ textAlign: 'center', margin: '25px 0' }}>
          <p style={{ fontSize: '14px', color: '#666', margin: '0 0 15px 0' }}>
            Would you like to share how God answered your prayer?
          </p>
          <a
            href={shareTestimonyUrl}
            style={{
              display: 'inline-block',
              backgroundColor: '#0284c7',
              color: '#ffffff',
              padding: '12px 30px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '14px',
            }}
          >
            Share Your Testimony
          </a>
        </div>
      )}

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
        <p style={{ color: '#666', fontSize: '14px', margin: '0 0 10px 0' }}>
          We're honored to pray alongside you.
        </p>
        <p style={{ color: '#999', fontSize: '12px', margin: '0 0 10px 0' }}>
          {organization.name}<br />
          {organization.address}
        </p>
        {unsubscribeUrl && (
          <p style={{ color: '#999', fontSize: '11px', margin: 0 }}>
            <a href={unsubscribeUrl} style={{ color: '#999' }}>
              Update notification preferences
            </a>
          </p>
        )}
      </div>
    </div>
  );
}

export function getPrayerUpdateEmailText(props: PrayerUpdateEmailProps): string {
  const { organization, requester, prayerRequest, update } = props;

  const getUpdateTitle = () => {
    switch (update.type) {
      case 'praying': return "We're Praying for You";
      case 'answered': return 'Celebrating Answered Prayer!';
      case 'encouragement': return 'A Word of Encouragement';
      case 'follow_up': return 'Checking In on Your Prayer Request';
      default: return 'Prayer Update';
    }
  };

  return `
${organization.name}
${getUpdateTitle()}

Dear ${requester.name},

${update.message}

${update.prayerCount ? `${update.prayerCount} people have prayed for your request.` : ''}

Your original prayer request:
"${prayerRequest.originalRequest.length > 150 ? prayerRequest.originalRequest.substring(0, 150) + '...' : prayerRequest.originalRequest}"

${update.scripture ? `"${update.scripture.text}" — ${update.scripture.reference}` : ''}

We're honored to pray alongside you.

${organization.name}
${organization.address}
Phone: ${organization.phone} | Email: ${organization.email}
  `.trim();
}
