import { Skeleton } from "@/components/ui/Skeleton";

export default function AdminLoading() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton size="lg" />
        <Skeleton size="md" className="w-48" />
      </div>

      {/* Dashboard stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-white/5 bg-gris-anthracite p-5 space-y-3"
          >
            <Skeleton size="sm" />
            <Skeleton size="lg" className="w-20" />
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/5 bg-gris-anthracite p-4 space-y-3">
        <Skeleton size="text" />
        <Skeleton size="text" />
        <Skeleton size="text" />
        <Skeleton size="text" className="w-3/4" />
        <Skeleton size="text" className="w-1/2" />
      </div>
    </div>
  );
}
