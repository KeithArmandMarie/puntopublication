import { buttonClasses } from "@/components/Button";
import { getFacebookPageUrl } from "@/components/FacebookFeed";
import { facebookMessageUrl } from "@/components/StoryTipCta";
import { contactEmail } from "@/config/site";

type Action = {
  href: string;
  label: string;
  variant: "accent" | "secondary";
  external: boolean;
};

/**
 * The two call to action buttons in the header: "Send a tip" (accent) and
 * "Follow on Facebook" (secondary). Both come from real addresses: the Facebook page
 * (NEXT_PUBLIC_FB_PAGE_URL) and `contactEmail`. A button with no address is left out,
 * and the whole group renders nothing when neither exists.
 */
export function HeaderActions({ className = "flex items-center gap-2" }: { className?: string }) {
  const email = contactEmail.trim();
  const facebook = getFacebookPageUrl();

  const actions: Action[] = [];
  if (facebook) {
    actions.push({
      href: facebookMessageUrl(facebook),
      label: "Send a tip",
      variant: "accent",
      external: true,
    });
  } else if (email) {
    actions.push({ href: `mailto:${email}`, label: "Send a tip", variant: "accent", external: false });
  }
  if (facebook) {
    actions.push({ href: facebook, label: "Follow on Facebook", variant: "secondary", external: true });
  }
  if (actions.length === 0) return null;

  return (
    <div className={className}>
      {actions.map((action) => (
        <a
          key={action.label}
          href={action.href}
          className={buttonClasses(action.variant, "whitespace-nowrap")}
          {...(action.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {action.label}
          {action.external ? <span className="sr-only"> (opens in a new tab)</span> : null}
        </a>
      ))}
    </div>
  );
}
