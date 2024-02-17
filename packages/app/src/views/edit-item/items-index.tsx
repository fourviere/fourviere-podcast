import { FullPageColumnLayout } from "@fourviere/ui/lib/layouts/full-page";
import React from "react";

import { NavLink } from "react-router-dom";
import UseCurrentFeed from "../../hooks/use-current-feed";

import CardGrid, { Card } from "@fourviere/ui/lib/lists/card-grid";

interface Props {}

const ItemsIndex: React.FC<Props> = () => {
  const currentFeed = UseCurrentFeed();
  return (
    <FullPageColumnLayout>
      <CardGrid title="Items">
        {currentFeed?.feed.rss.channel[0].item?.map((item, index) => (
          <NavLink
            key={item.guid["#text"]}
            to={`/feed/${currentFeed.feedId}/feed-items/${index}`}
          >
            <Card title={item.title} image={item["itunes:image"]?.["@"].href} />
          </NavLink>
        ))}
      </CardGrid>
    </FullPageColumnLayout>
  );
};

export default ItemsIndex;
