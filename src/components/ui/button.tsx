import {
  type ButtonHTMLAttributes,
  cloneElement,
  isValidElement,
  type PropsWithChildren,
  type ReactElement,
} from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "ghost" | "danger";
    size?: "sm" | "md" | "lg";
    isLoading?: boolean;
    asChild?: boolean;
  }
>;

const variants = {
  primary:
    "bg-brand-coral text-white shadow-lg shadow-brand-coral/20 hover:bg-brand-coral/90 focus-visible:outline-brand-coral disabled:bg-brand-coral/50 disabled:shadow-none",
  secondary:
    "bg-surface text-foreground ring-1 ring-inset ring-border hover:bg-surface-strong focus-visible:outline-foreground/60",
  ghost: "text-muted hover:bg-surface hover:text-foreground",
  danger:
    "bg-red-500/15 text-red-300 ring-1 ring-inset ring-red-500/30 hover:bg-red-500/25 hover:text-red-200 focus-visible:outline-red-500/60 disabled:bg-red-500/10",
} as const;

const sizes = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
} as const;

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  asChild = false,
  className,
  children,
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed",
    sizes[size],
    variants[variant],
    className,
  );

  if (asChild && isValidElement(children)) {
    return cloneElement(children as ReactElement<{ className?: string }>, {
      className: cn(classes, (children as ReactElement<{ className?: string }>).props.className),
    });
  }

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={classes}
      {...props}
    >
      {isLoading && <Spinner size="sm" />}
      {children}
    </button>
  );
}