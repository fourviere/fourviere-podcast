import UseCurrentFeed from "../../../hooks/use-current-feed";
import { useTranslation } from "react-i18next";
import VStack from "@fourviere/ui/lib/layouts/v-stack";
import Form, { Section } from "@fourviere/ui/lib/form";
import { Static, Type } from "@sinclair/typebox";
import { RSSItemSchema } from "@fourviere/core/lib/schema/rss/item";
import { Feed } from "@fourviere/core/lib/schema/feed";
import Img from "../../../components/form-fields/image/index";
import { ItunesItemSchema } from "@fourviere/core/lib/schema/itunes/item";
import { Item } from "@fourviere/core/lib/schema/item";

const payloadSchema = Type.Union([
  Type.Pick(RSSItemSchema, [
    "title", //-
    "description", //-
    "link",
    "guid", //-
    "pubDate", //-
    "author",
    "enclosure",
  ]),
  Type.Pick(ItunesItemSchema, ["itunes:image"]),
]);
type PayloadType = Static<typeof payloadSchema>;

export default function ItemGeneral({ index }: { index: number }) {
  const currentFeed = UseCurrentFeed();
  const { t } = useTranslation("feed", {
    keyPrefix: "forms.item",
  });
  const { t: tUtils } = useTranslation("utils", { keyPrefix: "" });

  if (!currentFeed || !currentFeed.feed.rss.channel.item?.[index]) {
    return null;
  }

  const formSections: Section<PayloadType>[] = [
    {
      title: undefined,
      description: t("presentation.description"),
      hideTitle: false,
      fields: [
        {
          id: "title",
          name: "title",
          label: t("presentation.fields.title.label"),
          type: "text",
          style: "2xl",
          component: "input",
          width: "1",
        },
        {
          id: "guid.#text",
          name: "guid.#text",
          label: t("presentation.fields.guid.label"),
          style: "sm",
          component: "uuid",
          width: "1",
        },
        {
          id: "author",
          name: "author",
          label: t("presentation.fields.author.label"),
          type: "text",
          component: "input",
          width: "1",
        },
      ],
    },
    {
      title: t("image.title"),
      description: t("image.description"),
      fields: [
        {
          id: "itunes:image.@.href",
          name: "itunes:image.@.href",
          label: t("image.fields.image.label"),
          hideLabel: true,
          component: Img,
          fieldProps: {
            feedId: currentFeed.feedId,
            itemId: currentFeed.feed.rss.channel.item[index],
          },
          width: "1",
        },
      ],
    },
    {
      title: t("description.title"),
      description: t("description.description"),
      fields: [
        {
          id: "description",
          name: "description",
          label: t("description.fields.description.label"),
          hideLabel: true,
          type: "text",
          component: "text",
          width: "1",
        },
      ],
    },
  ];

  return (
    <VStack wFull hFull>
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
        title={t("presentation.title")}
        sections={formSections}
        data={currentFeed.feed.rss.channel.item[index]}
        schema={payloadSchema}
      />
    </VStack>
  );
}
