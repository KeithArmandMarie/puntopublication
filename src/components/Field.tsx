import type { ComponentPropsWithoutRef } from "react";

type FieldProps = Omit<ComponentPropsWithoutRef<"input">, "id"> & {
  id: string;
  label: string;
  hint?: string;
};

export const controlClasses =
  "min-h-11 w-full rounded-md border border-border-strong bg-background px-3 text-base text-foreground placeholder:text-muted";

/** Label above a text input. The label is always visible and tied to the input. */
export function Field({ id, label, hint, className = "", ...props }: FieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>
      <input
        id={id}
        aria-describedby={hintId}
        className={`${controlClasses} ${className}`.trim()}
        {...props}
      />
      {hint && (
        <p id={hintId} className="text-sm text-muted">
          {hint}
        </p>
      )}
    </div>
  );
}
