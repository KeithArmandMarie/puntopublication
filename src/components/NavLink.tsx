"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentPropsWithoutRef } from "react";

type NavLinkProps = Omit<ComponentPropsWithoutRef<typeof Link>, "href"> & {
  href: string;
  /** Only mark the link current on an exact path match. */
  exact?: boolean;
};

/** Link that sets aria-current="page" on its own page. Style it with aria-[current=page]: */
export function NavLink({ href, exact = false, ...props }: NavLinkProps) {
  const pathname = usePathname();
  const current =
    pathname === href || (!exact && pathname.startsWith(`${href}/`));

  return (
    <Link href={href} aria-current={current ? "page" : undefined} {...props} />
  );
}
