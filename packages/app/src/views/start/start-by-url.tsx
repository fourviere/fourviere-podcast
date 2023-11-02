import { FunctionComponent, useState } from "react";
import feedStore from "../../store/feed";

const StartByURL: FunctionComponent = () => {
  const { loadFeedFromUrl } = feedStore((state) => state);
  const [url, setUrl] = useState<string>("");

  return (
    <div>
      <input
        type="text"
        placeholder="Enter URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button onClick={() => loadFeedFromUrl(url)}>Load</button>
    </div>
  );
};

export default StartByURL;
