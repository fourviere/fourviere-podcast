import { FunctionComponent, useState } from "react";
import feedStore from "../../store/feed";
import { Container } from "@fourviere/ui/lib/box";
import { Title } from "@fourviere/ui/lib/typography";
import Button from "@fourviere/ui/lib/button";
import Input from "@fourviere/ui/lib/form/fields/input";
import appStore from "../../store/app";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  InvalidPodcastFeedError,
  InvalidXMLError,
} from "@fourviere/core/lib/errors";

const URL_REGEX = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;

type Inputs = {
  url: string;
};

interface Props {
  done: () => void;
}

const StartByURL: FunctionComponent<Props> = ({ done }) => {
  const { loadFeedFromUrl } = feedStore((state) => state);
  const { getTranslations, addError } = appStore((state) => state);
  const [isLoading, setIsLoading] = useState(false);
  const t = getTranslations();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);
    try {
      await loadFeedFromUrl(data.url);
      done();
    } catch (e: any) {
      if (e instanceof InvalidXMLError) {
        addError(t["start.start_by_url.errors.invalid_xml"]);
      } else if (e instanceof InvalidPodcastFeedError) {
        addError(t["start.start_by_url.errors.invalid_podcast_feed"]);
      } else {
        addError(t["start.start_by_url.errors.generic"]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container spaceY="lg" padding="5xl" wFull>
      <Title>{t["start.start_by_url.title"]}</Title>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Container flex="row-top" wFull spaceX="md">
          <Input
            size="2xl"
            placeholder="https://example.com/feed.xml"
            error={
              errors?.url?.type && t["start.start_by_url.errors.invalid_url"]
            }
            {...register("url", {
              required: true,
              pattern: URL_REGEX,
            })}
          />

          <Button type="submit" isLoading={isLoading}>
            {t["start.start_by_url.action"]}
          </Button>
        </Container>
      </form>
    </Container>
  );
};

export default StartByURL;
