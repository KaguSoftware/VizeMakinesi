function Skeleton({ className }: { className?: string }) {
  return <div className={['bg-navy/6 animate-pulse', className ?? ''].join(' ')} />
}

export default function MarqueeLoading() {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-9 w-40" />
      </div>
      {[0, 1].map((i) => (
        <div key={i} className="border border-navy/10 bg-white">
          <div className="flex items-center justify-between px-6 py-4 border-b border-navy/8">
            <Skeleton className="h-6 w-44" />
            <Skeleton className="h-8 w-36" />
          </div>
          <div className="px-6 py-4 flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, j) => (
              <div key={j} className="flex gap-3 py-3 border-b border-navy/8">
                <Skeleton className="h-4 w-4 mt-2" />
                <div className="flex-1 flex flex-col gap-2">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
                <Skeleton className="h-6 w-16 mt-2" />
                <Skeleton className="h-4 w-6 mt-2" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
