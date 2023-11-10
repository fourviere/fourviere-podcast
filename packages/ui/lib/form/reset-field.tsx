import { XCircleIcon } from "@heroicons/react/24/outline";
const ResetField = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="w-5 h-5 text-rose-500 hover:text-rose-700"
    >
      <XCircleIcon />
    </button>
  );
};

export default ResetField;
