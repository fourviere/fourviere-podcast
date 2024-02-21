import { FullPageColumnLayout } from "@fourviere/ui/lib/layouts/full-page";
import React, { useEffect } from "react";
import SideMenu from "../../components/main-menu";
import FeedMenu from "./feed-menu";
import { Outlet, useNavigate } from "react-router-dom";
import UseCurrentFeed from "../../hooks/use-current-feed";

interface Props {}

const EditFeed: React.FC<Props> = () => {
  const currentFeed = UseCurrentFeed();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentFeed) {
      navigate("/");
    }
  }, [currentFeed, navigate]);

  return (
    currentFeed && (
      <FullPageColumnLayout>
        <SideMenu />
        <FeedMenu />
        <Outlet />
      </FullPageColumnLayout>
    )
  );
};

export default EditFeed;
