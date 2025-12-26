import * as React from 'react';

interface CaseUpdateEmailProps {
  organization: {
    name: string;
    address: string;
    phone: string;
    email: string;
    websiteUrl?: string;
  };
  caseWorker?: {
    name: string;
    email: string;
    phone?: string;
  };
  client: {
    name: string;
    email: string;
  };
  caseInfo: {
    id: string;
    caseNumber: string;
    status: 'active' | 'pending' | 'referred' | 'closed' | 'resolved';
    previousStatus?: string;
    updatedAt: string;
    summary?: string;
  };
  update: {
    type: 'status_change' | 'assignment' | 'note_added' | 'referral' | 'appointment' | 'resolution';
    title: string;
    message: string;
    nextSteps?: string[];
  };
  appointment?: {
    date: string;
    time: string;
    location: string;
    purpose: string;
  };
  referral?: {
    organizationName: string;
    contactName?: string;
    contactPhone?: string;
    notes?: string;
  };
  portalUrl?: string;
  unsubscribeUrl?: string;
}

export function CaseUpdateEmail({
  organization,
  caseWorker,
  client,
  caseInfo,
  update,
  appointment,
  referral,
  portalUrl,
  unsubscribeUrl,
}: CaseUpdateEmailProps) {
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#047857';
      case 'pending': return '#d97706';
      case 'referred': return '#7c3aed';
      case 'closed': return '#6b7280';
      case 'resolved': return '#0284c7';
      default: return '#6b7280';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      {/* Header */}
      <div style={{ borderBottom: '3px solid #0284c7', paddingBottom: '20px', marginBottom: '20px' }}>
        <h1 style={{ color: '#0284c7', margin: '0 0 5px 0', fontSize: '24px' }}>
          {organization.name}
        </h1>
        <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>
          Case Update Notification
        </p>
      </div>

      {/* Greeting */}
      <div style={{ marginBottom: '20px' }}>
        <p style={{ fontSize: '16px', color: '#333', margin: '0 0 10px 0' }}>
          Dear {client.name},
        </p>
        <p style={{ fontSize: '16px', color: '#333', lineHeight: '1.6', margin: 0 }}>
          We have an update regarding your case with {organization.name}.
        </p>
      </div>

      {/* Case Info Box */}
      <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', margin: '20px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <div>
            <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>Case Number</p>
            <p style={{ margin: '3px 0 0 0', fontSize: '16px', fontWeight: 'bold', color: '#333' }}>
              {caseInfo.caseNumber}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>Status</p>
            <span
              style={{
                display: 'inline-block',
                backgroundColor: getStatusColor(caseInfo.status),
                color: '#ffffff',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: 'bold',
                marginTop: '3px',
              }}
            >
              {getStatusLabel(caseInfo.status)}
            </span>
          </div>
        </div>
        {caseInfo.summary && (
          <p style={{ margin: 0, fontSize: '14px', color: '#666', lineHeight: '1.5' }}>
            {caseInfo.summary}
          </p>
        )}
      </div>

      {/* Update Details */}
      <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '20px', margin: '20px 0' }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#1d4ed8', fontSize: '16px' }}>
          {update.title}
        </h3>
        <p style={{ margin: 0, fontSize: '14px', color: '#1e40af', lineHeight: '1.6' }}>
          {update.message}
        </p>
      </div>

      {/* Appointment Info */}
      {appointment && (
        <div style={{ backgroundColor: '#ecfdf5', border: '1px solid #6ee7b7', borderRadius: '8px', padding: '20px', margin: '20px 0' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#047857', fontSize: '16px' }}>
            📅 Scheduled Appointment
          </h3>
          <table style={{ width: '100%', fontSize: '14px' }}>
            <tbody>
              <tr>
                <td style={{ padding: '5px 0', color: '#047857', width: '100px' }}>Date:</td>
                <td style={{ padding: '5px 0', fontWeight: 'bold', color: '#047857' }}>{formatDate(appointment.date)}</td>
              </tr>
              <tr>
                <td style={{ padding: '5px 0', color: '#047857' }}>Time:</td>
                <td style={{ padding: '5px 0', fontWeight: 'bold', color: '#047857' }}>{appointment.time}</td>
              </tr>
              <tr>
                <td style={{ padding: '5px 0', color: '#047857' }}>Location:</td>
                <td style={{ padding: '5px 0', fontWeight: 'bold', color: '#047857' }}>{appointment.location}</td>
              </tr>
              <tr>
                <td style={{ padding: '5px 0', color: '#047857' }}>Purpose:</td>
                <td style={{ padding: '5px 0', color: '#047857' }}>{appointment.purpose}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Referral Info */}
      {referral && (
        <div style={{ backgroundColor: '#fdf4ff', border: '1px solid #e879f9', borderRadius: '8px', padding: '20px', margin: '20px 0' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#a21caf', fontSize: '16px' }}>
            🔗 Referral Information
          </h3>
          <table style={{ width: '100%', fontSize: '14px' }}>
            <tbody>
              <tr>
                <td style={{ padding: '5px 0', color: '#a21caf', width: '120px' }}>Organization:</td>
                <td style={{ padding: '5px 0', fontWeight: 'bold', color: '#a21caf' }}>{referral.organizationName}</td>
              </tr>
              {referral.contactName && (
                <tr>
                  <td style={{ padding: '5px 0', color: '#a21caf' }}>Contact:</td>
                  <td style={{ padding: '5px 0', fontWeight: 'bold', color: '#a21caf' }}>{referral.contactName}</td>
                </tr>
              )}
              {referral.contactPhone && (
                <tr>
                  <td style={{ padding: '5px 0', color: '#a21caf' }}>Phone:</td>
                  <td style={{ padding: '5px 0', fontWeight: 'bold', color: '#a21caf' }}>{referral.contactPhone}</td>
                </tr>
              )}
              {referral.notes && (
                <tr>
                  <td style={{ padding: '5px 0', color: '#a21caf', verticalAlign: 'top' }}>Notes:</td>
                  <td style={{ padding: '5px 0', color: '#a21caf' }}>{referral.notes}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Next Steps */}
      {update.nextSteps && update.nextSteps.length > 0 && (
        <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fcd34d', borderRadius: '8px', padding: '20px', margin: '20px 0' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#92400e', fontSize: '16px' }}>
            📋 Next Steps
          </h3>
          <ol style={{ margin: 0, paddingLeft: '20px', color: '#92400e', fontSize: '14px' }}>
            {update.nextSteps.map((step, index) => (
              <li key={index} style={{ marginBottom: '8px', lineHeight: '1.5' }}>{step}</li>
            ))}
          </ol>
        </div>
      )}

      {/* Case Worker Contact */}
      {caseWorker && (
        <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '15px', margin: '20px 0' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#333' }}>Your Case Worker</h4>
          <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
            <strong>{caseWorker.name}</strong><br />
            Email: {caseWorker.email}
            {caseWorker.phone && <><br />Phone: {caseWorker.phone}</>}
          </p>
        </div>
      )}

      {/* Portal Button */}
      {portalUrl && (
        <div style={{ textAlign: 'center', margin: '25px 0' }}>
          <a
            href={portalUrl}
            style={{
              display: 'inline-block',
              backgroundColor: '#0284c7',
              color: '#ffffff',
              padding: '14px 35px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '14px',
            }}
          >
            View Case Details
          </a>
        </div>
      )}

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
        <p style={{ color: '#666', fontSize: '14px', margin: '0 0 10px 0' }}>
          We're here to help. Contact us if you have any questions.
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

export function getCaseUpdateEmailText(props: CaseUpdateEmailProps): string {
  const { organization, caseWorker, client, caseInfo, update, appointment, referral } = props;

  return `
${organization.name}
Case Update Notification

Dear ${client.name},

We have an update regarding your case with ${organization.name}.

CASE INFORMATION
----------------
Case Number: ${caseInfo.caseNumber}
Status: ${caseInfo.status.charAt(0).toUpperCase() + caseInfo.status.slice(1)}
${caseInfo.summary ? `Summary: ${caseInfo.summary}` : ''}

UPDATE
------
${update.title}

${update.message}

${appointment ? `SCHEDULED APPOINTMENT
--------------------
Date: ${new Date(appointment.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
Time: ${appointment.time}
Location: ${appointment.location}
Purpose: ${appointment.purpose}` : ''}

${referral ? `REFERRAL INFORMATION
-------------------
Organization: ${referral.organizationName}
${referral.contactName ? `Contact: ${referral.contactName}` : ''}
${referral.contactPhone ? `Phone: ${referral.contactPhone}` : ''}
${referral.notes ? `Notes: ${referral.notes}` : ''}` : ''}

${update.nextSteps && update.nextSteps.length > 0 ? `NEXT STEPS
----------
${update.nextSteps.map((step, i) => `${i + 1}. ${step}`).join('\n')}` : ''}

${caseWorker ? `YOUR CASE WORKER
----------------
${caseWorker.name}
Email: ${caseWorker.email}
${caseWorker.phone ? `Phone: ${caseWorker.phone}` : ''}` : ''}

We're here to help. Contact us if you have any questions.

${organization.address}
Phone: ${organization.phone} | Email: ${organization.email}
  `.trim();
}
