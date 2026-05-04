function Skeleton({ className }: { className?: string }) {
  return <div className={['bg-navy/6 animate-pulse', className ?? ''].join(' ')} />
}

export default function TeamLoading() {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-3">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-9 w-32" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="border border-navy/10 bg-white flex flex-col">
            <div className="flex items-center justify-between px-4 py-2 border-b border-navy/8">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-6 w-16" />
            </div>
            <div className="p-6 flex flex-col items-center gap-3 flex-1">
              <Skeleton className="w-[72px] h-[72px] rounded-full" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-20" />
            </div>
            <div className="flex gap-4 px-4 py-3 border-t border-navy/8">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-8" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
