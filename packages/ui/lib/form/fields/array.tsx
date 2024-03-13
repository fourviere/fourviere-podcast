import React, { useEffect, useMemo, useState } from "react";
import { FieldArray, Field, FieldProps } from "formik";
import { Reorder } from "framer-motion";
import Input from "./input";
import FormRow from "../form-row";
import Button from "../../button";
import { ArrowsUpDownIcon, TrashIcon } from "@heroicons/react/24/outline";
import "./array.css";
import tw from "tailwind-styled-components";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { simpleHash } from "../../utils/string";
import { v4 as uuidv4 } from "uuid";

const ArrayForm: React.ComponentType<
  FieldProps<Array<Record<string, unknown>>> & {
    label: string;
    touched: boolean;
  }
> = ({ field, form }) => {
  const [dragEnabled, setDragEnabled] = useState(false);

  const v = useMemo(() => keifyElements(field.value), [field.value]);

  useEffect(() => {
    const t = setTimeout(() => {
      setDragEnabled(false);
    }, 3000);
    return () => clearTimeout(t);
  }, [dragEnabled, field.value]);
  return (
    <FieldContainer>
      <FieldArray name={field.name}>
        {({ insert, remove }) => (
          <Reorder.Group
            axis="y"
            values={v}
            layoutScroll={true}
            className="max-h-[500px] overflow-y-auto text-sm"
            onReorder={(e) => {
              form.setFieldValue(field.name, unkeifyElements(e));
            }}
          >
            <FieldHeader>
              <Button
                size="sm"
                theme={dragEnabled ? "primary" : "secondary"}
                onClick={() => setDragEnabled((d) => !d)}
                Icon={ArrowsUpDownIcon}
              >
                <span>sort</span>
              </Button>
            </FieldHeader>
            {v.map((item, index) => (
              <Reorder.Item
                drag={dragEnabled}
                /* This 2 drag enabled checks are used for allowing the field editing whithout refreshing the value */
                key={dragEnabled ? JSON.stringify(item) : index}
                value={dragEnabled && item}
              >
                <ArrayItem dragEnabled={dragEnabled}>
                  <DeleteButton onClick={() => remove(index)}>
                    <TrashIcon className="h-4 w-4" />
                  </DeleteButton>
                  <FormRow label="miaooai" htmlFor="1">
                    <Field
                      as={Input}
                      name={`${field.name}[${index}]["@"].href`}
                      disabled={dragEnabled}
                    />
                  </FormRow>
                  <FormRow label="miaooai" htmlFor="2">
                    <Field
                      as={Input}
                      name={`${field.name}[${index}]["@"].type`}
                      disabled={dragEnabled}
                    />
                  </FormRow>
                  {dragEnabled && (
                    <DisabledView>
                      <ArrowsUpDownIcon className="h-5 w-5 text-slate-600" />
                    </DisabledView>
                  )}
                </ArrayItem>
                <AddButtonContainer>
                  <AddButton
                    type="button"
                    onClick={() =>
                      insert(index + 1, {
                        "@": {
                          href: "sss",
                          type: "sss",
                          __k: uuidv4(),
                        },
                      })
                    }
                  >
                    <PlusCircleIcon className="h-5 w-5" />
                  </AddButton>
                </AddButtonContainer>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        )}
      </FieldArray>
    </FieldContainer>
  );
};

export default ArrayForm;

const FieldContainer = tw.div`space-y-3 rounded-lg bg-slate-100 p-3`;
const FieldHeader = tw.div`flex justify-between items-center sticky top-0 z-10 bg-slate-100/95 pb-3`;

const ArrayItem = tw.div<{
  dragEnabled: boolean | undefined;
}>`relative overflow-hidden rounded-md bg-white p-3 mt-1.5 ${(p) =>
  p.dragEnabled && "array-shaking-item"}`;
const DeleteButton = tw.button`absolute right-1 top-1 flex items-center justify-center text-slate-800 hover:text-rose-100 w-6 h-6 rounded-full bg-slate-100 hover:bg-rose-600 `;
const DisabledView = tw.div`absolute inset-0 flex cursor-move items-center justify-center bg-white/60`;
const AddButtonContainer = tw.button`flex justify-center w-full`;
const AddButton = tw.button`flex items-center justify-center p-1 bg-white hover:bg-slate-50 rounded-b-full text-slate-600 hover:text-slate-800 mb-1.5`;

// These function are used to derive the key for the array items
function keifyElements(
  arr: Array<Record<string, unknown>>,
): Array<Record<string, unknown>> {
  return (
    arr.map((e: Record<string, unknown>) => ({
      ...e,
      __k: simpleHash(JSON.stringify(e)),
    })) ?? []
  );
}

function unkeifyElements(
  arr: Array<Record<string, unknown>>,
): Array<Record<string, unknown>> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return arr.map(({ __k, ...e }) => e);
}
