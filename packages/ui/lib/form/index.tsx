import ContainerTitle from "@fourviere/ui/lib/container-title";
import FormRow from "@fourviere/ui/lib/form/form-row";
import FormSection from "@fourviere/ui/lib/form/form-section";
import VStack from "@fourviere/ui/lib/layouts/v-stack";
import { Formik, FormikValues, Field as FormikField, FieldProps } from "formik";
import Boolean from "@fourviere/ui/lib/form/fields/boolean";
import Ajv from "ajv";
import localize from "ajv-i18n/localize";
import { useTranslation } from "react-i18next";
import Grid, { GridCell } from "@fourviere/ui/lib/layouts/grid";
import Input from "@fourviere/ui/lib/form/fields/input";
import Select from "@fourviere/ui/lib/form/fields/select";
import { ComponentType, InputHTMLAttributes } from "react";
import ArrayForm from "@fourviere/ui/lib/form/fields/array";

function getValueByPath(obj: Record<string, unknown>, path: string) {
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

type Section = {
  title: string;
  description: string;
  hideTitle?: boolean;
  fields: Array<
    {
      id: string;
      name: string;
      label: string;
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
    } & { options?: Record<string, unknown> } & {
      // input
      placeholder?: string;
      type?: "number" | "text" | "password";
    }
  >;
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
        const ajv = new Ajv({
          allErrors: true,
        });

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
          throw new Error("Invalid form");
        }
      }}
      onSubmit={(values, { setSubmitting }) => {
        onSubmit(values);
        setSubmitting(false);
      }}
    >
      {({ dirty, isSubmitting, handleSubmit, isValid, touched, errors }) => (
        <VStack>
          <ContainerTitle
            isDirty={dirty}
            isDisabled={!isValid}
            isSubmitting={isSubmitting}
            onSave={() => handleSubmit()}
          >
            {title}
          </ContainerTitle>
          {JSON.stringify(errors)}

          {sections.map((section) => (
            <FormSection
              key={section.title}
              title={section.title}
              description={section.description}
              hideTitle={section.hideTitle}
            >
              <Grid cols="1" mdCols="2" spacing="4">
                {section.fields.map((field, index) => {
                  return (
                    <GridCell
                      key={index}
                      mdColSpan={field.width === "1/2" ? 1 : 2}
                    >
                      <FormRow
                        key={field.id}
                        htmlFor={field.id}
                        label={field.component !== "boolean" ? field.label : ""}
                      >
                        <FormikField
                          name={field.name}
                          label={field.label}
                          component={
                            COMPONENT_MAP?.[
                              field.component as keyof typeof COMPONENT_MAP
                            ] ??
                            field.component ??
                            "input"
                          }
                          touched={getValueByPath(touched, field.name)}
                          style={field.style}
                          {...(field.fieldProps
                            ? { fieldProps: field.fieldProps }
                            : {})}
                          placeholder={field?.placeholder}
                          {...(field.component === "select" && field.options
                            ? { options: field.options }
                            : {})}
                          {...(field.component === "input" && field.type
                            ? { type: field.type }
                            : {})}
                        />
                      </FormRow>
                    </GridCell>
                  );
                })}
              </Grid>
            </FormSection>
          ))}
        </VStack>
      )}
    </Formik>
  );
}
