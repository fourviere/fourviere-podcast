import { FunctionComponent, useState } from "react";
import { H1, H1Link } from "@fourviere/ui/lib/typography";
import { Container, HalfPageBox } from "@fourviere/ui/lib/box";
import {
  FullPageColumnLayout,
  FullPageLayoutBackground,
} from "@fourviere/ui/lib/layouts/full-page";
import appStore from "../../store/app";
import feedStore from "../../store/feed";
import StartByURL from "./start-by-url";
import StartByDrag from "./start-by-drag";
import { AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import Drawer from "@fourviere/ui/lib/modals/drawer";
import StartByIndex from "./start-by-podcast-index";
import SideMenu from "../../components/main-menu";

interface StartViewProps {}

const StartView: FunctionComponent<StartViewProps> = () => {
  const { getTranslations, getConfigurations } = appStore((state) => state);
  const { createProject } = feedStore((state) => state);
  const [startByUrlVisible, setStartByUrlVisible] = useState(false);
  const [startByIndexVisible, setStartByIndexVisible] = useState(false);

  const t = getTranslations();
  const isPodcastIndexEnabled = getConfigurations("podcastIndex").enabled;

  return (
    <FullPageColumnLayout>
      <SideMenu />
      <FullPageLayoutBackground>
        <StartByDrag>
          <HalfPageBox>
            <Container spaceY="xl">
              <p>
                <H1Link
                  onClick={() => {
                    createProject().catch(() => {});
                  }}
                >
                  {t["start.create"]}
                </H1Link>
                <br /> <H1>{t["start.import"]}</H1>,{" "}
                <H1>{t["start.open_file"]}</H1>,{" "}
                <H1Link onClick={() => setStartByUrlVisible(true)}>
                  {t["start.load_from_url"]}
                </H1Link>
                {isPodcastIndexEnabled && (
                  <>
                    {" "}
                    <H1>{t["start.or"]}</H1>
                    <H1Link onClick={() => setStartByIndexVisible(true)}>
                      {" "}
                      {t["start.load_from_podcastindex"]}
                    </H1Link>
                  </>
                )}
              </p>
            </Container>
          </HalfPageBox>
        </StartByDrag>
        {createPortal(
          <AnimatePresence mode="wait">
            {startByUrlVisible && (
              <Drawer type="bottom" onClose={() => setStartByUrlVisible(false)}>
                <StartByURL done={() => setStartByUrlVisible(false)} />
              </Drawer>
            )}
          </AnimatePresence>,
          document.getElementById("drawer")!
        )}
        {createPortal(
          <AnimatePresence mode="wait">
            {startByIndexVisible && (
              <Drawer
                type="bottom"
                onClose={() => setStartByIndexVisible(false)}
              >
                <StartByIndex done={() => setStartByIndexVisible(false)} />
              </Drawer>
            )}
          </AnimatePresence>,
          document.getElementById("drawer")!
        )}
      </FullPageLayoutBackground>
    </FullPageColumnLayout>
  );
};

export default StartView;
