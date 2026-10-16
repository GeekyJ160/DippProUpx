import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "min-h-32 w-full resize-none rounded-md border border-border bg-bg px-3 py-3 text-sm leading-relaxed text-fg outline-none placeholder:text-subtle focus:border-fg",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";
