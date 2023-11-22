import { FullPageColumnLayout } from "@fourviere/ui/lib/layouts/full-page";
import React, { FC } from "react";
import SideMenu from "../../components/main-menu";
import { Container } from "@fourviere/ui/lib/box";
import FormSection from "@fourviere/ui/lib/form/form-section";
import FormRow from "@fourviere/ui/lib/form/form-row";
import Input from "@fourviere/ui/lib/form/fields/input";
import Checkbox from "@fourviere/ui/lib/form/fields/checkbox";
import { Formik } from "formik";
import { FormField } from "@fourviere/ui/lib/form/form-field";
import useConfigurations from "../../hooks/useConfigurations";
import useTranslations from "../../hooks/useTranslations";
import FormObserver from "../../components/form-observer";
import { AppState } from "../../store/app";
import Select from "@fourviere/ui/lib/form/fields/select";
import TRANSLATIONS from "../../translations";
import Boolean from "@fourviere/ui/lib/form/fields/boolean";

interface Props {}

const Configurations: React.FC<Props> = () => {
  const { configurations, update } = useConfigurations();
  const t = useTranslations();
  return (
    <FullPageColumnLayout>
      <SideMenu />
      <Formik
        initialValues={configurations}
        enableReinitialize
        onSubmit={(values, { setSubmitting }) => {
          update(values);
          setSubmitting(false);
        }}
      >
        {({ handleSubmit, setFieldValue, values }) => {
          return (
            <Container
              scroll
              wFull
              flex="col"
              as="form"
              onSubmit={handleSubmit}
            >
              <FormObserver<AppState>
                updateFunction={(values) => {
                  //console.log("update", values);
                  update(values);
                }}
              />

              <FormSection
                title={t["configurations.locale.title"]}
                description={t["configurations.locale.description"]}
              >
                <FormRow
                  name="configurations.currentLanguage"
                  label={t["configurations.locale.language"]}
                >
                  <FormField
                    id="locale"
                    name="locale"
                    as={Select as FC}
                    fieldProps={{
                      options: Object.keys(TRANSLATIONS).map((key) => ({
                        value: key,
                        name: key.toUpperCase(),
                      })),
                      labelProperty: "name",
                      keyProperty: "value",
                    }}
                  />
                </FormRow>
              </FormSection>
              <FormSection
                title={t["configurations.podcast_index.title"]}
                description={t["configurations.podcast_index.description"]}
              >
                <FormRow
                  name="services.podcastIndex.enabled"
                  label={t["configurations.podcast_index.enabled"]}
                >
                  <FormField
                    id="services.podcastIndex.enabled"
                    name="services.podcastIndex.enabled"
                    fieldProps={{
                      label: t["configurations.podcast_index.enabled.label"],
                      setFieldValue,
                      value: values.services.podcastIndex.enabled,
                    }}
                    as={Boolean}
                  />
                </FormRow>
                <FormRow
                  name="configurations.services.podcastIndex.apiKey"
                  label={t["configurations.podcast_index.api_key"]}
                >
                  <FormField
                    id="services.podcastIndex.apiKey"
                    name="services.podcastIndex.apiKey"
                    as={Input}
                    initValue="1234"
                    emtpyValueButtonMessage={t["ui.forms.empty_field.message"]}
                  />
                </FormRow>
                <FormRow
                  name="configurations.services.podcastIndex.apiSecret"
                  label={t["configurations.podcast_index.api_secret"]}
                >
                  <FormField
                    id="services.podcastIndex.apiSecret"
                    name="services.podcastIndex.apiSecret"
                    fieldProps={{
                      type: "password",
                    }}
                    initValue="1234"
                    emtpyValueButtonMessage={t["ui.forms.empty_field.message"]}
                    as={Input}
                  />
                </FormRow>
              </FormSection>
            </Container>
          );
        }}
      </Formik>
    </FullPageColumnLayout>
  );
};

export default Configurations;
