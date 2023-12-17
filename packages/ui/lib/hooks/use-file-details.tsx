import { useEffect, useState } from "react";

const useFileDetails = (url: string) => {
  const [details, setDetails] = useState<{
    mimeType: string;
    size: number;
  } | null>(null);

  useEffect(() => {
    getFileDetails(url)
      .then(setDetails)
      .catch((e) => {
        console.error("Problem getting file details", e);
      });
  }, [url]);

  return details;
};
export default useFileDetails;

async function getFileDetails(
  url: string
): Promise<{ mimeType: string; size: number }> {
  try {
    const response = await fetch(url, { method: "HEAD" });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const mimeType = response.headers.get("Content-Type") ?? "unknown";
    const size = parseInt(response.headers.get("Content-Length") ?? "0", 10);

    return { mimeType, size };
  } catch (error) {
    console.error("Error fetching file details:", error);
    throw error;
  }
}
