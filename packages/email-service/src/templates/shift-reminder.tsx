import * as React from 'react';

interface ShiftReminderEmailProps {
  organization: {
    name: string;
    address: string;
    phone: string;
    email: string;
    websiteUrl?: string;
  };
  volunteer: {
    name: string;
    email: string;
  };
  shift: {
    id: string;
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    location: string;
    description?: string;
    teamName?: string;
    contactName?: string;
    contactPhone?: string;
  };
  reminderType: '24h' | '2h' | 'custom';
  calendarUrl?: string;
  unsubscribeUrl?: string;
}

export function ShiftReminderEmail({
  organization,
  volunteer,
  shift,
  reminderType,
  calendarUrl,
  unsubscribeUrl,
}: ShiftReminderEmailProps) {
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const reminderText = reminderType === '24h'
    ? 'tomorrow'
    : reminderType === '2h'
    ? 'in 2 hours'
    : 'coming up';

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      {/* Header */}
      <div style={{ borderBottom: '3px solid #0284c7', paddingBottom: '20px', marginBottom: '20px' }}>
        <h1 style={{ color: '#0284c7', margin: '0 0 5px 0', fontSize: '24px' }}>
          {organization.name}
        </h1>
        <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>
          Volunteer Shift Reminder
        </p>
      </div>

      {/* Main Content */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ color: '#333', margin: '0 0 15px 0', fontSize: '20px' }}>
          Hi {volunteer.name}! Your shift is {reminderText}
        </h2>
        <p style={{ fontSize: '16px', color: '#333', lineHeight: '1.6' }}>
          This is a friendly reminder about your upcoming volunteer shift. We appreciate your dedication to serving our community!
        </p>
      </div>

      {/* Shift Details Box */}
      <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', margin: '20px 0' }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#0284c7', fontSize: '18px' }}>
          {shift.title}
        </h3>
        <table style={{ width: '100%', fontSize: '14px' }}>
          <tbody>
            <tr>
              <td style={{ padding: '8px 0', color: '#666', width: '120px', verticalAlign: 'top' }}>📅 Date:</td>
              <td style={{ padding: '8px 0', fontWeight: 'bold' }}>{formatDate(shift.date)}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', color: '#666', verticalAlign: 'top' }}>⏰ Time:</td>
              <td style={{ padding: '8px 0', fontWeight: 'bold' }}>{shift.startTime} - {shift.endTime}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', color: '#666', verticalAlign: 'top' }}>📍 Location:</td>
              <td style={{ padding: '8px 0', fontWeight: 'bold' }}>{shift.location}</td>
            </tr>
            {shift.teamName && (
              <tr>
                <td style={{ padding: '8px 0', color: '#666', verticalAlign: 'top' }}>👥 Team:</td>
                <td style={{ padding: '8px 0', fontWeight: 'bold' }}>{shift.teamName}</td>
              </tr>
            )}
            {shift.description && (
              <tr>
                <td style={{ padding: '8px 0', color: '#666', verticalAlign: 'top' }}>📝 Notes:</td>
                <td style={{ padding: '8px 0' }}>{shift.description}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Contact Info */}
      {(shift.contactName || shift.contactPhone) && (
        <div style={{ backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px', padding: '15px', margin: '20px 0' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#0369a1' }}>Questions or Need to Cancel?</h4>
          <p style={{ fontSize: '14px', color: '#0369a1', margin: 0 }}>
            {shift.contactName && <>Contact: <strong>{shift.contactName}</strong><br /></>}
            {shift.contactPhone && <>Phone: <strong>{shift.contactPhone}</strong><br /></>}
            Email: <strong>{organization.email}</strong>
          </p>
        </div>
      )}

      {/* Action Button */}
      {calendarUrl && (
        <div style={{ textAlign: 'center', margin: '25px 0' }}>
          <a
            href={calendarUrl}
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
            Add to Calendar
          </a>
        </div>
      )}

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
        <p style={{ color: '#666', fontSize: '14px', margin: '0 0 10px 0' }}>
          Thank you for serving with {organization.name}!
        </p>
        <p style={{ color: '#999', fontSize: '12px', margin: '0 0 10px 0' }}>
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

export function getShiftReminderEmailText(props: ShiftReminderEmailProps): string {
  const { organization, volunteer, shift, reminderType } = props;

  const reminderText = reminderType === '24h'
    ? 'tomorrow'
    : reminderType === '2h'
    ? 'in 2 hours'
    : 'coming up';

  return `
${organization.name}
Volunteer Shift Reminder

Hi ${volunteer.name}!

Your shift is ${reminderText}!

SHIFT DETAILS
-------------
${shift.title}

Date: ${new Date(shift.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
Time: ${shift.startTime} - ${shift.endTime}
Location: ${shift.location}
${shift.teamName ? `Team: ${shift.teamName}` : ''}
${shift.description ? `Notes: ${shift.description}` : ''}

${shift.contactName || shift.contactPhone ? `QUESTIONS OR NEED TO CANCEL?
${shift.contactName ? `Contact: ${shift.contactName}` : ''}
${shift.contactPhone ? `Phone: ${shift.contactPhone}` : ''}
Email: ${organization.email}` : ''}

Thank you for serving with ${organization.name}!

${organization.address}
Phone: ${organization.phone} | Email: ${organization.email}
  `.trim();
}
