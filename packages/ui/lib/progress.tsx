type Props = {
  progress: number;
};

export default function Progress({ progress }: Props) {
  return (
    <div className="w-full rounded-full border border-slate-200">
      <div
        className="m-px rounded-full bg-slate-600 text-center text-xs font-medium leading-none text-slate-100 transition-all duration-500"
        style={{ width: `${progress}%` }}
      >
        {progress}%
      </div>
    </div>
  );
}
