function Skeleton({ className }: { className?: string }) {
  return <div className={['bg-navy/6 animate-pulse', className ?? ''].join(' ')} />
}

export default function PartnershipsLoading() {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-3">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-9 w-44" />
        </div>
        <Skeleton className="h-10 w-44" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="border border-navy/10 bg-white flex flex-col">
            <div className="flex items-center justify-between px-4 py-2 border-b border-navy/8">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-6 w-16" />
            </div>
            <div className="p-5 flex flex-col gap-3 flex-1">
              <Skeleton className="h-14 w-36" />
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="flex gap-4 px-5 py-3 border-t border-navy/8">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-8" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
