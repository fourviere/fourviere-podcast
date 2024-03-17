type Props = {
  ok: () => void;
  cancel: () => void;
  title: string;
  message: string;
  okButton?: string;
  cancelButton?: string;
  icon?: React.ElementType;
};

export default function Alert({
  ok,
  cancel,
  title,
  message,
  okButton,
  cancelButton,
  icon,
}: Props) {
  const Icon = icon as React.ElementType;
  return (
    <>
      <div className="fixed inset-0 z-30 bg-slate-700 bg-opacity-75 transition-opacity"></div>
      <div className="fixed inset-0 z-40 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
            <div className="sm:flex sm:items-start">
              {icon && (
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <Icon className="h-6 w-6 text-red-600" />
                </div>
              )}
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 className="text-base font-semibold leading-6 text-gray-900">
                  {title}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">{message}</p>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:ml-10 sm:mt-4 sm:flex sm:pl-4">
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:w-auto"
                onClick={() => ok()}
              >
                {okButton}
              </button>
              <button
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:ml-3 sm:mt-0 sm:w-auto"
                onClick={() => cancel()}
              >
                {cancelButton}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
