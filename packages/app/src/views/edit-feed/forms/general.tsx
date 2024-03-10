import FormSection from "@fourviere/ui/lib/form/form-section";
import FormRow from "@fourviere/ui/lib/form/form-row";
import Input from "@fourviere/ui/lib/form/fields/input";
import { Formik } from "formik";
import { FormField } from "@fourviere/ui/lib/form/form-field";
import UseCurrentFeed from "../../../hooks/use-current-feed";
import { useTranslation } from "react-i18next";
import Select from "@fourviere/ui/lib/form/fields/select";
import PODCASTCATEGORIES from "@fourviere/core/lib/podcast-namespace/categories";
import { FC } from "react";
import FormObjectField from "@fourviere/ui/lib/form/form-object-field";
import { ChannelLinks } from "../../../components/form-fields/channel-links";
import ContainerTitle from "@fourviere/ui/lib/container-title";
import FormBlocker from "../../../components/form-blocker";
import Img from "../../../components/form-fields/image";
import { LANGUAGE_BY_LOCALE } from "@fourviere/core/lib/const";
import VStack from "@fourviere/ui/lib/layouts/v-stack";

export default function General() {
  const currentFeed = UseCurrentFeed();
  const { t } = useTranslation("", {
    keyPrefix: "",
  });

  if (!currentFeed) {
    return null;
  }

  return (
    <>
      <Formik
        initialValues={currentFeed.feed}
        enableReinitialize
        onSubmit={(values, { setSubmitting }) => {
          currentFeed.update(values);
          setSubmitting(false);
        }}
      >
        {({ values, handleSubmit, dirty, isSubmitting }) => {
          return (
            <>
              <FormBlocker dirty={dirty} />
              <ContainerTitle
                isDirty={dirty}
                isSubmitting={isSubmitting}
                onSave={() => handleSubmit()}
              >
                {t("edit_feed.presentation.title")}
              </ContainerTitle>
              <VStack
                spacing="4"
                as="form"
                wFull
                onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                  e.preventDefault();
                  handleSubmit();
                }}
              >
                <FormSection
                  description={t("edit_feed.presentation.title.description")}
                >
                  <FormRow
                    htmlFor="rss.channel.title"
                    label={t("edit_feed.channel_field.show_name")}
                  >
                    <FormField
                      id="rss.channel.title"
                      name="rss.channel.title"
                      as={Input}
                      fieldProps={{ size: "lg" }}
                      initValue="My podcast title"
                      emtpyValueButtonMessage={t(
                        "ui.forms.empty_field.message",
                      )}
                    />
                  </FormRow>
                  <FormRow htmlFor="rss.channel.image.url" label={"test image"}>
                    <FormField
                      id="rss.channel.image.url"
                      name="rss.channel.image.url"
                      as={Img}
                      fieldProps={{
                        feedId: currentFeed.feedId,
                        name: "rss.channel.image.url",
                      }}
                      emtpyValueButtonMessage={t(
                        "ui.forms.empty_field.message",
                      )}
                      initValue="https://"
                    />
                  </FormRow>
                  <FormRow
                    htmlFor={`rss.channel.["itunes:type"]`}
                    label={t("edit_feed.channel_field.type")}
                  >
                    <FormField
                      id={`rss.channel.["itunes:type"]`}
                      name={`rss.channel.["itunes:type"]`}
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
                      emtpyValueButtonMessage={t(
                        "ui.forms.empty_field.message",
                      )}
                    />
                  </FormRow>
                  <ChannelLinks
                    name="rss.channel.link"
                    values={values.rss.channel.link}
                  />
                </FormSection>

                <FormSection
                  title={t("edit_feed.indexing.title")}
                  description={t("edit_feed.indexing.title.description")}
                >
                  <FormRow
                    htmlFor="rss.channel.category.0"
                    label={t("edit_feed.channel_field.language")}
                  >
                    <FormField
                      id="rss.channel.language"
                      name="rss.channel.language"
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
                      emtpyValueButtonMessage={t(
                        "ui.forms.empty_field.message",
                      )}
                    />
                  </FormRow>
                  <FormRow
                    htmlFor="rss.channel.category.0"
                    label={t("edit_feed.channel_field.category")}
                  >
                    <FormField
                      id="rss.channel.category.0"
                      name="rss.channel.category.0"
                      as={Select as FC}
                      fieldProps={{
                        options: PODCASTCATEGORIES,
                        labelProperty: "name",
                        keyProperty: "name",
                      }}
                      initValue="My podcast category"
                      emtpyValueButtonMessage={t(
                        "ui.forms.empty_field.message",
                      )}
                    />
                  </FormRow>
                  <FormRow
                    htmlFor={`rss.channel.["itunes:explicit"]`}
                    label={t("edit_feed.channel_field.explicit")}
                  >
                    <FormField
                      id={`rss.channel.["itunes:explicit"]`}
                      name={`rss.channel.["itunes:explicit"]`}
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
                      emtpyValueButtonMessage={t(
                        "ui.forms.empty_field.message",
                      )}
                    />
                  </FormRow>
                  <FormRow
                    htmlFor={`rss.channel.["itunes:block"]`}
                    label={t("edit_feed.channel_field.block")}
                  >
                    <FormField
                      id={`rss.channel.["itunes:block"]`}
                      name={`rss.channel.["itunes:block"]`}
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
                      emtpyValueButtonMessage={t(
                        "ui.forms.empty_field.message",
                      )}
                    />
                  </FormRow>
                  <FormRow
                    htmlFor={`rss.channel.["itunes:complete"]`}
                    label={t("edit_feed.channel_field.complete")}
                  >
                    <FormField
                      id={`rss.channel.["itunes:complete"]`}
                      name={`rss.channel.["itunes:complete"]`}
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
                      emtpyValueButtonMessage={t(
                        "ui.forms.empty_field.message",
                      )}
                    />
                  </FormRow>

                  <FormRow
                    htmlFor={`rss.channel.["itunes:new-feed-url"]`}
                    label={t("edit_feed.channel_field.new_feed_url")}
                  >
                    <FormField
                      id={`rss.channel.["itunes:new-feed-url"]`}
                      name={`rss.channel.["itunes:new-feed-url"]`}
                      as={Input}
                      initValue="Jhon Doe"
                      emtpyValueButtonMessage={t(
                        "ui.forms.empty_field.message",
                      )}
                    />
                  </FormRow>
                </FormSection>
                <FormSection
                  title={t("edit_feed.ownership.title")}
                  description={t("edit_feed.ownership.title.description")}
                >
                  <FormRow
                    htmlFor={`rss.channel.copyright`}
                    label={t("edit_feed.channel_field.copyright")}
                  >
                    <FormField
                      id={`rss.channel.copyright`}
                      name={`rss.channel.copyright`}
                      as={Input}
                      initValue="© 2021 My Podcast"
                      emtpyValueButtonMessage={t(
                        "ui.forms.empty_field.message",
                      )}
                    />
                  </FormRow>
                  <FormRow
                    htmlFor={`rss.channel.["itunes:author"]`}
                    label={t("edit_feed.channel_field.author")}
                  >
                    <FormField
                      id={`rss.channel.["itunes:author"]`}
                      name={`rss.channel.["itunes:author"]`}
                      as={Input}
                      initValue="Jhon Doe"
                      emtpyValueButtonMessage={t(
                        "ui.forms.empty_field.message",
                      )}
                    />
                  </FormRow>

                  <FormObjectField
                    emtpyValueButtonMessage={t("ui.forms.empty_field.message")}
                    fieldName={`rss.channel.["itunes:owner"]`}
                    initValue={{
                      "itunes:name": "Jhon Doe",
                      "itunes:email": "jhon@doe.audio",
                    }}
                    label={t("edit_feed.channel_field.owner")}
                  >
                    <FormRow
                      htmlFor={`rss.channel.["itunes:owner"].name`}
                      label={t("edit_feed.channel_field.owner.name")}
                    >
                      <FormField
                        id={`rss.channel.["itunes:owner"].["itunes:name"]]`}
                        name={`rss.channel.["itunes:owner"].["itunes:name"]`}
                        as={Input}
                      />
                    </FormRow>
                    <FormRow
                      htmlFor={`rss.channel.["itunes:owner"].email`}
                      label={t("edit_feed.channel_field.owner.email")}
                    >
                      <FormField
                        id={`rss.channel.["itunes:owner"].["itunes:email"]]`}
                        name={`rss.channel.["itunes:owner"].["itunes:email"]`}
                        as={Input}
                      />
                    </FormRow>
                  </FormObjectField>
                </FormSection>
              </VStack>
            </>
          );
        }}
      </Formik>
    </>
  );
}
