import { useEffect, useState } from "react";
import jsonpath from "jsonpath";
import { useFormikContext } from "formik";
import { FormProps } from ".";

function ChangeDetector<DataType>({
  changeCallbacks,
  initialData,
}: {
  initialData: DataType;
  changeCallbacks: FormProps<DataType>["onFieldChange"];
}) {
  const [prevValues, setPrevValues] = useState<DataType>(initialData);
  const { values, setFieldValue, setFieldError, setFieldTouched } =
    useFormikContext<DataType>();

  useEffect(() => {
    if (
      changeCallbacks &&
      Array.isArray(changeCallbacks) &&
      changeCallbacks.length > 0
    ) {
      changeCallbacks.forEach(({ fieldName, callback }) => {
        const prevValue = jsonpath.value(prevValues, fieldName) as unknown;
        const value = jsonpath.value(values, fieldName) as unknown;
        if (prevValue !== value) {
          callback?.(value, setFieldValue, setFieldError, setFieldTouched);
        }
      });
    }
    setPrevValues(values);
  }, [values]);
  return null;
}

export default ChangeDetector;
