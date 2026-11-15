type InitialsBadgeProps = {
  /** A first name. Only its first letter is shown. */
  name: string;
  className?: string;
};

/**
 * The default staff picture: the first letter of the first name on the brand
 * color. Hidden from screen readers, because the name is always written next to it.
 */
export function InitialsBadge({ name, className = "" }: InitialsBadgeProps) {
  const initial = Array.from(name.trim())[0]?.toUpperCase() ?? "";
  return (
    <span
      aria-hidden="true"
      className={`inline-flex size-11 shrink-0 items-center justify-center rounded-md border border-brand-border bg-brand text-lg font-bold text-on-brand ${className}`.trim()}
    >
      {initial}
    </span>
  );
}
