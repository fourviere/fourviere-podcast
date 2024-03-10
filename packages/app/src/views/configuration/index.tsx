import { FullPageColumnLayout } from "@fourviere/ui/lib/layouts/full-page";
import React from "react";
import SideMenu from "../../components/main-menu";
import useConfigurations from "../../hooks/use-configurations";
import { useTranslation } from "react-i18next";
import Form from "@fourviere/ui/lib/form";
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
                  id: "locale",
                  name: "locale",
                  label: t("locale.fields.language.label"),
                  component: "select",
                  options: { en: "English", fr: "Français", it: "Italiano" },
                },
              ],
            },
            {
              title: t("podcast_index.title"),
              description: t("podcast_index.description"),
              fields: [
                {
                  id: "services.podcastIndex.enabled",
                  name: "services.podcastIndex.enabled",
                  label: t("podcast_index.fields.enabled.label"),
                  component: "boolean",
                },
                {
                  id: "services.podcastIndex.apiKey",
                  name: "services.podcastIndex.apiKey",
                  label: t("podcast_index.fields.api_key.label"),
                  component: "input",
                  width: "1/2",
                },
                {
                  id: "services.podcastIndex.apiSecret",
                  name: "services.podcastIndex.apiSecret",
                  label: t("podcast_index.fields.api_secret.label"),
                  component: "input",
                  width: "1/2",
                  type: "password",
                },
              ],
            },
          ]}
          data={configurations as Schema}
          schema={schema}
        />
      </VStack>
    </FullPageColumnLayout>
  );
};

export default Configurations;
