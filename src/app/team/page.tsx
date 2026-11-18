import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";
import { StaffGrid } from "@/components/StaffGrid";
import { pageImages } from "@/config/page-images";

const description = "Everyone who works at Punto Publication, with their position.";

export const metadata: Metadata = {
  title: "Our team",
  description,
  alternates: { canonical: "/team" },
};

/** `/team`: every member of Punto Publication, with full name and position. */
export default function TeamPage() {
  return (
    <>
      <PageHeader title="Our team" image={pageImages.team.header}>
        {description}
      </PageHeader>
      <Container className="py-section">
        <StaffGrid title="Every member" />
      </Container>
    </>
  );
}
