import { PlusCircleIcon } from "@heroicons/react/24/outline";

const AddField = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="h-5 w-5 text-slate-500 hover:text-slate-700"
    >
      <PlusCircleIcon />
    </button>
  );
};

export default AddField;
