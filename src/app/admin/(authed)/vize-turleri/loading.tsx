export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="h-3 w-24 bg-navy/10 rounded mb-3" />
      <div className="h-9 w-48 bg-navy/10 rounded mb-4" />
      <div className="h-4 w-105 max-w-full bg-navy/10 rounded mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 items-start">
        {/* Visa type picker */}
        <div className="border border-border rounded-lg p-2 flex flex-col gap-1">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="h-9 bg-navy/10 rounded-sm" />
          ))}
        </div>

        {/* Editors for the selected type */}
        <div className="flex flex-col gap-6">
          <div className="h-7 w-40 bg-navy/10 rounded" />
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="border border-border rounded-lg p-6 flex flex-col gap-6">
              <div className="h-3 w-40 bg-navy/10 rounded" />
              <div className="h-10 bg-navy/10 rounded" />
              <div className="h-24 bg-navy/10 rounded" />
              <div className="flex justify-end">
                <div className="h-9 w-28 bg-navy/10 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
