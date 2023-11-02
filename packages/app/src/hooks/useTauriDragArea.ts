import { useEffect, useState } from "react";
import { listen } from "@tauri-apps/api/event";

type Props = {
  onFile: (path: string) => void;
  onError: (error: string) => void;
  fileExtensions: string[];
};

const useTauriDragArea = ({ onError, onFile, fileExtensions }: Props) => {
  const [isHover, setIsHover] = useState(false);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const listeners = [
      listen<string>("tauri://file-drop", (event) => {
        setError(false);
        if (!fileExtensions.includes(event.payload?.[0]?.slice(-3))) {
          setError(true);
          onError("Wrong format");
          setIsHover(false);

          setTimeout(() => {
            try {
              setError(false);
            } catch {}
          }, 3000);
        } else {
          onFile(event.payload[0]);
          setIsHover(false);
        }
      }),

      listen("tauri://file-drop-hover", (_) => {
        setIsHover(true);
      }),

      listen("tauri://file-drop-cancelled", (_) => {
        setIsHover(false);
        setError(false);
      }),
    ];

    return () => {
      listeners.forEach((l) => {
        l.then((r) => r());
      });
    };
  }, []);

  return { isHover, error };
};

export default useTauriDragArea;
