import { SectionHeading } from "@/components/SectionHeading";
import { StaffCard } from "@/components/StaffCard";
import { getAllStaff } from "@/lib/content";

type StaffGridProps = {
  /** Heading text. Defaults to "Meet the young journalists". */
  title?: string;
};

/**
 * "Meet the team": every staff member as a `StaffCard` (picture, first name, position),
 * 2 columns on phones, 3 from 640px, 4 from 1024px. Renders nothing without staff.
 */
export function StaffGrid({ title = "Meet the young journalists" }: StaffGridProps) {
  const staff = getAllStaff();
  if (staff.length === 0) return null;

  return (
    <section aria-labelledby="staff-grid-heading" data-reveal>
      <SectionHeading title={title} id="staff-grid-heading" />
      <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
        {staff.map((member) => (
          <li key={member.id}>
            <StaffCard
              member={member}
              sizes="(min-width: 1024px) 280px, (min-width: 640px) 33vw, 50vw"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
