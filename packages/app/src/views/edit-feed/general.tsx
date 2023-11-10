import { Container } from "@fourviere/ui/lib/box";
import FormSection from "@fourviere/ui/lib/form/form-section";
import FormRow from "@fourviere/ui/lib/form/form-row";
import Input from "@fourviere/ui/lib/form/fields/input";
import Text from "@fourviere/ui/lib/form/fields/text";
import { FieldArray, Formik } from "formik";
import { FormField } from "@fourviere/ui/lib/form/form-field";
import UseCurrentFeed from "../../hooks/useCurrentFeed";
import useTranslations from "../../hooks/useTranslations";
import AddField from "@fourviere/ui/lib/form/add-field";
import Undefined from "@fourviere/ui/lib/form/fields/undefined";
import ImageField from "@fourviere/ui/lib/form/fields/image";
import useUpload from "../../hooks/useUpload";
import FormObserver from "../../components/form-observer";
import { Feed } from "@fourviere/core/lib/schema/feed";
export default function General() {
  const currentFeed = UseCurrentFeed();
  const t = useTranslations();

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
      {({ values, setFieldValue, setFieldError, handleSubmit }) => {
        const imageUpload = useUpload({
          feedId: currentFeed.feedId,
          updateField: (value: string) =>
            setFieldValue("rss.channel.0.image.url", value),
          updateError: (value: string) =>
            setFieldError("rss.channel.0.image.url", value),
        });

        return (
          <Container scroll wFull flex="col" as="form" onSubmit={handleSubmit}>
            <FormObserver<Feed>
              updateFunction={(values) => {
                currentFeed.update(values);
              }}
            />
            <FormSection
              title={t["edit-feed.basic.title"]}
              description="This is the presentation of your podcast."
            >
              <FormRow
                name="rss.channel.0.title"
                label={t["edit-feed.basic.show_name"]}
              >
                <FormField
                  id="rss.channel.0.title"
                  name="rss.channel.0.title"
                  as={Input}
                  fieldProps={{ size: "lg" }}
                  initValue="My podcast title"
                  emtpyValueButtonMessage={t["ui.forms.empty_field.message"]}
                />
              </FormRow>
              <FormRow
                name="rss.channel.0.image"
                label={t["edit-feed.basic.image"]}
              >
                <FormField
                  id="rss.channel.0.image.url"
                  name="rss.channel.0.image.url"
                  as={ImageField}
                  fieldProps={{
                    onImageClick: imageUpload.openFile,
                    isUploading: imageUpload.isUploading,
                    helpMessage: t["edit-feed.basic.image.help"],
                  }}
                  emtpyValueButtonMessage={t["ui.forms.empty_field.message"]}
                  initValue="https://"
                />
              </FormRow>

              <FormRow
                name="rss.channel.0.description"
                label={t["edit-feed.basic.show_description"]}
              >
                <FormField
                  id="rss.channel.0.description"
                  name="rss.channel.0.description"
                  as={Text}
                  fieldProps={{
                    value: values.rss.channel[0].description,
                    setFieldValue,
                  }}
                  initValue="My podcast description"
                  emtpyValueButtonMessage={t["ui.forms.empty_field.message"]}
                />
              </FormRow>

              <FormRow
                name="rss.channel.0.link"
                label={t["edit-feed.basic.link"]}
              >
                <FieldArray
                  name="rss.channel.0.link"
                  render={(arrayHelpers) => (
                    <Container spaceY="sm">
                      {values.rss.channel[0].link &&
                      values.rss.channel[0].link.length > 0 ? (
                        <>
                          {values.rss.channel[0].link.map((_, index) => (
                            <div key={index}>
                              <FormField
                                id={`rss.channel.0.link.${index}["@"].href`}
                                name={`rss.channel.0.link.${index}["@"].href`}
                                as={Input}
                                emtpyValueButtonMessage={
                                  t["ui.forms.empty_field.message"]
                                }
                                initValue="https://..."
                                overrideReset={() => arrayHelpers.remove(index)}
                                postSlot={
                                  <AddField
                                    onClick={() =>
                                      arrayHelpers.insert(index, {
                                        "@": {
                                          href: "https://...",
                                        },
                                      })
                                    }
                                  ></AddField>
                                }
                              />
                            </div>
                          ))}
                          <AddField
                            onClick={() =>
                              arrayHelpers.push({
                                "@": {
                                  href: "https://...",
                                },
                              })
                            }
                          />
                        </>
                      ) : (
                        <Undefined
                          onClick={() =>
                            arrayHelpers.push({
                              "@": {
                                href: "https://...",
                              },
                            })
                          }
                        >
                          {t["ui.forms.empty_field.message"]}
                        </Undefined>
                      )}
                    </Container>
                  )}
                />
              </FormRow>
            </FormSection>
          </Container>
        );
      }}
    </Formik>
  );
}
