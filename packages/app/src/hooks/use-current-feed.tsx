import { Feed } from "@fourviere/core/lib/schema/feed";
import feedStore from "../store/feed/index";
import { useParams } from "react-router-dom";
import { Configuration } from "../store/feed/types";

export default function UseCurrentFeed() {
  const { feedId } = useParams<{ feedId: string }>();

  const project = feedStore((state) => state.getProjectById(feedId!));
  const updateFeed = feedStore((state) => state.updateFeed);
  const updateConfiguration = feedStore((state) => state.updateConfiguration);
  const addEpisodeToProject = feedStore((state) => state.addEpisodeToProject);

  if (!project) {
    return null;
  }

  return {
    update: (value: Feed) => updateFeed(feedId!, value),
    updateConfiguration: (value: Configuration) =>
      updateConfiguration(feedId!, value),
    feed: project.feed,
    configuration: project.configuration,
    feedId,
    addEpisodeToProject: () => addEpisodeToProject(feedId!),
  };
}
