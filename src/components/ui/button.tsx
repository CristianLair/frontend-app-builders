import { type ButtonHTMLAttributes, type PropsWithChildren } from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "ghost" | "danger";
    isLoading?: boolean;
  }
>;

const variants = {
  primary:
    "bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:outline-emerald-600 disabled:bg-emerald-600/50",
  secondary:
    "bg-white text-zinc-900 ring-1 ring-inset ring-zinc-300 hover:bg-zinc-50 focus-visible:outline-zinc-600",
  ghost: "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
  danger:
    "bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-600 disabled:bg-red-600/50",
} as const;

export function Button({
  variant = "primary",
  isLoading = false,
  className,
  children,
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed",
        variants[variant],
        className,
      )}
      {...props}
    >
      {isLoading && <Spinner size="sm" />}
      {children}
    </button>
  );
}