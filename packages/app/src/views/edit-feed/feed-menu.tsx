import SideMenu, { SideMenuItem } from "@fourviere/ui/lib/menu/side-menu";
import { NavLink, NavLinkProps } from "react-router-dom";
import useTranslations from "../../hooks/useTranslations";

export default function FeedMenu() {
  const t = useTranslations();
  return (
    <SideMenu
      main={
        <>
          <SideMenuItem<NavLinkProps>
            component={NavLink}
            to="feed-basic"
            key="feed-basic"
          >
            {t["edit_feed.basic.title"]}
          </SideMenuItem>

          <SideMenuItem<NavLinkProps>
            component={NavLink}
            to="feed-source-code"
            key="feed-source-code"
          >
            {t["edit_feed.source-code.title"]}
          </SideMenuItem>

          <SideMenuItem<NavLinkProps>
            component={NavLink}
            to="feed-config"
            key="feed-config"
          >
            {t["edit_feed.configuration.title"]}
          </SideMenuItem>
        </>
      }
    />
  );
}
