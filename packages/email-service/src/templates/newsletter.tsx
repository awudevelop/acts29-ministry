import * as React from 'react';

interface NewsletterEmailProps {
  organization: {
    name: string;
    address: string;
    phone: string;
    email: string;
    websiteUrl: string;
  };
  subscriber: {
    name?: string;
    email: string;
  };
  newsletter: {
    subject: string;
    preheader?: string;
    sections: Array<{
      type: 'heading' | 'text' | 'image' | 'button' | 'divider' | 'event' | 'donation-cta';
      content: string;
      imageUrl?: string;
      buttonUrl?: string;
      buttonText?: string;
      eventDate?: string;
      eventLocation?: string;
    }>;
  };
  unsubscribeUrl: string;
}

export function NewsletterEmail({
  organization,
  subscriber,
  newsletter,
  unsubscribeUrl,
}: NewsletterEmailProps) {
  const greeting = subscriber.name ? `Dear ${subscriber.name}` : 'Dear Friend';

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#0284c7', padding: '30px 20px', textAlign: 'center' }}>
        <h1 style={{ color: '#ffffff', margin: 0, fontSize: '28px' }}>
          {organization.name}
        </h1>
        <p style={{ color: '#bae6fd', margin: '10px 0 0 0', fontSize: '14px' }}>
          Serving those in need with the love of Christ
        </p>
      </div>

      {/* Content */}
      <div style={{ padding: '30px 20px' }}>
        <p style={{ fontSize: '16px', color: '#333', marginBottom: '20px' }}>
          {greeting},
        </p>

        {newsletter.sections.map((section, index) => {
          switch (section.type) {
            case 'heading':
              return (
                <h2 key={index} style={{ color: '#0284c7', fontSize: '22px', margin: '30px 0 15px 0' }}>
                  {section.content}
                </h2>
              );

            case 'text':
              return (
                <p key={index} style={{ fontSize: '16px', color: '#333', lineHeight: '1.6', margin: '0 0 15px 0' }}>
                  {section.content}
                </p>
              );

            case 'image':
              return (
                <div key={index} style={{ margin: '20px 0' }}>
                  <img
                    src={section.imageUrl}
                    alt=""
                    style={{ width: '100%', borderRadius: '8px' }}
                  />
                  {section.content && (
                    <p style={{ fontSize: '14px', color: '#666', fontStyle: 'italic', margin: '10px 0 0 0' }}>
                      {section.content}
                    </p>
                  )}
                </div>
              );

            case 'button':
              return (
                <div key={index} style={{ textAlign: 'center', margin: '25px 0' }}>
                  <a
                    href={section.buttonUrl}
                    style={{
                      display: 'inline-block',
                      backgroundColor: '#0284c7',
                      color: '#ffffff',
                      padding: '14px 30px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontWeight: 'bold',
                      fontSize: '16px',
                    }}
                  >
                    {section.buttonText || section.content}
                  </a>
                </div>
              );

            case 'divider':
              return (
                <hr key={index} style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '25px 0' }} />
              );

            case 'event':
              return (
                <div key={index} style={{ backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px', padding: '20px', margin: '20px 0' }}>
                  <h3 style={{ color: '#0284c7', margin: '0 0 10px 0', fontSize: '18px' }}>
                    {section.content}
                  </h3>
                  {section.eventDate && (
                    <p style={{ fontSize: '14px', color: '#666', margin: '5px 0' }}>
                      <strong>When:</strong> {section.eventDate}
                    </p>
                  )}
                  {section.eventLocation && (
                    <p style={{ fontSize: '14px', color: '#666', margin: '5px 0' }}>
                      <strong>Where:</strong> {section.eventLocation}
                    </p>
                  )}
                  {section.buttonUrl && (
                    <a
                      href={section.buttonUrl}
                      style={{
                        display: 'inline-block',
                        marginTop: '10px',
                        color: '#0284c7',
                        fontWeight: 'bold',
                        textDecoration: 'none',
                      }}
                    >
                      Learn More &rarr;
                    </a>
                  )}
                </div>
              );

            case 'donation-cta':
              return (
                <div key={index} style={{ backgroundColor: '#fef3c7', border: '1px solid #fcd34d', borderRadius: '8px', padding: '25px', margin: '25px 0', textAlign: 'center' }}>
                  <h3 style={{ color: '#92400e', margin: '0 0 10px 0', fontSize: '20px' }}>
                    Support Our Ministry
                  </h3>
                  <p style={{ fontSize: '14px', color: '#78350f', margin: '0 0 15px 0' }}>
                    {section.content}
                  </p>
                  <a
                    href={section.buttonUrl || `${organization.websiteUrl}/donate`}
                    style={{
                      display: 'inline-block',
                      backgroundColor: '#f59e0b',
                      color: '#ffffff',
                      padding: '14px 30px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontWeight: 'bold',
                      fontSize: '16px',
                    }}
                  >
                    {section.buttonText || 'Give Now'}
                  </a>
                </div>
              );

            default:
              return null;
          }
        })}
      </div>

      {/* Footer */}
      <div style={{ backgroundColor: '#f8fafc', padding: '25px 20px', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ textAlign: 'center', marginBottom: '15px' }}>
          <p style={{ color: '#666', fontSize: '14px', margin: '0 0 5px 0' }}>
            {organization.name}
          </p>
          <p style={{ color: '#999', fontSize: '12px', margin: 0 }}>
            {organization.address}
          </p>
        </div>

        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#999', fontSize: '12px', margin: '0 0 10px 0' }}>
            You are receiving this email because you subscribed to our newsletter.
          </p>
          <a
            href={unsubscribeUrl}
            style={{ color: '#0284c7', fontSize: '12px', textDecoration: 'underline' }}
          >
            Unsubscribe from this list
          </a>
        </div>
      </div>
    </div>
  );
}

