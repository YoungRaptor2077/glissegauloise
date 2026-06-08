import { cn } from "@/lib/utils";

type SkeletonSize = "sm" | "md" | "lg" | "card" | "text";

interface SkeletonProps {
  size?: SkeletonSize;
  className?: string;
}

const sizeClasses: Record<SkeletonSize, string> = {
  sm: "h-4 w-20",
  md: "h-6 w-40",
  lg: "h-8 w-60",
  card: "h-48 w-full rounded-2xl",
  text: "h-4 w-full",
};

export function Skeleton({ size = "md", className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-shimmer rounded-lg bg-gris-anthracite-light",
        sizeClasses[size],
        className
      )}
    />
  );
}
