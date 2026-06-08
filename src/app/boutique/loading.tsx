import { Skeleton } from "@/components/ui/Skeleton";

export default function BoutiqueLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header skeleton */}
      <div className="mb-8 space-y-3">
        <Skeleton size="lg" className="w-48" />
        <Skeleton size="md" className="w-72" />
      </div>

      {/* Filters skeleton */}
      <div className="flex gap-3 mb-8">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} size="sm" className="h-10 w-24 rounded-full" />
        ))}
      </div>

      {/* Product grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-white/5 bg-gris-anthracite overflow-hidden"
          >
            <Skeleton size="card" className="aspect-square rounded-none" />
            <div className="p-4 space-y-3">
              <Skeleton size="text" />
              <Skeleton size="text" className="w-2/3" />
              <Skeleton size="sm" className="w-20 h-6" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
