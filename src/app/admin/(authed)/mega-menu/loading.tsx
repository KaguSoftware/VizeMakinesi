function Skeleton({ className }: { className?: string }) {
  return <div className={['bg-navy/6 animate-pulse', className ?? ''].join(' ')} />
}

export default function MegaMenuLoading() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-9 w-48" />
      </div>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="border border-navy/10 bg-white">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-navy/8">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-5 w-40 flex-1" />
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-4 w-6" />
          </div>
          <div className="px-4 py-3 flex flex-col gap-3">
            {Array.from({ length: 2 }).map((_, j) => (
              <div key={j} className="flex items-center gap-3 py-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-5 w-6" />
                <Skeleton className="flex-1 h-4" />
                <Skeleton className="h-6 w-14" />
                <Skeleton className="h-4 w-4" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
