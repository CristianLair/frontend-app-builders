import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type AlertProps = HTMLAttributes<HTMLDivElement> & {
  variant?: "error" | "success" | "info";
};

const variants = {
  error: "border-red-200 bg-red-50 text-red-800",
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  info: "border-zinc-200 bg-zinc-50 text-zinc-700",
} as const;

export function Alert({ variant = "info", className, ...props }: AlertProps) {
  return (
    <div
      role={variant === "error" ? "alert" : undefined}
      className={cn("rounded-lg border px-3.5 py-2.5 text-sm", variants[variant], className)}
      {...props}
    />
  );
}