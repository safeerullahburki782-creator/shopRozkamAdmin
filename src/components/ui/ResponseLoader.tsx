import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function APIResponseLoader({ className = "" }) {
  return (
    <div className={`flex flex-col gap-y-12 ${className}`}>
      <Skeleton className={cn("max-w-full rounded-xl", className)} />
    </div>
  );
}
