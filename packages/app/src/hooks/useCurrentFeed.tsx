import { Feed } from "@fourviere/core/lib/schema/feed";
import feedStore, { Configuration } from "../store/feed";
import { useParams } from "react-router-dom";

export default function UseCurrentFeed() {
  const { feedId } = useParams<{ feedId: string }>();

  if (!feedId) {
    return null;
  }

  const project = feedStore((state) => state.getProjectById(feedId));
  const updateFeed = feedStore((state) => state.updateFeed);
  const updateConfiguration = feedStore((state) => state.updateConfiguration);

  if (!project) {
    return null;
  }

  return {
    update: (value: Feed) => updateFeed(feedId, value),
    updateConfiguration: (value: Configuration) =>
      updateConfiguration(feedId, value),
    feed: project.feed,
    configuration: project.configuration,
    feedId,
  };
}