export function getNewsletterEmailText(props: NewsletterEmailProps): string {
  const { organization, subscriber, newsletter, unsubscribeUrl } = props;
  const greeting = subscriber.name ? `Dear ${subscriber.name}` : 'Dear Friend';

  let text = `${organization.name}\n${'='.repeat(organization.name.length)}\n\n`;
  text += `${greeting},\n\n`;

  for (const section of newsletter.sections) {
    switch (section.type) {
      case 'heading':
        text += `\n## ${section.content}\n\n`;
        break;
      case 'text':
        text += `${section.content}\n\n`;
        break;
      case 'button':
        text += `${section.buttonText || section.content}: ${section.buttonUrl}\n\n`;
        break;
      case 'divider':
        text += `${'—'.repeat(30)}\n\n`;
        break;
      case 'event':
        text += `EVENT: ${section.content}\n`;
        if (section.eventDate) text += `When: ${section.eventDate}\n`;
        if (section.eventLocation) text += `Where: ${section.eventLocation}\n`;
        if (section.buttonUrl) text += `More info: ${section.buttonUrl}\n`;
        text += '\n';
        break;
      case 'donation-cta':
        text += `\nSUPPORT OUR MINISTRY\n`;
        text += `${section.content}\n`;
        text += `Give now: ${section.buttonUrl || `${organization.websiteUrl}/donate`}\n\n`;
        break;
    }
  }

  text += `\n${'—'.repeat(30)}\n`;
  text += `${organization.name}\n`;
  text += `${organization.address}\n\n`;
  text += `Unsubscribe: ${unsubscribeUrl}\n`;

  return text.trim();
}

// Welcome email for new subscribers
interface WelcomeEmailProps {
  organization: {
    name: string;
    address: string;
    websiteUrl: string;
  };
  subscriber: {
    name?: string;
    email: string;
  };
  unsubscribeUrl: string;
}

