import SideMenu, { SideMenuItem } from "@fourviere/ui/lib/menu/side-menu";
import { NavLink, NavLinkProps } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  BanknotesIcon,
  CodeBracketSquareIcon,
  Cog8ToothIcon,
  MusicalNoteIcon,
  PencilSquareIcon,
  QueueListIcon,
} from "@heroicons/react/24/outline";
import FeedUploader from "../../components/feed-uploader";

export default function FeedMenu() {
  const { t } = useTranslation("", {
    keyPrefix: "",
  });
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
            {t("edit_feed.presentation.title")}
          </SideMenuItem>

          <SideMenuItem<NavLinkProps>
            component={NavLink}
            to="feed-itunes"
            key="feed-itunes"
            icon={<MusicalNoteIcon />}
          >
            {t("edit_feed.channel_field.itunes.title")}
          </SideMenuItem>

          <SideMenuItem<NavLinkProps>
            component={NavLink}
            to="feed-v4v"
            key="feed-v4v"
            icon={<BanknotesIcon />}
          >
            {t("edit_feed.channel_field.v4v.title")}
          </SideMenuItem>

          <hr />

          <SideMenuItem<NavLinkProps>
            component={NavLink}
            to="feed-items"
            key="feed-items"
            icon={<QueueListIcon />}
          >
            {t("edit_feed.items.title")}
          </SideMenuItem>

          <hr />

          <SideMenuItem<NavLinkProps>
            component={NavLink}
            to="feed-source-code"
            key="feed-source-code"
            icon={<CodeBracketSquareIcon />}
          >
            {t("edit_feed.source-code.title")}
          </SideMenuItem>

          <SideMenuItem<NavLinkProps>
            component={NavLink}
            to="feed-config"
            key="feed-config"
            icon={<Cog8ToothIcon />}
          >
            {t("edit_feed.configuration.title")}
          </SideMenuItem>
        </>
      }
      footer={
        <>
          <FeedUploader />
        </>
      }
    />
  );
}
