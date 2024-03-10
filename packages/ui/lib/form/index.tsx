import ContainerTitle from "@fourviere/ui/lib/container-title";
import FormRow from "@fourviere/ui/lib/form/form-row";
import FormSection from "@fourviere/ui/lib/form/form-section";
import VStack from "@fourviere/ui/lib/layouts/v-stack";
import { Formik, FormikValues, Field as FormikField } from "formik";
import Boolean from "@fourviere/ui/lib/form/fields/boolean";
import Ajv from "ajv";
import localize from "ajv-i18n/localize";
import { useTranslation } from "react-i18next";
import Grid, { GridCell } from "@fourviere/ui/lib/layouts/grid";
import Input from "@fourviere/ui/lib/form/fields/input";
import Select from "@fourviere/ui/lib/form/fields/select";

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
} as const;

export default function Form<DataType extends FormikValues>({
  data,
  sections,
  title,
  onSubmit,
  schema,
}: {
  title: string;
  sections: Array<{
    title: string;
    description: string;
    fields: Array<
      {
        id: string;
        name: string;
        label: string;

        style?: string;
        defaultValue?: unknown;
        component: keyof typeof COMPONENT_MAP;
        fieldProps?: Record<string, unknown>;
        width?: "1" | "1/2";
      } & { options?: Record<string, unknown> } & {
        placeholder?: string;
        type?: "number" | "text" | "password";
      }
    >;
  }>;
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
          console.log(errors);
          return errors;
          throw new Error("Invalid form");
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

          {sections.map((section) => (
            <FormSection
              key={section.title}
              title={section.title}
              description={section.description}
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
                        {COMPONENT_MAP?.[field.component] ? (
                          <FormikField
                            name={field.name}
                            label={field.label}
                            component={COMPONENT_MAP[field.component]}
                            touched={getValueByPath(touched, field.name)}
                            style={field.style}
                            placeholder={field?.placeholder}
                            {...(field.component === "select" && field.options
                              ? { options: field.options }
                              : {})}
                            {...(field.component === "input" && field.type
                              ? { type: field.type }
                              : {})}
                          />
                        ) : null}
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
