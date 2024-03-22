import { useEffect, useState } from "react";
import uploadsStore from "../store/uploads";
import { deepEquals } from "../utils/object";
import { Upload } from "../store/uploads/types";

interface Props {
  id: string;
  onChange: (value: Upload) => void;
}

export default function useUploadChange({ onChange, id }: Props) {
  const [hasFinishedUploadPending, setHasFinishedUploadPending] =
    useState(false);
  useEffect(() => {
    // check if there is a finished upload in the store
    // set it into the formik field
    // (used when the user went out from the form an  navigates back)
    if (uploadsStore.getState().uploads[id]?.value?.url) {
      const value = uploadsStore.getState().uploads[id];
      onChange(value);
      uploadsStore.getState().removeUpload(id);
      setHasFinishedUploadPending(true);
    }

    // triggers the field value update when the upload is finished
    // and the component is still mounted
    const unsubscribe = uploadsStore.subscribe((state, prevState) => {
      const value = state.uploads[id];
      const prevValue = prevState.uploads[id];
      if (value && value.value && !deepEquals(value.value, prevValue.value)) {
        onChange(value);
        state.removeUpload(id);
      }
      setHasFinishedUploadPending(false);
    });

    return () => {
      unsubscribe();
    };
  }, [id]);

  return { hasFinishedUploadPending };
}
