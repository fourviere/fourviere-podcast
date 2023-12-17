import { Container } from "@fourviere/ui/lib/box";
import FormSection from "@fourviere/ui/lib/form/form-section";
import FormRow from "@fourviere/ui/lib/form/form-row";
import Input from "@fourviere/ui/lib/form/fields/input";
import { Formik } from "formik";
import { FormField } from "@fourviere/ui/lib/form/form-field";
import UseCurrentFeed from "../../hooks/useCurrentFeed";
import useTranslations from "../../hooks/useTranslations";
import FormObjectField from "@fourviere/ui/lib/form/form-object-field";
import Boolean from "@fourviere/ui/lib/form/fields/boolean";
import ImageField from "@fourviere/ui/lib/form/fields/image";
import { Categories } from "../../components/form-fields/categories.tsx";
import useUpload, { UploadResponse } from "../../hooks/useUpload";
import ContainerTitle from "@fourviere/ui/lib/container-title.tsx";

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
      {({
        values,
        handleSubmit,
        setFieldValue,
        setFieldError,
        dirty,
        isSubmitting,
      }) => {
        console.log({ values });
        const imageUpload = useUpload({
          feedId: currentFeed.feedId,
          updateField: (value: UploadResponse) =>
            void setFieldValue(
              `rss.channel.0.['itunes:image'].@.href`,
              value.url,
            ),
          updateError: (value: string) =>
            setFieldError(`rss.channel.0.['itunes:image'].@.href`, value),
          fileFamily: "image",
        });
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
                fieldName={`rss.channel.0.['itunes:image']`}
                cols={1}
                initValue={{
                  "@": {
                    href: "https://",
                  },
                }}
                label={t["edit_feed.channel_field.itunes.image"]}
              >
                <FormRow
                  name="rss.channel.0.['itunes:image'].@.href"
                  label={t["edit_feed.channel_field.itunes.image"]}
                >
                  <ImageField
                    id="rss.channel.0.['itunes:image'].@.href"
                    name="rss.channel.0.['itunes:image'].@.href"
                    onImageClick={imageUpload.openFile}
                    isUploading={imageUpload.isUploading}
                    helpMessage={t["edit_feed.channel_field.image.help"]}
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
                fieldName={`rss.channel.0.["itunes:owner"]`}
                initValue={{
                  "itunes:name": "Jhon Doe",
                  "itunes:email": "jhon@doe.audio",
                }}
                label={t["edit_feed.channel_field.owner"]}
              >
                <FormRow
                  name={`rss.channel.0.["itunes:owner"].name`}
                  label={t["edit_feed.channel_field.owner.name"]}
                >
                  <FormField
                    id={`rss.channel.0.["itunes:owner"].["itunes:name"]]`}
                    name={`rss.channel.0.["itunes:owner"].["itunes:name"]`}
                    as={Input}
                  />
                </FormRow>
                <FormRow
                  name={`rss.channel.0.["itunes:owner"].email`}
                  label={t["edit_feed.channel_field.owner.email"]}
                >
                  <FormField
                    id={`rss.channel.0.["itunes:owner"].["itunes:email"]`}
                    name={`rss.channel.0.["itunes:owner"].["itunes:email"]`}
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
                name={`rss.channel.0.["itunes:keywords"]`}
                label={t["edit_feed.channel_field.itunes.keywords"]}
              >
                <FormField
                  id={`rss.channel.0.["itunes:keywords"]`}
                  name={`rss.channel.0.["itunes:keywords"]`}
                  as={Input}
                  initValue="technology, news, podcast"
                  emtpyValueButtonMessage={t["ui.forms.empty_field.message"]}
                />
              </FormRow>
              <Categories name={`rss.channel.0.["itunes:category"]`} />
              <FormRow
                name={`rss.channel.0.["itunes:complete"]`}
                label={t["edit_feed.channel_field.itunes.complete"]}
              >
                <FormField
                  id={`rss.channel.0.["itunes:complete"]`}
                  name={`rss.channel.0.["itunes:complete"]`}
                  fieldProps={{
                    label:
                      t["edit_feed.channel_field.itunes.complete.description"],
                    value: values.rss.channel[0]["itunes:complete"],
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
