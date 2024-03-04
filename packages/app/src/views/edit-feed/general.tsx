import { Container } from "@fourviere/ui/lib/box";
import FormSection from "@fourviere/ui/lib/form/form-section";
import FormRow from "@fourviere/ui/lib/form/form-row";
import Input from "@fourviere/ui/lib/form/fields/input";
import { Formik } from "formik";
import { FormField } from "@fourviere/ui/lib/form/form-field";
import UseCurrentFeed from "../../hooks/use-current-feed";
import useTranslations from "../../hooks/use-translations";
import Select from "@fourviere/ui/lib/form/fields/select";
import PODCASTCATEGORIES from "@fourviere/core/lib/podcast-namespace/categories";
import { FC } from "react";
import FormObjectField from "@fourviere/ui/lib/form/form-object-field";
import { ChannelLinks } from "../../components/form-fields/channel-links";
import ContainerTitle from "@fourviere/ui/lib/container-title";
import CKEditor from "@fourviere/ui/lib/form/fields/ckeditor";
import FormBlocker from "../../components/form-blocker";
import Img from "../../components/form-fields/image";
import { LANGUAGE_BY_LOCALE } from "@fourviere/core/lib/const";

export default function General() {
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
      {({ values, setFieldValue, handleSubmit, dirty, isSubmitting }) => {
        return (
          <Container
            scroll
            wFull
            flex="col"
            as="form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <FormBlocker dirty={dirty} />
            <ContainerTitle
              isDirty={dirty}
              isSubmitting={isSubmitting}
              onSave={() => handleSubmit()}
            >
              {t["edit_feed.presentation.title"]}
            </ContainerTitle>

            <Container spaceY="3xl">
              <FormSection
                description={t["edit_feed.presentation.title.description"]}
              >
                <FormRow
                  name="rss.channel.0.title"
                  label={t["edit_feed.channel_field.show_name"]}
                >
                  <FormField
                    id="rss.channel.0.title"
                    name="rss.channel.0.title"
                    as={Input}
                    fieldProps={{ size: "lg" }}
                    initValue="My podcast title"
                    emtpyValueButtonMessage={t["ui.forms.empty_field.message"]}
                  />
                </FormRow>
                <FormRow name="rss.channel.0.image.url" label={"test image"}>
                  <FormField
                    id="rss.channel.0.image.url"
                    name="rss.channel.0.image.url"
                    as={Img}
                    fieldProps={{
                      feedId: currentFeed.feedId,
                      name: "rss.channel.0.image.url",
                    }}
                    emtpyValueButtonMessage={t["ui.forms.empty_field.message"]}
                    initValue="https://"
                  />
                </FormRow>

                <FormRow
                  name="rss.channel.0.description"
                  label={t["edit_feed.channel_field.show_description"]}
                >
                  <FormField
                    id="rss.channel.0.description"
                    name="rss.channel.0.description"
                    as={CKEditor as FC}
                    fieldProps={{
                      value: values.rss.channel[0].description,
                      setFieldValue, //TODO: remove this move into the component
                    }}
                    initValue="My podcast description"
                    emtpyValueButtonMessage={t["ui.forms.empty_field.message"]}
                  />
                </FormRow>
                <FormRow
                  name={`rss.channel.0.["itunes:type"]`}
                  label={t["edit_feed.channel_field.type"]}
                >
                  <FormField
                    id={`rss.channel.0.["itunes:type"]`}
                    name={`rss.channel.0.["itunes:type"]`}
                    fieldProps={{
                      options: [
                        { name: "Episodic", value: "episodic" },
                        { name: "Serial", value: "serial" },
                      ],
                      labelProperty: "name",
                      keyProperty: "value",
                    }}
                    as={Select as FC}
                    initValue="yes"
                    emtpyValueButtonMessage={t["ui.forms.empty_field.message"]}
                  />
                </FormRow>
                <ChannelLinks
                  name="rss.channel.0.link"
                  values={values.rss.channel[0].link}
                />
              </FormSection>
              <FormSection
                title={t["edit_feed.indexing.title"]}
                description={t["edit_feed.indexing.title.description"]}
              >
                <FormRow
                  name="rss.channel.0.category.0"
                  label={t["edit_feed.channel_field.language"]}
                >
                  <FormField
                    id="rss.channel.0.language"
                    name="rss.channel.0.language"
                    as={Select as FC}
                    fieldProps={{
                      options: Object.entries(
                        LANGUAGE_BY_LOCALE as Record<string, string>,
                      ).map(([key, value]) => ({
                        name: key,
                        value: value,
                      })),
                      labelProperty: "value",
                      keyProperty: "name",
                      lowercase: true,
                    }}
                    initValue="en-us"
                    emtpyValueButtonMessage={t["ui.forms.empty_field.message"]}
                  />
                </FormRow>
                <FormRow
                  name="rss.channel.0.category.0"
                  label={t["edit_feed.channel_field.category"]}
                >
                  <FormField
                    id="rss.channel.0.category.0"
                    name="rss.channel.0.category.0"
                    as={Select as FC}
                    fieldProps={{
                      options: PODCASTCATEGORIES,
                      labelProperty: "name",
                      keyProperty: "name",
                    }}
                    initValue="My podcast category"
                    emtpyValueButtonMessage={t["ui.forms.empty_field.message"]}
                  />
                </FormRow>
                <FormRow
                  name={`rss.channel.0.["itunes:explicit"]`}
                  label={t["edit_feed.channel_field.explicit"]}
                >
                  <FormField
                    id={`rss.channel.0.["itunes:explicit"]`}
                    name={`rss.channel.0.["itunes:explicit"]`}
                    fieldProps={{
                      options: [
                        { name: "No", value: "no" },
                        { name: "Yes", value: "yes" },
                      ],
                      labelProperty: "name",
                      keyProperty: "value",
                    }}
                    as={Select as FC}
                    initValue="yes"
                    emtpyValueButtonMessage={t["ui.forms.empty_field.message"]}
                  />
                </FormRow>
                <FormRow
                  name={`rss.channel.0.["itunes:block"]`}
                  label={t["edit_feed.channel_field.block"]}
                >
                  <FormField
                    id={`rss.channel.0.["itunes:block"]`}
                    name={`rss.channel.0.["itunes:block"]`}
                    fieldProps={{
                      options: [
                        { name: "No", value: "no" },
                        { name: "Yes", value: "yes" },
                      ],
                      labelProperty: "name",
                      keyProperty: "value",
                    }}
                    as={Select as FC}
                    initValue="yes"
                    emtpyValueButtonMessage={t["ui.forms.empty_field.message"]}
                  />
                </FormRow>
                <FormRow
                  name={`rss.channel.0.["itunes:complete"]`}
                  label={t["edit_feed.channel_field.complete"]}
                >
                  <FormField
                    id={`rss.channel.0.["itunes:complete"]`}
                    name={`rss.channel.0.["itunes:complete"]`}
                    fieldProps={{
                      options: [
                        { name: "No", value: "no" },
                        { name: "Yes", value: "yes" },
                      ],
                      labelProperty: "name",
                      keyProperty: "value",
                    }}
                    as={Select as FC}
                    initValue="yes"
                    emtpyValueButtonMessage={t["ui.forms.empty_field.message"]}
                  />
                </FormRow>

                <FormRow
                  name={`rss.channel.0.["itunes:new-feed-url"]`}
                  label={t["edit_feed.channel_field.new_feed_url"]}
                >
                  <FormField
                    id={`rss.channel.0.["itunes:new-feed-url"]`}
                    name={`rss.channel.0.["itunes:new-feed-url"]`}
                    as={Input}
                    initValue="Jhon Doe"
                    emtpyValueButtonMessage={t["ui.forms.empty_field.message"]}
                  />
                </FormRow>
              </FormSection>
              <FormSection
                title={t["edit_feed.ownership.title"]}
                description={t["edit_feed.ownership.title.description"]}
              >
                <FormRow
                  name={`rss.channel.0.copyright`}
                  label={t["edit_feed.channel_field.copyright"]}
                >
                  <FormField
                    id={`rss.channel.0.copyright`}
                    name={`rss.channel.0.copyright`}
                    as={Input}
                    initValue="© 2021 My Podcast"
                    emtpyValueButtonMessage={t["ui.forms.empty_field.message"]}
                  />
                </FormRow>
                <FormRow
                  name={`rss.channel.0.["itunes:author"]`}
                  label={t["edit_feed.channel_field.author"]}
                >
                  <FormField
                    id={`rss.channel.0.["itunes:author"]`}
                    name={`rss.channel.0.["itunes:author"]`}
                    as={Input}
                    initValue="Jhon Doe"
                    emtpyValueButtonMessage={t["ui.forms.empty_field.message"]}
                  />
                </FormRow>

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
                      id={`rss.channel.0.["itunes:owner"].["itunes:email"]]`}
                      name={`rss.channel.0.["itunes:owner"].["itunes:email"]`}
                      as={Input}
                    />
                  </FormRow>
                </FormObjectField>
              </FormSection>
            </Container>
          </Container>
        );
      }}
    </Formik>
  );
}
