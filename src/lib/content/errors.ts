import type { ZodError } from "zod";

/** Thrown for any content problem. The message always names the file. */
export class ContentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ContentError";
  }
}

function fieldName(path: ReadonlyArray<PropertyKey>): string {
  return path
    .map((part, index) =>
      typeof part === "number" ? `[${part}]` : index === 0 ? String(part) : `.${String(part)}`,
    )
    .join("");
}

/** Turns zod issues into lines like: content/posts/a.md, field "section": message. */
export function formatZodError(file: string, error: ZodError): string {
  const lines: string[] = [];
  for (const issue of error.issues) {
    if (issue.code === "unrecognized_keys") {
      for (const key of issue.keys) {
        const where = fieldName([...issue.path, key]);
        lines.push(`${file}, field "${where}": this field is not allowed. Remove it or fix the spelling.`);
      }
      continue;
    }
    const field = fieldName(issue.path) || "(whole file)";
    const message = issue.message.includes("received undefined")
      ? "this field is required but missing."
      : issue.message;
    lines.push(`${file}, field "${field}": ${message}`);
  }
  return lines.join("\n");
}

export function contentError(file: string, field: string, message: string): ContentError {
  return new ContentError(`${file}, field "${field}": ${message}`);
}
