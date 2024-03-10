import { Container } from "@fourviere/ui/lib/box";
import AddField from "@fourviere/ui/lib/form/add-field";
import Undefined from "@fourviere/ui/lib/form/fields/undefined";
import { FormField } from "@fourviere/ui/lib/form/form-field";
import { FieldArray, useField } from "formik";
import { Input } from "@fourviere/ui/lib/form/fields/input";
import VStack from "@fourviere/ui/lib/layouts/v-stack";
import Box from "@fourviere/ui/lib/layouts/box";

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
  return (
    <Box paddingX="3" paddingY="3" wFull bgColor="slate-100" rounded="lg">
      <VStack spacing="2" wFull>
        <FieldArray
          name={name}
          render={(arrayHelpers) => (
            <Container spaceY="sm">
              {values?.map((_, index) => (
                <div key={index}>
                  <FormField
                    id={`${name}.${index}["@"].href`}
                    name={`${name}.${index}["@"].href`}
                    as={Input}
                    initValue={BASE_URL}
                  />
                </div>
              ))}

              <Container flex="row-center" spaceX="sm">
                <AddField
                  onClick={() => {
                    console.log("add");
                    arrayHelpers.push({});
                  }}
                />
              </Container>
              <button onClick={() => arrayHelpers.push(INIT_VALUE)}>
                adsads
              </button>
            </Container>
          )}
        />
      </VStack>
    </Box>
  );
};
