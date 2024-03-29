import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

type ErrorAlertProps = {
  message: string;
};
const ErrorAlert = ({ message }: ErrorAlertProps) => {
  return (
    <div className="my-1 flex items-center space-x-1 rounded-md text-xs text-rose-500 ">
      <ExclamationCircleIcon className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
};

export default ErrorAlert;
