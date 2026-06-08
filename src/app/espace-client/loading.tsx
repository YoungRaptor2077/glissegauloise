import { Skeleton } from "@/components/ui/Skeleton";

export default function EspaceClientLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8 space-y-3">
        <Skeleton size="lg" />
        <Skeleton size="md" />
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-white/5 bg-gris-anthracite p-6 space-y-3"
          >
            <Skeleton size="sm" />
            <Skeleton size="lg" className="w-16" />
            <Skeleton size="text" className="w-3/4" />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} size="card" className="h-24" />
        ))}
      </div>
    </div>
  );
}
