export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="h-12 w-12 rounded-full border-2 border-gris-anthracite-light" />
          <div className="absolute inset-0 h-12 w-12 rounded-full border-2 border-transparent border-t-vert-neon animate-spin" />
        </div>
        <div className="space-y-3 w-full max-w-sm">
          <div className="h-4 bg-gris-anthracite rounded-full animate-pulse" />
          <div className="h-4 bg-gris-anthracite rounded-full animate-pulse w-3/4" />
          <div className="h-4 bg-gris-anthracite rounded-full animate-pulse w-1/2" />
        </div>
      </div>
    </div>
  );
}
