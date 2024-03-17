import { Container } from "@fourviere/ui/lib/box";
import Drawer from "@fourviere/ui/lib/modals/drawer";
import Itunes from "./forms/itunes";
import GeneralForm from "./forms/general";
import VStack from "@fourviere/ui/lib/layouts/v-stack";
import HStack from "@fourviere/ui/lib/layouts/h-stack";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { H1, H3, P, Title } from "@fourviere/ui/lib/typography";
import UseCurrentFeed from "../../hooks/use-current-feed";
import { normalizeText } from "../../utils/text";
import {
  OneQuarterPageBox,
  OneThirdPageBox,
  ThreeQuartersPageBox,
  TwoThirdsPageBox,
} from "@fourviere/ui/lib/layouts/columns";
import EditButton from "@fourviere/ui/lib/edit-button";
import Description from "./forms/description";
import TileButton from "@fourviere/ui/lib/buttons/tile-button";
import {
  CodeBracketIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  MusicalNoteIcon,
  PaintBrushIcon,
} from "@heroicons/react/24/outline";
import Grid from "@fourviere/ui/lib/layouts/grid";
import SourceCode from "./source-code";
import Configuration from "./forms/configuration";
import FeedUploader from "../../components/feed-uploader";

export default function General() {
  const [descriptionModal, setDescriptionModal] = useState<boolean>(false);
  const [configurationModal, setConfigurationModal] = useState<boolean>(false);
  const [itunesModal, setItunesModal] = useState<boolean>(false);
  const [generalModal, setGeneralModal] = useState<boolean>(false);
  const [sourceModal, setSourceModal] = useState<boolean>(false);
  const currentFeed = UseCurrentFeed();

  return (
    <VStack scroll wFull paddingX="6" paddingY="6" spacing="6">
      <HStack spacing="2" alignItems="center" responsive={true}>
        <ThreeQuartersPageBox>
          <EditButton onClick={() => setGeneralModal(true)}>
            <HStack spacing="4" alignItems="center">
              <img
                className="h-20 w-20 rounded-lg"
                src={currentFeed?.feed.rss.channel.image?.url ?? "/logo.svg"}
              />
              <VStack>
                <Title>{currentFeed?.feed.rss.channel.title}</Title>
                <H3>
                  {currentFeed?.feed.rss.channel["itunes:author"] ??
                    currentFeed?.feed.rss.channel.link?.[0]["@"].href}
                </H3>
              </VStack>
            </HStack>
          </EditButton>
        </ThreeQuartersPageBox>
        <OneQuarterPageBox $responsive={true}>
          <FeedUploader />
        </OneQuarterPageBox>
      </HStack>

      <HStack spacing="6" responsive={true}>
        <OneThirdPageBox $responsive={true}>
          <VStack spacing="4">
            <EditButton onClick={() => setDescriptionModal(true)}>
              <P
                style={{ minHeight: "80px" }}
                dangerouslySetInnerHTML={{
                  __html: normalizeText(
                    currentFeed?.feed.rss.channel.description,
                  ),
                }}
              ></P>
            </EditButton>
          </VStack>
        </OneThirdPageBox>
        <TwoThirdsPageBox $responsive>
          <Grid cols="2" mdCols="4" lgCols="6" wFull spacing="3">
            <TileButton
              icon={PaintBrushIcon}
              title="Presentation"
              loading={70}
              onClick={() => setGeneralModal(true)}
            />
            <TileButton
              icon={DocumentTextIcon}
              title="Description"
              loading={70}
              onClick={() => setDescriptionModal(true)}
            />
            <TileButton
              icon={MusicalNoteIcon}
              title="Itunes"
              checked
              onClick={() => setItunesModal(true)}
            />

            <TileButton theme="empty" icon={DocumentTextIcon} title="Podroll" />
            <TileButton
              icon={CodeBracketIcon}
              title="Code editor"
              onClick={() => setSourceModal(true)}
            />
            {/* <TileButton
              label="coming soon"
              theme="disabled"
              icon={DocumentTextIcon}
              title="Transcript"
            />
            <TileButton
              label="coming soon"
              theme="disabled"
              icon={DocumentTextIcon}
              title="Chapters"
            />

            <TileButton
              label="coming soon"
              theme="disabled"
              icon={DocumentTextIcon}
              title="Funding"
            />
            <TileButton
              label="coming soon"
              theme="disabled"
              icon={DocumentTextIcon}
              title="Team"
            />

            <TileButton
              label="coming soon"
              theme="disabled"
              icon={DocumentTextIcon}
              title="Live"
            />
            <TileButton
              label="coming soon"
              theme="disabled"
              icon={DocumentTextIcon}
              title="Stats"
            /> */}
            <TileButton
              icon={Cog6ToothIcon}
              title="Configuration"
              loading={70}
              onClick={() => setConfigurationModal(true)}
            />
          </Grid>
        </TwoThirdsPageBox>
      </HStack>
      <hr />
      <H1>Episodes</H1>
      <HStack spacing="6" responsive={true}>
        <TwoThirdsPageBox>
          <P>Episodes</P>
        </TwoThirdsPageBox>
        <OneThirdPageBox>ddd</OneThirdPageBox>
      </HStack>

      <AnimatePresence>
        {generalModal && (
          <Drawer type="right" onClose={() => setGeneralModal(false)}>
            <GeneralForm />
          </Drawer>
        )}
        {descriptionModal && (
          <Drawer type="right" onClose={() => setDescriptionModal(false)}>
            <VStack style={{ height: "100vh" }}>
              <Description />
            </VStack>
          </Drawer>
        )}
        {itunesModal && (
          <Drawer type="right" onClose={() => setItunesModal(false)}>
            <Container scroll style={{ height: "100vh" }}>
              <Itunes />
            </Container>
          </Drawer>
        )}
        {sourceModal && (
          <Drawer type="right" onClose={() => setSourceModal(false)}>
            <Container scroll style={{ height: "100vh" }}>
              <SourceCode />
            </Container>
          </Drawer>
        )}
        {configurationModal && (
          <Drawer type="right" onClose={() => setConfigurationModal(false)}>
            <Container scroll style={{ height: "100vh" }}>
              <Configuration />
            </Container>
          </Drawer>
        )}
      </AnimatePresence>
    </VStack>
  );
}
