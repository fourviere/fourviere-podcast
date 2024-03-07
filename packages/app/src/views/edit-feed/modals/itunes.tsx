import { Container } from "@fourviere/ui/lib/box";
import FormSection from "@fourviere/ui/lib/form/form-section";
import FormRow from "@fourviere/ui/lib/form/form-row";
import Input from "@fourviere/ui/lib/form/fields/input";
import { Formik } from "formik";
import { FormField } from "@fourviere/ui/lib/form/form-field";
import UseCurrentFeed from "../../../hooks/use-current-feed.tsx";
import useTranslations from "../../../hooks/use-translations.tsx";
import FormObjectField from "@fourviere/ui/lib/form/form-object-field";
import Boolean from "@fourviere/ui/lib/form/fields/boolean";
import { Categories } from "../../../components/form-fields/categories.tsx";
import ContainerTitle from "@fourviere/ui/lib/container-title.tsx";
import Img from "../../../components/form-fields/image/index.tsx";

export default function Itunes() {
  const currentFeed = UseCurrentFeed();
  const t = useTranslations();

  if (!currentFeed) {
    return null;
  }

  return (
    <Formik
      initialValues={currentFeed.feed}
      enableReinitialize
      onSubmit={(values, { setSubmitting }) => {
        currentFeed.update(values);
        setSubmitting(false);
      }}
    >
      {({ values, handleSubmit, setFieldValue, dirty, isSubmitting }) => {
        return (
          <Container
            scroll
            wFull
            spaceY="3xl"
            flex="col"
            as="form"
            onSubmit={handleSubmit}
          >
            <ContainerTitle
              isDirty={dirty}
              isSubmitting={isSubmitting}
              onSave={() => handleSubmit()}
            >
              {t["edit_feed.channel_field.itunes.title"]}
            </ContainerTitle>
            <FormSection
              title={t["edit_feed.itunes_presentation.title"]}
              description={
                t["edit_feed.channel_field.itunes.complete.description"]
              }
            >
              <FormObjectField
                emtpyValueButtonMessage={t["ui.forms.empty_field.message"]}
                fieldName={`rss.channel.['itunes:image']`}
                cols={1}
                initValue={{
                  "@": {
                    href: "https://",
                  },
                }}
                label={t["edit_feed.channel_field.itunes.image"]}
              >
                <FormRow
                  name="rss.channel.['itunes:image'].@.href"
                  label={"test image"}
                >
                  <FormField
                    id="rss.channel.['itunes:image'].@.href"
                    name="rss.channel.['itunes:image'].@.href"
                    as={Img}
                    fieldProps={{
                      feedId: currentFeed.feedId,
                      name: "rss.channel.['itunes:image'].@.href",
                    }}
                    emtpyValueButtonMessage={t["ui.forms.empty_field.message"]}
                    initValue="https://"
                  />
                </FormRow>
              </FormObjectField>
            </FormSection>
            <FormSection
              title={t["edit_feed.itunes_ownership.title"]}
              description={t["edit_feed.itunes_ownership.title.description"]}
            >
              <FormObjectField
                emtpyValueButtonMessage={t["ui.forms.empty_field.message"]}
                fieldName={`rss.channel.["itunes:owner"]`}
                initValue={{
                  "itunes:name": "Jhon Doe",
                  "itunes:email": "jhon@doe.audio",
                }}
                label={t["edit_feed.channel_field.owner"]}
              >
                <FormRow
                  name={`rss.channel.["itunes:owner"].name`}
                  label={t["edit_feed.channel_field.owner.name"]}
                >
                  <FormField
                    id={`rss.channel.["itunes:owner"].["itunes:name"]]`}
                    name={`rss.channel.["itunes:owner"].["itunes:name"]`}
                    as={Input}
                  />
                </FormRow>
                <FormRow
                  name={`rss.channel.["itunes:owner"].email`}
                  label={t["edit_feed.channel_field.owner.email"]}
                >
                  <FormField
                    id={`rss.channel.["itunes:owner"].["itunes:email"]`}
                    name={`rss.channel.["itunes:owner"].["itunes:email"]`}
                    as={Input}
                  />
                </FormRow>
              </FormObjectField>
            </FormSection>
            <FormSection
              title={t["edit_feed.itunes_indexing.title"]}
              description={t["edit_feed.itunes_indexing.title.description"]}
            >
              <FormRow
                name={`rss.channel.["itunes:keywords"]`}
                label={t["edit_feed.channel_field.itunes.keywords"]}
              >
                <FormField
                  id={`rss.channel.["itunes:keywords"]`}
                  name={`rss.channel.["itunes:keywords"]`}
                  as={Input}
                  initValue="technology, news, podcast"
                  emtpyValueButtonMessage={t["ui.forms.empty_field.message"]}
                />
              </FormRow>
              <Categories name={`rss.channel.["itunes:category"]`} />
              <FormRow
                name={`rss.channel.["itunes:complete"]`}
                label={t["edit_feed.channel_field.itunes.complete"]}
              >
                <FormField
                  id={`rss.channel.["itunes:complete"]`}
                  name={`rss.channel.["itunes:complete"]`}
                  fieldProps={{
                    label:
                      t["edit_feed.channel_field.itunes.complete.description"],
                    value: values.rss.channel["itunes:complete"],
                    setFieldValue,
                    mapBoolean: (b: boolean) => (b ? "yes" : undefined),
                    unmapBoolean: (b: string) => b === "yes",
                  }}
                  initValue={"yes"}
                  emtpyValueButtonMessage={t["ui.forms.empty_field.message"]}
                  as={Boolean}
                />
              </FormRow>
            </FormSection>
          </Container>
        );
      }}
    </Formik>
  );
}
