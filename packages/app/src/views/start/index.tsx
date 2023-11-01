import { FunctionComponent } from "react";
import { H1, H1Link } from "@fourviere/ui/lib/typography";
import { ImageLinkCard, ImageLinkCardContainer } from "@fourviere/ui/lib/cards";
import { BoxCol, HalfPageBox } from "@fourviere/ui/lib/box";
import FullPageLayoutBackground from "@fourviere/ui/lib/layouts/full-page";
import appStore from "../../store/app";
import feedStore from "../../store/feed";

interface StartViewProps {}

const StartView: FunctionComponent<StartViewProps> = () => {
  const { getTranslations } = appStore((state) => state);
  const { projects } = feedStore((state) => state);
  const t = getTranslations();

  return (
    <FullPageLayoutBackground>
      <HalfPageBox>
        <BoxCol>
          <p>
            <H1Link>{t["start.create"]}</H1Link>
            <br />
            <H1>{t["start.or"]} </H1>
            <H1Link>{t["start.open_file"]}</H1Link>,{" "}
            <H1Link>{t["start.load_from_url"]}</H1Link>,{" "}
            <H1Link> {t["start.load_from_podcastindex"]}</H1Link>
          </p>
          <ImageLinkCardContainer>
            {Object.keys(projects).map((feed) => (
              <ImageLinkCard
                src={projects[feed].feed.rss.channel[0].image?.url || ""}
                showError={!projects[feed].configuration}
              />
            ))}
          </ImageLinkCardContainer>
        </BoxCol>
      </HalfPageBox>
    </FullPageLayoutBackground>
  );
};

export default StartView;
