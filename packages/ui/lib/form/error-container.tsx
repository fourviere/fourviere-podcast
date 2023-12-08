export default function ErrorContainer({ error }: { error: string }) {
  return (
    <div className="text-xs  bg-rose-50 text-rose-600 px-2 py-1 rounded-b mx-3 w-50%">
      {error}
    </div>
  );
}
