import { useFormikContext } from "formik";
import {useEffect, useRef} from "react";
import {debounce} from "../lib/util.tsx";

interface Props<T> {
  updateFunction: (values: T) => void;
}

export default function FormObserver<T>({ updateFunction }: Props<T>) {
  const { values } = useFormikContext<T>();
  const updateFuncDebouncedRef = useRef(debounce(updateFunction, 1500));
  useEffect(() => {
    updateFuncDebouncedRef.current(values);
  }, [values]);

  return null;
}
