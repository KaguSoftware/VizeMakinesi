function Skeleton({ className }: { className?: string }) {
  return <div className={['bg-navy/6 animate-pulse', className ?? ''].join(' ')} />
}

export default function HomeRegionsLoading() {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-9 w-56" />
      </div>
      <div className="flex flex-col gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border border-navy/10 rounded overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 bg-white">
              <Skeleton className="h-3 w-3" />
              <Skeleton className="h-6 w-48" />
              <Skeleton className="ml-auto h-5 w-14 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
