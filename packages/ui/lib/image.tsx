import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";

interface ImageProps {
  src: string;
  style: React.CSSProperties;
}

const Image: React.FC<ImageProps> = ({ src, style }) => {
  const [error, setError] = useState(false);

  const handleImageError = () => {
    setError(true);
  };

  useEffect(() => {
    setError(false);
  }, [src]);

  return (
    <>
      {error ? (
        <div
          style={style}
          className="flex shrink-0 flex-col items-center justify-center rounded border object-cover p-1 text-center text-xs leading-none shadow"
        >
          <ExclamationCircleIcon className="h-8 w-8 text-slate-600"></ExclamationCircleIcon>
          Image cannot be loaded
        </div>
      ) : (
        <img
          src={src}
          style={style}
          onError={handleImageError}
          className="shrink-0 rounded border object-cover shadow"
        />
      )}
    </>
  );
};

export default Image;
