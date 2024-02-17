import { FunctionComponent, useState } from "react";
import feedStore from "../../store/feed/index";
import { Container } from "@fourviere/ui/lib/box";
import { H1, Title } from "@fourviere/ui/lib/typography";
import Button from "@fourviere/ui/lib/button";
import Input from "@fourviere/ui/lib/form/fields/input";
import appStore from "../../store/app";
import { useFormik } from "formik";
import { ImageLinkCard, ImageLinkCardContainer } from "@fourviere/ui/lib/cards";
import { usePodcastIndex } from "../../hooks/use-podcast-index";
import {
  InvalidPodcastFeedError,
  InvalidXMLError,
} from "@fourviere/core/lib/errors";

interface Props {
  done: () => void;
}

const StartByIndex: FunctionComponent<Props> = ({ done }) => {
  const { loadFeedFromUrl } = feedStore((state) => state);
  const { getTranslations, addError } = appStore((state) => state);
  const { search, isLoading, feeds, resetFeeds } = usePodcastIndex();
  const [isImporting, setIsImporting] = useState(false);
  const t = getTranslations();

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
      await loadFeedFromUrl(feedUrl);
      resetFeeds();
      done();
    } catch (e) {
      if (e instanceof InvalidXMLError) {
        addError(t["start.start_by_url.errors.invalid_xml"]);
      } else if (e instanceof InvalidPodcastFeedError) {
        addError(t["start.start_by_url.errors.invalid_podcast_feed"]);
      } else {
        addError(t["start.start_by_url.errors.generic"]);
      }
      console.error(e);
    } finally {
      setIsImporting(false);
    }
  }

  return (
    <Container spaceY="lg" padding="5xl" wFull>
      <Title>{t["start.start_by_index.title"]}</Title>

      <form onSubmit={formik.handleSubmit}>
        <Container flex="row-top" wFull spaceX="md">
          <Input
            size="2xl"
            placeholder="podcasting 2.0"
            name="term"
            onChange={formik.handleChange}
            value={formik.values.term}
          />

          <Button size="lg" type="submit" isLoading={isLoading}>
            {t["start.start_by_index.action"]}
          </Button>
        </Container>
      </form>

      {feeds && !isImporting ? (
        <ImageLinkCardContainer>
          {feeds.slice(0, 20).map((feed) => (
            <ImageLinkCard
              theme="light"
              key={feed.id}
              src={feed.artwork}
              onClick={() => {
                void podcastSelect(feed.url);
              }}
            />
          ))}
        </ImageLinkCardContainer>
      ) : null}

      {isImporting && (
        <Container padding="md">
          <H1>{t["start.start_by_index.importing_in_progress"]}</H1>
        </Container>
      )}
    </Container>
  );
};

export default StartByIndex;
