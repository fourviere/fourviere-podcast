import { FullPageColumnLayout } from "@fourviere/ui/lib/layouts/full-page";
import React from "react";

import { NavLink } from "react-router-dom";
import UseCurrentFeed from "../../hooks/use-current-feed";

import { Card } from "@fourviere/ui/lib/lists/card-grid";
import ContainerTitle from "@fourviere/ui/lib/container-title";
import { Container } from "@fourviere/ui/lib/box";
import Button from "@fourviere/ui/lib/button";
import { useTranslation } from "react-i18next";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import feedStore from "../../store/feed";
import Grid from "@fourviere/ui/lib/layouts/grid";

interface Props {}

const ItemsIndex: React.FC<Props> = () => {
  const { t } = useTranslation("", {
    keyPrefix: "",
  });
  const currentFeed = UseCurrentFeed();
  const { addEpisodeToProject } = feedStore((state) => state);

  function addEpisode() {
    addEpisodeToProject(currentFeed!.feedId!);
  }

  return (
    <FullPageColumnLayout>
      <Container wFull scroll>
        <ContainerTitle
          isDirty={false}
          isSubmitting={false}
          postSlot={
            <Button
              size="md"
              theme="secondary"
              Icon={PlusCircleIcon}
              onClick={addEpisode}
            >
              {t("edit_feed.items.add_episode")}
            </Button>
          }
        >
          {t("edit_feed.items.title")}
        </ContainerTitle>
        <Grid cols="2" mdCols="4" lgCols="6">
          {currentFeed?.feed.rss.channel.item?.map((item) => (
            <NavLink
              key={item.guid["#text"]}
              to={`/feed/${currentFeed.feedId}/feed-items/${encodeURIComponent(
                item.guid["#text"],
              )}`}
            >
              <Card
                title={item.title}
                image={item["itunes:image"]?.["@"].href}
              />
            </NavLink>
          ))}
        </Grid>
      </Container>
    </FullPageColumnLayout>
  );
};

export default ItemsIndex;
