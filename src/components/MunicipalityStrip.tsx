import { Chip } from "@/components/Chip";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { municipalities, municipalitiesIndex } from "@/config/site";

/** Plain text chips, one per municipality, plus a link to the full list. */
export function MunicipalityStrip() {
  return (
    <Reveal>
    <section aria-labelledby="municipality-strip-heading">
      <SectionHeading title="Municipalities" id="municipality-strip-heading" />
      <ul className="mt-4 flex flex-wrap gap-2">
        {municipalities.map((municipality) => (
          <li key={municipality.slug}>
            <Chip href={municipality.href}>{municipality.name}</Chip>
          </li>
        ))}
        <li>
          <Chip href={municipalitiesIndex.href} className="bg-surface">
            {municipalitiesIndex.label}
          </Chip>
        </li>
      </ul>
    </section>
    </Reveal>
  );
}
