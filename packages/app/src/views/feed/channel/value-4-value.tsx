import UseCurrentFeed from "../../../hooks/use-current-feed";
import { useTranslation } from "react-i18next";
import VStack from "@fourviere/ui/lib/layouts/v-stack";
import Form, { Section } from "@fourviere/ui/lib/form";
import { v4 as uuidv4 } from "uuid";
import { Static, Type } from "@sinclair/typebox";
import { Feed } from "@fourviere/core/lib/schema/feed";
import { PodcastChannelSchema } from "@fourviere/core/lib/schema/podcasting/channel";

const payloadSchema = Type.Object({
  rss: Type.Object({
    channel: Type.Pick(PodcastChannelSchema, ["podcast:value"]),
  }),
});
type PayloadType = Static<typeof payloadSchema>;

export default function ValueForValue() {
  const currentFeed = UseCurrentFeed();
  const { t } = useTranslation("feed", {
    keyPrefix: "forms",
  });
  const { t: tUtils } = useTranslation("utils", { keyPrefix: "" });

  if (!currentFeed) {
    return null;
  }

  const formSections: Section<PayloadType>[] = [
    {
      title: t("monetization.funding.title"),
      description: t("monetization.funding.description"),
      fields: [
        {
          id: "rss.channel.podcast:funding",
          name: "rss.channel.podcast:funding",
          hideLabel: true,
          label: t("monetization.funding.title"),
          component: "array",
          defaultItem: {
            "@": {
              url: "",
            },
            "#text": "",
            __k: uuidv4(),
          },
          childrenFields: [
            {
              id: "@.url",
              name: "@.url",
              label: t("monetization.funding.fields.url.label"),
              component: "input",
              width: "1/2",
            },
            {
              id: "#text",
              name: "#text",
              label: t("monetization.funding.fields.description.label"),
              component: "input",
              width: "1/2",
            },
          ],
          width: "1",
        },
      ],
    },
    {
      title: t("monetization.value_4_value.title"),
      description: t("monetization.value_4_value.description"),
      hideTitle: false,
      fields: [
        {
          id: "rss.channel.podcast:value.@.type",
          name: "rss.channel.podcast:value.@.type",
          label: t("monetization.value_4_value.fields.type.label"),
          component: "select",
          options: {
            bitcoin: "Bitcoin",
            lightning: "Lightning",
          },
          width: "1/2",
        },
        {
          id: "rss.channel.podcast:value.@.method",
          name: "rss.channel.podcast:value.@.method",
          label: t("monetization.value_4_value.fields.method.label"),
          options: {
            keysend: "Keysend",
            amp: "Amp",
            wallet: "Wallet",
            node: "Node",
          },
          component: "select",
          width: "1/2",
        },
        {
          id: "rss.channel.podcast:value.@.suggested",
          name: "rss.channel.podcast:value.@.suggested",
          label: t("monetization.value_4_value.fields.suggested.label"),
          type: "text",
          style: "sm",
          component: "input",
          width: "1/2",
        },
      ],
    },
    {
      title: t("monetization.value_4_value.recipient_title"),
      description: t("monetization.value_4_value.recipient_description"),
      fields: [
        {
          id: "rss.channel.podcast:value.podcast:valueRecipient",
          name: "rss.channel.podcast:value.podcast:valueRecipient",
          hideLabel: true,
          label: t("value_4_value.recipient_title"),
          component: "array",
          defaultItem: {
            "@": {
              address: "",
              customKey: "",
              customValue: "",
              name: "",
              split: 1,
              type: "node",
              __k: uuidv4(),
            },
          },
          childrenFields: [
            {
              id: "@.name",
              name: "@.name",
              label: t(
                "monetization.value_4_value.fields.recipient_name.label",
              ),
              component: "input",
              width: "1",
            },
            {
              id: "@.type",
              name: "@.type",
              label: t(
                "monetization.value_4_value.fields.recipient_type.label",
              ),
              options: {
                keysend: "Keysend",
                amp: "Amp",
                wallet: "Wallet",
                node: "Node",
              },
              component: "select",
              width: "1/2",
            },
            {
              id: "@.address",
              name: "@.address",
              label: t(
                "monetization.value_4_value.fields.recipient_address.label",
              ),
              component: "input",
              width: "1/2",
            },
            {
              id: "@.split",
              name: "@.split",
              label: t(
                "monetization.value_4_value.fields.recipient_split.label",
              ),
              component: "input",
              width: "1/2",
              type: "number",
            },
            {
              id: "@.fee",
              name: "@.fee",
              label: t("monetization.value_4_value.fields.recipient_fee.label"),
              component: "boolean",
              width: "1/2",
            },
            {
              id: "@.customKey",
              name: "@.customKey",
              label: t(
                "monetization.value_4_value.fields.recipient_custom_key.label",
              ),
              options: {
                696969: "LNPAY destination",
                818818: "Hive account name",
                7629168: "Tip note / destination",
                7629169: "JSON encoded metadata (7629169)",
                7629171: "Tipping	variable	Tip note / destination",
                7629173: "Podcast (WIP) standard (7629173)",
                7629175: "PodcastIndex ID or GUID (7629175)",
                34349334: "Chat message	Whatsat and more",
                34349337: "Signature",
                34349339: "Send pubkey	Whatsat and more",
                34349340: "Thunder Hub Sending Node Name",
                34349343: "Timestamp",
                34349345: "Thunder Hub Content",
                34349347: "Thunder Hub Request",
                5482373484: "Preimage",
                133773310: "JSON encoded metadata (133773310)",
                112111100: "LND Wallet id",
              },
              component: "select",
              width: "1/2",
            },
            {
              id: "@.customValue",
              name: "@.customValue",
              label: t(
                "monetization.value_4_value.fields.recipient_custom_value.label",
              ),
              component: "input",
              width: "1/2",
            },
          ],
          width: "1",
        },
      ],
    },
  ];

  return (
    <VStack scroll wFull hFull>
      <Form<PayloadType>
        onSubmit={(values) => {
          currentFeed.update(values as Feed);
        }}
        labels={{
          isSaving: tUtils("form.labels.isSaving"),
          save: tUtils("form.labels.save"),
          unsavedChanges: tUtils("form.labels.unsavedChanges"),
          hasErrors: tUtils("form.labels.hasErrors"),
        }}
        title={t("monetization.title")}
        sections={formSections}
        data={currentFeed.feed}
        schema={payloadSchema}
      />
    </VStack>
  );
}
