import { Container } from "@fourviere/ui/lib/box";
import AddField from "@fourviere/ui/lib/form/add-field";
import Undefined from "@fourviere/ui/lib/form/fields/undefined";
import { FormField } from "@fourviere/ui/lib/form/form-field";
import FormRow from "@fourviere/ui/lib/form/form-row";
import { FieldArray } from "formik";
import useTranslations from "../../hooks/useTranslations";
import Input from "@fourviere/ui/lib/form/fields/input";

const BASE_URL = "https://...";
const INIT_VALUE = {
  "@": {
    href: BASE_URL,
  },
};

interface Props {
  values?: {
    "#text"?: string;
    "@": {
      rel?: string;
      type?: string;
      href?: string;
    };
  }[];
  name: string;
}

export const ChannelLinks = ({ name, values }: Props) => {
  const t = useTranslations();
  return (
    <FormRow name={name} label={t["edit_feed.channel_field.link"]}>
      <FieldArray
        name={name}
        render={(arrayHelpers) => (
          <Container spaceY="sm">
            {values && values.length > 0 ? (
              <>
                {values.map((_, index) => (
                  <div key={index}>
                    <FormField
                      id={`${name}.${index}["@"].href`}
                      name={`${name}.${index}["@"].href`}
                      as={Input}
                      emtpyValueButtonMessage={
                        t["ui.forms.empty_field.message"]
                      }
                      initValue={BASE_URL}
                      overrideReset={() => arrayHelpers.remove(index)}
                      postSlot={
                        <AddField
                          onClick={() => arrayHelpers.insert(index, INIT_VALUE)}
                        ></AddField>
                      }
                    />
                  </div>
                ))}
                <Container flex="row-center" spaceX="sm">
                  <AddField onClick={() => arrayHelpers.push(INIT_VALUE)} />
                </Container>
              </>
            ) : (
              <Undefined onClick={() => arrayHelpers.push(INIT_VALUE)}>
                {t["ui.forms.empty_field.message"]}
              </Undefined>
            )}
          </Container>
        )}
      />
    </FormRow>
  );
};
