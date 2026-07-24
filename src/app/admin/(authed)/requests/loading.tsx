function Skeleton({ className }: { className?: string }) {
  return <div className={['bg-navy/6 animate-pulse', className ?? ''].join(' ')} />
}

export default function RequestsLoading() {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        <Skeleton className="h-3 w-40" />
        <Skeleton className="h-9 w-36" />
        <Skeleton className="h-3 w-56" />
      </div>
      <div className="flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border border-navy/10 bg-white p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-8 w-32" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
