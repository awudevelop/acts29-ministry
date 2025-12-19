/**
 * Acts29 Ministry - Notification Agent
 * Supabase Edge Function for sending notifications
 *
 * Handles:
 * - Email notifications (via Resend/SendGrid)
 * - SMS notifications (via Twilio)
 * - Push notifications (via Firebase)
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationPayload {
  type: 'email' | 'sms' | 'push';
  recipient: string;
  subject?: string;
  body: string;
  template?: string;
  data?: Record<string, unknown>;
}

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const payload: NotificationPayload = await req.json();

    let result;

    switch (payload.type) {
      case 'email':
        result = await sendEmail({
          to: payload.recipient,
          subject: payload.subject ?? 'Acts29 Ministry Notification',
          html: payload.body,
        });
        break;

      case 'sms':
        result = await sendSMS(payload.recipient, payload.body);
        break;

      case 'push':
        result = await sendPushNotification(payload.recipient, payload.subject ?? '', payload.body);
        break;

      default:
        throw new Error(`Unknown notification type: ${payload.type}`);
    }

    // Log notification in database
    await supabaseClient.from('notification_logs').insert({
      type: payload.type,
      recipient: payload.recipient,
      subject: payload.subject,
      status: result.success ? 'sent' : 'failed',
      error: result.error,
      sent_at: new Date().toISOString(),
    });

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: result.success ? 200 : 500,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ success: false, error: message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

async function sendEmail(payload: EmailPayload): Promise<{ success: boolean; error?: string }> {
  const resendApiKey = Deno.env.get('RESEND_API_KEY');

  if (!resendApiKey) {
    console.log('Email would be sent:', payload);
    return { success: true }; // Mock for development
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: payload.from ?? 'Acts29 Ministry <noreply@acts29ministry.org>',
        to: [payload.to],
        subject: payload.subject,
        html: payload.html,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Email send failed';
    return { success: false, error: message };
  }
}

async function sendSMS(
  to: string,
  body: string
): Promise<{ success: boolean; error?: string }> {
  const twilioSid = Deno.env.get('TWILIO_ACCOUNT_SID');
  const twilioToken = Deno.env.get('TWILIO_AUTH_TOKEN');
  const twilioFrom = Deno.env.get('TWILIO_PHONE_NUMBER');

  if (!twilioSid || !twilioToken || !twilioFrom) {
    console.log('SMS would be sent:', { to, body });
    return { success: true }; // Mock for development
  }

  try {
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${btoa(`${twilioSid}:${twilioToken}`)}`,
        },
        body: new URLSearchParams({
          To: to,
          From: twilioFrom,
          Body: body,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'SMS send failed';
    return { success: false, error: message };
  }
}

async function sendPushNotification(
  token: string,
  title: string,
  body: string
): Promise<{ success: boolean; error?: string }> {
  const fcmKey = Deno.env.get('FIREBASE_SERVER_KEY');

  if (!fcmKey) {
    console.log('Push notification would be sent:', { token, title, body });
    return { success: true }; // Mock for development
  }

  try {
    const response = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `key=${fcmKey}`,
      },
      body: JSON.stringify({
        to: token,
        notification: { title, body },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Push notification failed';
    return { success: false, error: message };
  }
}
