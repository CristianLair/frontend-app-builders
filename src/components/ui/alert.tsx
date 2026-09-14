import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type AlertProps = HTMLAttributes<HTMLDivElement> & {
  variant?: "error" | "success" | "info";
};

const variants = {
  error: "border-red-500/30 bg-red-500/10 text-red-200",
  success: "border-green-500/30 bg-green-500/10 text-green-200",
  info: "border-white/10 bg-white/5 text-gray-300",
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