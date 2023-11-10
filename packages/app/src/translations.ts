const TRANSLATIONS = {
  en: {
    "start.create": "Create a new feed",
    "start.or": "or",
    "start.import": "or import an existing one",
    "start.open_file": "by dragging an existing file",
    "start.load_from_url": "fetching from a remote address",
    "start.load_from_podcastindex": "importing from podcastindex",
    "start.start_by_url.title": "Import new feed from remote address",
    "start.start_by_url.action": "Import",
    "start.start_by_url.errors.invalid_xml": "The feed is not a valid XML",
    "start.start_by_url.errors.invalid_podcast_feed":
      "The feed is not a valid podcast feed",
    "start.start_by_url.errors.generic": "Error during fetching podcast feed",
    "start.start_by_url.errors.invalid_url": "The URL provided is not valid",
    "start.start_by_index.title": "Import a podcast feed from podcastindex",
    "start.start_by_index.action": "Search",
    "start.start_by_index.errors.generic":
      "Error during fetching podcast index",
    "start.start_by_index.errors.invalid_xml": "The feed is not a valid XML",
    "start.start_by_index.errors.invalid_podcast_feed":
      "The feed is not a valid podcast feed",
    "start.start_by_index.importing_in_progress":
      "Importing in progress... please wait",
    "edit-feed.basic.title": "Basic informations",
    "edit-feed.basic.show_name": "Show name",
    "edit-feed.basic.show_description": "Show description",
    "edit-feed.basic.image": "Show image",
    "edit-feed.basic.link": "Link",
    "ui.forms.empty_field.message": "Click here to assign a value",
  },
} as const;

export default TRANSLATIONS;
