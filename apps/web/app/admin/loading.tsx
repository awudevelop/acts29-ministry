import { StatCardSkeleton, TableSkeleton } from '@acts29/admin-ui';

export default function AdminDashboardLoading() {
  return (
    <div className="space-y-8">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
        <div className="h-5 w-64 animate-pulse rounded bg-gray-100" />
      </div>

      {/* Stats Grid skeleton */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>

      {/* Quick Actions skeleton */}
      <div className="space-y-4">
        <div className="h-6 w-32 animate-pulse rounded bg-gray-200" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-gray-100" />
          ))}
        </div>
      </div>

      {/* Content Grid skeleton */}
      <div className="grid gap-6 lg:grid-cols-2">
        <TableSkeleton rows={5} columns={2} />
        <TableSkeleton rows={5} columns={2} />
      </div>
    </div>
  );
}
