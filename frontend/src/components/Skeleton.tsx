import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800/80 ${className}`}
      aria-hidden="true"
    />
  );
};

export const ProblemCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-[#0D121F] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <div className="flex items-center gap-3 pt-2">
        <Skeleton className="h-6 w-24 rounded-lg" />
        <Skeleton className="h-6 w-24 rounded-lg" />
      </div>
    </div>
  );
};

export const TableRowSkeleton: React.FC<{ cols?: number }> = ({ cols = 5 }) => {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: cols }).map((_, idx) => (
        <td key={idx} className="px-6 py-4">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
};
