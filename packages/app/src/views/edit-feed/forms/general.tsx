import UseCurrentFeed from "../../../hooks/use-current-feed";
import { useTranslation } from "react-i18next";
import Img from "../../../components/form-fields/image/index";
import { LANGUAGE_BY_LOCALE } from "@fourviere/core/lib/const";
import VStack from "@fourviere/ui/lib/layouts/v-stack";
import Form, { Section } from "@fourviere/ui/lib/form";
import { RSSChannelSchema } from "@fourviere/core/lib/schema/rss/channel";

import { Static, Type } from "@sinclair/typebox";
import { v4 as uuidv4 } from "uuid";
import { Feed } from "@fourviere/core/lib/schema/feed";
import PODCAST_CATEGORIES from "@fourviere/core/lib/podcast-namespace/categories";
import { ItunesChannelSchema } from "@fourviere/core/lib/schema/itunes/channel";

const payloadSchema = Type.Object({
  rss: Type.Object({
    channel: Type.Intersect([
      Type.Omit(RSSChannelSchema, ["pubDate", "lastBuildDate"]),
      Type.Pick(ItunesChannelSchema, ['"itunes:type"', '"itunes:explicit"']),
    ]),
  }),
});
type PayloadType = Static<typeof payloadSchema>;

export default function General() {
  const currentFeed = UseCurrentFeed();
  const { t } = useTranslation("feed", {
    keyPrefix: "forms.general",
  });
  const { t: tUtils } = useTranslation("utils", { keyPrefix: "" });

  if (!currentFeed) {
    return null;
  }

  const formSections: Section[] = [
    {
      title: null,
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
      ],
    },
    {
      title: t("ownership.title"),
      description: t("ownership.description"),
      fields: [
        {
          id: "rss.channel.webmaster",
          name: "rss.channel.webmaster",
          label: t("ownership.fields.webmaster.label"),
          component: "input",
          width: "1/2",
          style: "sm",
        },
        {
          id: "rss.channel.managingEditor",
          name: "rss.channel.managingEditor",
          label: t("ownership.fields.managingEditor.label"),
          component: "input",
          width: "1/2",
          style: "sm",
        },
        {
          id: "rss.channel.copyright",
          name: "rss.channel.copyright",
          label: t("ownership.fields.copyright.label"),
          component: "input",
          width: "1",
          style: "sm",
        },
      ],
    },
    {
      title: t("category.title"),
      description: t("category.description"),
      fields: [
        {
          id: "rss.channel.category",
          name: "rss.channel.category",
          label: t("category.fields.category.label"),
          component: "array",
          defaultItem: { _: "" },
          childrenFields: [
            {
              id: "",
              name: "",
              label: t("category.fields.category.label"),
              component: "select",
              options: PODCAST_CATEGORIES.reduce(
                (a, e) => ({
                  ...a,
                  [e.name]: e.name,
                }),
                {},
              ),
              width: "1",
            },
          ],
        },
      ],
    },
    {
      title: t("links.title"),
      description: t("links.description"),
      fields: [
        {
          id: "rss.channel.link",
          name: "rss.channel.link",
          label: t("links.title"),
          component: "array",
          defaultItem: {
            "@": {
              href: "https://www.fourviere.io",
              type: "application/rss+xml",
              rel: "last",
              __k: uuidv4(),
            },
          },
          childrenFields: [
            {
              id: "@.href",
              name: "@.href",
              label: t("links.fields.link_href.label"),
              component: "input",
              width: "1/2",
            },
            {
              id: "@.type",
              name: "@.type",
              label: t("links.fields.link_type.label"),
              component: "input",
              width: "1/2",
            },
            {
              id: "@.rel",
              name: "@.rel",
              label: t("links.fields.link_rel.label"),
              component: "input",
              width: "1/2",
            },
          ],
          width: "1",
        },
      ],
    },
    {
      title: t("feedTTLUpdateFrequency.title"),
      description: t("feedTTLUpdateFrequency.description"),
      fields: [
        {
          id: "rss.channel.skipDays",
          name: "rss.channel.skipDays",
          label: t("feedTTLUpdateFrequency.fields.skipDays.label"),
          component: "array",
          width: "1/2",
          style: "sm",
          defaultItem: { day: "Monday" },
          childrenFields: [
            {
              id: "day",
              name: "day",
              label: null,
              component: "select",
              options: {
                "": "",
                Monday: tUtils("weekdays.monday"),
                Tuesday: tUtils("weekdays.tuesday"),
                Wednesday: tUtils("weekdays.wednesday"),
                Thursday: tUtils("weekdays.thursday"),
                Friday: tUtils("weekdays.friday"),
                Saturday: tUtils("weekdays.saturday"),
                Sunday: tUtils("weekdays.sunday"),
              },
              width: "1",
              style: "sm",
            },
          ],
        },
        {
          id: "rss.channel.skipHours",
          name: "rss.channel.skipHours",
          label: t("feedTTLUpdateFrequency.fields.skipHours.label"),
          component: "array",
          width: "1/2",
          style: "sm",
          defaultItem: { hour: 0 },
          childrenFields: [
            {
              id: "hour",
              name: "hour",
              label: null,
              component: "input",
              type: "number",
              fieldProps: {
                min: 0,
                max: 23,
              },
              width: "1",
              style: "sm",
            },
          ],
        },
        {
          id: "rss.channel.ttl",
          name: "rss.channel.ttl",
          label: t("feedTTLUpdateFrequency.fields.ttl.label"),
          component: "input",
          width: "1",
          style: "sm",
          type: "number",
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
        title={t("presentation.title")}
        sections={formSections}
        data={currentFeed.feed}
        schema={payloadSchema}
      />
    </VStack>
  );
}
