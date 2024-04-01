import UseCurrentFeed from "../../../hooks/use-current-feed";
import { useTranslation } from "react-i18next";
import VStack from "@fourviere/ui/lib/layouts/v-stack";
import Form, { Section } from "@fourviere/ui/lib/form";
import { v4 as uuidv4 } from "uuid";
import { Static, Type } from "@sinclair/typebox";
import { Feed } from "@fourviere/core/lib/schema/feed";
import { PodcastItemSchema } from "@fourviere/core/lib/schema/podcasting/item";
import { Item } from "@fourviere/core/lib/schema/item";

const payloadSchema = Type.Pick(PodcastItemSchema, ["podcast:value"]);

type PayloadType = Static<typeof payloadSchema>;

export default function ValueForValueItem({ index }: { index: number }) {
  const currentFeed = UseCurrentFeed();
  const { t } = useTranslation("feed", {
    keyPrefix: "forms.monetization.value_4_value",
  });
  const { t: tUtils } = useTranslation("utils", { keyPrefix: "" });

  if (!currentFeed || !currentFeed.feed.rss.channel.item?.[index]) {
    return null;
  }

  if (!currentFeed) {
    return null;
  }

  const formSections: Section<PayloadType>[] = [
    {
      title: t("title"),
      description: t("description"),
      hideTitle: false,
      fields: [
        {
          id: "podcast:value.@.type",
          name: "podcast:value.@.type",
          label: t("fields.type.label"),
          component: "select",
          options: {
            bitcoin: "Bitcoin",
            lightning: "Lightning",
          },
          width: "1/2",
        },
        {
          id: "podcast:value.@.method",
          name: "podcast:value.@.method",
          label: t("fields.method.label"),
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
          id: "podcast:value.@.suggested",
          name: "podcast:value.@.suggested",
          label: t("fields.suggested.label"),
          type: "text",
          style: "sm",
          component: "input",
          width: "1/2",
        },
      ],
    },
    {
      title: t("recipient_title"),
      description: t("recipient_description"),
      fields: [
        {
          id: "podcast:value.podcast:valueRecipient",
          name: "podcast:value.podcast:valueRecipient",
          hideLabel: true,
          label: t("recipient_title"),
          component: "array",
          defaultItem: {
            "@": {
              address: "",
              customKey: "",
              customValue: "",
              name: "",
              split: 1,
              type: "node",
            },
            __k: uuidv4(),
          },
          childrenFields: [
            {
              id: "@.name",
              name: "@.name",
              label: t("fields.recipient_name.label"),
              component: "input",
              width: "1",
            },
            {
              id: "@.type",
              name: "@.type",
              label: t("fields.recipient_type.label"),
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
              label: t("fields.recipient_address.label"),
              component: "input",
              width: "1/2",
            },
            {
              id: "@.split",
              name: "@.split",
              label: t("fields.recipient_split.label"),
              component: "input",
              type: "number",
              width: "1/2",
            },
            {
              id: "@.fee",
              name: "@.fee",
              label: t("fields.recipient_fee.label"),
              component: "boolean",
              width: "1/2",
            },
            {
              id: "@.customKey",
              name: "@.customKey",
              label: t("fields.recipient_custom_key.label"),
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
              label: t("fields.recipient_custom_value.label"),
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
          try {
            const data = JSON.parse(JSON.stringify(currentFeed.feed)) as Feed;

            if (!data.rss.channel.item) {
              data.rss.channel.item = [];
            }

            data.rss.channel.item[index] = values as Item;
            data.rss.channel.item[index].pubDate = new Date().toUTCString();

            currentFeed.update(data);
          } catch (e) {
            console.error(e);
          }
        }}
        labels={{
          isSaving: tUtils("form.labels.isSaving"),
          save: tUtils("form.labels.save"),
          unsavedChanges: tUtils("form.labels.unsavedChanges"),
          hasErrors: tUtils("form.labels.hasErrors"),
        }}
        title={t("title")}
        sections={formSections}
        data={currentFeed.feed.rss.channel.item[index]}
        schema={payloadSchema}
      />
    </VStack>
  );
}
