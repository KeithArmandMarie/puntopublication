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

export type SocialLink = {
  label: string;
  href: string;
};

export const siteName = "Punto Publication";

/** The motto. It is the main heading of the home page banner. */
export const motto = "In Truth, We Serve. In Words, We Lead.";

/** Leave empty to hide. The tagline is never shown while this is an empty string. */
export const tagline =
  "Empowering the Voice of the Youth through Responsible Journalism.";

/** Shown in search results and metadata: the tagline and the brand line from DESIGN.md. */
export const siteDescription = `${tagline} Provincial Youth Journalist Publication, Davao del Sur.`;

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

/** Sections are filters on the archive page, not pages of their own: `/archive?section=news`. */
export const sections: Section[] = sectionNames.map((name) => {
  const slug = slugify(name);
  return { name, slug, href: `/archive?section=${slug}` };
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

/** The header links, in order. The sections are not here: they are filters on the archive page. */
export const mainNav: NavLinkItem[] = [
  { label: "About", href: "/about" },
  { label: "Municipalities", href: "/municipality" },
  { label: "Gallery", href: "/gallery" },
  { label: "Archive", href: "/archive" },
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
