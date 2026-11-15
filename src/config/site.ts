import { slugify } from "@/lib/slug";

export type NavLinkItem = {
  label: string;
  href: string;
};

export type Section = {
  name: string;
  slug: string;
  href: string;
};

export type Municipality = Section;

export type MainNavEntry =
  | ({ type: "link" } & NavLinkItem)
  | {
      type: "menu";
      label: string;
      items: NavLinkItem[];
      allLink: NavLinkItem;
    };

export type SocialLink = {
  label: string;
  href: string;
};

export const siteName = "Punto Publication";

/** Leave empty to hide. The tagline is never shown while this is an empty string. */
export const tagline = "";

/** Shown in search results and metadata. Taken from the brand line in DESIGN.md. */
export const siteDescription =
  "Provincial Youth Journalist Publication, Davao del Sur.";

export const logo = {
  src: "/brand/logo.webp",
  width: 3375,
  height: 3375,
} as const;

const sectionNames = [
  "News",
  "Features",
  "Editorial",
  "Opinion",
  "Sports",
  "Literary",
] as const;

const municipalityNames = [
  "Digos City",
  "Bansalan",
  "Hagonoy",
  "Kiblawan",
  "Magsaysay",
  "Malalag",
  "Matanao",
  "Padada",
  "Santa Cruz",
  "Sulop",
] as const;

export const sections: Section[] = sectionNames.map((name) => {
  const slug = slugify(name);
  return { name, slug, href: `/section/${slug}` };
});

export const municipalities: Municipality[] = municipalityNames.map((name) => {
  const slug = slugify(name);
  return { name, slug, href: `/municipality/${slug}` };
});

export const municipalitiesIndex: NavLinkItem = {
  label: "All municipalities",
  href: "/municipality",
};

export const searchHref = "/search";

export const mainNav: MainNavEntry[] = [
  ...sections.map(
    (s): MainNavEntry => ({ type: "link", label: s.name, href: s.href }),
  ),
  {
    type: "menu",
    label: "Municipalities",
    items: municipalities.map((m) => ({ label: m.name, href: m.href })),
    allLink: municipalitiesIndex,
  },
];

const policyNames = [
  "Editorial Policy",
  "Corrections",
  "Ethics",
  "Privacy",
  "Terms",
] as const;

export const policyLinks: NavLinkItem[] = policyNames.map((label) => ({
  label,
  href: `/${slugify(label)}`,
}));

/** Add a URL to show a link in the footer. Empty values are hidden. */
export const socialLinks: SocialLink[] = [
  { label: "Facebook", href: "" },
  { label: "Instagram", href: "" },
  { label: "YouTube", href: "" },
  { label: "TikTok", href: "" },
  { label: "X", href: "" },
];

/** Add an address to show it in the footer. Empty hides it. */
export const contactEmail = "";

export function getSocialLinks(): SocialLink[] {
  return socialLinks.filter((link) => link.href.trim() !== "");
}
