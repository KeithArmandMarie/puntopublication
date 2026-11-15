import type { ComponentPropsWithoutRef } from "react";

/** Page width: 1200px of content, 16px gutters on phones, 24px on larger screens. */
export function Container({
  className = "",
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return <div className={`container-page ${className}`.trim()} {...props} />;
}
