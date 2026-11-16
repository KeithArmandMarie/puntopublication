import { InitialsBadge } from "@/components/InitialsBadge";
import { SectionHeading } from "@/components/SectionHeading";
import { getAllStaff } from "@/lib/content";

type StaffGridProps = {
  /** Heading text. Defaults to "Meet the young journalists". */
  title?: string;
};

/**
 * The staff as a grid: initials badge, first name and position. First names
 * only, no photos and no links (the authors are minors). Renders nothing without staff.
 */
export function StaffGrid({ title = "Meet the young journalists" }: StaffGridProps) {
  const staff = getAllStaff();
  if (staff.length === 0) return null;

  return (
    <section aria-labelledby="staff-grid-heading">
      <SectionHeading title={title} id="staff-grid-heading" />
      <ul className="mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-2 md:grid-cols-3">
        {staff.map((member) => (
          <li key={member.id} className="flex items-center gap-3">
            <InitialsBadge name={member.firstName} />
            <div className="min-w-0">
              <p className="font-bold">{member.firstName}</p>
              <p className="text-sm text-muted">{member.position}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
