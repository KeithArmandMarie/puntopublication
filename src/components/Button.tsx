import type { ComponentPropsWithoutRef } from "react";
import { ArrowRightIcon } from "@/components/icons";

export type ButtonVariant = "primary" | "accent" | "secondary" | "onBrand";

const base =
  "press group/button inline-flex min-h-11 items-center justify-center gap-2 rounded-full border px-5 text-base font-semibold underline-offset-4 hover:underline disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:no-underline";

const variants: Record<ButtonVariant, string> = {
  // Brand fill with light text.
  primary: "border-brand-border bg-brand text-on-brand",
  // Yellow is a fill, with brown text on top.
  accent: "border-accent bg-accent text-on-accent",
  secondary: "border-border-strong bg-transparent text-foreground hover:bg-surface",
  // Outline button for brand colored bands, next to an accent button.
  onBrand: "border-on-brand-muted bg-transparent text-on-brand",
};

/**
 * An arrow for the end of a button's label. It slides 4px to the right while the pointer is on
 * the button (a fine pointer only). Works in any element that uses `buttonClasses` or `Button`.
 */
export function ButtonArrow() {
  return (
    <ArrowRightIcon className="size-5 shrink-0 transition-transform duration-(--duration-fast) ease-out group-hover/button:translate-x-1" />
  );
}

/** Class string for anything that should look like a button, such as a Link. */
export function buttonClasses(variant: ButtonVariant = "primary", className = "") {
  return `${base} ${variants[variant]} ${className}`.trim();
}

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: ButtonVariant;
};

export function Button({
  variant = "primary",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return <button type={type} className={buttonClasses(variant, className)} {...props} />;
}
