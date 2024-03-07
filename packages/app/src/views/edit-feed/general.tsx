import { Container } from "@fourviere/ui/lib/box";
import FormSection from "@fourviere/ui/lib/form/form-section";
import FormRow from "@fourviere/ui/lib/form/form-row";
import Input from "@fourviere/ui/lib/form/fields/input";
import { Formik } from "formik";
import { FormField } from "@fourviere/ui/lib/form/form-field";
import UseCurrentFeed from "../../hooks/use-current-feed";
import useTranslations from "../../hooks/use-translations";
import Select from "@fourviere/ui/lib/form/fields/select";
import PODCASTCATEGORIES from "@fourviere/core/lib/podcast-namespace/categories";
import { FC, useState } from "react";
import FormObjectField from "@fourviere/ui/lib/form/form-object-field";
import { ChannelLinks } from "../../components/form-fields/channel-links";
import ContainerTitle from "@fourviere/ui/lib/container-title";
import CKEditor from "@fourviere/ui/lib/form/fields/ckeditor";
import FormBlocker from "../../components/form-blocker";
import Img from "../../components/form-fields/image";
import { LANGUAGE_BY_LOCALE } from "@fourviere/core/lib/const";
import Drawer from "@fourviere/ui/lib/modals/drawer";
import V4v from "./modals/v4v";
import Button from "@fourviere/ui/lib/button";
import Itunes from "./modals/itunes";
import ButtonCard from "@fourviere/ui/lib/buttonCard";
import BitcoinIcon from "@fourviere/ui/lib/icons/bitcoin";
import ItunesIcon from "@fourviere/ui/lib/icons/itunes";

import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/solid";

import Progress from "@fourviere/ui/lib/progress";

import VStack from "@fourviere/ui/lib/layouts/v-stack";
import HStack from "@fourviere/ui/lib/layouts/h-stack";

