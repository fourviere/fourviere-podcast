import { FunctionComponent, useState } from "react";
import feedStore from "../../store/feed/index";
import { Container } from "@fourviere/ui/lib/box";
import { Title } from "@fourviere/ui/lib/typography";
import Button from "@fourviere/ui/lib/button";
import Input from "@fourviere/ui/lib/form/fields/input";
import { useFormik } from "formik";
import appStore from "../../store/app";

import {
  InvalidPodcastFeedError,
  InvalidXMLError,
} from "@fourviere/core/lib/errors";

const URL_REGEX = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;

interface Props {
  done: () => void;
}

const StartByURL: FunctionComponent<Props> = ({ done }) => {
  const { initProjectFromUrl } = feedStore((state) => state);
  const { getTranslations, addError } = appStore((state) => state);
  const [isLoading, setIsLoading] = useState(false);
  const t = getTranslations();

  const formik = useFormik({
    initialValues: {
      url: "",
    },
    onSubmit: async (data) => {
      if (!URL_REGEX.test(data.url)) {
        addError(t["start.start_by_url.errors.invalid_url"]);
        return;
      }
      setIsLoading(true);
      try {
        await initProjectFromUrl(data.url);
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
        setIsLoading(false);
      }
    },
  });

  return (
    <Container spaceY="lg" padding="5xl" wFull>
      <Title>{t["start.start_by_url.title"]}</Title>

      <form onSubmit={formik.handleSubmit}>
        <Container flex="row-top" wFull spaceX="md">
          <Input
            size="2xl"
            name="url"
            placeholder="https://example.com/feed.xml"
            onChange={formik.handleChange}
            value={formik.values.url}
          />

          <Button size="lg" type="submit" isLoading={isLoading}>
            {t["start.start_by_url.action"]}
          </Button>
        </Container>
      </form>
    </Container>
  );
};

export default StartByURL;
