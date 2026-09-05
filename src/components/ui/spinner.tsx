import { cn } from "@/lib/utils";

type SpinnerProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizes = {
  sm: "size-4 border-[1.5px]",
  md: "size-6 border-2",
  lg: "size-10 border-[3px]",
};

export function Spinner({ size = "md", className }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Cargando"
      className={cn(
        "inline-block animate-spin rounded-full border-transparent border-t-current",
        sizes[size],
        className,
      )}
    />
  );
}