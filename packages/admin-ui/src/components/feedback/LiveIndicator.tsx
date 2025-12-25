'use client';

import * as React from 'react';
import { cn } from '../../lib/utils';
import { WifiOff, RefreshCw } from 'lucide-react';

interface LiveIndicatorProps {
  isConnected?: boolean;
  lastUpdate?: Date | null;
  onRefresh?: () => void;
  className?: string;
}

function formatLastUpdate(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffMs / 60000);

  if (diffSecs < 10) return 'Just now';
  if (diffSecs < 60) return `${diffSecs}s ago`;
  if (diffMins < 60) return `${diffMins}m ago`;
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export function LiveIndicator({
  isConnected = true,
  lastUpdate,
  onRefresh,
  className,
}: LiveIndicatorProps) {
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

  // Update the relative time every 10 seconds
  React.useEffect(() => {
    const interval = setInterval(forceUpdate, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={cn(
        'flex items-center gap-2 text-sm',
        className
      )}
    >
      {/* Connection status */}
      <div className="flex items-center gap-1.5">
        {isConnected ? (
          <>
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            <span className="text-green-600 font-medium">Live</span>
          </>
        ) : (
          <>
            <WifiOff className="h-3.5 w-3.5 text-gray-400" />
            <span className="text-gray-500">Offline</span>
          </>
        )}
      </div>

      {/* Last update */}
      {lastUpdate && (
        <>
          <span className="text-gray-300">|</span>
          <span className="text-gray-500">
            Updated {formatLastUpdate(lastUpdate)}
          </span>
        </>
      )}

      {/* Refresh button */}
      {onRefresh && (
        <button
          onClick={onRefresh}
          className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          title="Refresh"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

// Compact version for tight spaces
export function LiveDot({ isConnected = true }: { isConnected?: boolean }) {
  if (!isConnected) {
    return <WifiOff className="h-3 w-3 text-gray-400" />;
  }

  return (
    <span className="relative flex h-2 w-2" title="Live updates enabled">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
    </span>
  );
}
