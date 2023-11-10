import { FullPageColumnLayout } from "@fourviere/ui/lib/layouts/full-page";
import React from "react";
import SideMenu from "../../components/main-menu";
import FeedMenu from "./feed-menu";
import { Outlet } from "react-router-dom";

interface Props {}

const EditFeed: React.FC<Props> = () => {
  return (
    <FullPageColumnLayout>
      <SideMenu />
      <FeedMenu />
      <Outlet />
    </FullPageColumnLayout>
  );
};

export default EditFeed;
