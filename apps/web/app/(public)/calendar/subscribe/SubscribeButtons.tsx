'use client';

import { useState } from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';

interface SubscribeButtonsProps {
  icalUrl: string;
  webcalUrl: string;
  copyOnly?: boolean;
}

export function SubscribeButtons({ icalUrl, webcalUrl, copyOnly }: SubscribeButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(icalUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const googleCalendarUrl = `https://calendar.google.com/calendar/render?cid=${encodeURIComponent(webcalUrl)}`;
  const outlookUrl = `https://outlook.live.com/calendar/0/addfromweb?url=${encodeURIComponent(icalUrl)}&name=${encodeURIComponent('Acts 29 Ministry Events')}`;

  if (copyOnly) {
    return (
      <button
        onClick={handleCopy}
        className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-primary-700"
        title="Copy URL"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" />
            Copy
          </>
        )}
      </button>
    );
  }

  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Google Calendar */}
      <a
        href={googleCalendarUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 rounded-lg bg-white border-2 border-gray-200 px-4 py-3 font-medium text-gray-700 transition hover:border-primary-300 hover:bg-primary-50"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" fill="#4285F4"/>
          <path d="M12 7v5l4.28 2.54.72-1.21-3.5-2.08V7H12z" fill="#fff"/>
        </svg>
        Google Calendar
        <ExternalLink className="h-4 w-4 text-gray-400" />
      </a>

      {/* Apple Calendar (webcal) */}
      <a
        href={webcalUrl}
        className="flex items-center justify-center gap-2 rounded-lg bg-white border-2 border-gray-200 px-4 py-3 font-medium text-gray-700 transition hover:border-primary-300 hover:bg-primary-50"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
        </svg>
        Apple Calendar
      </a>

      {/* Outlook */}
      <a
        href={outlookUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 rounded-lg bg-white border-2 border-gray-200 px-4 py-3 font-medium text-gray-700 transition hover:border-primary-300 hover:bg-primary-50"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#0078D4">
          <path d="M24 7.387v10.478c0 .23-.08.424-.238.576-.16.154-.352.23-.578.23h-8.547v-6.959l1.758 1.279c.078.055.17.086.266.086.096 0 .188-.031.266-.086l6.836-4.971v-.633h-.023l-7.08 5.145-2.023-1.471V5.334h8.547c.226 0 .418.077.578.23.158.152.238.346.238.576v1.247zM14.637 5.334H.817A.792.792 0 00.238 5.564.774.774 0 000 6.137v12.58c0 .229.08.424.238.577a.792.792 0 00.579.23h13.82V5.334zm-7.637 9.873c-2.6 0-4.074-1.785-4.074-3.98 0-2.196 1.543-3.98 4.074-3.98 2.53 0 4.073 1.784 4.073 3.98 0 2.195-1.474 3.98-4.073 3.98zm0-1.68c1.396 0 2.074-1.025 2.074-2.3 0-1.274-.678-2.299-2.074-2.299-1.397 0-2.075 1.025-2.075 2.3 0 1.274.678 2.299 2.075 2.299z"/>
        </svg>
        Outlook
        <ExternalLink className="h-4 w-4 text-gray-400" />
      </a>

      {/* Copy URL */}
      <button
        onClick={handleCopy}
        className="flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-3 font-medium text-white transition hover:bg-primary-700"
      >
        {copied ? (
          <>
            <Check className="h-5 w-5" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="h-5 w-5" />
            Copy URL
          </>
        )}
      </button>
    </div>
  );
}
