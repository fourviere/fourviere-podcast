import classNames from "classnames";
import React, { useEffect, useState } from "react";

interface ImageProps {
  src: string;
  style?: React.CSSProperties;
  className?: string;
}

const Image: React.FC<ImageProps> = ({ src, style, className }) => {
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
          className={classNames([
            "flex shrink-0 flex-col items-center justify-center rounded ",
            className,
          ])}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 0 24 24"
            width="24"
          >
            <path
              d="M0 0h24v24H0zm0 0h24v24H0zm21 19c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2"
              fill="none"
            />
            <path
              fill="currentColor"
              d="M21 5v6.59l-3-3.01-4 4.01-4-4-4 4-3-3.01V5c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2zm-3 6.42l3 3.01V19c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2v-6.58l3 2.99 4-4 4 4 4-3.99z"
            />
          </svg>
        </div>
      ) : (
        <img
          src={src}
          style={style}
          onError={handleImageError}
          className={classNames([
            "shrink-0 rounded border object-cover shadow",
            className,
          ])}
        />
      )}
    </>
  );
};

export default Image;
