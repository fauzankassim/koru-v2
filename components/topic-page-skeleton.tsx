export function TopicPageSkeleton() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10 animate-pulse">
      <div className="h-5 w-32 bg-muted rounded mb-6" />
      <div className="flex items-center justify-between mb-6">
        <div className="h-8 w-56 bg-muted rounded" />
        <div className="h-6 w-24 bg-muted rounded-full" />
      </div>
      <div className="h-9 w-full bg-muted rounded mb-6" />
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-16 bg-muted rounded-2xl" />
        ))}
      </div>
    </main>
  );
}