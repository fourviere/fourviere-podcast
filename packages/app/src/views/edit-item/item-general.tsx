import { Container } from "@fourviere/ui/lib/box";
import FormSection from "@fourviere/ui/lib/form/form-section";
import FormRow from "@fourviere/ui/lib/form/form-row";
import Input from "@fourviere/ui/lib/form/fields/input";
import Text from "@fourviere/ui/lib/form/fields/text";
import AudioField from "@fourviere/ui/lib/form/fields/audio";
import { Formik } from "formik";
import ImageField from "@fourviere/ui/lib/form/fields/image";
import { FormField } from "@fourviere/ui/lib/form/form-field";
import UseCurrentFeed from "../../hooks/useCurrentFeed";
import useTranslations from "../../hooks/useTranslations";

import FormObserver from "../../components/form-observer";
import { Feed } from "@fourviere/core/lib/schema/feed";
import { useParams } from "react-router-dom";
import useUpload from "../../hooks/useUpload";
import { FC } from "react";
import { FullPageColumnLayout } from "@fourviere/ui/lib/layouts/full-page";

export default function ItemGeneral() {
  const currentFeed = UseCurrentFeed();
  let { itemIndex } = useParams<{ itemIndex: string }>();
  const t = useTranslations();

  if (!currentFeed) {
    return null;
  }

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
        {({ setFieldValue, setFieldError, handleSubmit, values }) => {
          const imageUpload = useUpload({
            feedId: currentFeed.feedId,
            updateField: (value: string) =>
              setFieldValue(
                `rss.channel.0.item.${itemIndex}.["itunes:image"].@.href`,
                value
              ),
            updateError: (value: string) =>
              setFieldError(
                `rss.channel.0.item.${itemIndex}.["itunes:image"].@.href`,
                value
              ),
            fileFamily: "image",
          });

          const enclosureUpload = useUpload({
            feedId: currentFeed.feedId,
            updateField: (value: string) =>
              setFieldValue(
                `rss.channel.0.item[${itemIndex}].enclosure.@.url`,
                value
              ),
            updateError: (value: string) => {
              setFieldError(
                `rss.channel.0.item[${itemIndex}].enclosure.@.url`,
                value
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
              <FormObserver<Feed>
                updateFunction={(values) => {
                  currentFeed.update(values);
                }}
              />
              <FormSection
                title={t["edit_feed.items_fields.media.title"]}
                description={t["edit_feed.items_fields.media.description"]}
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
                  name="rss.channel.0.item[${itemIndex}].enclosure.@.url"
                  label={t["edit_feed.items_fields.enclosure_url"]}
                >
                  <FormField
                    id={`rss.channel.0.item[${itemIndex}].enclosure.@.url`}
                    name={`rss.channel.0.item[${itemIndex}].enclosure.@.url`}
                    as={AudioField}
                    fieldProps={{
                      onButtonClick: enclosureUpload.openFile,
                      isUploading: enclosureUpload.isUploading,
                    }}
                    initValue="https://www.spreaker.com/user/brainrepo/ep-190-matteo-croce-kernel"
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
                <FormRow
                  name="rss.channel.0.description"
                  label={t["edit_feed.items_fields.description"]}
                >
                  <FormField
                    id={`rss.channel.0.item[${itemIndex}].description`}
                    name={`rss.channel.0.item[${itemIndex}].description`}
                    as={Text as FC}
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
              </FormSection>
            </Container>
          );
        }}
      </Formik>
    </FullPageColumnLayout>
  );
}
