import React, { useEffect, useMemo, useState } from "react";
import { FieldArray, FieldProps } from "formik";
import { Reorder } from "framer-motion";
import { ArrowsUpDownIcon, TrashIcon } from "@heroicons/react/24/outline";
import "./array.css";
import tw from "tailwind-styled-components";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { simpleHash } from "../../utils/string";
import { v4 as uuidv4 } from "uuid";
import { FieldConf, generateFormikField } from "..";
import Grid from "../../layouts/grid";
import ErrorAlert from "../../alerts/error";
import { getError, getTouchedByPath } from "../utils";

const ArrayForm: React.ComponentType<
  FieldProps<Array<Record<string, unknown>>> & {
    label: string;
    childrenFields: Array<FieldConf>;
    defaultItem: Record<string, unknown>;
    arrayErrorsFrom?: string[];
  }
> = ({ field, form, childrenFields, defaultItem }) => {
  const [dragEnabled, setDragEnabled] = useState(false);

  //const v = useMemo(() => keifyElements(field.value), [field.value]);
  const v = useMemo(() => field.value, [field.value]);

  useEffect(() => {
    const t = setTimeout(() => {
      setDragEnabled(false);
    }, 3000);
    return () => clearTimeout(t);
  }, [dragEnabled, field.value]);

  const touched = getTouchedByPath(form.touched, field.name);
  const error = getError({
    touched,
    errors: form?.errors,
    name: field?.name,
  });

  return (
    <>
      <FieldContainer>
        <FieldArray name={field.name}>
          {({ insert, remove }) => (
            <Reorder.Group
              axis="y"
              values={v ?? []}
              layoutScroll={true}
              className="text-sm"
              onReorder={(e) => {
                form.setFieldValue(field.name, e);
              }}
            >
              <FieldHeader>
                {v?.length > 1 ? (
                  <SortButton
                    $active={dragEnabled}
                    onClick={() => setDragEnabled((d) => !d)}
                  >
                    <ArrowsUpDownIcon className="h-4 w-4" />
                  </SortButton>
                ) : null}
                <Button
                  $main
                  type="button"
                  onClick={() => insert(0, { ...defaultItem, __k: uuidv4() })}
                >
                  <PlusCircleIcon className="h-5 w-5" />
                </Button>
              </FieldHeader>
              {v?.map((item, index) => (
                <Reorder.Item
                  drag={dragEnabled}
                  /* This 2 drag enabled checks are used for allowing the field editing whithout refreshing the value */
                  key={dragEnabled ? simpleHash(JSON.stringify(item)) : index}
                  value={dragEnabled && item}
                >
                  <ArrayItem $dragEnabled={dragEnabled}>
                    <Grid cols="1" mdCols="2" spacing="4">
                      {childrenFields.map((subField, subIndex) => {
                        return generateFormikField({
                          field: subField,
                          index: subIndex,
                          fieldNamePrefix: `${field.name}.${index}`,
                        });
                      })}
                    </Grid>
                    {dragEnabled && (
                      <DisabledView>
                        <ArrowsUpDownIcon className="h-5 w-5 text-slate-600" />
                      </DisabledView>
                    )}
                  </ArrayItem>
                  <ButtonContainer>
                    <Button
                      $main={false}
                      type="button"
                      onClick={() =>
                        insert(index + 1, { ...defaultItem, __k: uuidv4() })
                      }
                    >
                      <PlusCircleIcon className="h-5 w-5" />
                    </Button>
                    <Button
                      $main={false}
                      $danger={true}
                      type="button"
                      onClick={() => remove(index)}
                    >
                      <TrashIcon className="h-5 w-5" />
                    </Button>
                  </ButtonContainer>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          )}
        </FieldArray>
      </FieldContainer>
      {error && <ErrorAlert message={error}></ErrorAlert>}
    </>
  );
};

export default ArrayForm;

const FieldContainer = tw.div`space-y-3 rounded-lg bg-slate-100 p-3`;
const FieldHeader = tw.div`flex items-center sticky top-0 bg-slate-100/95 space-x-3`;

const ArrayItem = tw.div<{
  $dragEnabled: boolean | undefined;
}>`relative overflow-hidden rounded-md bg-white p-3 mt-1.5 ${(p) =>
  p.$dragEnabled && "array-shaking-item"}`;
const DisabledView = tw.div`absolute inset-0 flex cursor-move items-center justify-center bg-white/60`;
const ButtonContainer = tw.div`flex justify-center w-full space-x-3`;
const Button = tw.button<{
  $main: boolean;
  $danger?: boolean;
}>`flex items-center justify-center p-1 bg-white hover:bg-slate-50 text-slate-600 hover:bg-slate-800 hover:text-slate-100 mb-1.5 transition-all duration-500 ${({
  $main,
}) => ($main ? "rounded-full" : "rounded-b-full")} ${({ $danger }) =>
  $danger && "hover:bg-rose-500 hover:text-rose-100"}`;
const SortButton = tw.button<{
  $active: boolean;
}>`rounded-full px-2 py-1 text-2xs uppercase font-semibold flex items-center justify-center  bg-white hover:bg-slate-50 text-slate-600 hover:bg-slate-800 hover:text-slate-100 mb-1.5 transition-all duration-500 ${({
  $active,
}) => $active && `bg-slate-700 text-slate-100 animate-pulse`}`;
