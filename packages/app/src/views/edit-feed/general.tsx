import { Container } from "@fourviere/ui/lib/box";
import FormSection from "@fourviere/ui/lib/form/form-section";

export default function General() {
  return (
    <Container wFull>
      <FormSection
        title="Presentation"
        description="This is the presentation of your podcast."
      ></FormSection>
      <FormSection
        title="Artwork"
        description="This is the presentation of your podcast."
      ></FormSection>
      <FormSection
        title="Base RSS feed info"
        description="This is the presentation of your podcast."
      ></FormSection>
    </Container>
  );
}
