import * as React from "react";
import { cn } from "@/lib/utils";

export function Label({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={cn("text-[11px] font-medium tracking-[0.08em] text-subtle uppercase", className)} {...props} />
  );
}
