import Button from "@fourviere/ui/lib/button";
import React from "react";
import { useParams } from "react-router-dom";
import useFeedUpload from "../../hooks/useFeedUpload";

const FeedUpload: React.FC = () => {
  const { feedId } = useParams<{ feedId: string }>();

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
    <div>
      <Button
        size="lg"
        onClick={() => {
          upload("test.xml");
        }}
        disabled={isUploading}
        isLoading={isUploading}
      >
        Upload
      </Button>
    </div>
  );
};

export default FeedUpload;
