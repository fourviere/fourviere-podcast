import { Formik } from "formik";
import UseCurrentFeed from "../../../hooks/use-current-feed";
import { useTranslation } from "react-i18next";
import ContainerTitle from "@fourviere/ui/lib/container-title";
import CKEditor from "@fourviere/ui/lib/form/fields/ckeditor";
import FormBlocker from "../../../components/form-blocker";

export default function Description() {
  const currentFeed = UseCurrentFeed();
  const { t } = useTranslation("feed", {
    keyPrefix: "forms",
  });
  const { t: tUtils } = useTranslation("utils", { keyPrefix: "" });

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
                labels={{
                  isSaving: tUtils("form.labels.isSaving"),
                  save: tUtils("form.labels.save"),
                  unsavedChanges: tUtils("form.labels.unsavedChanges"),
                }}
              >
                {t("description.title")}
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
