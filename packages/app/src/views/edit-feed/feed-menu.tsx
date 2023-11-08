import SideMenu, { SideMenuItem } from "@fourviere/ui/lib/menu/side-menu";
import { NavLink, NavLinkProps } from "react-router-dom";

export default function FeedMenu() {
  return (
    <SideMenu
      main={
        <>
          <SideMenuItem<NavLinkProps> component={NavLink} to="info" key="info">
            Presentation
          </SideMenuItem>

          <SideMenuItem<NavLinkProps>
            component={NavLink}
            to="source-code"
            key="source-code"
          >
            Source Code
          </SideMenuItem>
        </>
      }
    />
  );
}
