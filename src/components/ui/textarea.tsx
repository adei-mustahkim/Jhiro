import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[110px] w-full resize-none rounded-xl border border-emerald-950/10 bg-white/80 px-3.5 py-3 text-sm shadow-[0_1px_2px_rgba(6,78,59,0.03)] ring-offset-background transition-all placeholder:text-muted-foreground/70 focus-visible:border-emerald-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/15 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
