import { Container } from "@/components/Container";
import { siteName } from "@/config/site";

export default function Home() {
  return (
    <Container className="py-section">
      <h1>{siteName}</h1>
    </Container>
  );
}
