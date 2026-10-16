import { cn } from "@/lib/utils";

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: "default" | "accent" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        variant === "accent"
          ? "bg-accent text-accent-fg"
          : "border border-border bg-elevated text-muted",
        className,
      )}
      {...props}
    />
  );
}
