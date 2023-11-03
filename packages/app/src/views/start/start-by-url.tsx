import { FunctionComponent, useEffect, useState } from "react";
import feedStore from "../../store/feed";
import { Container } from "@fourviere/ui/lib/box";
import { Title } from "@fourviere/ui/lib/typography";
import Button from "@fourviere/ui/lib/button";
import Input from "@fourviere/ui/lib/form/fields/input";
import appStore from "../../store/app";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
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
  const { getTranslations } = appStore((state) => state);
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const t = getTranslations();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Inputs>();

  const formData = useWatch({
    control,
  });

  useEffect(() => {
    setError(undefined);
  }, [formData]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);
    try {
      await loadFeedFromUrl(data.url);
      done();
    } catch (e: any) {
      if (e instanceof InvalidXMLError) {
        setError(t["start.start_by_url.errors.invalid_xml"]);
      } else if (e instanceof InvalidPodcastFeedError) {
        setError(t["start.start_by_url.errors.invalid_podcast_feed"]);
      } else {
        setError(t["start.start_by_url.errors.generic"]);
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
            error={!!errors?.url?.type || error || false}
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
