function Skeleton({ className }: { className?: string }) {
  return (
    <div className={['bg-navy/6 animate-pulse', className ?? ''].join(' ')} />
  )
}

export default function AdminLoading() {
  return (
    <div className="flex flex-col gap-10">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-3">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-9 w-56" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>

      {/* Table skeleton */}
      <div className="border border-navy/10 bg-white">
        <div className="border-b border-navy/10 px-4 py-3 flex gap-6">
          {['w-8', 'w-12', 'w-24', 'w-40', 'w-20', 'w-16', 'w-12'].map((w, i) => (
            <Skeleton key={i} className={`h-3 ${w}`} />
          ))}
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="border-b border-navy/8 px-4 py-4 flex items-center gap-6">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-8 w-12" />
            <Skeleton className="h-5 w-6" />
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-3 w-12 ml-auto" />
          </div>
        ))}
      </div>
    </div>
  )
}
