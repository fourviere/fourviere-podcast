import UseCurrentFeed from "../../../hooks/use-current-feed";
import { useTranslation } from "react-i18next";
import Img from "../../../components/form-fields/image/index";
import { LANGUAGE_BY_LOCALE } from "@fourviere/core/lib/const";
import VStack from "@fourviere/ui/lib/layouts/v-stack";
import Form from "@fourviere/ui/lib/form";
import {
  descriptionSchema,
  imageSchema,
  titleSchema,
} from "@fourviere/core/lib/schema/rss/channel";
import { Static, Type } from "@sinclair/typebox";
import { FeedState } from "../../../store/feed";
import { Feed } from "@fourviere/core/lib/schema/feed";

const payloadSchema = Type.Object({
  rss: Type.Object({
    channel: Type.Object({
      title: titleSchema,
      image: imageSchema,
      description: descriptionSchema,
      // category: categorySchema,
    }),
  }),
});
type PayloadType = Static<typeof payloadSchema>;

export default function General() {
  const currentFeed = UseCurrentFeed();
  const { t } = useTranslation("feed", {
    keyPrefix: "forms.general",
  });

  if (!currentFeed) {
    return null;
  }

  return (
    <VStack scroll wFull>
      <Form<PayloadType>
        onSubmit={(values) => {
          currentFeed.update(values);
        }}
        title={t("presentation.title")}
        sections={[
          {
            title: t("presentation.title"),
            description: t("presentation.description"),
            hideTitle: false,
            fields: [
              {
                id: "rss.channel.title",
                name: "rss.channel.title",
                label: t("presentation.fields.title.label"),
                type: "text",
                style: "2xl",
                component: "input",
                width: "1",
              },

              // {
              //   id: "rss.channel.link",
              //   name: "rss.channel.link",
              //   label: t("channellinks"),
              //   // component: ChannelLinks,
              //   component: "inpu",
              //   width: "1",
              // },
              // {
              //   id: "rss.channel.category.0",
              //   name: "rss.channel.category.0",
              //   label: t("podcast_index.fields.api_key.label"),
              //   type: "select",
              //   defaultValue: "",
              //   // component: Select as FC,
              //   component: Input,
              //   fieldProps: {
              //     options: PODCASTCATEGORIES,
              //     labelProperty: "name",
              //     keyProperty: "name",
              //   },
              //   width: "1",
              // },
            ],
          },
          {
            title: t("image.title"),
            description: t("image.description"),
            fields: [
              {
                id: "rss.channel.image.url",
                name: "rss.channel.image.url",
                label: t("image.fields.image.label"),
                component: Img,
                fieldProps: {
                  feedId: currentFeed.feedId,
                },
                width: "1",
              },
            ],
          },
          {
            title: t("presentation_tags.title"),
            description: t("presentation_tags.description"),
            fields: [
              {
                id: "rss.channel.['itunes:type']",
                name: "rss.channel.['itunes:type']",
                label: t("presentation_tags.fields.type.label"),
                component: "select",
                options: { episodic: "Episodic", serial: "Serial" },
                width: "1/2",
              },
              {
                id: "rss.channel.['itunes:explicit']",
                name: "rss.channel.['itunes:explicit']",
                label: t("presentation_tags.fields.explicit.label"),
                component: "select",
                options: { yes: "Yes", no: "No" },
                width: "1/2",
              },

              {
                id: "rss.channel.language",
                name: "rss.channel.language",
                label: t("presentation_tags.fields.language.label"),
                component: "select",
                options: LANGUAGE_BY_LOCALE,
                width: "1/2",
              },
              {
                id: "rss.channel.link",
                name: "rss.channel.link",
                label: t("channellinks"),
                component: "array",
                width: "1",
              },
            ],
          },
        ]}
        data={currentFeed.feed as PayloadType}
        schema={payloadSchema}
      />
      {/* <Formik
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
      </Formik> */}
    </VStack>
  );
}
