import FormRow from "@fourviere/ui/lib/form/form-row";
import { APPLE_PODCAST_CATEGORIES } from "../../consts.tsx";
import { Container } from "@fourviere/ui/lib/box";
import { Field, FieldArray, useField } from "formik";
import Select from "@fourviere/ui/lib/form/fields/select";
import ResetField from "@fourviere/ui/lib/form/reset-field";
import Undefined from "@fourviere/ui/lib/form/fields/undefined";
import useTranslations from "../../hooks/useTranslations.tsx";
import { Feed } from "@fourviere/core/lib/schema/feed";

interface Props {
  name: string;
}

export const Categories = ({ name }: Props) => {
  const t = useTranslations();

  const [input] =
    useField<Feed["rss"]["channel"]["0"]["itunes:category"]>(name);

  const categories = input.value;

  return (
    <FieldArray name={name}>
      {({ remove, push }) => (
        <FormRow name="itunes_ext.categories" label="itunes categories">
          <div className="space-y-1">
            {categories.map((category, index) => {
              const subCategories = APPLE_PODCAST_CATEGORIES.find(
                (e) => e.category === category["@"].text
              )?.subcategories.map((e) => ({
                key: e,
                value: e,
              }));

              return (
                <Container spaceX="sm" flex="row-middle" key={index}>
                  <Field
                    as={Select}
                    keyProperty="category"
                    labelProperty="category"
                    name={`${name}.${index}.@.text`}
                    options={APPLE_PODCAST_CATEGORIES.map((e) => ({
                      category: e.category,
                    }))}
                  />

                  {!!subCategories?.length && (
                    <Field
                      as={Select}
                      keyProperty="key"
                      labelProperty="value"
                      name={`${name}.${index}.['itunes:category'].@.text`}
                      options={subCategories}
                    />
                  )}
                  <div>
                    <ResetField
                      onClick={() => {
                        remove(index);
                      }}
                    />
                  </div>
                </Container>
              );
            })}

            {categories.length < 2 && (
              <Undefined
                onClick={() =>
                  push({
                    "itunes:category": {
                      "@": { text: "Hobbies" },
                    },
                    "@": { text: "Leisure" },
                  })
                }
              >
                {t["ui.forms.empty_field.message"]}
              </Undefined>
            )}
          </div>
        </FormRow>
      )}
    </FieldArray>
  );
};
