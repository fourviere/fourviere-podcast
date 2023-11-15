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
import Select from "@fourviere/ui/lib/form/fields/select";
import useUpload from "../../hooks/useUpload";
import FormObserver from "../../components/form-observer";
import { Feed } from "@fourviere/core/lib/schema/feed";
import PODCASTCATEGORIES from "@fourviere/core/lib/podcast-namespace/categories";
import { FC } from "react";
import { LANGUAGE_BY_LOCALE } from "../../consts";
export default function Itunes() {
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
              title={t["edit_feed.itunes.title"]}
              description="This is the presentation of your podcast."
            >
              <FormRow
                name={`rss.channel.0.["itunes:keywords"]`}
                label={t["edit_feed.itunes.keywords"]}
              >
                <FormField
                  id={`rss.channel.0.["itunes:keywords"]`}
                  name={`rss.channel.0.["itunes:keywords"]`}
                  as={Input}
                  initValue="technology, news, podcast"
                  emtpyValueButtonMessage={t["ui.forms.empty_field.message"]}
                />
              </FormRow>
            </FormSection>
          </Container>
        );
      }}
    </Formik>
  );
}
