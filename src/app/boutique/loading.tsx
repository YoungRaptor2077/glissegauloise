export default function BoutiqueLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header skeleton */}
      <div className="mb-8 space-y-3">
        <div className="h-8 w-48 bg-gris-anthracite rounded-lg animate-pulse" />
        <div className="h-4 w-72 bg-gris-anthracite rounded-lg animate-pulse" />
      </div>

      {/* Filters skeleton */}
      <div className="flex gap-3 mb-8">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-10 w-24 bg-gris-anthracite rounded-full animate-pulse"
          />
        ))}
      </div>

      {/* Product grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-white/5 bg-gris-anthracite overflow-hidden"
          >
            <div className="aspect-square bg-gris-anthracite-light animate-pulse" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gris-anthracite-light rounded animate-pulse" />
              <div className="h-4 w-2/3 bg-gris-anthracite-light rounded animate-pulse" />
              <div className="h-6 w-20 bg-gris-anthracite-light rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
