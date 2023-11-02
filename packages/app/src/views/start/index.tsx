import { FunctionComponent } from "react";
import { H1, H1Link } from "@fourviere/ui/lib/typography";
import { ImageLinkCard, ImageLinkCardContainer } from "@fourviere/ui/lib/cards";
import { BoxCol, HalfPageBox } from "@fourviere/ui/lib/box";
import FullPageLayoutBackground from "@fourviere/ui/lib/layouts/full-page";
import appStore from "../../store/app";
import feedStore from "../../store/feed";
import StartByURL from "./start-by-url";
import StartByDrag from "./start-by-drag";

interface StartViewProps {}

const StartView: FunctionComponent<StartViewProps> = () => {
  const { getTranslations } = appStore((state) => state);
  const { projects, createProject } = feedStore((state) => state);

  const t = getTranslations();

  return (
    <FullPageLayoutBackground>
      <StartByDrag>
        <HalfPageBox>
          <BoxCol>
            <p>
              <H1Link onClick={createProject}>{t["start.create"]}</H1Link>
              <br />
              <H1>{t["start.or"]} </H1>
              <H1Link>{t["start.open_file"]}</H1Link>,{" "}
              <H1Link>{t["start.load_from_url"]}</H1Link>,{" "}
              <H1Link> {t["start.load_from_podcastindex"]}</H1Link>
            </p>
            <StartByURL />
            <ImageLinkCardContainer>
              {Object.keys(projects)
                .reverse()
                .map((feed) => (
                  <ImageLinkCard
                    src={projects[feed].feed.rss.channel[0].image?.url || ""}
                    showError={!projects[feed].configuration}
                  />
                ))}
            </ImageLinkCardContainer>
          </BoxCol>
        </HalfPageBox>
      </StartByDrag>
    </FullPageLayoutBackground>
  );
};

export default StartView;