export default function General() {
  const currentFeed = UseCurrentFeed();
  const t = useTranslations();
  const [v4vModal, setV4vModal] = useState<boolean>(false);
  const [itunesModal, setItunesModal] = useState<boolean>(false);

  if (!currentFeed) {
    return null;
  }

  return (
    <VStack scroll wFull>
      <VStack scroll>
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
                  {t["edit_feed.presentation.title"]}
                </ContainerTitle>
                <VStack
                  spacing="4"
                  as="form"
                  wFull
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                  }}
                >
                  <FormSection
                    description={t["edit_feed.presentation.title.description"]}
                  >
                    <FormRow
                      name="rss.channel.title"
                      label={t["edit_feed.channel_field.show_name"]}
                    >
                      <FormField
                        id="rss.channel.title"
                        name="rss.channel.title"
                        as={Input}
                        fieldProps={{ size: "lg" }}
                        initValue="My podcast title"
                        emtpyValueButtonMessage={
                          t["ui.forms.empty_field.message"]
                        }
                      />
                    </FormRow>
                    <FormRow name="rss.channel.image.url" label={"test image"}>
                      <FormField
                        id="rss.channel.image.url"
                        name="rss.channel.image.url"
                        as={Img}
                        fieldProps={{
                          feedId: currentFeed.feedId,
                          name: "rss.channel.image.url",
                        }}
                        emtpyValueButtonMessage={
                          t["ui.forms.empty_field.message"]
                        }
                        initValue="https://"
                      />
                    </FormRow>

                    <FormRow
                      name="rss.channel.description"
                      label={t["edit_feed.channel_field.show_description"]}
                    >
                      <FormField
                        id="rss.channel.description"
                        name="rss.channel.description"
                        as={CKEditor as FC}
                        fieldProps={{
                          value: values.rss.channel.description,
                          setFieldValue, //TODO: remove this move into the component
                        }}
                        initValue="My podcast description"
                        emtpyValueButtonMessage={
                          t["ui.forms.empty_field.message"]
                        }
                      />
                    </FormRow>
                    <FormRow
                      name={`rss.channel.["itunes:type"]`}
                      label={t["edit_feed.channel_field.type"]}
                    >
                      <FormField
                        id={`rss.channel.["itunes:type"]`}
                        name={`rss.channel.["itunes:type"]`}
                        fieldProps={{
                          options: [
                            { name: "Episodic", value: "episodic" },
                            { name: "Serial", value: "serial" },
                          ],
                          labelProperty: "name",
                          keyProperty: "value",
                        }}
                        as={Select as FC}
                        initValue="yes"
                        emtpyValueButtonMessage={
                          t["ui.forms.empty_field.message"]
                        }
                      />
                    </FormRow>
                    <ChannelLinks
                      name="rss.channel.link"
                      values={values.rss.channel.link}
                    />
                  </FormSection>

                  <FormSection
                    title={t["edit_feed.indexing.title"]}
                    description={t["edit_feed.indexing.title.description"]}
                  >
                    <FormRow
                      name="rss.channel.category.0"
                      label={t["edit_feed.channel_field.language"]}
                    >
                      <FormField
                        id="rss.channel.language"
                        name="rss.channel.language"
                        as={Select as FC}
                        fieldProps={{
                          options: Object.entries(
                            LANGUAGE_BY_LOCALE as Record<string, string>,
                          ).map(([key, value]) => ({
                            name: key,
                            value: value,
                          })),
                          labelProperty: "value",
                          keyProperty: "name",
                          lowercase: true,
                        }}
                        initValue="en-us"
                        emtpyValueButtonMessage={
                          t["ui.forms.empty_field.message"]
                        }
                      />
                    </FormRow>
                    <FormRow
                      name="rss.channel.category.0"
                      label={t["edit_feed.channel_field.category"]}
                    >
                      <FormField
                        id="rss.channel.category.0"
                        name="rss.channel.category.0"
                        as={Select as FC}
                        fieldProps={{
                          options: PODCASTCATEGORIES,
                          labelProperty: "name",
                          keyProperty: "name",
                        }}
                        initValue="My podcast category"
                        emtpyValueButtonMessage={
                          t["ui.forms.empty_field.message"]
                        }
                      />
                    </FormRow>
                    <FormRow
                      name={`rss.channel.["itunes:explicit"]`}
                      label={t["edit_feed.channel_field.explicit"]}
                    >
                      <FormField
                        id={`rss.channel.["itunes:explicit"]`}
                        name={`rss.channel.["itunes:explicit"]`}
                        fieldProps={{
                          options: [
                            { name: "No", value: "no" },
                            { name: "Yes", value: "yes" },
                          ],
                          labelProperty: "name",
                          keyProperty: "value",
                        }}
                        as={Select as FC}
                        initValue="yes"
                        emtpyValueButtonMessage={
                          t["ui.forms.empty_field.message"]
                        }
                      />
                    </FormRow>
                    <FormRow
                      name={`rss.channel.["itunes:block"]`}
                      label={t["edit_feed.channel_field.block"]}
                    >
                      <FormField
                        id={`rss.channel.["itunes:block"]`}
                        name={`rss.channel.["itunes:block"]`}
                        fieldProps={{
                          options: [
                            { name: "No", value: "no" },
                            { name: "Yes", value: "yes" },
                          ],
                          labelProperty: "name",
                          keyProperty: "value",
                        }}
                        as={Select as FC}
                        initValue="yes"
                        emtpyValueButtonMessage={
                          t["ui.forms.empty_field.message"]
                        }
                      />
                    </FormRow>
                    <FormRow
                      name={`rss.channel.["itunes:complete"]`}
                      label={t["edit_feed.channel_field.complete"]}
                    >
                      <FormField
                        id={`rss.channel.["itunes:complete"]`}
                        name={`rss.channel.["itunes:complete"]`}
                        fieldProps={{
                          options: [
                            { name: "No", value: "no" },
                            { name: "Yes", value: "yes" },
                          ],
                          labelProperty: "name",
                          keyProperty: "value",
                        }}
                        as={Select as FC}
                        initValue="yes"
                        emtpyValueButtonMessage={
                          t["ui.forms.empty_field.message"]
                        }
                      />
                    </FormRow>

                    <FormRow
                      name={`rss.channel.["itunes:new-feed-url"]`}
                      label={t["edit_feed.channel_field.new_feed_url"]}
                    >
                      <FormField
                        id={`rss.channel.["itunes:new-feed-url"]`}
                        name={`rss.channel.["itunes:new-feed-url"]`}
                        as={Input}
                        initValue="Jhon Doe"
                        emtpyValueButtonMessage={
                          t["ui.forms.empty_field.message"]
                        }
                      />
                    </FormRow>
                  </FormSection>
                  <FormSection
                    title={t["edit_feed.ownership.title"]}
                    description={t["edit_feed.ownership.title.description"]}
                  >
                    <FormRow
                      name={`rss.channel.copyright`}
                      label={t["edit_feed.channel_field.copyright"]}
                    >
                      <FormField
                        id={`rss.channel.copyright`}
                        name={`rss.channel.copyright`}
                        as={Input}
                        initValue="© 2021 My Podcast"
                        emtpyValueButtonMessage={
                          t["ui.forms.empty_field.message"]
                        }
                      />
                    </FormRow>
                    <FormRow
                      name={`rss.channel.["itunes:author"]`}
                      label={t["edit_feed.channel_field.author"]}
                    >
                      <FormField
                        id={`rss.channel.["itunes:author"]`}
                        name={`rss.channel.["itunes:author"]`}
                        as={Input}
                        initValue="Jhon Doe"
                        emtpyValueButtonMessage={
                          t["ui.forms.empty_field.message"]
                        }
                      />
                    </FormRow>

                    <FormObjectField
                      emtpyValueButtonMessage={
                        t["ui.forms.empty_field.message"]
                      }
                      fieldName={`rss.channel.["itunes:owner"]`}
                      initValue={{
                        "itunes:name": "Jhon Doe",
                        "itunes:email": "jhon@doe.audio",
                      }}
                      label={t["edit_feed.channel_field.owner"]}
                    >
                      <FormRow
                        name={`rss.channel.["itunes:owner"].name`}
                        label={t["edit_feed.channel_field.owner.name"]}
                      >
                        <FormField
                          id={`rss.channel.["itunes:owner"].["itunes:name"]]`}
                          name={`rss.channel.["itunes:owner"].["itunes:name"]`}
                          as={Input}
                        />
                      </FormRow>
                      <FormRow
                        name={`rss.channel.["itunes:owner"].email`}
                        label={t["edit_feed.channel_field.owner.email"]}
                      >
                        <FormField
                          id={`rss.channel.["itunes:owner"].["itunes:email"]]`}
                          name={`rss.channel.["itunes:owner"].["itunes:email"]`}
                          as={Input}
                        />
                      </FormRow>
                    </FormObjectField>
                  </FormSection>
                </VStack>
              </>
            );
          }}
        </Formik>
        {v4vModal && (
          <Drawer type="right" onClose={() => setV4vModal(false)}>
            <Container scroll style={{ width: "70vw", height: "100vh" }}>
              <V4v />
            </Container>
          </Drawer>
        )}
        {itunesModal && (
          <Drawer type="right" onClose={() => setItunesModal(false)}>
            <Container scroll style={{ width: "70vw", height: "100vh" }}>
              <Itunes />
            </Container>
          </Drawer>
        )}
      </VStack>
      <HStack spacing="4" paddingX="4" paddingY="4">
        <ButtonCard
          title="Value 4 Value"
          description="Designates the cryptocurrency or payment layer that will be used, the
                    transport method for transacting the payments, and a suggested amount
                    denominated in the given cryptocurrency."
          theme="dark"
          topRight={<CheckCircleIcon className="h-5 w-5 text-green-500" />}
          onClick={() => setV4vModal(true)}
          icon={BitcoinIcon}
        />
        <ButtonCard
          title="Value 4 Value"
          description="Designates the cryptocurrency or payment layer that will be used, the
                    transport method for transacting the payments, and a suggested amount
                    denominated in the given cryptocurrency."
          theme="dark"
          topRight={<CheckCircleIcon className="h-5 w-5 text-green-500" />}
          onClick={() => setV4vModal(true)}
          icon={BitcoinIcon}
        />

        <ButtonCard
          title="iTunes"
          topRight={<ExclamationCircleIcon className="h-5 w-5 text-rose-500" />}
          description="Configure your podcast for iTunes. This includes the podcast title, description, category, and more. iTunes is the largest podcast directory and is used by many podcast apps."
          onClick={() => setItunesModal(true)}
          icon={ItunesIcon}
        />

        <ButtonCard
          title="iTunes"
          theme="error"
          topRight={
            <Progress
              progress={50}
              showValue={false}
              height={"sm"}
              width="sm"
            />
          }
          // description="Configure your podcast for iTunes. This includes the podcast title, description, category, and more. iTunes is the largest podcast directory and is used by many podcast apps."
          onClick={() => setItunesModal(true)}
          icon={ItunesIcon}
        />
      </HStack>
    </VStack>
  );
}
