function Skeleton({ className }: { className?: string }) {
  return <div className={['bg-navy/6 animate-pulse rounded-sm', className ?? ''].join(' ')} />
}

export default function CountriesLoading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-3" />
        <Skeleton className="h-3 w-20" />
      </div>
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="flex flex-col gap-3">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-9 w-44" />
        </div>
        <Skeleton className="h-10 w-44" />
      </div>
      <Skeleton className="h-10 w-72" />
      <div className="border border-navy/10 bg-white">
        <div className="grid grid-cols-[40px_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-0">
          {/* Header */}
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="py-3 px-4 border-b border-navy/10">
              <Skeleton className="h-2 w-16" />
            </div>
          ))}
          {/* Rows */}
          {Array.from({ length: 8 }).map((_, r) =>
            Array.from({ length: 9 }).map((_, c) => (
              <div key={`${r}-${c}`} className="py-3 px-4 border-b border-navy/8">
                <Skeleton className="h-3 w-20" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
