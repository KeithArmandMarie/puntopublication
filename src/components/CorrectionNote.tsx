import type { Language } from "@/lib/content/schema";

type CorrectionNoteProps = {
  /** The correction text, written in the language of the story. */
  children: string;
  language?: Language;
  className?: string;
};

/** A note with a 1px brand border, 12px corners and the label "Correction". No icon, no alarm colors. */
export function CorrectionNote({ children, language = "en", className = "" }: CorrectionNoteProps) {
  return (
    <div
      role="note"
      className={`rounded-md border border-brand-border bg-surface p-5 ${className}`.trim()}
    >
      <p className="text-sm font-semibold">Correction</p>
      <p lang={language} className="mt-1">
        {children}
      </p>
    </div>
  );
}
