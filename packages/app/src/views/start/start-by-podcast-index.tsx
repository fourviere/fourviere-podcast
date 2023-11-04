import { FunctionComponent, useEffect, useState } from "react";
import feedStore from "../../store/feed";
import { Container } from "@fourviere/ui/lib/box";
import { H1, Title } from "@fourviere/ui/lib/typography";
import Button from "@fourviere/ui/lib/button";
import Input from "@fourviere/ui/lib/form/fields/input";
import appStore from "../../store/app";
import { SubmitHandler, useForm } from "react-hook-form";
import { ImageLinkCard, ImageLinkCardContainer } from "@fourviere/ui/lib/cards";
import { usePodcastIndex } from "../../hooks/usePodcastIndex";

type Inputs = {
  term: string;
};

interface Props {
  done: () => void;
}

const StartByIndex: FunctionComponent<Props> = ({ done }) => {
  const { loadFeedFromUrl } = feedStore((state) => state);
  const { getTranslations } = appStore((state) => state);
  const {
    search,
    error: searchError,
    isLoading,
    feeds,
    resetFeeds,
  } = usePodcastIndex();
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string>();
  const t = getTranslations();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    search(data.term);
  };

  async function podcastSelect(feedUrl: string) {
    try {
      setIsImporting(true);
      await loadFeedFromUrl(feedUrl);
      resetFeeds();
      done();
    } catch (e: any) {
      console.error(e);
      // if (e instanceof InvalidXMLError) {
      //   setError(t["start.start_by_url.errors.invalid_xml"]);
      // } else if (e instanceof InvalidPodcastFeedError) {
      //   setError(t["start.start_by_url.errors.invalid_podcast_feed"]);
      // } else {
      //   setError(t["start.start_by_url.errors.generic"]);
      // }
    } finally {
      setIsImporting(false);
    }
  }

  return (
    <Container spaceY="lg" padding="5xl" wFull>
      <Title>{t["start.start_by_index.title"]}</Title>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Container flex="row-top" wFull spaceX="md">
          <Input
            size="2xl"
            placeholder="podcasting 2.0"
            {...register("term", {
              required: true,
            })}
          />

          <Button type="submit" isLoading={isLoading}>
            {t["start.start_by_index.action"]}
          </Button>
        </Container>
      </form>

      {feeds && !isImporting ? (
        <ImageLinkCardContainer>
          {feeds.slice(0, 20).map((feed) => (
            <ImageLinkCard
              key={feed.id}
              src={feed.artwork}
              onClick={() => podcastSelect(feed.url)}
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
