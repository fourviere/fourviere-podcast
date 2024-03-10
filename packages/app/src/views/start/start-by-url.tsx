import { FunctionComponent, useState } from "react";
import feedStore from "../../store/feed/index";
import { Title } from "@fourviere/ui/lib/typography";
import Button from "@fourviere/ui/lib/button";
import { InputRaw } from "@fourviere/ui/lib/form/fields/input";
import { useFormik } from "formik";
import appStore from "../../store/app";

import {
  InvalidPodcastFeedError,
  InvalidXMLError,
} from "@fourviere/core/lib/errors";
import { useTranslation } from "react-i18next";
import VStack from "@fourviere/ui/lib/layouts/v-stack";
import HStack from "@fourviere/ui/lib/layouts/h-stack";

const URL_REGEX = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;

interface Props {
  done: () => void;
}

const StartByURL: FunctionComponent<Props> = ({ done }) => {
  const { t } = useTranslation("start");
  const { initProjectFromUrl } = feedStore((state) => state);
  const { addError } = appStore((state) => state);
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      url: "",
    },
    onSubmit: async (data) => {
      if (!URL_REGEX.test(data.url)) {
        addError(t("errors.invalid_url"));
        return;
      }
      setIsLoading(true);
      try {
        await initProjectFromUrl(data.url);
        done();
      } catch (e) {
        if (e instanceof InvalidXMLError) {
          addError(t("errors.invalid_xml"));
        } else if (e instanceof InvalidPodcastFeedError) {
          addError(t("invalid_podcast_feed"));
        } else {
          addError(t("errors.generic"));
        }
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <VStack paddingX="6" paddingY="6" spacing="7">
      <VStack spacing="3">
        <Title>{t("start_by_url.title")}</Title>

        <form onSubmit={formik.handleSubmit}>
          <HStack spacing="3">
            <InputRaw
              name="url"
              componentStyle="2xl"
              placeholder="https://example.com/feed.xml"
              onChange={formik.handleChange}
              value={formik.values.url}
            />

            <Button size="lg" type="submit" isLoading={isLoading}>
              {t("start_by_url.action")}
            </Button>
          </HStack>
        </form>
      </VStack>
    </VStack>
  );
};

export default StartByURL;
