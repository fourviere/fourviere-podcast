import feedStore from "../store/feed";

type Props = {
  feedId?: string;
};

const useHasRemote = ({ feedId }: Props) => {
  if (!feedId) {
    return false;
  }
  const { remote } = feedStore(
    (state) =>
      state.getProjectById(feedId)?.configuration?.remotes ?? {
        remote: "none",
      },
  );

  return remote !== "none";
};

export default useHasRemote;
