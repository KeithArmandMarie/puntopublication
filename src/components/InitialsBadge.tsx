type InitialsBadgeProps = {
  /** A first name. Only its first letter is shown. */
  firstName: string;
  className?: string;
};

/** The default stand-in for a staff photo: the first letter of the first name in brand colors. */
export function InitialsBadge({ firstName, className = "" }: InitialsBadgeProps) {
  const letter = firstName.trim().charAt(0).toUpperCase();
  return (
    <span
      aria-hidden="true"
      className={`inline-flex size-11 shrink-0 items-center justify-center rounded-md border border-brand-border bg-brand text-lg font-bold text-on-brand ${className}`.trim()}
    >
      {letter}
    </span>
  );
}
