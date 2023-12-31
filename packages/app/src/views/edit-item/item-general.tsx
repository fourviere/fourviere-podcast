import { Container } from "@fourviere/ui/lib/box";
import FormSection from "@fourviere/ui/lib/form/form-section";
import FormRow from "@fourviere/ui/lib/form/form-row";
import Input from "@fourviere/ui/lib/form/fields/input";
import AudioField from "../../components/form-fields/audio";
import { Formik } from "formik";
import ImageField from "@fourviere/ui/lib/form/fields/image";
import { FormField } from "@fourviere/ui/lib/form/form-field";
import UseCurrentFeed from "../../hooks/useCurrentFeed";
import useTranslations from "../../hooks/useTranslations";
import { useParams } from "react-router-dom";
import useUpload, { UploadResponse } from "../../hooks/useUpload";
import { FullPageColumnLayout } from "@fourviere/ui/lib/layouts/full-page";
import { getDuration } from "../../native/audio";
import { ItemLink } from "../../components/form-fields/item-link";
import Boolean from "@fourviere/ui/lib/form/fields/boolean";
import Select from "@fourviere/ui/lib/form/fields/select";
import episodeType from "@fourviere/core/lib/apple/episode-type";
import ContainerTitle from "@fourviere/ui/lib/container-title";
import CKEditor from "@fourviere/ui/lib/form/fields/ckeditor";
import FormBlocker from "../../components/form-blocker";

