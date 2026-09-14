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
    "bg-gradient-to-r from-pink-500 to-violet-600 text-white shadow-lg shadow-pink-500/20 hover:from-pink-400 hover:to-violet-500 focus-visible:outline-pink-400 disabled:bg-gradient-to-r disabled:from-pink-500/60 disabled:to-violet-600/60 disabled:shadow-none",
  secondary:
    "bg-white/10 text-white ring-1 ring-inset ring-white/15 hover:bg-white/20 focus-visible:outline-white/60",
  ghost: "text-gray-300 hover:bg-white/10 hover:text-white",
  danger:
    "bg-red-500/15 text-red-300 ring-1 ring-inset ring-red-500/30 hover:bg-red-500/25 hover:text-red-200 focus-visible:outline-red-500/60 disabled:bg-red-500/10",
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