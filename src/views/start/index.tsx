import { FunctionComponent } from "react";
import { H1, H1Link } from "../../ui/typography";
import FullPageLayoutBackground from "../../ui/layouts/full-page";
import appStore from "../../store/app";

interface StartViewProps {}

const StartView: FunctionComponent<StartViewProps> = () => {
  const { getTranslations } = appStore((state) => state);
  const t = getTranslations();

  return (
    <FullPageLayoutBackground>
      <section>
        <p>
          <H1Link>{t["start.create"]}</H1Link>
        </p>
        <p>
          <H1>{t["start.or"]} </H1>
          <H1Link>{t["start.open_file"]}</H1Link>,{" "}
          <H1Link>{t["start.load_from_url"]}</H1Link>,{" "}
          <H1Link> {t["start.load_from_podcastindex"]}</H1Link>
        </p>
      </section>
    </FullPageLayoutBackground>
  );
};

export default StartView;
