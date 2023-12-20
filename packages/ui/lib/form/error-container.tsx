export default function ErrorContainer({ error }: { error: string }) {
  return (
    <div className="w-50%  mx-3 rounded-b bg-rose-50 px-2 py-1 text-xs text-rose-600">
      {error}
    </div>
  );
}