export default function ItemGeneral() {
  const currentFeed = UseCurrentFeed();
  const { itemIndex } = useParams<{ itemIndex: string }>();
  const t = useTranslations();

  if (!currentFeed) {
    return null;
  }

  console.log("load");
  return (
    <FullPageColumnLayout>
      <Formik
        initialValues={currentFeed.feed}
        enableReinitialize
        onSubmit={(values, { setSubmitting }) => {
          currentFeed.update(values);
          setSubmitting(false);
        }}
      >
        {({
          setFieldValue,
          setFieldError,
          handleSubmit,
          values,
          dirty,
          isSubmitting,
        }) => {
          const imageUpload = useUpload({
            feedId: currentFeed.feedId,
            updateField: (value: UploadResponse) => {
              void setFieldValue(
                `rss.channel.0.item.${itemIndex}.["itunes:image"].@.href`,
                value.url,
              );
            },
            updateError: (value: string) =>
              setFieldError(
                `rss.channel.0.item.${itemIndex}.["itunes:image"].@.href`,
                value,
              ),
            fileFamily: "image",
          });

          const getDurationCallback = (s: string) => {
            getDuration(s)
              .then((duration) => {
                void setFieldValue(
                  `rss.channel.0.item[${itemIndex}]["itunes:duration"]`,
                  duration,
                );
              })
              .catch(console.error);
          };

          const enclosureUpload = useUpload({
            feedId: currentFeed.feedId,
            updateField: (value: UploadResponse) => {
              void setFieldValue(
                `rss.channel.0.item[${itemIndex}].enclosure.@.url`,
                value.url,
              );
              void setFieldValue(
                `rss.channel.0.item[${itemIndex}].enclosure.@.length`,
                value.size,
              );
              void setFieldValue(
                `rss.channel.0.item[${itemIndex}].enclosure.@.type`,
                value.mime_type,
              );
              getDurationCallback(value.url);
            },

            updateError: (value: string) => {
              setFieldError(
                `rss.channel.0.item[${itemIndex}].enclosure.@.url`,
                value,
              );
            },
            fileFamily: "audio",
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
              <FormBlocker dirty={dirty} />
              <ContainerTitle
                isDirty={dirty}
                isSubmitting={isSubmitting}
                onSave={() => handleSubmit()}
              >
                {values.rss.channel[0].item?.[Number(itemIndex)].title}
              </ContainerTitle>

              <FormSection
                title={t["edit_feed.items_fields.media.title"]}
                description={t["edit_feed.items_fields.media.description"]}
              >
                <FormRow
                  name="rss.channel.0.item[${itemIndex}].enclosure.@.url"
                  label={t["edit_feed.items_fields.enclosure_url"]}
                >
                  <FormField<typeof AudioField>
                    id={`rss.channel.0.item[${itemIndex}].enclosure.@`}
                    name={`rss.channel.0.item[${itemIndex}].enclosure.@`}
                    as={AudioField}
                    fieldProps={{
                      onButtonClick: enclosureUpload.openFile,
                      isUploading: enclosureUpload.isUploading,
                      onChange: (s: string) => {
                        getDurationCallback(s);
                      },
                    }}
                    initValue="https://www.spreaker.com/user/brainrepo/ep-190-matteo-croce-kernel"
                    emtpyValueButtonMessage={t["ui.forms.empty_field.message"]}
                  />
                </FormRow>
                <FormRow
                  name={`rss.channel.0.item[${itemIndex}]["itunes:duration"]`}
                  label={t["edit_feed.items_fields.duration"]}
                >
                  <FormField
                    id={`rss.channel.0.item[${itemIndex}]["itunes:duration"]`}
                    name={`rss.channel.0.item[${itemIndex}]["itunes:duration"]`}
                    as={Input}
                    initValue="My podcast title"
                    emtpyValueButtonMessage={t["ui.forms.empty_field.message"]}
                  />
                </FormRow>
              </FormSection>
              <FormSection
                title={t["edit_feed.items_fields.presentation.title"]}
                description={
                  t["edit_feed.items_fields.presentation.description"]
                }
              >
                <FormRow
                  name="rss.channel.0.title"
                  label={t["edit_feed.items_fields.title"]}
                >
                  <FormField
                    id={`rss.channel.0.item[${itemIndex}].title`}
                    name={`rss.channel.0.item[${itemIndex}].title`}
                    as={Input}
                    fieldProps={{ size: "lg" }}
                    initValue="My podcast title"
                    emtpyValueButtonMessage={t["ui.forms.empty_field.message"]}
                  />
                </FormRow>

                <FormRow
                  name={`rss.channel.0.item[${itemIndex}]["podcast:season"]`}
                  label={t["edit_feed.items_fields.podcast_season"]}
                >
                  <FormField
                    id={`rss.channel.0.item[${itemIndex}]["podcast:season"]`}
                    name={`rss.channel.0.item[${itemIndex}]["podcast:season"]`}
                    as={Input}
                    initValue="1"
                    emtpyValueButtonMessage={t["ui.forms.empty_field.message"]}
                  />
                </FormRow>
                <FormRow
                  name={`rss.channel.0.item[${itemIndex}]["podcast:episode"]`}
                  label={t["edit_feed.items_fields.podcast_episode"]}
                >
                  <FormField
                    id={`rss.channel.0.item[${itemIndex}]["podcast:episode"]`}
                    name={`rss.channel.0.item[${itemIndex}]["podcast:episode"]`}
                    as={Input}
                    initValue="1"
                    emtpyValueButtonMessage={t["ui.forms.empty_field.message"]}
                  />
                </FormRow>

                <FormRow
                  name="rss.channel.0.guid.#text"
                  label={t["edit_feed.items_fields.guid"]}
                >
                  <Container flex="col" spaceY="md">
                    <FormField
                      id={`rss.channel.0.item[${itemIndex}].guid.#text`}
                      name={`rss.channel.0.item[${itemIndex}].guid.#text`}
                      as={Input}
                      initValue="Unique identifier for the episode"
                      emtpyValueButtonMessage={
                        t["ui.forms.empty_field.message"]
                      }
                    />

                    <FormField
                      id={`rss.channel.0.item[${itemIndex}].guid.@.isPermaLink`}
                      name={`rss.channel.0.item[${itemIndex}].guid.@.isPermaLink`}
                      fieldProps={{
                        label: "Is Permalink",
                        setFieldValue,
                        value:
                          values.rss.channel[0].item?.[Number(itemIndex)]
                            .guid?.["@"]?.isPermaLink,
                        mapBoolean: (b: boolean) => (b ? "true" : "false"),
                        unmapBoolean: (b: string) => b === "true",
                      }}
                      as={Boolean}
                    />
                  </Container>
                </FormRow>
                <FormRow
                  name={`rss.channel.0.item[${itemIndex}].author`}
                  label={t["edit_feed.items_fields.author"]}
                >
                  <FormField
                    id={`rss.channel.0.item[${itemIndex}].author]`}
                    name={`rss.channel.0.item[${itemIndex}].author`}
                    as={Input}
                    initValue="Mauro Murru"
                    emtpyValueButtonMessage={t["ui.forms.empty_field.message"]}
                  />
                </FormRow>
                <FormRow
                  name="rss.channel.0.image"
                  label={t["edit_feed.items_fields.image"]}
                >
                  <FormField
                    id={`rss.channel.0.item.${itemIndex}.["itunes:image"].@.href`}
                    name={`rss.channel.0.item.${itemIndex}.["itunes:image"].@.href`}
                    as={ImageField}
                    fieldProps={{
                      onImageClick: imageUpload.openFile,
                      isUploading: imageUpload.isUploading,
                      helpMessage: t["edit_feed.channel_field.image.help"],
                    }}
                    emtpyValueButtonMessage={t["ui.forms.empty_field.message"]}
                    initValue="https://"
                  />
                </FormRow>
                <ItemLink
                  name={`rss.channel.0.item[${itemIndex}].link`}
                  values={values.rss.channel[0].item?.[Number(itemIndex)].link}
                />
                <FormRow
                  name="rss.channel.0.description"
                  label={t["edit_feed.items_fields.description"]}
                >
                  <FormField
                    id={`rss.channel.0.item[${itemIndex}].description`}
                    name={`rss.channel.0.item[${itemIndex}].description`}
                    as={CKEditor}
                    fieldProps={{
                      value:
                        values.rss.channel[0].item?.[Number(itemIndex)]
                          .description,
                      setFieldValue,
                    }}
                    initValue="My episode description"
                    emtpyValueButtonMessage={t["ui.forms.empty_field.message"]}
                  />
                </FormRow>

                <FormRow
                  name="rss.channel.0.item[${itemIndex}]['itunes:explicit']"
                  label={t["edit_feed.items_fields.explicit"]}
                >
                  <FormField
                    id={`rss.channel.0.item[${itemIndex}]['itunes:explicit']`}
                    name={`rss.channel.0.item[${itemIndex}]['itunes:explicit']`}
                    fieldProps={{
                      label: "Explicit",
                      setFieldValue,
                      value:
                        values.rss.channel[0].item?.[Number(itemIndex)][
                          "itunes:explicit"
                        ],
                      mapBoolean: (b: boolean) => (b ? "true" : "clean"),
                      unmapBoolean: (b: string) => b === "true",
                    }}
                    as={Boolean}
                  />
                </FormRow>
              </FormSection>
              <FormSection
                title={t["edit_feed.items_fields.itunes.title"]}
                description={t["edit_feed.items_fields.itunes.description"]}
              >
                <FormRow
                  name={`rss.channel.0.item[${itemIndex}]["itunes:subtitle"]`}
                  label={t["edit_feed.items_fields.itunes_subtitle"]}
                >
                  <FormField
                    id={`rss.channel.0.item[${itemIndex}]["itunes:subtitle"]`}
                    name={`rss.channel.0.item[${itemIndex}]["itunes:subtitle"]`}
                    as={Input}
                    initValue="My podcast subtitle"
                    emtpyValueButtonMessage={t["ui.forms.empty_field.message"]}
                  />
                </FormRow>
                <FormRow
                  name="rss.channel.0.description"
                  label={t["edit_feed.items_fields.itunes_summary"]}
                >
                  <FormField<typeof CKEditor>
                    id={`rss.channel.0.item[${itemIndex}]["itunes:summary"]`}
                    name={`rss.channel.0.item[${itemIndex}]["itunes:summary"]`}
                    as={CKEditor}
                    fieldProps={{
                      value:
                        values.rss.channel[0].item?.[Number(itemIndex)][
                          "itunes:summary"
                        ],
                      setFieldValue,
                    }}
                    initValue="My episode sumary"
                    emtpyValueButtonMessage={t["ui.forms.empty_field.message"]}
                  />
                </FormRow>
                <FormRow
                  name={`rss.channel.0.item[${itemIndex}]["itunes:episodeType"]`}
                  label={t["edit_feed.items_fields.episode_type"]}
                >
                  <FormField
                    id={`rss.channel.0.item[${itemIndex}]["itunes:episodeType"]`}
                    name={`rss.channel.0.item[${itemIndex}]["itunes:episodeType"]`}
                    as={Select}
                    fieldProps={{
                      options: episodeType,
                      labelProperty: "value",
                      keyProperty: "name",
                      lowercase: true,
                    }}
                    initValue="full"
                    emtpyValueButtonMessage={t["ui.forms.empty_field.message"]}
                  />
                </FormRow>
              </FormSection>
            </Container>
          );
        }}
      </Formik>
    </FullPageColumnLayout>
  );
}
