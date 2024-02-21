import { Container } from "@fourviere/ui/lib/box";
import FormSection from "@fourviere/ui/lib/form/form-section";
import FormRow from "@fourviere/ui/lib/form/form-row";
import Input from "@fourviere/ui/lib/form/fields/input";
import AudioField from "../../components/form-fields/audio";
import { Formik } from "formik";
import Img from "../../components/form-fields/image";
import { FormField } from "@fourviere/ui/lib/form/form-field";
import UseCurrentFeed from "../../hooks/use-current-feed";
import useTranslations from "../../hooks/use-translations";
import { useNavigate, useParams } from "react-router-dom";
import { FullPageColumnLayout } from "@fourviere/ui/lib/layouts/full-page";
import { ItemLink } from "../../components/form-fields/item-link";
import Boolean from "@fourviere/ui/lib/form/fields/boolean";
import Select from "@fourviere/ui/lib/form/fields/select";
import episodeType from "@fourviere/core/lib/apple/episode-type";
import ContainerTitle from "@fourviere/ui/lib/container-title";
import CKEditor from "@fourviere/ui/lib/form/fields/ckeditor";
import FormBlocker from "../../components/form-blocker";
import Duration from "../../components/form-fields/audio/duration";
import feedStore from "../../store/feed";
import Button from "@fourviere/ui/lib/button";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import useConfirmationModal from "../../hooks/use-confirmation-modal";

