import * as React from 'react';
import { FileQuestion } from 'lucide-react';
import { Button } from '@acts29/ui';
import { cn } from '../../lib/utils';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  actionHref?: string;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  actionHref,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 py-16 px-4 text-center',
        className
      )}
    >
      <div className="mb-4 text-gray-400">
        {icon ?? <FileQuestion className="h-12 w-12" />}
      </div>
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      {description && (
        <p className="mt-1 max-w-md text-sm text-gray-500">{description}</p>
      )}
      {action && (
        <div className="mt-6">
          {actionHref ? (
            <a href={actionHref}>
              <Button>{action.label}</Button>
            </a>
          ) : (
            <Button onClick={action.onClick}>{action.label}</Button>
          )}
        </div>
      )}
    </div>
  );
}
