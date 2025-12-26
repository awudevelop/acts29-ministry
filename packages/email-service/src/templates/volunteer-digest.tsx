import * as React from 'react';

interface VolunteerDigestEmailProps {
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
  period: {
    startDate: string;
    endDate: string;
    type: 'weekly' | 'monthly';
  };
  stats: {
    hoursLogged: number;
    shiftsCompleted: number;
    upcomingShifts: number;
    totalHoursAllTime?: number;
    rank?: string; // e.g., "Top 10% of volunteers"
  };
  upcomingShifts: Array<{
    id: string;
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    location: string;
    teamName?: string;
  }>;
  recentActivity?: Array<{
    type: 'shift_completed' | 'hours_logged' | 'team_joined' | 'milestone';
    description: string;
    date: string;
  }>;
  opportunities?: Array<{
    id: string;
    title: string;
    date: string;
    spotsAvailable: number;
  }>;
  teamUpdates?: Array<{
    teamName: string;
    message: string;
  }>;
  dashboardUrl?: string;
  signUpUrl?: string;
  unsubscribeUrl?: string;
}

export function VolunteerDigestEmail({
  organization,
  volunteer,
  period,
  stats,
  upcomingShifts,
  recentActivity,
  opportunities,
  teamUpdates,
  dashboardUrl,
  signUpUrl,
  unsubscribeUrl,
}: VolunteerDigestEmailProps) {
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });

  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return `${startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;
  };

  const periodLabel = period.type === 'weekly' ? 'Weekly' : 'Monthly';

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      {/* Header */}
      <div style={{ borderBottom: '3px solid #0284c7', paddingBottom: '20px', marginBottom: '20px' }}>
        <h1 style={{ color: '#0284c7', margin: '0 0 5px 0', fontSize: '24px' }}>
          {organization.name}
        </h1>
        <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>
          Your {periodLabel} Volunteer Summary
        </p>
      </div>

      {/* Greeting */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ color: '#333', margin: '0 0 10px 0', fontSize: '20px' }}>
          Hi {volunteer.name}! 👋
        </h2>
        <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
          Here's your volunteer summary for {formatDateRange(period.startDate, period.endDate)}
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
        <div style={{ flex: 1, backgroundColor: '#ecfdf5', borderRadius: '8px', padding: '15px', textAlign: 'center' }}>
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#047857', margin: '0 0 5px 0' }}>
            {stats.hoursLogged}
          </p>
          <p style={{ fontSize: '12px', color: '#047857', margin: 0 }}>Hours This {period.type === 'weekly' ? 'Week' : 'Month'}</p>
        </div>
        <div style={{ flex: 1, backgroundColor: '#eff6ff', borderRadius: '8px', padding: '15px', textAlign: 'center' }}>
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#1d4ed8', margin: '0 0 5px 0' }}>
            {stats.shiftsCompleted}
          </p>
          <p style={{ fontSize: '12px', color: '#1d4ed8', margin: 0 }}>Shifts Completed</p>
        </div>
        <div style={{ flex: 1, backgroundColor: '#fef3c7', borderRadius: '8px', padding: '15px', textAlign: 'center' }}>
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#92400e', margin: '0 0 5px 0' }}>
            {stats.upcomingShifts}
          </p>
          <p style={{ fontSize: '12px', color: '#92400e', margin: 0 }}>Upcoming Shifts</p>
        </div>
      </div>

      {/* Milestone Banner */}
      {stats.rank && (
        <div style={{ backgroundColor: '#fdf4ff', border: '1px solid #e879f9', borderRadius: '8px', padding: '15px', margin: '20px 0', textAlign: 'center' }}>
          <p style={{ color: '#a21caf', fontSize: '16px', fontWeight: 'bold', margin: 0 }}>
            🏆 {stats.rank}
          </p>
          {stats.totalHoursAllTime && (
            <p style={{ color: '#a21caf', fontSize: '14px', margin: '5px 0 0 0' }}>
              You've volunteered {stats.totalHoursAllTime} hours total!
            </p>
          )}
        </div>
      )}

      {/* Upcoming Shifts */}
      {upcomingShifts.length > 0 && (
        <div style={{ marginBottom: '25px' }}>
          <h3 style={{ color: '#333', fontSize: '16px', margin: '0 0 15px 0', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>
            📅 Your Upcoming Shifts
          </h3>
          {upcomingShifts.slice(0, 5).map((shift, index) => (
            <div
              key={shift.id}
              style={{
                backgroundColor: index % 2 === 0 ? '#f8fafc' : '#ffffff',
                padding: '12px',
                borderRadius: '6px',
                marginBottom: '8px',
                border: '1px solid #e2e8f0',
              }}
            >
              <p style={{ margin: '0 0 5px 0', fontWeight: 'bold', fontSize: '14px', color: '#333' }}>
                {shift.title}
              </p>
              <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>
                {formatDate(shift.date)} • {shift.startTime} - {shift.endTime} • {shift.location}
              </p>
              {shift.teamName && (
                <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#0284c7' }}>
                  Team: {shift.teamName}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Open Opportunities */}
      {opportunities && opportunities.length > 0 && (
        <div style={{ marginBottom: '25px' }}>
          <h3 style={{ color: '#333', fontSize: '16px', margin: '0 0 15px 0', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>
            🙋 Open Opportunities
          </h3>
          <div style={{ backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px', padding: '15px' }}>
            {opportunities.slice(0, 3).map((opp, index) => (
              <div
                key={opp.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 0',
                  borderBottom: index < opportunities.length - 1 ? '1px solid #bae6fd' : 'none',
                }}
              >
                <div>
                  <p style={{ margin: 0, fontWeight: 'bold', fontSize: '14px', color: '#0369a1' }}>
                    {opp.title}
                  </p>
                  <p style={{ margin: '3px 0 0 0', fontSize: '12px', color: '#0369a1' }}>
                    {formatDate(opp.date)} • {opp.spotsAvailable} spots left
                  </p>
                </div>
              </div>
            ))}
            {signUpUrl && (
              <div style={{ textAlign: 'center', marginTop: '15px' }}>
                <a
                  href={signUpUrl}
                  style={{
                    display: 'inline-block',
                    backgroundColor: '#0284c7',
                    color: '#ffffff',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    fontSize: '13px',
                  }}
                >
                  Sign Up for a Shift
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Team Updates */}
      {teamUpdates && teamUpdates.length > 0 && (
        <div style={{ marginBottom: '25px' }}>
          <h3 style={{ color: '#333', fontSize: '16px', margin: '0 0 15px 0', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>
            👥 Team Updates
          </h3>
          {teamUpdates.map((update, index) => (
            <div
              key={index}
              style={{
                backgroundColor: '#f8fafc',
                padding: '12px',
                borderRadius: '6px',
                marginBottom: '8px',
                borderLeft: '4px solid #0284c7',
              }}
            >
              <p style={{ margin: '0 0 5px 0', fontWeight: 'bold', fontSize: '13px', color: '#0284c7' }}>
                {update.teamName}
              </p>
              <p style={{ margin: 0, fontSize: '14px', color: '#333' }}>
                {update.message}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Dashboard Button */}
      {dashboardUrl && (
        <div style={{ textAlign: 'center', margin: '25px 0' }}>
          <a
            href={dashboardUrl}
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
            View Your Dashboard
          </a>
        </div>
      )}

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
        <p style={{ color: '#666', fontSize: '14px', margin: '0 0 10px 0' }}>
          Thank you for making a difference with {organization.name}!
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

export function getVolunteerDigestEmailText(props: VolunteerDigestEmailProps): string {
  const { organization, volunteer, period, stats, upcomingShifts, opportunities, teamUpdates } = props;

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });

  const periodLabel = period.type === 'weekly' ? 'Weekly' : 'Monthly';

  return `
