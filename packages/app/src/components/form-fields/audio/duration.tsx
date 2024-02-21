import Input from "@fourviere/ui/lib/form/fields/input";
import { useField } from "formik";
import { useEffect, useState } from "react";
import { getDuration } from "../../../native/audio";
import useTranslations from "../../../hooks/use-translations";

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
  const t = useTranslations();

  useEffect(() => {
    setError(undefined);
    getDuration(audioField.value)
      .then((duration) => {
        if (duration) {
          void helpers.setValue(duration);
          helpers.setTouched(true);
          helpers.setError(undefined);
        } else {
          void helpers.setValue(0);
          helpers.setTouched(true);
        }
      })
      .catch(() => {
        void helpers.setValue(0);
        setError(t["edit_feed.audio.duration.error"]);
      });
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
