import { Container } from "@fourviere/ui/lib/box";
import FormSection from "@fourviere/ui/lib/form/form-section";
import FormRow from "@fourviere/ui/lib/form/form-row";
import Input from "@fourviere/ui/lib/form/fields/input";
import Text from "@fourviere/ui/lib/form/fields/text";
import { FieldArray, Formik } from "formik";
import { FormField } from "@fourviere/ui/lib/form/form-field";
import UseCurrentFeed from "../../hooks/useCurrentFeed";
import useTranslations from "../../hooks/useTranslations";

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
      {({
        values,
        errors,
        touched,
        handleChange,
        setFieldValue,
        handleBlur,
        handleSubmit,
        isSubmitting,
      }) => (
        <Container scroll wFull flex="col" as="form" onSubmit={handleSubmit}>
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
                initValue="My podcast description"
              />
            </FormRow>
            <FormRow
              name="rss.channel.0.link"
              label={t["edit-feed.basic.link"]}
            >
              <FieldArray
                name="rss.channel.0.link"
                render={(arrayHelpers) => (
                  <div>
                    {values.rss.channel[0].link &&
                    values.rss.channel[0].link.length > 0 ? (
                      values.rss.channel[0].link.map((friend, index) => (
                        <div key={index}>
                          <FormField
                            id={`rss.channel.0.link.${index}["@"].href`}
                            name={`rss.channel.0.link.${index}["@"].href`}
                            as={Input}
                            initValue="https://..."
                          />
                          <button
                            type="button"
                            onClick={() => arrayHelpers.remove(index)} // remove a friend from the list
                          >
                            -
                          </button>
                        </div>
                      ))
                    ) : (
                      <button
                        type="button"
                        onClick={() => arrayHelpers.push({})}
                      >
                        Add a friend
                      </button>
                    )}
                    <div>
                      <button type="submit">Submit</button>
                    </div>
                  </div>
                )}
              />
            </FormRow>
          </FormSection>
          <FormSection
            title="RSS base info"
            description="This is the presentation of your podcast."
          ></FormSection>
          <FormSection
            title="Technical"
            description="This is the presentation of your podcast."
          >
            <FormRow name="ttl" label="ttl">
              <FormField
                id="rss.channel.0.ttl"
                name="rss.channel.0.ttl"
                as={Input}
                initValue={10}
              />
            </FormRow>
          </FormSection>
          <button type="submit">Submit</button>
        </Container>
      )}
    </Formik>
  );
}
