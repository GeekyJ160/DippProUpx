import * as React from "react";
import { cn } from "@/lib/utils";

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "h-11 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg outline-none focus:border-fg",
      className,
    )}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = "Select";
