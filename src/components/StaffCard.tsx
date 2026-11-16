import Image from "next/image";
import type { StaffMember } from "@/lib/content";

type StaffCardProps = {
  member: StaffMember;
  /** Tells the browser how wide the picture is shown. Required, as for every image. */
  sizes: string;
  /** Heading level of the name. Defaults to h3. */
  headingLevel?: "h3" | "h4";
  className?: string;
};

/**
 * A team member as a card: square picture, first name and position, in a 1px border.
 * The authors are minors, so only the first name shows and the card is not a link.
 * With no photo the picture is the first letter of the first name on the brand color.
 */
export function StaffCard({
  member,
  sizes,
  headingLevel: Heading = "h3",
  className = "",
}: StaffCardProps) {
  const initial = Array.from(member.firstName.trim())[0]?.toUpperCase() ?? "";

  return (
    <article className={`overflow-hidden rounded-md border border-border ${className}`.trim()}>
      {member.photo ? (
        <div className="relative aspect-1/1 w-full bg-surface">
          <Image
            src={member.photo}
            alt={`Photo of ${member.firstName}`}
            fill
            sizes={sizes}
            loading="lazy"
            className="object-cover"
          />
        </div>
      ) : (
        <div
          aria-hidden="true"
          className="flex aspect-1/1 w-full items-center justify-center bg-brand text-4xl font-extrabold text-on-brand"
        >
          {initial}
        </div>
      )}
      <div className="border-t border-border p-3">
        <Heading className="text-lg font-bold tracking-tight">{member.firstName}</Heading>
        <p className="mt-1 text-sm text-muted">{member.position}</p>
      </div>
    </article>
  );
}
