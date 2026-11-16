import { buttonClasses } from "@/components/Button";
import { CallToAction } from "@/components/CallToAction";
import { getFacebookPageUrl } from "@/components/FacebookFeed";
import { contactEmail } from "@/config/site";

/**
 * "Send us a story or tip": the site wide call to action, in the layout above the footer.
 * The buttons come from config: email when `contactEmail` is set, the Facebook page
 * when NEXT_PUBLIC_FB_PAGE_URL is set. Renders nothing when neither is set.
 */
export function StoryTipCta() {
  const email = contactEmail.trim();
  const facebook = getFacebookPageUrl();
  if (!email && !facebook) return null;

  // The first button present is the main one (accent), the other is secondary.
  const variants = ["accent", "secondary"] as const;
  const links = [
    email ? { href: `mailto:${email}`, label: "Email the editors", external: false } : null,
    facebook ? { href: facebook, label: "Message us on Facebook", external: true } : null,
  ].filter((link) => link !== null);

  return (
    <CallToAction
      id="story-tip-heading"
      title="Have a story from your town?"
      actions={links.map((link, index) => (
        <a
          key={link.href}
          href={link.href}
          className={buttonClasses(variants[index])}
          {...(link.external ? { rel: "noopener noreferrer" } : {})}
        >
          {link.label}
        </a>
      ))}
    >
      Send a story idea, a tip or a photo to the editors.
    </CallToAction>
  );
}