export default function ItemGeneral() {
  const currentFeed = UseCurrentFeed();
  const { itemGUID } = useParams<{ itemGUID: string }>(); //todo: fix using guid
  const t = useTranslations();
  const { deleteEpisodeFromProject } = feedStore((state) => state);
  const navigate = useNavigate();
  const { askForConfirmation, renderConfirmationModal } =
    useConfirmationModal();

  const itemIndex = currentFeed?.feed.rss.channel[0].item?.findIndex(
    (item) => item.guid["#text"] === itemGUID,
  );

  if (!currentFeed) {
    navigate(`/`);
    return null;
  }

  if (itemIndex === -1) {
    navigate(`/feed/${currentFeed.feedId}/feed-items`);
    return null;
  }

  return (
    <>
      {renderConfirmationModal()}
      <FullPageColumnLayout>
        <Formik
          initialValues={currentFeed.feed}
          enableReinitialize
          onSubmit={(values, { setSubmitting }) => {
            currentFeed.update(values);
            setSubmitting(false);
          }}
        >
          {({ setFieldValue, handleSubmit, values, dirty, isSubmitting }) => {
            const [skipExitProtection, setSkipExitProtection] =
              useState<boolean>(false);

            const remove = () => {
              askForConfirmation({
                title: t["edit_feed.feed-deleter.ask_delete.title"],
                message: t["edit_feed.items.delete_episode"],
              }).then((del) => {
                if (itemGUID && del) {
                  setSkipExitProtection(true);
                  deleteEpisodeFromProject(currentFeed.feedId!, itemGUID);
                  navigate(`/feed/${currentFeed.feedId}/feed-items`);
                }
              });
            };

            return (
              <Container
                scroll
                wFull
                spaceY="3xl"
                flex="col"
                as="form"
                onSubmit={handleSubmit}
              >
                {!skipExitProtection && <FormBlocker dirty={dirty} />}
                <ContainerTitle
                  isDirty={dirty}
                  isSubmitting={isSubmitting}
                  onSave={() => handleSubmit()}
                >
                  {values.rss.channel[0].item?.[Number(itemIndex)].title}
                </ContainerTitle>

                <FormSection
                  title={t["edit_feed.items_fields.media.title"]}
                  description={t["edit_feed.items_fields.media.description"]}
                >
                  <FormRow
                    name="rss.channel.0.item[${itemIndex}].enclosure.@.url"
                    label={t["edit_feed.items_fields.enclosure_url"]}
                  >
                    <FormField<typeof AudioField>
                      id={`rss.channel.0.item[${itemIndex}].enclosure.@`}
                      name={`rss.channel.0.item[${itemIndex}].enclosure.@`}
                      as={AudioField}
                      fieldProps={{
                        feedId: currentFeed.feedId,
                        name: `rss.channel.0.item[${itemIndex}].enclosure.@`,
                      }}
                      initValue="https://www.spreaker.com/user/brainrepo/ep-190-matteo-croce-kernel"
                      emtpyValueButtonMessage={
                        t["ui.forms.empty_field.message"]
                      }
                    />
                  </FormRow>

                  <FormRow
                    name={`rss.channel.0.item[${itemIndex}]["itunes:duration"]`}
                    label={t["edit_feed.items_fields.duration"]}
                  >
                    <FormField
                      id={`rss.channel.0.item[${itemIndex}]["itunes:duration"]`}
                      name={`rss.channel.0.item[${itemIndex}]["itunes:duration"]`}
                      as={Duration}
                      fieldProps={{
                        audioFieldName: `rss.channel.0.item[${itemIndex}].enclosure.@.url`,
                        durationFieldName: `rss.channel.0.item[${itemIndex}]["itunes:duration"]`,
                      }}
                      initValue={0}
                      emtpyValueButtonMessage={
                        t["ui.forms.empty_field.message"]
                      }
                    />
                  </FormRow>
                </FormSection>
                <FormSection
                  title={t["edit_feed.items_fields.presentation.title"]}
                  description={
                    t["edit_feed.items_fields.presentation.description"]
                  }
                >
                  <FormRow
                    name="rss.channel.0.title"
                    label={t["edit_feed.items_fields.title"]}
                  >
                    <FormField
                      id={`rss.channel.0.item[${itemIndex}].title`}
                      name={`rss.channel.0.item[${itemIndex}].title`}
                      as={Input}
                      fieldProps={{ size: "lg" }}
                      initValue="My podcast title"
                      emtpyValueButtonMessage={
                        t["ui.forms.empty_field.message"]
                      }
                    />
                  </FormRow>

                  <FormRow
                    name={`rss.channel.0.item[${itemIndex}]["podcast:season"]`}
                    label={t["edit_feed.items_fields.podcast_season"]}
                  >
                    <FormField
                      id={`rss.channel.0.item[${itemIndex}]["podcast:season"]`}
                      name={`rss.channel.0.item[${itemIndex}]["podcast:season"]`}
                      as={Input}
                      initValue="1"
                      emtpyValueButtonMessage={
                        t["ui.forms.empty_field.message"]
                      }
                    />
                  </FormRow>
                  <FormRow
                    name={`rss.channel.0.item[${itemIndex}]["podcast:episode"]`}
                    label={t["edit_feed.items_fields.podcast_episode"]}
                  >
                    <FormField
                      id={`rss.channel.0.item[${itemIndex}]["podcast:episode"]`}
                      name={`rss.channel.0.item[${itemIndex}]["podcast:episode"]`}
                      as={Input}
                      initValue="1"
                      emtpyValueButtonMessage={
                        t["ui.forms.empty_field.message"]
                      }
                    />
                  </FormRow>

                  <FormRow
                    name="rss.channel.0.guid.#text"
                    label={t["edit_feed.items_fields.guid"]}
                  >
                    <Container flex="col" spaceY="md">
                      <FormField
                        id={`rss.channel.0.item[${itemIndex}].guid.#text`}
                        name={`rss.channel.0.item[${itemIndex}].guid.#text`}
                        as={Input}
                        initValue="Unique identifier for the episode"
                        emtpyValueButtonMessage={
                          t["ui.forms.empty_field.message"]
                        }
                      />

                      <FormField
                        id={`rss.channel.0.item[${itemIndex}].guid.@.isPermaLink`}
                        name={`rss.channel.0.item[${itemIndex}].guid.@.isPermaLink`}
                        fieldProps={{
                          label: "Is Permalink",
                          setFieldValue,
                          value:
                            values.rss.channel[0].item?.[Number(itemIndex)]
                              .guid?.["@"]?.isPermaLink,
                          mapBoolean: (b: boolean) => (b ? "true" : "false"),
                          unmapBoolean: (b: string) => b === "true",
                        }}
                        as={Boolean}
                      />
                    </Container>
                  </FormRow>
                  <FormRow
                    name={`rss.channel.0.item[${itemIndex}].author`}
                    label={t["edit_feed.items_fields.author"]}
                  >
                    <FormField
                      id={`rss.channel.0.item[${itemIndex}].author]`}
                      name={`rss.channel.0.item[${itemIndex}].author`}
                      as={Input}
                      initValue="Mauro Murru"
                      emtpyValueButtonMessage={
                        t["ui.forms.empty_field.message"]
                      }
                    />
                  </FormRow>

                  <FormRow name="rss.channel.0.image.url" label={"test image"}>
                    <FormField
                      id={`rss.channel.0.item.${itemIndex}.["itunes:image"].@.href`}
                      name={`rss.channel.0.item.${itemIndex}.["itunes:image"].@.href`}
                      as={Img}
                      fieldProps={{
                        feedId: currentFeed.feedId,
                        name: `rss.channel.0.item.${itemIndex}.["itunes:image"].@.href`,
                      }}
                      emtpyValueButtonMessage={
                        t["ui.forms.empty_field.message"]
                      }
                      initValue="https://"
                    />
                  </FormRow>
                  <ItemLink
                    name={`rss.channel.0.item[${itemIndex}].link`}
                    values={
                      values.rss.channel[0].item?.[Number(itemIndex)].link
                    }
                  />
                  <FormRow
                    name="rss.channel.0.description"
                    label={t["edit_feed.items_fields.description"]}
                  >
                    <FormField
                      id={`rss.channel.0.item[${itemIndex}].description`}
                      name={`rss.channel.0.item[${itemIndex}].description`}
                      as={CKEditor}
                      fieldProps={{
                        value:
                          values.rss.channel[0].item?.[Number(itemIndex)]
                            .description,
                        setFieldValue,
                      }}
                      initValue="My episode description"
                      emtpyValueButtonMessage={
                        t["ui.forms.empty_field.message"]
                      }
                    />
                  </FormRow>

                  <FormRow
                    name="rss.channel.0.item[${itemIndex}]['itunes:explicit']"
                    label={t["edit_feed.items_fields.explicit"]}
                  >
                    <FormField
                      id={`rss.channel.0.item[${itemIndex}]['itunes:explicit']`}
                      name={`rss.channel.0.item[${itemIndex}]['itunes:explicit']`}
                      fieldProps={{
                        label: "Explicit",
                        setFieldValue,
                        value:
                          values.rss.channel[0].item?.[Number(itemIndex)][
                            "itunes:explicit"
                          ],
                        mapBoolean: (b: boolean) => (b ? "true" : "clean"),
                        unmapBoolean: (b: string) => b === "true",
                      }}
                      as={Boolean}
                    />
                  </FormRow>
                </FormSection>
                <FormSection
                  title={t["edit_feed.items_fields.itunes.title"]}
                  description={t["edit_feed.items_fields.itunes.description"]}
                >
                  <FormRow
                    name={`rss.channel.0.item[${itemIndex}]["itunes:subtitle"]`}
                    label={t["edit_feed.items_fields.itunes_subtitle"]}
                  >
                    <FormField
                      id={`rss.channel.0.item[${itemIndex}]["itunes:subtitle"]`}
                      name={`rss.channel.0.item[${itemIndex}]["itunes:subtitle"]`}
                      as={Input}
                      initValue="My podcast subtitle"
                      emtpyValueButtonMessage={
                        t["ui.forms.empty_field.message"]
                      }
                    />
                  </FormRow>
                  <FormRow
                    name="rss.channel.0.description"
                    label={t["edit_feed.items_fields.itunes_summary"]}
                  >
                    <FormField<typeof CKEditor>
                      id={`rss.channel.0.item[${itemIndex}]["itunes:summary"]`}
                      name={`rss.channel.0.item[${itemIndex}]["itunes:summary"]`}
                      as={CKEditor}
                      fieldProps={{
                        value:
                          values.rss.channel[0].item?.[Number(itemIndex)][
                            "itunes:summary"
                          ],
                        setFieldValue,
                      }}
                      initValue="My episode sumary"
                      emtpyValueButtonMessage={
                        t["ui.forms.empty_field.message"]
                      }
                    />
                  </FormRow>
                  <FormRow
                    name={`rss.channel.0.item[${itemIndex}]["itunes:episodeType"]`}
                    label={t["edit_feed.items_fields.episode_type"]}
                  >
                    <FormField
                      id={`rss.channel.0.item[${itemIndex}]["itunes:episodeType"]`}
                      name={`rss.channel.0.item[${itemIndex}]["itunes:episodeType"]`}
                      as={Select}
                      fieldProps={{
                        options: episodeType,
                        labelProperty: "value",
                        keyProperty: "name",
                        lowercase: true,
                      }}
                      initValue="full"
                      emtpyValueButtonMessage={
                        t["ui.forms.empty_field.message"]
                      }
                    />
                  </FormRow>
                </FormSection>
                <FormSection
                  title={t["edit_feed.configuration.feed.actions"]}
                  description={
                    t["edit_feed.configuration.feed.actions.description"]
                  }
                >
                  <FormRow name="feed.actions">
                    <Container wFull spaceX="sm" spaceY="sm">
                      <Button
                        size="lg"
                        theme="warning"
                        Icon={TrashIcon}
                        onClick={() => remove()}
                      >
                        {t["edit_feed.items.delete_episode.title"]}
                      </Button>
                    </Container>
                  </FormRow>
                </FormSection>
              </Container>
            );
          }}
        </Formik>
      </FullPageColumnLayout>
    </>
  );
}
