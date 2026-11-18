import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

type ChipProps = ComponentPropsWithoutRef<typeof Link>;

/** A flat text chip with a 1px border that links somewhere. For tags and municipalities. */
export function Chip({ className = "", ...props }: ChipProps) {
  return (
    <Link
      className={`press inline-flex min-h-11 items-center rounded-full border border-border-strong px-4 text-sm font-semibold text-foreground underline-offset-4 hover:bg-surface hover:underline ${className}`.trim()}
      {...props}
    />
  );
}
