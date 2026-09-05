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
        <label htmlFor={id} className="text-sm font-medium text-zinc-700">
          {label}
        </label>
      )}
      <input
        id={id}
        className={cn(
          "h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-600 focus:outline-2 focus:outline-emerald-600/20",
          error && "border-red-500 focus:border-red-500 focus:outline-red-500/20",
          className,
        )}
        aria-invalid={error ? true : undefined}
        {...props}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}