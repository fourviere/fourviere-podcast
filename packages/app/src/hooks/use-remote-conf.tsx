import feedStore from "../store/feed/index";

type Props = {
  feedId: string;
};
export default function UseRemoteConf({ feedId }: Props) {
  const state = feedStore(
    (state) =>
      state.getProjectById(feedId)?.configuration?.remotes ?? {
        remote: "none",
        s3: {},
        ftp: {},
      },
  );

  return {
    hasRemote: state.remote !== "none",
    remote: state,
    currentRemote:
      state?.remote !== "none" && state?.[state.remote]
        ? state?.[state.remote]
        : undefined,
  };
}
