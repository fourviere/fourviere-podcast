import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    start: {
      index: {
        welcome:
          "<create>Create a new feed</create> or import an existing one by dragging an existing file or <load_from_url>fetching it from a remote address</load_from_url> <br /> <podcast_index>or <load_from_podcastindex>importing it from podcastindex</load_from_podcastindex></podcast_index>",
      },
      errors: {
        invalid_xml: "The feed is not a valid XML",
        invalid_podcast_feed: "The feed is not a valid podcast feed",
        generic: "Error during fetching podcast feed",
        invalid_url: "The URL provided is not valid",
      },
      start_by_podcast_index: {
        title: "Import new feed from podcast index",
        submit: "Search",
        importing_in_progress: "Importing in progress... please wait",
      },
      // start_by_url: {
      //   title: "Import new feed from remote address",
      //   action: "Import",
      //   errors: {
      //     invalid_xml: "The feed is not a valid XML",
      //     invalid_podcast_feed: "The feed is not a valid podcast feed",
      //     generic: "Error during fetching podcast feed",
      //     invalid_url: "The URL provided is not valid",
      //   },
      // },
      // start_by_index: {
      //   title: "Import a podcast feed from podcastindex",
      //   action: "Search",
      //   errors: {
      //     generic: "Error during fetching podcast index",
      //     podcast_index_misconfigured:
      //       "Podcast index is misconfigured or disabled, please check your configuration",
      //     invalid_xml: "The feed is not a valid XML",
      //     invalid_podcast_feed: "The feed is not a valid podcast feed",
      //   },
      //   importing_in_progress: "Importing in progress... please wait",
      // },
    },
    configuration: {
      index: {
        title: "Configuration",
        locale: {
          title: "Locale",
          description:
            "This section contains the configuration for the locale of your feed. The locale is used to change the application language",
          fields: {
            language: { label: "Language" },
          },
        },
        podcast_index: {
          title: "Podcast index configuration",
          description:
            "Podcast Index maintains a large, open directory of podcasts, accessible to anyone. This database is an alternative to more closed systems, offering a broader range of podcast listings without platform-specific restrictions.",
          fields: {
            enabled: {
              label: "Enable the podcast index import feature",
            },
            api_key: {
              label: "Api key",
            },
            api_secret: {
              label: "Api secret",
            },
          },
        },
      },
    },

    ///OLD

    // edit_feed: {
    //   presentation: {
    //     title: "Presentation",
    //     description:
    //       "This area will contain the fields necessary for, once completed, having defined the presentation of the podcast.",
    //   },
    //   indexing: {
    //     title: "Indexing",
    //     description:
    //       "This area will contain the fields necessary for allowing the podcast client and the podcast directories to index the podcast.",
    //   },
    //   channel_field: {
    //     show_name: "Show name",
    //     show_description: "Show description",

    //     category: "Show category",
    //     image: {
    //       title: "Image",
    //       help: "Click on the preview to upload the image from your computer or enter the address in the text field.",
    //     },
    //     link: "Link",
    //     language: "Language",
    //     copyright: "Copyright",
    //     block: "Block",
    //     complete: "Complete",
    //     author: "Show Author",
    //     owner: "Show Owner",
    //     email: "Show owner email",
    //     name: "Show owner name",
    //     new_feed_url: "Redirect to new feed url",
    //     type: "Show type",
    //     explicit: {
    //       title: "Explicit",
    //       note: "Contains explicit content",
    //     },
    //     itunes: {
    //       title: "Itunes specific",
    //       keywords: "Keywords",
    //       category: "Category",
    //       image: "Itunes image",
    //       complete: {
    //         title: "Itunes complete",
    //         description:
    //           "If you will never publish another episode to your show, use this tag.",
    //       },
    //     },
    //     v4v: {
    //       title: "V4V & founding",
    //       description:
    //         "designates the cryptocurrency or payment layer that will be used, the transport method for transacting the payments, and a suggested amount denominated in the given cryptocurrency.",
    //       name: "Name",
    //       customKey: "Custom key",
    //       customValue: "Custom value",
    //       type: "Type",
    //       suggested: "Suggested",
    //       method: "Method",
    //       valueRecipient: {
    //         name: "Name",
    //         node: "Node",
    //         address: "Address",
    //         customKey: "Custom key",
    //         customValue: "Custom value",
    //         split: "Split",
    //         fee: "Fee",
    //       },
    //     },
    //   },
    //   ownership: {
    //     title: "Ownership",
    //     description:
    //       "This section contains fields for specifying the ownership details of the podcast. It includes fields for the show owner's name and email.",
    //   },
    //   itunes_presentation: {
    //     title: "Itunes presentation",
    //     description:
    //       "Itunes requires custom presentation fields, here you can set them.",
    //   },
    //   itunes_indexing: {
    //     title: "Itunes indexing",
    //     description:
    //       "Here you can configure the fields used by itunes for feeding their index.",
    //   },
    //   itunes_ownership: {
    //     title: "Itunes Ownership",
    //     description:
    //       "Here you can configure specific ownership info for the itunes directory",
    //   },
    //   items: {
    //     add_episode: "Add episode",

    //     delete_episode: {
    //       text: "You are about to delete this episode, are you sure? This operation cannot be reverted",
    //       title: "Delete episode",
    //     },
    //     media: {
    //       title: "Media",
    //       description:
    //         "This section contains the podcast media file and the title",
    //     },
    //     title: "Episodes",
    //     fields: {
    //       title: "Title",
    //       guid: "GUID",
    //       author: "Author",
    //       image: "Episode image",
    //       link: "Episode page",
    //       description: "Episode description",
    //       enclosure_url: "Media file",
    //       url: "File url",
    //       type: "File type",
    //       length: "Length in bytes",
    //       presentation: {
    //         title: "Presentation",
    //         description:
    //           "This area will contain the fields necessary for, once completed, having defined the presentation of the episode.",
    //       },
    //       itunes: {
    //         title: "Itunes",
    //         description:
    //           "This area will contain the episode itunes specific fields.",
    //       },
    //       duration: "Duration",
    //       itunes_subtitle: "Subtitle",
    //       itunes_summary: "Summary",
    //       podcast_season: "Season",
    //       podcast_episode: "Episode",
    //       explicit: "Explicit",
    //       episode_type: "Episode type",
    //     },
    //   },
    //   audio: {
    //     duration: {
    //       error: "Error getting enclosure duration",
    //     },
    //   },
    //   forms: {
    //     empty_field: {
    //       message: "Click here to assign a value",
    //     },
    //     unsaved_changes: {
    //       title: "Unsaved changes",
    //       message:
    //         "You have unsaved changes, are you sure you want to leave this page?",
    //       ok: "Leave",
    //       cancel: "Stay",
    //     },
    //   },
    //   configuration: {
    //     title: "Configuration",
    //     remotes: {
    //       title: "Remote configuration",
    //       description:
    //         "This section contains the configuration for uploading your assets (images, media files, chapter files and transcriptions) and your xml feed file. The assets can be uploaded to an ftp server or a compatible s3 service like Amazon AWS S3, Google Cloud Storage, Microsoft Azure Blob Storage, DigitalOcean Spaces, Alibaba Cloud OSS (Object Storage Service) and many more",
    //       category: "Remote destination type",
    //       s3: {
    //         endpoint: "Endpoint",
    //         region: "Region",
    //         bucket_name: "Bucket",
    //         access_key: "Access key",
    //         secret_key: "Secret key",
    //         http_host: "Public base url",
    //         https: "Https / Http",
    //         path: "Path",
    //         info: "Check for enabling https",
    //       },
    //       ftp: {
    //         host: "Host",
    //         port: "Port",
    //         user: "Username",
    //         password: "Password",
    //         path: "Path",
    //         http_host: "Public base url",
    //         https: "Https / Http",
    //         info: "Check for enabling https",
    //       },
    //     },
    //     feed: {
    //       title: "Feed configuration",
    //       description: "Here you can configure the feed basic settings",
    //       filename: "Feed file name",
    //       actions: {
    //         title: "Actions",
    //         description: "Here some advanced actions for the feed",
    //         overwrite_from_remote:
    //           "Overwrite the feed with the version hosted remotely",
    //       },
    //     },
    //   },
    //   "source-code": {
    //     title: "Source code",
    //   },
    //   "feed-uploader": {
    //     button_label: "Update remote feed",
    //     save_title: "Save your feed",
    //     remote_feed_not_valid:
    //       "The remote feed you are trying to patch is not valid",
    //     ask_overwrite: {
    //       title: "Overwrite",
    //       message:
    //         "You are overwriting the remote feed that seem more recent, are you sure? This operation cannot be reverted",
    //       not_valid:
    //         "The feed URL point to a non valid feed, do you want to overwrite it?",
    //       not_valid_skip_overwrite:
    //         "The feed is not valid and you chose not to overwrite it",
    //       not_last_skip_overwrite:
    //         "The remote feed is not the last version, and you chosed not to overwrite it",
    //     },
    //     error_persisting_feed: "An error occurred while persisting the feed",
    //     error_uploading_feed: "An error occurred while uploading the feed",
    //   },
    //   "feed-sync": {
    //     button_label: "Overwrite feed from remote",
    //     ask_overwrite: {
    //       title: "Overwrite",
    //       message:
    //         "You are overwriting the local feed with the remote one, are you sure? This operation cannot be reverted",
    //     },
    //     error_fetching_feed: "Error during fetching remote feed",
    //   },
    //   "feed-deleter": {
    //     button_label: "Delete this feed",
    //     ask_delete: {
    //       title: "Delete",
    //       message:
    //         "You are about to delete this feed, are you sure? This operation cannot be reverted",
    //     },
    //   },
    // },
    // configurations: {
    //   title: "Fourviere global configurations",
    //   locale: {
    //     title: "Locale",
    //     description:
    //       "This section contains the configuration for the locale of your feed. The locale is used to change the application language",
    //     language: "Language",
    //   },
    //   podcast_index: {
    //     title: "Podcast index configuration",
    //     description:
    //       "Podcast Index maintains a large, open directory of podcasts, accessible to anyone. This database is an alternative to more closed systems, offering a broader range of podcast listings without platform-specific restrictions.",
    //     enabled: {
    //       title: "Enabled podcast index",
    //       label:
    //         "Check to enable the podcast index import feature when creating a new feed",
    //     },
    //     api_key: "Api key",
    //     api_secret: "Api secret",
    //   },
    // },
    // modals: {
    //   confirmation: {
    //     ok: "Ok, continue",
    //     cancel: "Cancel",
    //   },
    // },
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "en", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
