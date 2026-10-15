import { type InputHTMLAttributes, useId } from "react";
import { cn } from "@/lib/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export function Input({ label, error, id: idProp, className, ...props }: InputProps) {
  const generatedId = useId();
  const id = idProp ?? generatedId;

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-muted">
          {label}
        </label>
      )}
      <input
        id={id}
        className={cn(
          "h-10 w-full rounded-lg border border-border bg-surface-strong px-3 text-sm text-foreground caret-accent placeholder:text-muted-soft focus:border-accent/40 focus:outline-2 focus:outline-accent/30",
          error && "border-red-500/50 focus:border-red-500 focus:outline-red-500/40",
          className,
        )}
        aria-invalid={error ? true : undefined}
        {...props}
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}