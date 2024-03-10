import { Container } from "@fourviere/ui/lib/box";
import FormSection from "@fourviere/ui/lib/form/form-section";
import FormRow from "@fourviere/ui/lib/form/form-row";
import Input from "@fourviere/ui/lib/form/fields/input";
import { FieldArray, Formik } from "formik";
import { FormField } from "@fourviere/ui/lib/form/form-field";
import UseCurrentFeed from "../../../hooks/use-current-feed";
import { useTranslation } from "react-i18next";

import ContainerTitle from "@fourviere/ui/lib/container-title";

import FormBlocker from "../../../components/form-blocker";
import ResetField from "@fourviere/ui/lib/form/reset-field";
import Undefined from "@fourviere/ui/lib/form/fields/undefined";

const PREFIX = `rss.channel["podcast:value"]`;

export default function V4v() {
  const currentFeed = UseCurrentFeed();
  const { t } = useTranslation("", {
    keyPrefix: "",
  });

  if (!currentFeed) {
    return null;
  }

  return (
    <Formik
      initialValues={currentFeed.feed}
      enableReinitialize
      onSubmit={(values, { setSubmitting }) => {
        currentFeed.update(values);
        setSubmitting(false);
      }}
    >
      {({ values, handleSubmit, dirty, isSubmitting }) => {
        return (
          <Container
            wFull
            flex="col"
            spaceY="sm"
            as="form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <FormBlocker dirty={dirty} />
            <ContainerTitle
              isDirty={dirty}
              isSubmitting={isSubmitting}
              onSave={() => handleSubmit()}
            >
              {t("edit_feed.channel_field.v4v.title")}
            </ContainerTitle>

            <FormSection
              title="Configuration"
              description={t("edit_feed.channel_field.v4v.description")}
            >
              <FormRow
                htmlFor={`${PREFIX}["@"].name`}
                label={t("edit_feed.channel_field.v4v.name")}
              >
                <FormField
                  id={`${PREFIX}["@"].name`}
                  name={`${PREFIX}["@"].name`}
                  as={Input}
                />
              </FormRow>
              <Container flex="row-center" spaceX="sm" spaceY="sm">
                <FormRow
                  htmlFor={`${PREFIX}["@"].customKey`}
                  label={t("edit_feed.channel_field.v4v.customKey")}
                >
                  <FormField
                    id={`${PREFIX}["@"].customKey`}
                    name={`${PREFIX}["@"].customKey`}
                    as={Input}
                  />
                </FormRow>
                <FormRow
                  htmlFor={`${PREFIX}["@"].customValue`}
                  label={t("edit_feed.channel_field.v4v.customValue")}
                >
                  <FormField
                    id={`${PREFIX}["@"].customValue`}
                    name={`${PREFIX}["@"].customValue`}
                    as={Input}
                  />
                </FormRow>
              </Container>
              <FormRow
                htmlFor={`${PREFIX}["@"].type`}
                label={t("edit_feed.channel_field.v4v.type")}
              >
                <FormField
                  id={`${PREFIX}["@"].type`}
                  name={`${PREFIX}["@"].type`}
                  as={Input}
                />
              </FormRow>

              <Container flex="row-center" spaceX="sm">
                <FormRow
                  htmlFor={`${PREFIX}["@"].method`}
                  label={t("edit_feed.channel_field.v4v.method")}
                >
                  <FormField
                    id={`${PREFIX}["@"].method`}
                    name={`${PREFIX}["@"].method`}
                    as={Input}
                  />
                </FormRow>
                <FormRow
                  htmlFor={`${PREFIX}["@"].suggested`}
                  label={t("edit_feed.channel_field.v4v.suggested")}
                >
                  <FormField
                    id={`${PREFIX}["@"].suggested`}
                    name={`${PREFIX}["@"].suggested`}
                    as={Input}
                  />
                </FormRow>
              </Container>
            </FormSection>
            <FormSection
              title="Splits"
              description={t("edit_feed.channel_field.v4v.description")}
            >
              <FieldArray name={`${PREFIX}["podcast:valueRecipient"]`}>
                {({ remove, push }) => (
                  <Container spaceY="5xl">
                    {Array.isArray(
                      values.rss.channel?.["podcast:value"]?.[
                        "podcast:valueRecipient"
                      ],
                    )
                      ? values.rss.channel?.["podcast:value"]?.[
                          "podcast:valueRecipient"
                        ].map((_, index: number) => {
                          return (
                            <Container
                              flex="row-top"
                              spaceX="sm"
                              key={index}
                              card
                            >
                              <Container flex="col" spaceY="sm" wFull>
                                <Container flex="row-center" spaceX="md">
                                  <FormRow
                                    htmlFor={`${PREFIX}.["podcast:valueRecipient"].${index}.@.name`}
                                    label={
                                      t[
                                        "edit_feed.channel_field.v4v.valueRecipient.name"
                                      ]
                                    }
                                  >
                                    <FormField
                                      id={`${PREFIX}.["podcast:valueRecipient"].${index}.@.name`}
                                      name={`${PREFIX}.["podcast:valueRecipient"].${index}.@.name`}
                                      as={Input}
                                    />
                                  </FormRow>
                                  <FormRow
                                    htmlFor={`${PREFIX}.["podcast:valueRecipient"].${index}.@.type`}
                                    label={
                                      t[
                                        "edit_feed.channel_field.v4v.valueRecipient.node"
                                      ]
                                    }
                                  >
                                    <FormField
                                      id={`${PREFIX}.["podcast:valueRecipient"].${index}.@.type`}
                                      name={`${PREFIX}.["podcast:valueRecipient"].${index}.@.type`}
                                      as={Input}
                                    />
                                  </FormRow>
                                </Container>

                                <FormRow
                                  htmlFor={`${PREFIX}.["podcast:valueRecipient"].${index}.@.address`}
                                  label={
                                    t[
                                      "edit_feed.channel_field.v4v.valueRecipient.address"
                                    ]
                                  }
                                >
                                  <FormField
                                    id={`${PREFIX}.["podcast:valueRecipient"].${index}.@.address`}
                                    name={`${PREFIX}.["podcast:valueRecipient"].${index}.@.address`}
                                    as={Input}
                                  />
                                </FormRow>
                                <Container flex="row-center" spaceX="md">
                                  <FormRow
                                    htmlFor={`${PREFIX}.["podcast:valueRecipient"].${index}.@.customKey`}
                                    label={
                                      t[
                                        "edit_feed.channel_field.v4v.valueRecipient.customKey"
                                      ]
                                    }
                                  >
                                    <FormField
                                      id={`${PREFIX}.["podcast:valueRecipient"].${index}.@.customKey`}
                                      name={`${PREFIX}.["podcast:valueRecipient"].${index}.@.customKey`}
                                      as={Input}
                                    />
                                  </FormRow>
                                  <FormRow
                                    htmlFor={`${PREFIX}.["podcast:valueRecipient"].${index}.@.customValue`}
                                    label={
                                      t[
                                        "edit_feed.channel_field.v4v.valueRecipient.customValue"
                                      ]
                                    }
                                  >
                                    <FormField
                                      id={`${PREFIX}.["podcast:valueRecipient"].${index}.@.customValue`}
                                      name={`${PREFIX}.["podcast:valueRecipient"].${index}.@.customValue`}
                                      as={Input}
                                    />
                                  </FormRow>
                                </Container>
                                <Container flex="row-center" spaceX="md">
                                  <FormRow
                                    htmlFor={`${PREFIX}.["podcast:valueRecipient"].${index}.@.split`}
                                    label={
                                      t[
                                        "edit_feed.channel_field.v4v.valueRecipient.split"
                                      ]
                                    }
                                  >
                                    <FormField
                                      id={`${PREFIX}.["podcast:valueRecipient"].${index}.@.split`}
                                      name={`${PREFIX}.["podcast:valueRecipient"].${index}.@.split`}
                                      as={Input}
                                    />
                                  </FormRow>
                                  <FormRow
                                    htmlFor={`${PREFIX}.["podcast:valueRecipient"].${index}.@.fee`}
                                    label={
                                      t[
                                        "edit_feed.channel_field.v4v.valueRecipient.fee"
                                      ]
                                    }
                                  >
                                    <FormField
                                      id={`${PREFIX}.["podcast:valueRecipient"].${index}.@.fee`}
                                      name={`${PREFIX}.["podcast:valueRecipient"].${index}.@.fee`}
                                      as={Input}
                                    />
                                  </FormRow>
                                </Container>
                              </Container>

                              <ResetField
                                onClick={() => {
                                  console.log("remove", index);
                                  remove(index);
                                }}
                              />
                            </Container>
                          );
                        })
                      : null}

                    <Undefined
                      onClick={() =>
                        push({
                          "@": {
                            name: "",
                            type: "",
                            address: "",
                            customKey: "",
                            customValue: "",
                            split: "",
                            fee: "",
                          },
                        })
                      }
                    >
                      {t("ui.forms.empty_field.message")}
                    </Undefined>
                  </Container>
                )}
              </FieldArray>
            </FormSection>
          </Container>
        );
      }}
    </Formik>
  );
}
