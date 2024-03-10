import ContainerTitle from "@fourviere/ui/lib/container-title";
import { FormField } from "@fourviere/ui/lib/form/form-field";
import FormRow from "@fourviere/ui/lib/form/form-row";
import FormSection from "@fourviere/ui/lib/form/form-section";
import VStack from "@fourviere/ui/lib/layouts/v-stack";
import { Formik, FormikValues } from "formik";
import Boolean from "@fourviere/ui/lib/form/fields/boolean";
import Ajv from "ajv";
import localize, { Language } from "ajv-i18n/localize";
import { useTranslation } from "react-i18next";

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
    fields: Array<{
      id: string;
      name: string;
      label: string;
      type: string;
      defaultValue: unknown;
      component: React.ElementType;
      fieldProps?: Record<string, unknown>;
    }>;
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
          return errors;
          console.log(errors);
        }
      }}
      onSubmit={(values, { setSubmitting }) => {
        onSubmit(values);
        setSubmitting(false);
      }}
    >
      {({
        setFieldValue,
        dirty,
        isSubmitting,
        handleSubmit,
        isValid,
        errors,
        touched,
      }) => (
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
              {section.fields.map((field) => (
                <FormRow
                  key={field.id}
                  htmlFor={field.id}
                  label={field.component !== Boolean ? field.label : ""}
                >
                  <FormField
                    id={field.id}
                    name={field.name}
                    fieldProps={{
                      label: field.label,
                      setFieldValue,
                      ...field.fieldProps,
                      error:
                        getValueByPath(touched, field.name) &&
                        errors[field.name],
                    }}
                    as={field.component}
                  />
                </FormRow>
              ))}
            </FormSection>
          ))}
        </VStack>
      )}
    </Formik>
  );
}
