import ContainerTitle from "@fourviere/ui/lib/container-title";
import FormRow from "@fourviere/ui/lib/form/form-row";
import FormSection from "@fourviere/ui/lib/form/form-section";
import VStack from "@fourviere/ui/lib/layouts/v-stack";
import {
  Formik,
  FormikValues,
  Field as FormikField,
  FieldProps,
  FormikTouched,
} from "formik";
import Boolean from "@fourviere/ui/lib/form/fields/boolean";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import localize from "ajv-i18n/localize";
import { useTranslation } from "react-i18next";
import Grid, { GridCell } from "@fourviere/ui/lib/layouts/grid";
import Input from "@fourviere/ui/lib/form/fields/input";
import Select from "@fourviere/ui/lib/form/fields/select";
import { ComponentType, InputHTMLAttributes } from "react";
import ArrayForm from "@fourviere/ui/lib/form/fields/array";
import ErrorAlert from "../alerts/error";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { ErrorBox } from "../box";

export function getValueByPath(obj: Record<string, unknown>, path: string) {
  const keys = path.split(".");
  let value = obj;
  for (const key of keys) {
    if (value && typeof value === "object") {
      value = value[key] as Record<string, unknown>;
    } else {
      return undefined;
    }
  }
  return value;
}

const COMPONENT_MAP = {
  boolean: Boolean,
  input: Input,
  select: Select,
  array: ArrayForm,
} as const;

type BaseFieldConf = {
  id: string;
  name: string;
  label?: string | null;
  style?: string;
  defaultValue?: unknown;
  component:
    | keyof typeof COMPONENT_MAP
    | ComponentType<
        FieldProps<string, unknown> & {
          label: string;
          touched: boolean;
          fieldProps: { feedId: string };
        } & InputHTMLAttributes<HTMLInputElement>
      >;
  fieldProps?: Record<string, unknown>;
  width?: "1" | "1/2";
};

interface InputFieldConf extends BaseFieldConf {
  placeholder?: string;
  type?: "number" | "text" | "password";
}

interface ArrayFieldConf extends BaseFieldConf {
  childrenFields: FieldConf[];
  defaultItem?: Record<string, unknown>;
  arrayErrorsFrom: string[];
}

interface SelectFieldConf extends BaseFieldConf {
  options: Record<string, unknown>;
}

export type FieldConf =
  | BaseFieldConf
  | InputFieldConf
  | SelectFieldConf
  | ArrayFieldConf;

export type Section = {
  title?: string | null;
  description?: string | null;
  hideTitle?: boolean;
  fields: FieldConf[];
};

export default function Form<DataType extends FormikValues>({
  data,
  sections,
  title,
  onSubmit,
  schema,
}: {
  title: string;
  sections: Array<Section>;
  data: DataType;
  schema: Record<string, unknown>;
  onSubmit: (values: DataType) => void;
}) {
  const { i18n } = useTranslation();

  return (
    <Formik
      initialValues={data}
      enableReinitialize
      validate={(values: DataType) => {
        const ajv = addFormats(
          new Ajv({
            allErrors: true,
          }),
        );

        const validate = ajv.compile(schema);
        const valid = validate(values);
        if (!valid) {
          const language = i18n.language as keyof typeof localize;
          localize[language](validate.errors);
          const errors = validate.errors?.reduce((acc, error) => {
            return {
              ...acc,
              [error.instancePath.split("/").join(".").substring(1)]:
                error.message,
            };
          }, {});
          console.log("Validation errors", errors);
          return errors;
        }
      }}
      onSubmit={(values, { setSubmitting }) => {
        onSubmit(values);
        setSubmitting(false);
      }}
    >
      {({ dirty, isSubmitting, handleSubmit, isValid, touched }) => (
        <VStack>
          <ContainerTitle
            isDirty={dirty}
            isDisabled={!isValid}
            isSubmitting={isSubmitting}
            onSave={() => handleSubmit()}
          >
            {title}
          </ContainerTitle>
          <div className="sticky top-[75px] z-10 p-3">
            {Object.keys(touched).length > 0 && !isValid && (
              <ErrorBox>
                <div className="flex items-center">
                  <ExclamationCircleIcon className="mr-1 h-3 w-3" /> The form
                  has errors
                </div>
              </ErrorBox>
            )}
          </div>

          {sections.map((section) => (
            <FormSection
              key={section.title}
              title={section.title}
              description={section.description}
              hideTitle={section.hideTitle}
            >
              <Grid cols="1" mdCols="2" spacing="4">
                {section.fields.map((field, index) => {
                  return generateFormikField({
                    field,
                    index,
                    touched: getValueByPath(touched, field.name),
                  });
                })}
              </Grid>
            </FormSection>
          ))}
        </VStack>
      )}
    </Formik>
  );
}

export function generateFormikField({
  field,
  index,
  touched,
  fieldNamePrefix,
  postSlot,
}: {
  field: FieldConf;
  index: number;
  touched: FormikTouched<unknown>;
  // Used for array fields
  fieldNamePrefix?: string;
  postSlot?: React.ReactNode;
}) {
  const props: Record<string, unknown> = {
    touched,
  };

  if (field.fieldProps) {
    props["fieldProps"] = field.fieldProps;
  }

  if (field.component === "select" && (field as SelectFieldConf).options) {
    props["options"] = (field as SelectFieldConf).options;
  }

  if (field.component === "input" && (field as InputFieldConf).type) {
    props["type"] = (field as InputFieldConf).type;
    props["placeholder"] = (field as InputFieldConf).placeholder;
  }

  if (field.component === "array" && (field as ArrayFieldConf).childrenFields) {
    props["childrenFields"] = (field as ArrayFieldConf).childrenFields;
    props["defaultItem"] = (field as ArrayFieldConf).defaultItem;
    props["fieldNamePrefix"] = fieldNamePrefix;
  }

  let name = `${fieldNamePrefix ? fieldNamePrefix + "." : ""}${field.name}`;
  // handle the case when the element of the array is a string
  if (name.slice(-1) === ".") {
    name = name.substring(0, name.length - 1);
  }

  return (
    <GridCell key={index} mdColSpan={field.width === "1/2" ? 1 : 2}>
      <FormRow
        key={field.id}
        htmlFor={field.id}
        label={field.component !== "boolean" ? field.label : ""}
      >
        <FormikField
          name={name}
          label={field.label}
          component={
            COMPONENT_MAP?.[field.component as keyof typeof COMPONENT_MAP] ??
            field.component ??
            "input"
          }
          style={field.style}
          {...props}
        />
        {postSlot}
      </FormRow>
    </GridCell>
  );
}
