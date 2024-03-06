import {
  SideIconMenu,
  SideMenuButton,
} from "@fourviere/ui/lib/menu/side-icon-menu";
import React from "react";
import feedStore from "../store/feed";
import { ImageLinkCard } from "@fourviere/ui/lib/cards";
import { Link, useParams } from "react-router-dom";
import { CogIcon, PlusCircleIcon } from "@heroicons/react/24/outline";

const SideMenu: React.FC = () => {
  const { feedId } = useParams();
  const { projects } = feedStore((state) => state);

  const Podcasts = Object.keys(projects)
    .reverse()
    .map((key) => {
      return (
        <Link
          to={`/feed/${key}/feed-basic`}
          style={{ display: "block" }}
          key={key}
        >
          <ImageLinkCard
            theme="dark"
            size="xs"
            faded={!!feedId && feedId !== key}
            active={feedId === key}
            src={
              projects?.[key]?.feed?.rss?.channel.image?.url ||
              // projects?.[key]?.feed?.rss?.channel["itunes:image"]?.["@"]
              //   ?.href ||
              "/logo.svg"
            }
          />
        </Link>
      );
    });

  const Config = (
    <Link to="/configurations">
      <SideMenuButton>
        <CogIcon style={{ width: "30px" }} />
      </SideMenuButton>
    </Link>
  );

  const Add = (
    <Link to="/">
      <SideMenuButton>
        <PlusCircleIcon style={{ width: "30px" }} />
      </SideMenuButton>
    </Link>
  );

  return (
    <SideIconMenu
      logo={
        <img
          src="/big-fourviere.svg"
          style={{ height: "70px", width: "100%" }}
          alt="Fourvière logo"
        />
      }
      main={
        <>
          {Add}
          {Podcasts}
        </>
      }
      footer={Config}
    />
  );
};

export default SideMenu;
