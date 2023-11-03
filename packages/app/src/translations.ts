const TRANSLATIONS = {
  en: {
    "start.create": "Create a new feed",
    "start.or": "or open from",
    "start.open_file": "file",
    "start.load_from_url": "remote address",
    "start.load_from_podcastindex": "import from podcastindex",
    "start.start_by_url.title": "Import new feed from remote address",
    "start.start_by_url.action": "Import",
    "start.start_by_url.errors.invalid_xml": "The feed is not a valid XML",
    "start.start_by_url.errors.invalid_podcast_feed":
      "The feed is not a valid podcast feed",
    "start.start_by_url.errors.generic": "Error during fetching podcast feed",
  },
} as const;

export default TRANSLATIONS;
