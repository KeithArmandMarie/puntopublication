/** First focusable element on every page. Jumps past the header to #main-content. */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only rounded-md bg-accent px-4 py-3 font-semibold text-on-accent focus:not-sr-only focus:absolute focus:left-gutter focus:top-2 focus:z-[60]"
    >
      Skip to content
    </a>
  );
}
