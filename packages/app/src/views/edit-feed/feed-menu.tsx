import SideMenu, { SideMenuItem } from "@fourviere/ui/lib/menu/side-menu";
import { NavLink, NavLinkProps } from "react-router-dom";
import useTranslations from "../../hooks/useTranslations";
import {
  CodeBracketSquareIcon,
  Cog8ToothIcon,
  MusicalNoteIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";

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
            icon={<PencilSquareIcon />}
          >
            {t["edit_feed.presentation.title"]}
          </SideMenuItem>

          <SideMenuItem<NavLinkProps>
            component={NavLink}
            to="feed-itunes"
            key="feed-itunes"
            icon={<MusicalNoteIcon />}
          >
            {t["edit_feed.channel_field.itunes.title"]}
          </SideMenuItem>
          <hr />

          <SideMenuItem<NavLinkProps>
            component={NavLink}
            to="feed-source-code"
            key="feed-source-code"
            icon={<CodeBracketSquareIcon />}
          >
            {t["edit_feed.source-code.title"]}
          </SideMenuItem>

          <SideMenuItem<NavLinkProps>
            component={NavLink}
            to="feed-config"
            key="feed-config"
            icon={<Cog8ToothIcon />}
          >
            {t["edit_feed.configuration.title"]}
          </SideMenuItem>
        </>
      }
    />
  );
}
