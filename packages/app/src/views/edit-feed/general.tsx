import { Container } from "@fourviere/ui/lib/box";
import FormSection from "@fourviere/ui/lib/form/form-section";
import FormRow from "@fourviere/ui/lib/form/form-row";
import Input from "@fourviere/ui/lib/form/fields/input";
import Text from "@fourviere/ui/lib/form/fields/text";
import { useParams } from "react-router-dom";
import feedStore from "../../store/feed";
import { Field, Formik } from "formik";
import Undefined from "@fourviere/ui/lib/form/fields/undefined";
import { FormField } from "@fourviere/ui/lib/form/form-field";

export default function General() {
  const { feedId } = useParams<{ feedId: string }>();

  if (!feedId) {
    return null;
  }

  const project = feedStore((state) => state.getProjectById(feedId));
  const updateFeed = feedStore((state) => state.updateFeed);

  if (!project) {
    return null;
  }

  return (
    <Formik
      initialValues={project.feed}
      enableReinitialize
      onSubmit={(values, { setSubmitting }) => {
        updateFeed(feedId, values);
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
        /* and other goodies */
      }) => (
        <Container scroll wFull flex="col" as="form" onSubmit={handleSubmit}>
          <FormSection
            title="Presentation"
            description="This is the presentation of your podcast."
          >
            <FormRow name="title" label="title">
              <FormField
                id="rss.channel.0.title"
                name="rss.channel.0.title"
                as={Input}
                setFieldValue={setFieldValue}
                value={values.rss.channel[0].title || ""}
                initValue="My podcast"
              />
            </FormRow>
            <FormRow name="description" label="description">
              <FormField
                id="rss.channel.0.description"
                name="rss.channel.0.description"
                as={Text}
                setFieldValue={setFieldValue}
                value={values.rss.channel[0].description || ""}
                initValue="My podcast description"
              />
            </FormRow>
            <FormRow name="guid" label="guid">
              <Field
                id="rss.channel.0.guid"
                name="rss.channel.0.guid"
                as={Input}
                setFieldValue={setFieldValue}
                value={values.rss.channel[0].title || ""}
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
              <Undefined />
              <Field
                id="rss.channel.0.ttl"
                name="rss.channel.0.ttl"
                as={Input}
                setFieldValue={setFieldValue}
                value={values.rss.channel[0].ttl || 0}
              />
            </FormRow>
          </FormSection>
          <button type="submit">Submit</button>
        </Container>
      )}
    </Formik>
  );
}
