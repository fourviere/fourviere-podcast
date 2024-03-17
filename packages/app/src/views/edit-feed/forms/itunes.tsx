import UseCurrentFeed from "../../../hooks/use-current-feed";
import { useTranslation } from "react-i18next";
import Img from "../../../components/form-fields/image/index";
import VStack from "@fourviere/ui/lib/layouts/v-stack";
import Form, { Section } from "@fourviere/ui/lib/form";
import { Static, Type } from "@sinclair/typebox";
import { Feed } from "@fourviere/core/lib/schema/feed";
import { ItunesChannelSchema } from "@fourviere/core/lib/schema/itunes/channel";
import itunesCategories from "@fourviere/core/lib/apple/categories";
import jsonpath from "jsonpath";
import { extractIterationNumberFtomJsonPath } from "@fourviere/ui/lib/form/utils";

const payloadSchema = Type.Object({
  rss: Type.Object({
    channel: Type.Intersect([
      Type.Omit(ItunesChannelSchema, ['"itunes:type"', '"itunes:explicit"']),
    ]),
  }),
});
type PayloadType = Static<typeof payloadSchema>;

export default function Itunes() {
  const currentFeed = UseCurrentFeed();
  const { t } = useTranslation("feed", {
    keyPrefix: "forms.itunes",
  });
  const { t: tUtils } = useTranslation("utils", { keyPrefix: "" });

  if (!currentFeed) {
    return null;
  }

  const formSections: Section[] = [
    {
      title: t("image.title"),
      description: t("image.description"),
      fields: [
        {
          id: `rss.channel["itunes:image"].@.href`,
          name: `rss.channel["itunes:image"].@.href`,
          label: t("image.fields.image.label"),
          component: Img,
          hideLabel: true,
          fieldProps: {
            feedId: currentFeed.feedId,
          },
          width: "1",
        },
      ],
    },
    {
      title: t("ownership.title"),
      description: t("ownership.description"),
      fields: [
        {
          id: `rss.channel.itunes:owner.itunes:name`,
          name: `rss.channel.itunes:owner.itunes:name`,
          label: t("ownership.fields.itunes_owner.itunes_name.label"),
          component: "input",
          width: "1/2",
        },
        {
          id: `rss.channel.itunes:owner.itunes:email`,
          name: `rss.channel.itunes:owner.itunes:email`,
          label: t("ownership.fields.itunes_owner.itunes_email.label"),
          component: "input",
          width: "1/2",
        },
        {
          id: `rss.channel.itunes:author`,
          name: `rss.channel.itunes:author`,
          label: t("ownership.fields.itunes_author.label"),
          component: "input",
          width: "1",
        },
      ],
    },
    {
      title: t("category.title"),
      description: t("category.description"),
      fields: [
        {
          id: `rss.channel["itunes:category"]`,
          name: `rss.channel.itunes:category`,
          label: t("category.fields.itunes_category.label"),
          component: "array",
          hideLabel: true,
          defaultItem: { "@": { text: "" } },
          childrenFields: [
            {
              id: "@.text",
              name: "@.text",
              label: t("category.fields.category.label"),
              component: "select",
              hideLabel: true,
              options: itunesCategories.reduce(
                (a, e) => ({ ...a, [e.category]: e.category }),
                {},
              ),
              width: "1/2",
            },
            {
              id: `["itunes:category"].@.text`,
              name: `["itunes:category"].@.text`,
              label: t("category.fields.category.label"),
              component: "select",
              hideLabel: true,
              width: "1/2",
              hideIfOptionsIsEmpty: true,
              options: (e, data) => {
                // Filter the subcategories basing on the selected category
                const iteration = extractIterationNumberFtomJsonPath(e);

                const d = jsonpath.query(
                  data,
                  `$..rss.channel['itunes:category'].${iteration}['@'].text`,
                )?.[0] as string;

                return (
                  itunesCategories
                    .find((e) => e.category === d)
                    ?.subcategories.reduce((a, e) => ({ ...a, [e]: e }), {}) ||
                  {}
                );
              },
            },
          ],
        },
      ],
    },
    {
      title: t("technical.title"),
      description: t("technical.description"),
      fields: [
        {
          id: `rss.channel["tunes:new-feed-url"]`,
          name: `rss.channel["tunes:new-feed-url"]`,
          label: t("technical.fields.itunes_new_feed_url.label"),
          component: "input",
          width: "1",
        },
        {
          id: `rss.channel["itunes:block]`,
          name: `rss.channel["itunes:block]`,
          label: t("technical.fields.itunes_block.label"),
          component: "select",
          options: { yes: "Yes", no: "No" },
          width: "1/2",
        },
        {
          id: `rss.channel["itunes:complete]`,
          name: `rss.channel["itunes:complete]`,
          label: t("technical.fields.itunes_complete.label"),
          component: "select",
          options: { yes: "Yes", no: "No" },
          width: "1/2",
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
        title={t("title")}
        sections={formSections}
        data={currentFeed.feed}
        schema={payloadSchema}
      />
    </VStack>
  );
}
