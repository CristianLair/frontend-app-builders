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
        <label htmlFor={id} className="text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <input
        id={id}
        className={cn(
          "h-10 w-full rounded-lg border border-white/15 bg-white/5 px-3 text-sm text-white caret-pink-400 placeholder:text-gray-500 focus:border-pink-500/40 focus:outline-2 focus:outline-pink-500/30",
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