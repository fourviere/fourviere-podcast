import UseCurrentFeed from "../../../hooks/use-current-feed";
import { useTranslation } from "react-i18next";
import VStack from "@fourviere/ui/lib/layouts/v-stack";
import Form, { Section } from "@fourviere/ui/lib/form";
import {
  Configuration as ConfigurationType,
  configurationSchema,
} from "../../../store/feed/types";
import { Type } from "@sinclair/typebox";

const schema = Type.Omit(configurationSchema, ["meta"]);
export default function Configuration() {
  const currentFeed = UseCurrentFeed();
  const { t } = useTranslation("feed", {
    keyPrefix: "forms.configuration",
  });
  const { t: tUtils } = useTranslation("utils", { keyPrefix: "" });

  if (!currentFeed) {
    return null;
  }

  const formSections: Section<Exclude<ConfigurationType, "meta">>[] = [
    {
      title: t("general.title"),
      description: t("general.description"),
      fields: [
        {
          id: `feed.filename`,
          name: `feed.filename`,
          label: t("general.fields.filename.label"),
          component: "input",
          width: "1",
        },
      ],
    },
    {
      title: t("remotes.title"),
      description: t("remotes.description"),
      fields: [
        {
          id: `remotes.remote`,
          name: `remotes.remote`,
          label: t("remotes.fields.remote.label"),
          component: "select",
          options: {
            none: t("remotes.fields.remote.options.none"),
            ftp: t("remotes.fields.remote.options.ftp"),
            s3: t("remotes.fields.remote.options.s3"),
          },
          width: "1",
        },
      ],
    },
    {
      title: t("s3.title"),
      description: t("s3.description"),
      hideWhen: (data) => data.remotes.remote !== "s3",
      fields: [
        {
          id: `remotes.s3.endpoint`,
          name: `remotes.s3.endpoint`,
          label: t("s3.fields.endpoint.label"),
          component: "input",
          width: "1",
        },
        {
          id: `remotes.s3.region`,
          name: `remotes.s3.region`,
          label: t("s3.fields.region.label"),
          component: "input",
          width: "1/2",
        },
        {
          id: `remotes.s3.bucket_name`,
          name: `remotes.s3.bucket_name`,
          label: t("s3.fields.bucket_name.label"),
          component: "input",
          width: "1/2",
        },
        {
          id: `remotes.s3.access_key`,
          name: `remotes.s3.access_key`,
          label: t("s3.fields.access_key.label"),
          component: "input",
          width: "1/2",
        },
        {
          id: `remotes.s3.secret_key`,
          name: `remotes.s3.secret_key`,
          label: t("s3.fields.secret_key.label"),
          component: "input",
          width: "1/2",
          type: "password",
        },
        {
          id: `remotes.s3.http_host`,
          name: `remotes.s3.http_host`,
          label: t("s3.fields.http_host.label"),
          component: "input",
          width: "1",
        },
        {
          id: `remotes.s3.path`,
          name: `remotes.s3.path`,
          label: t("s3.fields.path.label"),
          component: "input",
          width: "1",
        },

        {
          id: `remotes.s3.https`,
          name: `remotes.s3.https`,
          label: t("s3.fields.https.label"),
          component: "boolean",
          width: "1",
        },
      ],
    },
    {
      title: t("ftp.title"),
      description: t("ftp.description"),
      hideWhen: (data) => data.remotes.remote !== "ftp",
      fields: [
        {
          id: `remotes.ftp.host`,
          name: `remotes.ftp.host`,
          label: t("ftp.fields.host.label"),
          component: "input",
          width: "1/2",
        },
        {
          id: `remotes.ftp.port`,
          name: `remotes.ftp.port`,
          label: t("ftp.fields.port.label"),
          component: "input",
          type: "number",
          width: "1/2",
        },
        {
          id: `remotes.ftp.user`,
          name: `remotes.ftp.user`,
          label: t("ftp.fields.user.label"),
          component: "input",
          width: "1/2",
        },
        {
          id: `remotes.ftp.password`,
          name: `remotes.ftp.password`,
          label: t("ftp.fields.password.label"),
          component: "input",
          type: "password",
          width: "1/2",
        },
        {
          id: `remotes.ftp.http_host`,
          name: `remotes.ftp.http_host`,
          label: t("ftp.fields.http_host.label"),
          component: "input",
          width: "1",
        },
        {
          id: `remotes.ftp.path`,
          name: `remotes.ftp.path`,
          label: t("ftp.fields.path.label"),
          component: "input",
          width: "1",
        },
        {
          id: `remotes.ftp.https`,
          name: `remotes.ftp.https`,
          label: t("ftp.fields.https.label"),
          component: "boolean",
          width: "1",
        },
      ],
    },
  ];

  return (
    <VStack scroll wFull hFull>
      <Form<ConfigurationType>
        onSubmit={(values) => {
          currentFeed.updateConfiguration({
            ...values,
          });
        }}
        labels={{
          isSaving: tUtils("form.labels.isSaving"),
          save: tUtils("form.labels.save"),
          unsavedChanges: tUtils("form.labels.unsavedChanges"),
          hasErrors: tUtils("form.labels.hasErrors"),
        }}
        title={t("title")}
        sections={formSections}
        data={currentFeed.configuration}
        schema={schema}
      />
    </VStack>
  );
}
