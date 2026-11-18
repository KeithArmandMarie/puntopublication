import { ButtonArrow, buttonClasses } from "@/components/Button";
import { SectionHeading } from "@/components/SectionHeading";
import Link from "next/link";
import { StaffCard } from "@/components/StaffCard";
import { getAllStaff } from "@/lib/content";

type StaffGridProps = {
  /** Heading text. Defaults to "Meet the young journalists". */
  title?: string;
  /** Show only the first few members, and a button to the Team page with everyone. */
  limit?: number;
};

/**
 * "Meet the team": staff members as `StaffCard`s (picture, full name, position), 2 columns on
 * phones, 3 from 640px, 4 from 1024px. Everyone by default. With `limit` it shows that many
 * (2 columns, 4 from 1024px) and, when there are more, a "Meet the whole team" button to `/team`.
 * Renders nothing without staff.
 */
export function StaffGrid({ title = "Meet the young journalists", limit }: StaffGridProps) {
  const everyone = getAllStaff();
  if (everyone.length === 0) return null;
  const staff = limit === undefined ? everyone : everyone.slice(0, limit);
  const hasMore = staff.length < everyone.length;

  return (
    <section aria-labelledby="staff-grid-heading" data-reveal>
      <SectionHeading title={title} id="staff-grid-heading" />
      <ul
        className={`mt-6 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 ${limit === undefined ? "sm:grid-cols-3" : ""}`.trim()}
      >
        {staff.map((member) => (
          <li key={member.id}>
            <StaffCard
              member={member}
              sizes="(min-width: 1024px) 280px, (min-width: 640px) 33vw, 50vw"
            />
          </li>
        ))}
      </ul>
      {hasMore ? (
        <div className="mt-8">
          <Link href="/team" className={buttonClasses("secondary")}>
            Meet the whole team
            <ButtonArrow />
          </Link>
        </div>
      ) : null}
    </section>
  );
}
