import { FormikErrors, FormikTouched } from "formik";
import { ErrorObject } from "ajv";
import { ArrayFieldConf, Section } from ".";

export function getError({
  touched,
  errors,
  name,
}: {
  touched: FormikTouched<unknown> | undefined;
  errors: FormikErrors<unknown> | undefined;
  name: string;
}): string | undefined {
  return touched && errors
    ? (errors?.[name as keyof typeof errors] as string)
    : undefined;
}

export function ajvErrorsToJsonPath(
  ajvErrors?: ErrorObject[] | null,
): Record<string, string> | undefined {
  // make the "must have required property" error to
  // be assigned to the child that is missing
  // instead with the parent node
  ajvErrors?.forEach((e: ErrorObject) => {
    if (e?.params?.missingProperty) {
      e.instancePath += `/${e?.params?.missingProperty}`;
    }
  });

  return ajvErrors?.reduce((acc, error) => {
    return {
      ...acc,
      // Ajv error paths are in the form of /path/to/field/
      // We want to convert them to path.to.field
      // removing the last /
      [error.instancePath.split("/").join(".").substring(1)]: error.message,
    };
  }, {});
}

export function getLabelByName<T>(sections: Section<T>[], name: string) {
  for (const section of sections) {
    for (const field of section.fields) {
      if (field.name === name) {
        return field.label;
      }
      if (field.component === "array") {
        for (const childField of (field as ArrayFieldConf).childrenFields) {
          const match = name.match(
            RegExp(`${field.name}\\.([0-9])+\\.${childField.name}`),
          );
          if (match) {
            return `${field.label} #${match?.[1]} - ${childField.label}`;
          }
        }
      }
    }
  }
  return "";
}

export function getTouchedByPath(
  obj: FormikTouched<Record<string, unknown>>,
  path: string,
) {
  const keys = path.split(".");
  let value: FormikTouched<Record<string, unknown>> | boolean = obj;
  for (const key of keys) {
    if (value && typeof value === "object") {
      value = value[key] as boolean;
    } else {
      return undefined;
    }
  }
  return value;
}

export function normalizeJsonPath(path: string) {
  return path.replace(".[", "[").replace(".@", `["@"]`);
}

export function extractIterationNumberFtomJsonPath(path: string) {
  const match = path.match(/(\d+)/);
  return match ? match[0] : "";
}
