import Button from "@fourviere/ui/lib/button";
import React from "react";
import { useParams } from "react-router-dom";
import useFeedUpload from "../../hooks/useFeedUpload";
import { Container } from "@fourviere/ui/lib/box";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import UseCurrentFeed from "../../hooks/useCurrentFeed";

const FeedUpload: React.FC = () => {
  const { feedId } = useParams<{ feedId: string }>();
  //get filename from feed state
  const currentFeed = UseCurrentFeed();
  const { remote } = currentFeed?.configuration?.remotes ?? {
    remote: "none",
    ftp: undefined,
    s3: undefined,
  };

  if (!feedId) {
    return null;
  }

  const { upload, isUploading } = useFeedUpload({
    feedId,
    updateField: (value) => {
      console.log(value);
    },
    updateError: (value) => {
      console.log(value);
    },
  });

  return (
    <Container padding="lg" spaceY="sm">
      <Button
        wfull={true}
        size="md"
        Icon={ArrowUpTrayIcon}
        onClick={() => {
          if (remote !== "none") {
            upload(currentFeed?.configuration.feed.filename ?? "feed.xml");
          }
        }}
        disabled={isUploading}
        isLoading={isUploading}
        responsiveCollapse={true}
      >
        publish updates
      </Button>
    </Container>
  );
};

export default FeedUpload;
