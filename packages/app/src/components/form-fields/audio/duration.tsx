import Input from "@fourviere/ui/lib/form/fields/input";
import { useField } from "formik";
import { useEffect, useState } from "react";
import { getDuration } from "../../../native/audio";

type DurationProps = {
  audioFieldName: string;
  durationFieldName: string;
};

export default function Duration({
  audioFieldName,
  durationFieldName,
}: DurationProps) {
  const [audioField] = useField<string>(audioFieldName);
  const [field, meta, helpers] = useField<number>(durationFieldName);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    getDuration(audioField.value)
      .then((duration) => {
        void helpers.setValue(duration);
      })
      .catch((e: Error) => setError(e.message));
  }, [audioField.value]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    void helpers.setValue(Number(e.target.value));
  };

  return (
    <Input
      type="number"
      value={field.value}
      onChange={onChange}
      error={error || meta.error}
    />
  );
}
