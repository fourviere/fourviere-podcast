import Button from "@fourviere/ui/lib/button";
import React from "react";
import { useParams } from "react-router-dom";
import useFeedUpload from "../../hooks/useFeedUpload";
import { Container } from "@fourviere/ui/lib/box";
import { ArrowUpLeftIcon } from "@heroicons/react/24/outline";
import UseCurrentFeed from "../../hooks/useCurrentFeed";

const FeedUpload: React.FC = () => {
  const { feedId } = useParams<{ feedId: string }>();
  //get filename from feed state
  const currentFeed = UseCurrentFeed();

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
    <Container padding="lg">
      <Button
        wfull
        Icon={() => <ArrowUpLeftIcon className="mr-2 h-5 w-5" />}
        onClick={() => {
          upload(currentFeed?.configuration.feed.filename ?? "feed.xml");
        }}
        disabled={isUploading}
        isLoading={isUploading}
      ></Button>
      {currentFeed?.configuration.feed.filename ?? "feed.xml"}
    </Container>
  );
};

export default FeedUpload;
