// Module hooks that let plain Node load the TypeScript content code.
// Node already strips the types. These hooks fill the two gaps:
//   1. "@/..." imports and imports without a file extension
//   2. "server-only", which only Next.js knows how to handle
// Used by scripts/content-check.mjs. Nothing else needs it.

import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const srcRoot = fileURLToPath(new URL("../src/", import.meta.url));

function withTypeScriptExtension(target) {
  for (const extension of [".ts", ".tsx"]) {
    if (existsSync(target + extension)) return pathToFileURL(target + extension).href;
  }
  return null;
}

export async function resolve(specifier, context, nextResolve) {
  if (specifier === "server-only") {
    return { url: "data:text/javascript,", shortCircuit: true };
  }

  let target = null;
  if (specifier.startsWith("@/")) {
    target = path.join(srcRoot, specifier.slice(2));
  } else if (
    specifier.startsWith(".") &&
    context.parentURL?.startsWith("file:") &&
    !context.parentURL.includes("/node_modules/")
  ) {
    target = path.resolve(path.dirname(fileURLToPath(context.parentURL)), specifier);
  }

  const url = target ? withTypeScriptExtension(target) : null;
  return nextResolve(url ?? specifier, context);
}
