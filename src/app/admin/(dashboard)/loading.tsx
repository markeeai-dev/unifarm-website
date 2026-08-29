export default function AdminLoading() {
  return (
    <div className="animate-pulse">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2.5">
          <div className="h-3 w-20 rounded-full bg-black/10" />
          <div className="h-7 w-56 rounded-full bg-black/10" />
          <div className="h-3.5 w-40 rounded-full bg-black/5" />
        </div>
        <div className="h-11 w-36 rounded-full bg-black/10" />
      </div>

      <div className="mt-6 h-11 w-full max-w-xs rounded-full bg-black/5" />

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-64 rounded-2xl bg-black/5" />
        ))}
      </div>
    </div>
  );
}
