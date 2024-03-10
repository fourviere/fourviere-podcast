import { FunctionComponent, useState } from "react";
import feedStore from "../../store/feed/index";
import { H1, Title } from "@fourviere/ui/lib/typography";
import Button from "@fourviere/ui/lib/button";
import { InputRaw } from "@fourviere/ui/lib/form/fields/input";
import appStore from "../../store/app";
import { useFormik } from "formik";
import { usePodcastIndex } from "../../hooks/use-podcast-index";
import {
  InvalidPodcastFeedError,
  InvalidXMLError,
} from "@fourviere/core/lib/errors";
import { useTranslation } from "react-i18next";
import VStack from "@fourviere/ui/lib/layouts/v-stack";
import HStack from "@fourviere/ui/lib/layouts/h-stack";
import Grid from "@fourviere/ui/lib/layouts/grid";
import HCard from "@fourviere/ui/lib/cards/h-card";

interface Props {
  done: () => void;
}

const StartByIndex: FunctionComponent<Props> = ({ done }) => {
  const { t } = useTranslation("start", {
    keyPrefix: "start_by_podcast_index",
  });
  const { t: tErrors } = useTranslation("start", {
    keyPrefix: "errors",
  });
  const { initProjectFromUrl } = feedStore((state) => state);
  const { addError } = appStore((state) => state);
  const { search, isLoading, feeds, resetFeeds } = usePodcastIndex();
  const [isImporting, setIsImporting] = useState(false);

  const formik = useFormik({
    initialValues: {
      term: "",
    },
    onSubmit: async (data) => {
      await search(data.term);
    },
  });

  async function podcastSelect(feedUrl: string) {
    try {
      setIsImporting(true);
      await initProjectFromUrl(feedUrl);
      resetFeeds();
      done();
    } catch (e) {
      if (e instanceof InvalidXMLError) {
        addError(tErrors("errors.invalid_xml"));
      } else if (e instanceof InvalidPodcastFeedError) {
        addError(tErrors("errors.invalid_podcast_feed"));
      } else {
        addError(tErrors("errors.generic"));
      }
      console.error(e);
    } finally {
      setIsImporting(false);
    }
  }

  return (
    <VStack paddingX="6" paddingY="6" spacing="7">
      <VStack spacing="3">
        <Title>{t("title")}</Title>
        <form onSubmit={formik.handleSubmit}>
          <HStack spacing="3">
            <InputRaw
              componentStyle="2xl"
              placeholder="podcasting 2.0"
              name="term"
              onChange={formik.handleChange}
              value={formik.values.term}
            />

            <Button size="lg" type="submit" isLoading={isLoading}>
              {t("submit")}
            </Button>
          </HStack>
        </form>
      </VStack>

      {feeds && !isImporting ? (
        <Grid cols="1" mdCols="3" lgCols="4" spacing="4">
          {feeds.slice(0, 20).map((feed) => (
            <HCard
              as="button"
              key={feed.id}
              imageSrc={feed.artwork}
              title={feed.title}
              subtitle={feed.author}
              onClick={() => {
                void podcastSelect(feed.url);
              }}
            />
          ))}
        </Grid>
      ) : null}
      {isImporting && <H1>{t("importing_in_progress")}</H1>}
    </VStack>
  );
};

export default StartByIndex;