export function WelcomeEmail({ organization, subscriber, unsubscribeUrl }: WelcomeEmailProps) {
  const greeting = subscriber.name ? `Dear ${subscriber.name}` : 'Dear Friend';

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#0284c7', padding: '30px 20px', textAlign: 'center' }}>
        <h1 style={{ color: '#ffffff', margin: 0, fontSize: '28px' }}>
          Welcome to {organization.name}!
        </h1>
      </div>

      {/* Content */}
      <div style={{ padding: '30px 20px' }}>
        <p style={{ fontSize: '16px', color: '#333', marginBottom: '20px' }}>
          {greeting},
        </p>

        <p style={{ fontSize: '16px', color: '#333', lineHeight: '1.6' }}>
          Thank you for subscribing to our newsletter! We&apos;re excited to have you join our community of supporters who are making a difference in the lives of those experiencing homelessness.
        </p>

        <p style={{ fontSize: '16px', color: '#333', lineHeight: '1.6' }}>
          Here&apos;s what you can expect from us:
        </p>

        <ul style={{ fontSize: '16px', color: '#333', lineHeight: '1.8' }}>
          <li>Monthly updates on our ministry&apos;s impact</li>
          <li>Stories of hope and transformation</li>
          <li>Upcoming events and volunteer opportunities</li>
          <li>Prayer requests and answered prayers</li>
        </ul>

        <div style={{ textAlign: 'center', margin: '30px 0' }}>
          <a
            href={organization.websiteUrl}
            style={{
              display: 'inline-block',
              backgroundColor: '#0284c7',
              color: '#ffffff',
              padding: '14px 30px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '16px',
            }}
          >
            Visit Our Website
          </a>
        </div>

        <p style={{ fontSize: '16px', color: '#333', lineHeight: '1.6' }}>
          God bless you,<br />
          The {organization.name} Team
        </p>
      </div>

      {/* Footer */}
      <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
        <p style={{ color: '#999', fontSize: '12px', margin: '0 0 10px 0' }}>
          You are receiving this email because you subscribed to our newsletter.
        </p>
        <a
          href={unsubscribeUrl}
          style={{ color: '#0284c7', fontSize: '12px', textDecoration: 'underline' }}
        >
          Unsubscribe
        </a>
      </div>
    </div>
  );
}

export function getWelcomeEmailText(props: WelcomeEmailProps): string {
  const { organization, subscriber, unsubscribeUrl } = props;
  const greeting = subscriber.name ? `Dear ${subscriber.name}` : 'Dear Friend';

  return `
Welcome to ${organization.name}!
${'='.repeat(30)}

${greeting},

Thank you for subscribing to our newsletter! We're excited to have you join our community of supporters who are making a difference in the lives of those experiencing homelessness.

Here's what you can expect from us:
- Monthly updates on our ministry's impact
- Stories of hope and transformation
- Upcoming events and volunteer opportunities
- Prayer requests and answered prayers

Visit our website: ${organization.websiteUrl}

God bless you,
The ${organization.name} Team

${'—'.repeat(30)}
Unsubscribe: ${unsubscribeUrl}
  `.trim();
}

// Donor update email
interface DonorUpdateEmailProps {
  organization: {
    name: string;
    address: string;
    websiteUrl: string;
  };
  donor: {
    name: string;
    email: string;
  };
  update: {
    title: string;
    message: string;
    impactStats?: Array<{ label: string; value: string }>;
    storyTitle?: string;
    storyContent?: string;
    ctaText?: string;
    ctaUrl?: string;
  };
  unsubscribeUrl: string;
}

