import {
  DollarSign,
  Users,
  Briefcase,
  Clock,
  TrendingUp,
  TrendingDown,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '../../lib/utils';

const iconMap: Record<string, LucideIcon> = {
  DollarSign,
  Users,
  Briefcase,
  Clock,
};

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: keyof typeof iconMap | LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

export function StatCard({
  title,
  value,
  change,
  changeLabel,
  icon,
  trend,
  className,
}: StatCardProps) {
  const Icon = typeof icon === 'string' ? iconMap[icon] : icon;

  const trendColor =
    trend === 'up'
      ? 'text-green-600 dark:text-green-400'
      : trend === 'down'
      ? 'text-red-600 dark:text-red-400'
      : 'text-gray-600 dark:text-gray-400';

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : null;

  return (
    <div
      className={cn(
        'rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 p-6 shadow-sm transition-colors',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
          {(change !== undefined || changeLabel) && (
            <div className="mt-2 flex items-center gap-1">
              {TrendIcon && <TrendIcon className={cn('h-4 w-4', trendColor)} />}
              {change !== undefined && (
                <span className={cn('text-sm font-medium', trendColor)}>
                  {change > 0 ? '+' : ''}
                  {typeof change === 'number' ? `${change}%` : change}
                </span>
              )}
              {changeLabel && (
                <span className="text-sm text-gray-500 dark:text-gray-400">{changeLabel}</span>
              )}
            </div>
          )}
        </div>
        {Icon && (
          <div className="rounded-lg bg-primary-50 dark:bg-primary-900/20 p-3">
            <Icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          </div>
        )}
      </div>
    </div>
  );
}
