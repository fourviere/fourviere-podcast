import React from "react";
import { H2, Note } from "@fourviere/ui/lib/typography";
import VStack from "@fourviere/ui/lib/layouts/v-stack";
import HStack from "@fourviere/ui/lib/layouts/h-stack";
import Image from "@fourviere/ui/lib/image";
import Grid from "@fourviere/ui/lib/layouts/grid";
import { motion, AnimatePresence } from "framer-motion";
import TileButton from "@fourviere/ui/lib/buttons/tile-button";
import { PaintBrushIcon, TrashIcon } from "@heroicons/react/24/outline";
import AudioPlayer from "react-h5-audio-player";
import "../styles/audio.css";
import { Item } from "@fourviere/core/lib/schema/item";
import classNames from "classnames";
import UseCurrentFeed from "../hooks/use-current-feed";
import { useTranslation } from "react-i18next";
import feedStore from "../store/feed";
import useConfirmationModal from "../hooks/use-confirmation-modal";

type Extend = React.HTMLAttributes<HTMLDivElement> &
  React.HTMLAttributes<HTMLAnchorElement> &
  React.HTMLAttributes<HTMLButtonElement>;

interface EpisodeCardProps extends Extend {
  item: Item;
  openBasicDetails: (index: number) => void;
  index: number;
  as: React.ElementType;
}

const EpisodeCard: React.FC<EpisodeCardProps> = ({
  item,
  openBasicDetails,
  index,
  as = "div",
}) => {
  const Component = as;
  const [isHovered, setIsHovered] = React.useState(false);

  const currentFeed = UseCurrentFeed()!;

  const { t } = useTranslation("feed", {
    keyPrefix: "forms.configuration",
  });
  const { deleteEpisodeFromProject } = feedStore((state) => state);
  const { askForConfirmation, renderConfirmationModal } =
    useConfirmationModal();

  async function remove() {
    const del = await askForConfirmation({
      title: t("actions.fields.delete_episode.modalTitle"),
      message: t("actions.fields.delete_episode.modalMessage"),
    });

    if (del) {
      // navigate("/");
      deleteEpisodeFromProject(currentFeed.feedId!, item.guid["#text"]);
    }
  }

  return (
    <Component
      className={classNames(
        "relative w-full overflow-hidden rounded-lg bg-white transition-all duration-500",
        { "scale-110": isHovered },
      )}
    >
      <HStack
        className="origin-left cursor-pointer"
        spacing="3"
        alignItems="center"
        paddingX="3"
        paddingY="3"
        onClick={() => setIsHovered((status) => !status)}
      >
        {item?.["itunes:image"]?.["@"].href && (
          <Image
            src={item?.["itunes:image"]?.["@"].href}
            alt="Card Image"
            className="h-16 rounded-lg"
          />
        )}

        <VStack spacing="2">
          <H2>
            <span className="line-clamp-2 text-left">{item.title}</span>
          </H2>
          <Note>
            <span className="line-clamp-1 text-left">
              {item?.["itunes:subtitle"]}
            </span>
          </Note>
        </VStack>
      </HStack>
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <div className="m-2 rounded-lg bg-slate-50 p-2">
              <Grid cols="2" mdCols="4" lgCols="5" spacing="3">
                <TileButton
                  icon={PaintBrushIcon}
                  title="Configuration"
                  onClick={() => openBasicDetails(index)}
                />
                <TileButton
                  theme="error"
                  icon={TrashIcon}
                  title="Delete"
                  onClick={() => remove()}
                  hoverEffect={false}
                />
              </Grid>

              {item.enclosure?.["@"]?.url ? (
                <AudioPlayer
                  src={item.enclosure?.["@"]?.url}
                  preload="metadata"
                />
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {renderConfirmationModal()}
    </Component>
  );
};

export default EpisodeCard;
