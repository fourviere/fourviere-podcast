import SideMenu, { SideMenuItem } from "@fourviere/ui/lib/menu/side-menu";
import { Link, LinkProps } from "react-router-dom";

const Main = (
  <>
    <SideMenuItem<LinkProps> component={Link} to="/config">
      Presentation
    </SideMenuItem>
    <SideMenuItem<LinkProps> component={Link} to="/a">
      Artwork
    </SideMenuItem>
    <SideMenuItem<LinkProps> component={Link} to="/a">
      Itunes
    </SideMenuItem>
    <SideMenuItem<LinkProps> component={Link} to="/a">
      Value for value
    </SideMenuItem>
    <SideMenuItem<LinkProps> component={Link} to="/a">
      Freed
    </SideMenuItem>
  </>
);

export default function FeedMenu() {
  return <SideMenu main={Main} />;
}
