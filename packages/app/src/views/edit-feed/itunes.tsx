import { Container } from "@fourviere/ui/lib/box";
import FormSection from "@fourviere/ui/lib/form/form-section";
import FormRow from "@fourviere/ui/lib/form/form-row";
import Input from "@fourviere/ui/lib/form/fields/input";
import { Field, FieldArray, Formik } from "formik";
import { FormField } from "@fourviere/ui/lib/form/form-field";
import UseCurrentFeed from "../../hooks/useCurrentFeed";
import useTranslations from "../../hooks/useTranslations";
import Undefined from "@fourviere/ui/lib/form/fields/undefined";
import Select from "@fourviere/ui/lib/form/fields/select";
import FormObserver from "../../components/form-observer";
import { Feed } from "@fourviere/core/lib/schema/feed";
import { APPLE_PODCAST_CATEGORIES } from "../../consts";
import ResetField from "@fourviere/ui/lib/form/reset-field";
import FormObjectField from "@fourviere/ui/lib/form/form-object-field";
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
      {({ values, handleSubmit }) => {
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

              <FieldArray name={`rss.channel.0.["itunes:category"]`}>
                {({ remove, push }) => (
                  <FormRow
                    name="itunes_ext.categories"
                    label="itunes categories"
                  >
                    <div className="space-y-1">
                      {values.rss.channel[0]["itunes:category"].map(
                        (category, index) => {
                          const subCategories = APPLE_PODCAST_CATEGORIES.find(
                            (e) => e.category === category["@"].text
                          )?.subcategories.map((e) => ({
                            key: e,
                            value: e,
                          }));

                          return (
                            <Container
                              spaceX="sm"
                              flex="row-middle"
                              key={index}
                            >
                              <Field
                                as={Select}
                                keyProperty="category"
                                labelProperty="category"
                                name={`rss.channel.0.['itunes:category'].${index}.@.text`}
                                options={APPLE_PODCAST_CATEGORIES.map((e) => ({
                                  category: e.category,
                                }))}
                              />

                              {!!subCategories?.length && (
                                <Field
                                  as={Select}
                                  keyProperty="key"
                                  labelProperty="value"
                                  name={`rss.channel.0.['itunes:category'].${index}.['itunes:category'].@.text`}
                                  options={subCategories}
                                />
                              )}
                              <div>
                                <ResetField
                                  onClick={() => {
                                    remove(index);
                                  }}
                                />
                              </div>
                            </Container>
                          );
                        }
                      )}

                      {values.rss.channel[0]["itunes:category"].length < 2 && (
                        <Undefined
                          onClick={() =>
                            push({
                              "itunes:category": {
                                "@": { text: "Hobbies" },
                              },
                              "@": { text: "Leisure" },
                            })
                          }
                        >
                          {t["ui.forms.empty_field.message"]}
                        </Undefined>
                      )}
                    </div>
                  </FormRow>
                )}
              </FieldArray>

              <FormObjectField
                emtpyValueButtonMessage={t["ui.forms.empty_field.message"]}
                fieldName={`rss.channel.0.["itunes:owner"]`}
                initValue={{
                  "itunes:name": "Jhon Doe",
                  "itunes:email": "jhon@doe.audio",
                }}
                label={t["edit_feed.additional.owner"]}
              >
                <FormRow
                  name={`rss.channel.0.["itunes:owner"].name`}
                  label={t["edit_feed.additional.owner.name"]}
                >
                  <FormField
                    id={`rss.channel.0.["itunes:owner"].["itunes:name"]]`}
                    name={`rss.channel.0.["itunes:owner"].["itunes:name"]`}
                    as={Input}
                  />
                </FormRow>
                <FormRow
                  name={`rss.channel.0.["itunes:owner"].email`}
                  label={t["edit_feed.additional.owner.email"]}
                >
                  <FormField
                    id={`rss.channel.0.["itunes:owner"].["itunes:email"]]`}
                    name={`rss.channel.0.["itunes:owner"].["itunes:email"]`}
                    as={Input}
                  />
                </FormRow>
              </FormObjectField>
            </FormSection>
          </Container>
        );
      }}
    </Formik>
  );
}
