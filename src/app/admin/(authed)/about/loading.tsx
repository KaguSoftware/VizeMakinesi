export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="h-3 w-24 bg-navy/10 rounded mb-3" />
      <div className="h-9 w-48 bg-navy/10 rounded mb-10" />
      <div className="border border-border rounded-lg p-6 flex flex-col gap-6">
        <div className="h-3 w-32 bg-navy/10 rounded" />
        <div className="h-10 bg-navy/10 rounded" />
        <div className="h-3 w-24 bg-navy/10 rounded" />
        <div className="h-24 bg-navy/10 rounded" />
        <div className="flex justify-end">
          <div className="h-9 w-24 bg-navy/10 rounded" />
        </div>
      </div>
    </div>
  )
}
