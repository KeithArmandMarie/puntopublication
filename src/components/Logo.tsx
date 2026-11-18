import Image from "next/image";
import Link from "next/link";
import { logo, siteName } from "@/config/site";

type LogoProps = {
  /** header is the sticky bar, footer sits on the brand color, sheet is the mobile menu. */
  variant?: "header" | "footer";
  onNavigate?: () => void;
  className?: string;
};

const sizes = {
  header: { image: "size-10 lg:size-12", text: "text-lg lg:text-xl", px: "48px" },
  footer: { image: "size-16", text: "text-xl", px: "64px" },
} as const;

/** Seal plus the site name, linking home. The seal carries the accessible name. */
export function Logo({ variant = "header", onNavigate, className = "" }: LogoProps) {
  const size = sizes[variant];
  return (
    <Link
      href="/"
      onClick={onNavigate}
      className={`inline-flex min-h-11 items-center gap-3 ${className}`.trim()}
    >
      <Image
        src={logo.src}
        alt={siteName}
        width={logo.width}
        height={logo.height}
        sizes={size.px}
        priority={variant === "header"}
        className={`${size.image} shrink-0`}
      />
      <span
        aria-hidden="true"
        className={`${size.text} font-semibold leading-tight tracking-tight`}
      >
        {siteName}
      </span>
    </Link>
  );
}
