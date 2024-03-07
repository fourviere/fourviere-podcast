import { Container } from "@fourviere/ui/lib/box";
import AddField from "@fourviere/ui/lib/form/add-field";
import Undefined from "@fourviere/ui/lib/form/fields/undefined";
import { FormField } from "@fourviere/ui/lib/form/form-field";
import FormRow from "@fourviere/ui/lib/form/form-row";
import { FieldArray } from "formik";
import useTranslations from "../../hooks/use-translations";
import Input from "@fourviere/ui/lib/form/fields/input";

const BASE_URL = "https://...";

interface Props {
  values?: string[];
  name: string;
}

export const ItemLink = ({ name, values }: Props) => {
  const t = useTranslations();
  return (
    <FormRow htmlFor={name} label={t["edit_feed.items_fields.link"]}>
      <FieldArray
        name={name}
        render={(arrayHelpers) => (
          <Container spaceY="sm">
            {values && values.length > 0 ? (
              <>
                {values.map((_, index) => (
                  <div key={index}>
                    <FormField
                      id={`${name}.${index}`}
                      name={`${name}.${index}`}
                      as={Input}
                      emtpyValueButtonMessage={
                        t["ui.forms.empty_field.message"]
                      }
                      initValue={BASE_URL}
                      overrideReset={() => arrayHelpers.remove(index)}
                      postSlot={
                        <AddField
                          onClick={() => arrayHelpers.insert(index, BASE_URL)}
                        ></AddField>
                      }
                    />
                  </div>
                ))}
                <Container flex="row-center" spaceX="sm">
                  <AddField onClick={() => arrayHelpers.push(BASE_URL)} />
                </Container>
              </>
            ) : (
              <Undefined onClick={() => arrayHelpers.push(BASE_URL)}>
                {t["ui.forms.empty_field.message"]}
              </Undefined>
            )}
          </Container>
        )}
      />
    </FormRow>
  );
};
