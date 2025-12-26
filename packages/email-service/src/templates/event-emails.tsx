import * as React from 'react';

// ============================================
// Event Registration Confirmation Email
// ============================================

interface EventRegistrationEmailProps {
  organization: {
    name: string;
    address: string;
    phone: string;
    email: string;
    websiteUrl?: string;
  };
  registrant: {
    name: string;
    email: string;
  };
  event: {
    id: string;
    title: string;
    date: string;
    startTime: string;
    endTime?: string;
    location: string;
    description?: string;
    imageUrl?: string;
    capacity?: number;
    spotsRemaining?: number;
  };
  registration: {
    id: string;
    registeredAt: string;
    ticketCount?: number;
    confirmationNumber?: string;
  };
  calendarUrl?: string;
  eventDetailsUrl?: string;
  unsubscribeUrl?: string;
}

export function EventRegistrationEmail({
  organization,
  registrant,
  event,
  registration,
  calendarUrl,
  eventDetailsUrl,
  unsubscribeUrl,
}: EventRegistrationEmailProps) {
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      {/* Header */}
      <div style={{ borderBottom: '3px solid #0284c7', paddingBottom: '20px', marginBottom: '20px' }}>
        <h1 style={{ color: '#0284c7', margin: '0 0 5px 0', fontSize: '24px' }}>
          {organization.name}
        </h1>
        <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>
          Event Registration Confirmation
        </p>
      </div>

      {/* Success Banner */}
      <div style={{ backgroundColor: '#ecfdf5', border: '1px solid #6ee7b7', borderRadius: '8px', padding: '15px', margin: '20px 0', textAlign: 'center' }}>
        <p style={{ color: '#047857', fontSize: '18px', fontWeight: 'bold', margin: 0 }}>
          ✓ You're Registered!
        </p>
      </div>

      {/* Main Content */}
      <div style={{ marginBottom: '20px' }}>
        <p style={{ fontSize: '16px', color: '#333', lineHeight: '1.6' }}>
          Hi {registrant.name},
        </p>
        <p style={{ fontSize: '16px', color: '#333', lineHeight: '1.6' }}>
          Thank you for registering! We're excited to see you at <strong>{event.title}</strong>.
          {registration.confirmationNumber && (
            <> Your confirmation number is <strong>{registration.confirmationNumber}</strong>.</>
          )}
        </p>
      </div>

      {/* Event Details Box */}
      <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', margin: '20px 0' }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#0284c7', fontSize: '18px' }}>
          {event.title}
        </h3>
        <table style={{ width: '100%', fontSize: '14px' }}>
          <tbody>
            <tr>
              <td style={{ padding: '8px 0', color: '#666', width: '120px', verticalAlign: 'top' }}>📅 Date:</td>
              <td style={{ padding: '8px 0', fontWeight: 'bold' }}>{formatDate(event.date)}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', color: '#666', verticalAlign: 'top' }}>⏰ Time:</td>
              <td style={{ padding: '8px 0', fontWeight: 'bold' }}>
                {event.startTime}{event.endTime && ` - ${event.endTime}`}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', color: '#666', verticalAlign: 'top' }}>📍 Location:</td>
              <td style={{ padding: '8px 0', fontWeight: 'bold' }}>{event.location}</td>
            </tr>
            {registration.ticketCount && registration.ticketCount > 1 && (
              <tr>
                <td style={{ padding: '8px 0', color: '#666', verticalAlign: 'top' }}>🎟️ Tickets:</td>
                <td style={{ padding: '8px 0', fontWeight: 'bold' }}>{registration.ticketCount}</td>
              </tr>
            )}
          </tbody>
        </table>
        {event.description && (
          <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #e2e8f0' }}>
            <p style={{ fontSize: '14px', color: '#666', margin: 0, lineHeight: '1.5' }}>
              {event.description}
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div style={{ textAlign: 'center', margin: '25px 0' }}>
        {calendarUrl && (
          <a
            href={calendarUrl}
            style={{
              display: 'inline-block',
              backgroundColor: '#0284c7',
              color: '#ffffff',
              padding: '12px 25px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '14px',
              marginRight: '10px',
            }}
          >
            Add to Calendar
          </a>
        )}
        {eventDetailsUrl && (
          <a
            href={eventDetailsUrl}
            style={{
              display: 'inline-block',
              backgroundColor: '#ffffff',
              color: '#0284c7',
              padding: '12px 25px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '14px',
              border: '2px solid #0284c7',
            }}
          >
            View Event Details
          </a>
        )}
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
        <p style={{ color: '#666', fontSize: '14px', margin: '0 0 10px 0' }}>
          Questions? Contact us at {organization.email} or {organization.phone}
        </p>
        <p style={{ color: '#999', fontSize: '12px', margin: '0 0 10px 0' }}>
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

export function getEventRegistrationEmailText(props: EventRegistrationEmailProps): string {
  const { organization, registrant, event, registration } = props;

  return `
${organization.name}
Event Registration Confirmation

✓ You're Registered!

Hi ${registrant.name},

Thank you for registering! We're excited to see you at ${event.title}.
${registration.confirmationNumber ? `Your confirmation number is ${registration.confirmationNumber}.` : ''}

EVENT DETAILS
-------------
${event.title}

Date: ${new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
Time: ${event.startTime}${event.endTime ? ` - ${event.endTime}` : ''}
Location: ${event.location}
${registration.ticketCount && registration.ticketCount > 1 ? `Tickets: ${registration.ticketCount}` : ''}
${event.description ? `\n${event.description}` : ''}

Questions? Contact us at ${organization.email} or ${organization.phone}

${organization.address}
  `.trim();
}

// ============================================
// Event Reminder Email
// ============================================

interface EventReminderEmailProps {
  organization: {
    name: string;
    address: string;
    phone: string;
    email: string;
    websiteUrl?: string;
  };
  registrant: {
    name: string;
    email: string;
  };
  event: {
    id: string;
    title: string;
    date: string;
    startTime: string;
    endTime?: string;
    location: string;
    description?: string;
    parkingInfo?: string;
    whatToBring?: string[];
  };
  reminderType: '24h' | '1h' | 'custom';
  calendarUrl?: string;
  directionsUrl?: string;
  unsubscribeUrl?: string;
}

export function EventReminderEmail({
  organization,
  registrant,
  event,
  reminderType,
  calendarUrl,
  directionsUrl,
  unsubscribeUrl,
}: EventReminderEmailProps) {
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const reminderText = reminderType === '24h'
    ? 'tomorrow'
    : reminderType === '1h'
    ? 'in 1 hour'
    : 'coming up soon';

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      {/* Header */}
      <div style={{ borderBottom: '3px solid #0284c7', paddingBottom: '20px', marginBottom: '20px' }}>
        <h1 style={{ color: '#0284c7', margin: '0 0 5px 0', fontSize: '24px' }}>
          {organization.name}
        </h1>
        <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>
          Event Reminder
        </p>
      </div>

      {/* Main Content */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ color: '#333', margin: '0 0 15px 0', fontSize: '20px' }}>
          Hi {registrant.name}! Your event is {reminderText}
        </h2>
        <p style={{ fontSize: '16px', color: '#333', lineHeight: '1.6' }}>
          We're looking forward to seeing you at <strong>{event.title}</strong>!
        </p>
      </div>

      {/* Event Details Box */}
      <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', margin: '20px 0' }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#0284c7', fontSize: '18px' }}>
          {event.title}
        </h3>
        <table style={{ width: '100%', fontSize: '14px' }}>
          <tbody>
            <tr>
              <td style={{ padding: '8px 0', color: '#666', width: '120px', verticalAlign: 'top' }}>📅 Date:</td>
              <td style={{ padding: '8px 0', fontWeight: 'bold' }}>{formatDate(event.date)}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', color: '#666', verticalAlign: 'top' }}>⏰ Time:</td>
              <td style={{ padding: '8px 0', fontWeight: 'bold' }}>
                {event.startTime}{event.endTime && ` - ${event.endTime}`}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', color: '#666', verticalAlign: 'top' }}>📍 Location:</td>
              <td style={{ padding: '8px 0', fontWeight: 'bold' }}>{event.location}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Parking Info */}
      {event.parkingInfo && (
        <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fcd34d', borderRadius: '8px', padding: '15px', margin: '20px 0' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#92400e' }}>🅿️ Parking Information</h4>
          <p style={{ fontSize: '14px', color: '#92400e', margin: 0 }}>
            {event.parkingInfo}
          </p>
        </div>
      )}

      {/* What to Bring */}
      {event.whatToBring && event.whatToBring.length > 0 && (
        <div style={{ backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px', padding: '15px', margin: '20px 0' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#0369a1' }}>📋 What to Bring</h4>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#0369a1', fontSize: '14px' }}>
            {event.whatToBring.map((item, index) => (
              <li key={index} style={{ marginBottom: '5px' }}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ textAlign: 'center', margin: '25px 0' }}>
        {directionsUrl && (
          <a
            href={directionsUrl}
            style={{
              display: 'inline-block',
              backgroundColor: '#0284c7',
              color: '#ffffff',
              padding: '12px 25px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '14px',
              marginRight: '10px',
            }}
          >
            Get Directions
          </a>
        )}
        {calendarUrl && (
          <a
            href={calendarUrl}
            style={{
              display: 'inline-block',
              backgroundColor: '#ffffff',
              color: '#0284c7',
              padding: '12px 25px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '14px',
              border: '2px solid #0284c7',
            }}
          >
            Add to Calendar
          </a>
        )}
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
        <p style={{ color: '#666', fontSize: '14px', margin: '0 0 10px 0' }}>
          Can't make it? Let us know at {organization.email}
        </p>
        <p style={{ color: '#999', fontSize: '12px', margin: '0 0 10px 0' }}>
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

export function getEventReminderEmailText(props: EventReminderEmailProps): string {
  const { organization, registrant, event, reminderType } = props;

  const reminderText = reminderType === '24h'
    ? 'tomorrow'
    : reminderType === '1h'
    ? 'in 1 hour'
    : 'coming up soon';

  return `
${organization.name}
Event Reminder

Hi ${registrant.name}!

Your event is ${reminderText}!

EVENT DETAILS
-------------
${event.title}

Date: ${new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
Time: ${event.startTime}${event.endTime ? ` - ${event.endTime}` : ''}
Location: ${event.location}

${event.parkingInfo ? `PARKING: ${event.parkingInfo}` : ''}

${event.whatToBring && event.whatToBring.length > 0 ? `WHAT TO BRING:
${event.whatToBring.map(item => `- ${item}`).join('\n')}` : ''}

Can't make it? Let us know at ${organization.email}

${organization.address}
Phone: ${organization.phone}
  `.trim();
}
