export function TopicCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 h-full animate-pulse">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="h-6 w-32 bg-muted rounded" />
        <div className="h-12 w-12 bg-muted rounded-full" />
      </div>
      <div className="h-4 w-24 bg-muted rounded mb-1" />
      <div className="mt-3 pt-3 border-t border-border space-y-2">
        <div className="h-3 w-40 bg-muted rounded" />
        <div className="h-3 w-28 bg-muted rounded" />
      </div>
    </div>
  );
}