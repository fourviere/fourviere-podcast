import React from "react";

const ResetField = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      className="absolute right-0 top-[50%] -translate-y-[50%] rounded-full  text-white hover:bg-slate-600 focus:outline-none bg-slate-300"
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  );
};

export default ResetField;
