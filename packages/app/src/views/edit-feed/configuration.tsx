import { Container } from "@fourviere/ui/lib/box";
import FormSection from "@fourviere/ui/lib/form/form-section";
import FormRow from "@fourviere/ui/lib/form/form-row";
import Input from "@fourviere/ui/lib/form/fields/input";
import Boolean from "@fourviere/ui/lib/form/fields/boolean";
import { Formik } from "formik";
import { FormField } from "@fourviere/ui/lib/form/form-field";
import UseCurrentFeed from "../../hooks/use-current-feed";
import useTranslations from "../../hooks/use-translations";
import Select from "@fourviere/ui/lib/form/fields/select";
import { FC } from "react";
import ContainerTitle from "@fourviere/ui/lib/container-title";
import FormBlocker from "../../components/form-blocker";
export default function Configuration() {
  const currentFeed = UseCurrentFeed();
  const t = useTranslations();

  if (!currentFeed) {
    return null;
  }

  return (
    <Formik
      initialValues={currentFeed.configuration}
      enableReinitialize
      onSubmit={(values, { setSubmitting }) => {
        currentFeed.updateConfiguration(values);
        setSubmitting(false);
      }}
    >
      {({ values, handleSubmit, setFieldValue, dirty, isSubmitting }) => {
        return (
          <Container scroll wFull flex="col" as="form" onSubmit={handleSubmit}>
            <FormBlocker dirty={dirty} />
            <ContainerTitle
              isDirty={dirty}
              isSubmitting={isSubmitting}
              onSave={() => handleSubmit()}
            >
              {t["edit_feed.configuration.title"]}
            </ContainerTitle>
            <FormSection
              title={t["edit_feed.configuration.feed.title"]}
              description={t["edit_feed.configuration.feed.description"]}
            >
              <FormRow
                name="feed.filename"
                label={t["edit_feed.configuration.feed.filename"]}
              >
                <FormField
                  id="feed.filename"
                  name="feed.filename"
                  as={Input}
                  fieldProps={{ placeholder: "filename.xml" }}
                />
              </FormRow>
            </FormSection>

            <FormSection
              title={t["edit_feed.configuration.remotes.title"]}
              description={t["edit_feed.configuration.remotes.description"]}
            >
              <FormRow name="" label={t["edit_feed.configuration.title"]}>
                <FormField
                  id="remotes.remote"
                  name="remotes.remote"
                  as={Select as FC}
                  fieldProps={{
                    options: [
                      { name: "s3" },
                      { name: "ftp" },
                      { name: "none" },
                    ],
                    labelProperty: "name",
                    keyProperty: "name",
                  }}
                />
              </FormRow>
              {values.remotes.remote === "s3" && (
                <>
                  <FormRow
                    name="remotes.s3.endpoint"
                    label={t["edit_feed.configuration.s3.endpoint"]}
                  >
                    <FormField
                      id="remotes.s3.endpoint"
                      name="remotes.s3.endpoint"
                      as={Input}
                    />
                  </FormRow>
                  <FormRow
                    name="remotes.s3.region"
                    label={t["edit_feed.configuration.s3.region"]}
                  >
                    <FormField
                      id="remotes.s3.region"
                      name="remotes.s3.region"
                      as={Input}
                    />
                  </FormRow>
                  <FormRow
                    name="remotes.s3.bucket_name"
                    label={t["edit_feed.configuration.s3.bucket_name"]}
                  >
                    <FormField
                      id="remotes.s3.bucket_name"
                      name="remotes.s3.bucket_name"
                      as={Input}
                    />
                  </FormRow>
                  <FormRow
                    name="remotes.s3.access_key"
                    label={t["edit_feed.configuration.s3.access_key"]}
                  >
                    <FormField
                      id="remotes.s3.access_key"
                      name="remotes.s3.access_key"
                      as={Input}
                    />
                  </FormRow>
                  <FormRow
                    name="remotes.s3.secret_key"
                    label={t["edit_feed.configuration.s3.secret_key"]}
                  >
                    <FormField
                      fieldProps={{ type: "password" }}
                      id="remotes.s3.secret_key"
                      name="remotes.s3.secret_key"
                      as={Input}
                    />
                  </FormRow>
                  <FormRow
                    name="remotes.s3.path"
                    label={t["edit_feed.configuration.s3.path"]}
                  >
                    <FormField
                      id="remotes.s3.path"
                      name="remotes.s3.path"
                      as={Input}
                    />
                  </FormRow>
                  <FormRow
                    name="remotes.s3.https"
                    label={t["edit_feed.configuration.s3.https"]}
                  >
                    <FormField
                      id="remotes.s3.https"
                      name="remotes.s3.https"
                      fieldProps={{
                        label: t["edit_feed.configuration.s3.https.info"],
                        value: values.remotes.s3?.https,
                        setFieldValue,
                      }}
                      as={Boolean}
                    />
                  </FormRow>
                  <FormRow
                    name="remotes.s3.http_host"
                    label={t["edit_feed.configuration.s3.http_host"]}
                  >
                    <FormField
                      id="remotes.s3.http_host"
                      name="remotes.s3.http_host"
                      as={Input}
                    />
                  </FormRow>
                </>
              )}

              {values.remotes.remote === "ftp" && (
                <>
                  <FormRow
                    name="remotes.ftp.host"
                    label={t["edit_feed.configuration.ftp.host"]}
                  >
                    <FormField
                      id="remotes.ftp.host"
                      name="remotes.ftp.host"
                      as={Input}
                    />
                  </FormRow>
                  <FormRow
                    name="remotes.ftp.port"
                    label={t["edit_feed.configuration.ftp.port"]}
                  >
                    <FormField
                      id="remotes.ftp.port"
                      name="remotes.ftp.port"
                      as={Input}
                      fieldProps={{ type: "number" }}
                    />
                  </FormRow>
                  <FormRow
                    name="remotes.ftp.user"
                    label={t["edit_feed.configuration.ftp.user"]}
                  >
                    <FormField
                      id="remotes.ftp.user"
                      name="remotes.ftp.user"
                      as={Input}
                    />
                  </FormRow>
                  <FormRow
                    name="remotes.ftp.password"
                    label={t["edit_feed.configuration.ftp.password"]}
                  >
                    <FormField
                      id="remotes.ftp.password"
                      name="remotes.ftp.password"
                      as={Input}
                      fieldProps={{ type: "password" }}
                    />
                  </FormRow>
                  <FormRow
                    name="remotes.ftp.path"
                    label={t["edit_feed.configuration.ftp.path"]}
                  >
                    <FormField
                      id="remotes.ftp.path"
                      name="remotes.ftp.path"
                      as={Input}
                    />
                  </FormRow>
                  <FormRow
                    name="remotes.ftp.https"
                    label={t["edit_feed.configuration.ftp.https"]}
                  >
                    <FormField
                      id="remotes.ftp.https"
                      name="remotes.ftp.https"
                      fieldProps={{
                        label: t["edit_feed.configuration.ftp.https.info"],
                        value: values.remotes.ftp?.https,
                        setFieldValue,
                      }}
                      initValue={true}
                      emtpyValueButtonMessage={
                        t["ui.forms.empty_field.message"]
                      }
                      as={Boolean}
                    />
                  </FormRow>
                  <FormRow
                    name="remotes.ftp.http_host"
                    label={t["edit_feed.configuration.ftp.http_host"]}
                  >
                    <FormField
                      id="remotes.ftp.http_host"
                      name="remotes.ftp.http_host"
                      as={Input}
                    />
                  </FormRow>
                </>
              )}
            </FormSection>
          </Container>
        );
      }}
    </Formik>
  );
}
