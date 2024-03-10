import { Formik } from "formik";
import UseCurrentFeed from "../../../hooks/use-current-feed";
import { useTranslation } from "react-i18next";
import ContainerTitle from "@fourviere/ui/lib/container-title";
import CKEditor from "@fourviere/ui/lib/form/fields/ckeditor";
import FormBlocker from "../../../components/form-blocker";

export default function Description() {
  const currentFeed = UseCurrentFeed();
  const { t } = useTranslation("", {
    keyPrefix: "",
  });

  if (!currentFeed) {
    return null;
  }

  return (
    <>
      <Formik
        initialValues={currentFeed.feed}
        enableReinitialize
        onSubmit={(values, { setSubmitting }) => {
          currentFeed.update(values);
          setSubmitting(false);
        }}
      >
        {({ values, setFieldValue, handleSubmit, dirty, isSubmitting }) => {
          return (
            <>
              <FormBlocker dirty={dirty} />
              <ContainerTitle
                isDirty={dirty}
                isSubmitting={isSubmitting}
                onSave={() => handleSubmit()}
              >
                {t("edit_feed.presentation.title")}
              </ContainerTitle>

              <CKEditor
                value={values.rss.channel.description}
                setFieldValue={setFieldValue}
                name="rss.channel.description"
              />
            </>
          );
        }}
      </Formik>
    </>
  );
}
