import { buttonClasses } from "@/components/Button";
import { CallToAction } from "@/components/CallToAction";
import { getFacebookPageUrl } from "@/components/FacebookFeed";
import { contactEmail } from "@/config/site";

/**
 * Where "Send it on Facebook" goes. A page with a plain name (facebook.com/NAME) opens
 * a message to the page through m.me. Any other address, such as profile.php?id=, goes to the page itself.
 */
function facebookMessageUrl(pageUrl: string): string {
  const url = new URL(pageUrl);
  const segments = url.pathname.split("/").filter(Boolean);
  const name = segments[0];
  if (segments.length === 1 && name && name !== "profile.php" && /^[\w.-]+$/.test(name)) {
    return `https://m.me/${name}`;
  }
  return pageUrl;
}

/**
 * The site wide call to action, in the layout just above the footer, so it is the last
 * thing on every page before the footer. It invites readers to send the editors a news
 * tip or a story, by message to the Facebook page (NEXT_PUBLIC_FB_PAGE_URL). When
 * `contactEmail` is set it adds an email button. Renders nothing when neither is set,
 * because it must never invite readers to send something nowhere.
 */
export function StoryTipCta() {
  const email = contactEmail.trim();
  const facebook = getFacebookPageUrl();
  if (!email && !facebook) return null;

  // The first button present is the main one (accent), the other is secondary.
  const variants = ["accent", "secondary"] as const;
  const links = [
    facebook
      ? { href: facebookMessageUrl(facebook), label: "Send it on Facebook", external: true }
      : null,
    email ? { href: `mailto:${email}`, label: "Send it by email", external: false } : null,
  ].filter((link) => link !== null);

  return (
    <CallToAction
      id="story-tip-heading"
      title="Have news or a story to share?"
      actions={links.map((link, index) => (
        <a
          key={link.href}
          href={link.href}
          className={buttonClasses(variants[index])}
          {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {link.label}
          {link.external ? <span className="sr-only"> (opens in a new tab)</span> : null}
        </a>
      ))}
    >
      Send us a news tip, a story idea or a photo from your town. Message our Facebook page and
      the editors will read it.
    </CallToAction>
  );
}
