import Button from "@fourviere/ui/lib/button";
import React from "react";
import feedStore from "../../store/feed";
import { serializeToXML } from "@fourviere/core/lib/converter";
import { useParams } from "react-router-dom";
import { invoke } from "@tauri-apps/api";

const FeedUpload: React.FC = () => {
  const { feedId } = useParams<{ feedId: string }>();

  if (!feedId) {
    return null;
  }

  const project = feedStore((state) => state.getProjectById(feedId));
  const xml = serializeToXML(project.feed);

  const { s3 } = feedStore(
    (state) =>
      state.getProjectById(feedId)?.configuration?.remotes ?? {
        remote: "none",
        s3: undefined,
      },
  );

  function upload() {
    void invoke("s3_xml_upload", {
      payload: {
        content: xml,
        file_name: "pippo",
        ...s3,
      },
    })
      .then((e) => {
        console.log(e);
      })
      .catch((e) => {
        console.error(e);
      });
  }

  return (
    <div>
      <Button size="lg" onClick={upload}>
        Upload
      </Button>
    </div>
  );
};

export default FeedUpload;
