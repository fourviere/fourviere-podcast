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
  let { feedId } = useParams();
  const { projects } = feedStore((state) => state);

  const Podcasts = Object.keys(projects)
    .reverse()
    .map((key) => {
      return (
        <Link to={`/feed/${key}`} style={{ display: "block" }} key={key}>
          <ImageLinkCard
            theme="dark"
            size="xs"
            faded={!!feedId && feedId !== key}
            active={feedId === key}
            src={
              projects?.[key]?.feed?.rss?.channel?.[0]["itunes:image"]?.["@"]
                ?.href || "/logo.svg"
            }
          />
        </Link>
      );
    });

  const Config = (
    <Link to="/config">
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
        <div className="p-3">
          <img
            src="/logo.svg"
            style={{ height: "60px", width: "100%" }}
            alt="Fourvière logo"
          />
        </div>
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
