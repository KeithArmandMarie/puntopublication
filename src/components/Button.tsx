import type { ComponentPropsWithoutRef } from "react";

export type ButtonVariant = "primary" | "accent" | "secondary" | "onBrand";

const base =
  "press inline-flex min-h-11 items-center justify-center gap-2 rounded-md border px-5 text-base font-semibold underline-offset-4 hover:underline disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:no-underline";

const variants: Record<ButtonVariant, string> = {
  // Brand fill with light text.
  primary: "border-brand-border bg-brand text-on-brand",
  // Yellow is a fill, with brown text on top.
  accent: "border-accent bg-accent text-on-accent",
  secondary: "border-border-strong bg-transparent text-foreground hover:bg-surface",
  // Outline button for brand colored bands, next to an accent button.
  onBrand: "border-on-brand-muted bg-transparent text-on-brand",
};

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
