import { FullPageColumnLayout } from "@fourviere/ui/lib/layouts/full-page";
import React from "react";
import SideMenu from "../../components/main-menu";
import Input from "@fourviere/ui/lib/form/fields/input";
import useConfigurations from "../../hooks/use-configurations";
import Select from "@fourviere/ui/lib/form/fields/select";
import Boolean from "@fourviere/ui/lib/form/fields/boolean";
import { useTranslation } from "react-i18next";
import Form from "./Form";
import i18n from "../../i18n";
import { AppState } from "../../store/app";
import VStack from "@fourviere/ui/lib/layouts/v-stack";
import { Static, Type } from "@sinclair/typebox";

interface Props {}

const schema = Type.Object({
  locale: Type.String(),
  services: Type.Object({
    podcastIndex: Type.Union([
      Type.Object({
        enabled: Type.Literal(true),
        apiKey: Type.String({ default: "", minLength: 4 }),
        apiSecret: Type.String({ default: "", minLength: 4 }),
      }),
      Type.Object({
        enabled: Type.Literal(false),
      }),
    ]),
  }),
});
type Schema = Static<typeof schema>;

const Configurations: React.FC<Props> = () => {
  const { configurations, update } = useConfigurations();
  const { t } = useTranslation("configuration", {
    keyPrefix: "index",
  });
  return (
    <FullPageColumnLayout>
      <SideMenu />
      <VStack scroll wFull>
        <Form<Schema>
          onSubmit={(values: Schema) => {
            update(values as AppState);
            i18n.changeLanguage(values.locale);
          }}
          title={t("title")}
          sections={[
            {
              title: t("locale.title"),
              description: t("locale.description"),
              fields: [
                {
                  id: "configurations.currentLanguage",
                  name: "locale",
                  label: t("locale.fields.language.label"),
                  type: "select",
                  defaultValue: "en",
                  component: Select,
                  fieldProps: {
                    options: [
                      { value: "en", name: "English" },
                      { value: "fr", name: "Français" },
                      { value: "it", name: "Italiano" },
                    ],
                    labelProperty: "name",
                    keyProperty: "value",
                  },
                },
              ],
            },
            {
              title: t("podcast_index.title"),
              description: t("podcast_index.description"),
              fields: [
                {
                  id: "configurations.services.podcastIndex.enabled",
                  name: "services.podcastIndex.enabled",
                  label: t("podcast_index.fields.enabled.label"),
                  type: "boolean",
                  defaultValue: false,
                  component: Boolean,
                },
                {
                  id: "configurations.services.podcastIndex.apiKey",
                  name: "services.podcastIndex.apiKey",
                  label: t("podcast_index.fields.api_key.label"),
                  type: "input",
                  defaultValue: "",
                  component: Input,
                },
                {
                  id: "configurations.services.podcastIndex.apiSecret",
                  name: "services.podcastIndex.apiSecret",
                  label: t("podcast_index.fields.api_secret.label"),
                  type: "input",
                  defaultValue: "",
                  component: Input,
                },
              ],
            },
          ]}
          data={configurations as Schema}
          schema={schema}
        />
      </VStack>
      {/* <Formik
        initialValues={configurations}
        enableReinitialize
        onSubmit={(values, { setSubmitting }) => {
          update(values);
          i18n.changeLanguage(values.locale);
          setSubmitting(false);
        }}
      >
        {({ handleSubmit, setFieldValue, values, dirty, isSubmitting }) => {
          return (
            <VStack scroll wFull as="form" onSubmit={handleSubmit}>
              <FormBlocker dirty={dirty} />

              <ContainerTitle
                isDirty={dirty}
                isSubmitting={isSubmitting}
                onSave={() => handleSubmit()}
              >
                {t("title")}
              </ContainerTitle>

              <FormSection
                title={t("locale.title")}
                description={t("locale.description")}
              >
                <FormRow
                  htmlFor="configurations.currentLanguage"
                  label={t("locale.fields.language.label")}
                >
                  <FormField
                    id="locale"
                    name="locale"
                    as={Select as FC}
                    fieldProps={{
                      options: [
                        { value: "en", name: "English" },
                        { value: "fr", name: "Français" },
                        { value: "it", name: "Italiano" },
                      ],
                      labelProperty: "name",
                      keyProperty: "value",
                    }}
                  />
                </FormRow>
              </FormSection>
              <FormSection
                title={t("podcast_index.title")}
                description={t("podcast_index.description")}
              >
                <FormRow htmlFor="services.podcastIndex.enabled">
                  <FormField
                    id="services.podcastIndex.enabled"
                    name="services.podcastIndex.enabled"
                    fieldProps={{
                      label: t("podcast_index.fields.enabled.label"),
                      setFieldValue,
                      value: values.services.podcastIndex.enabled,
                    }}
                    as={Boolean}
                  />
                </FormRow>
                <FormRow
                  htmlFor="configurations.services.podcastIndex.apiKey"
                  label={t("podcast_index.fields.api_key.label")}
                >
                  <FormField
                    id="services.podcastIndex.apiKey"
                    name="services.podcastIndex.apiKey"
                    as={Input}
                    initValue="1234"
                    emtpyValueButtonMessage={t("ui.forms.empty_field.message")}
                  />
                </FormRow>
                <FormRow
                  htmlFor="configurations.services.podcastIndex.apiSecret"
                  label={t("podcast_index.fields.api_secret.label")}
                >
                  <FormField
                    id="services.podcastIndex.apiSecret"
                    name="services.podcastIndex.apiSecret"
                    fieldProps={{
                      type: "password",
                    }}
                    initValue="1234"
                    emtpyValueButtonMessage={t("ui.forms.empty_field.message")}
                    as={Input}
                  />
                </FormRow>
              </FormSection>
            </VStack>
          );
        }}
      </Formik> */}
    </FullPageColumnLayout>
  );
};

export default Configurations;
