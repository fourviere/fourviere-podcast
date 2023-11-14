import { useFormikContext } from "formik";
import { useEffect } from "react";
import { useState } from "react";

interface Props<T> {
  updateFunction: (values: T) => void;
}
export default function FormObserver<T>({ updateFunction }: Props<T>) {
  const { values } = useFormikContext<T>();
  const [timer, setTimer] = useState<NodeJS.Timeout>();

  //TODO: improve this pls
  useEffect(() => {
    if (timer) clearTimeout(timer);
    const newTimer = setTimeout(() => {
      updateFunction(values);
    }, 1500);
    setTimer(newTimer);
    return clearTimeout(timer);
  }, [values]);

  return null;
}
