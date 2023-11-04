import SideMenu, { SideMenuItem } from "@fourviere/ui/lib/menu/side-menu";
import { NavLink, NavLinkProps } from "react-router-dom";

export default function FeedMenu() {
  return (
    <SideMenu
      main={
        <>
          <SideMenuItem<NavLinkProps> component={NavLink} to="info">
            Presentation
          </SideMenuItem>
          <SideMenuItem<NavLinkProps> component={NavLink} to="artwork">
            Artwork
          </SideMenuItem>
          <SideMenuItem<NavLinkProps> component={NavLink} to="itunes">
            Itunes
          </SideMenuItem>
          <SideMenuItem<NavLinkProps> component={NavLink} to="value-for-value">
            Value for value
          </SideMenuItem>
          <SideMenuItem<NavLinkProps>
            component={NavLink}
            to="source-code"
            className={({ isActive }) => (isActive ? "ide-menu-active " : "")}
          >
            Source Code
          </SideMenuItem>
        </>
      }
    />
  );
}
