import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md dark:bg-dark-card bg-muted",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