export function DonorUpdateEmail({
  organization,
  donor,
  update,
  unsubscribeUrl,
}: DonorUpdateEmailProps) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#0284c7', padding: '30px 20px', textAlign: 'center' }}>
        <h1 style={{ color: '#ffffff', margin: 0, fontSize: '24px' }}>
          {update.title}
        </h1>
        <p style={{ color: '#bae6fd', margin: '10px 0 0 0', fontSize: '14px' }}>
          An update from {organization.name}
        </p>
      </div>

      {/* Content */}
      <div style={{ padding: '30px 20px' }}>
        <p style={{ fontSize: '16px', color: '#333', marginBottom: '20px' }}>
          Dear {donor.name},
        </p>

        <p style={{ fontSize: '16px', color: '#333', lineHeight: '1.6' }}>
          {update.message}
        </p>

        {/* Impact Stats */}
        {update.impactStats && update.impactStats.length > 0 && (
          <div style={{ backgroundColor: '#f0f9ff', borderRadius: '8px', padding: '20px', margin: '25px 0' }}>
            <h3 style={{ color: '#0284c7', margin: '0 0 15px 0', textAlign: 'center' }}>
              Your Impact This Month
            </h3>
            <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
              {update.impactStats.map((stat, index) => (
                <div key={index} style={{ textAlign: 'center', padding: '10px' }}>
                  <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#0284c7', margin: 0 }}>
                    {stat.value}
                  </p>
                  <p style={{ fontSize: '12px', color: '#666', margin: '5px 0 0 0' }}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Story Section */}
        {update.storyTitle && update.storyContent && (
          <div style={{ borderLeft: '4px solid #0284c7', paddingLeft: '20px', margin: '25px 0' }}>
            <h3 style={{ color: '#333', margin: '0 0 10px 0' }}>
              {update.storyTitle}
            </h3>
            <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6', fontStyle: 'italic' }}>
              {update.storyContent}
            </p>
          </div>
        )}

        {/* CTA */}
        {update.ctaUrl && (
          <div style={{ textAlign: 'center', margin: '30px 0' }}>
            <a
              href={update.ctaUrl}
              style={{
                display: 'inline-block',
                backgroundColor: '#0284c7',
                color: '#ffffff',
                padding: '14px 30px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '16px',
              }}
            >
              {update.ctaText || 'Learn More'}
            </a>
          </div>
        )}

        <p style={{ fontSize: '16px', color: '#333', lineHeight: '1.6' }}>
          Thank you for your continued support. Together, we are making a lasting difference.
        </p>

        <p style={{ fontSize: '16px', color: '#333' }}>
          With gratitude,<br />
          The {organization.name} Team
        </p>
      </div>

      {/* Footer */}
      <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
        <p style={{ color: '#999', fontSize: '12px', margin: '0 0 10px 0' }}>
          You are receiving this email as a valued donor of {organization.name}.
        </p>
        <a
          href={unsubscribeUrl}
          style={{ color: '#0284c7', fontSize: '12px', textDecoration: 'underline' }}
        >
          Unsubscribe from donor updates
        </a>
      </div>
    </div>
  );
}

export function getDonorUpdateEmailText(props: DonorUpdateEmailProps): string {
  const { organization, donor, update, unsubscribeUrl } = props;

  let text = `${update.title}\n${'='.repeat(30)}\n\n`;
  text += `Dear ${donor.name},\n\n`;
  text += `${update.message}\n\n`;

  if (update.impactStats && update.impactStats.length > 0) {
    text += `YOUR IMPACT THIS MONTH\n${'—'.repeat(20)}\n`;
    for (const stat of update.impactStats) {
      text += `${stat.label}: ${stat.value}\n`;
    }
    text += '\n';
  }

  if (update.storyTitle && update.storyContent) {
    text += `${update.storyTitle}\n"${update.storyContent}"\n\n`;
  }

  if (update.ctaUrl) {
    text += `${update.ctaText || 'Learn More'}: ${update.ctaUrl}\n\n`;
  }

  text += `Thank you for your continued support. Together, we are making a lasting difference.\n\n`;
  text += `With gratitude,\nThe ${organization.name} Team\n\n`;
  text += `${'—'.repeat(30)}\nUnsubscribe: ${unsubscribeUrl}\n`;

  return text.trim();
}

// Event reminder email
interface EventReminderEmailProps {
  organization: {
    name: string;
    websiteUrl: string;
  };
  recipient: {
    name?: string;
    email: string;
  };
  event: {
    title: string;
    date: string;
    time: string;
    location: string;
    description?: string;
    calendarUrl?: string;
  };
  unsubscribeUrl: string;
}

export function EventReminderEmail({
  organization,
  recipient,
  event,
  unsubscribeUrl,
}: EventReminderEmailProps) {
  const greeting = recipient.name ? `Dear ${recipient.name}` : 'Dear Friend';

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#0284c7', padding: '30px 20px', textAlign: 'center' }}>
        <p style={{ color: '#bae6fd', margin: '0 0 5px 0', fontSize: '14px' }}>
          Event Reminder
        </p>
        <h1 style={{ color: '#ffffff', margin: 0, fontSize: '24px' }}>
          {event.title}
        </h1>
      </div>

      {/* Content */}
      <div style={{ padding: '30px 20px' }}>
        <p style={{ fontSize: '16px', color: '#333', marginBottom: '20px' }}>
          {greeting},
        </p>

        <p style={{ fontSize: '16px', color: '#333', lineHeight: '1.6' }}>
          This is a friendly reminder about our upcoming event. We hope to see you there!
        </p>

        <div style={{ backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px', padding: '25px', margin: '25px 0' }}>
          <h2 style={{ color: '#0284c7', margin: '0 0 15px 0', fontSize: '20px' }}>
            {event.title}
          </h2>
          <p style={{ fontSize: '16px', color: '#333', margin: '10px 0' }}>
            <strong>Date:</strong> {event.date}
          </p>
          <p style={{ fontSize: '16px', color: '#333', margin: '10px 0' }}>
            <strong>Time:</strong> {event.time}
          </p>
          <p style={{ fontSize: '16px', color: '#333', margin: '10px 0' }}>
            <strong>Location:</strong> {event.location}
          </p>
          {event.description && (
            <p style={{ fontSize: '14px', color: '#666', margin: '15px 0 0 0', lineHeight: '1.5' }}>
              {event.description}
            </p>
          )}
        </div>

        {event.calendarUrl && (
          <div style={{ textAlign: 'center', margin: '25px 0' }}>
            <a
              href={event.calendarUrl}
              style={{
                display: 'inline-block',
                backgroundColor: '#0284c7',
                color: '#ffffff',
                padding: '12px 25px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '14px',
              }}
            >
              Add to Calendar
            </a>
          </div>
        )}

        <p style={{ fontSize: '16px', color: '#333' }}>
          See you there!<br />
          The {organization.name} Team
        </p>
      </div>

      {/* Footer */}
      <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
        <a
          href={unsubscribeUrl}
          style={{ color: '#0284c7', fontSize: '12px', textDecoration: 'underline' }}
        >
          Unsubscribe from event reminders
        </a>
      </div>
    </div>
  );
}

export function getEventReminderEmailText(props: EventReminderEmailProps): string {
  const { organization, recipient, event, unsubscribeUrl } = props;
  const greeting = recipient.name ? `Dear ${recipient.name}` : 'Dear Friend';

  return `
EVENT REMINDER: ${event.title}
${'='.repeat(30)}

${greeting},

This is a friendly reminder about our upcoming event. We hope to see you there!

EVENT DETAILS
${'—'.repeat(15)}
${event.title}
Date: ${event.date}
Time: ${event.time}
Location: ${event.location}
${event.description ? `\n${event.description}` : ''}

${event.calendarUrl ? `Add to Calendar: ${event.calendarUrl}\n` : ''}
See you there!
The ${organization.name} Team

${'—'.repeat(30)}
Unsubscribe: ${unsubscribeUrl}
  `.trim();
}