${organization.name}
Your ${periodLabel} Volunteer Summary

Hi ${volunteer.name}!

YOUR STATS
----------
Hours This ${period.type === 'weekly' ? 'Week' : 'Month'}: ${stats.hoursLogged}
Shifts Completed: ${stats.shiftsCompleted}
Upcoming Shifts: ${stats.upcomingShifts}
${stats.totalHoursAllTime ? `Total Hours All Time: ${stats.totalHoursAllTime}` : ''}
${stats.rank ? `Achievement: ${stats.rank}` : ''}

${upcomingShifts.length > 0 ? `UPCOMING SHIFTS
---------------
${upcomingShifts.slice(0, 5).map(shift =>
  `${shift.title}
  ${formatDate(shift.date)} • ${shift.startTime} - ${shift.endTime}
  ${shift.location}${shift.teamName ? ` • Team: ${shift.teamName}` : ''}`
).join('\n\n')}` : ''}

${opportunities && opportunities.length > 0 ? `OPEN OPPORTUNITIES
------------------
${opportunities.slice(0, 3).map(opp =>
  `${opp.title}
  ${formatDate(opp.date)} • ${opp.spotsAvailable} spots left`
).join('\n\n')}` : ''}

${teamUpdates && teamUpdates.length > 0 ? `TEAM UPDATES
------------
${teamUpdates.map(update =>
  `${update.teamName}: ${update.message}`
).join('\n\n')}` : ''}

Thank you for making a difference with ${organization.name}!

${organization.address}
Phone: ${organization.phone} | Email: ${organization.email}
  `.trim();
}
