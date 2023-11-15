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
    "start.start_by_index.errors.podcast_index_misconfigured":
      "Podcast index is misconfigured or disabled, please check your configuration",
    "start.start_by_index.errors.invalid_xml": "The feed is not a valid XML",
    "start.start_by_index.errors.invalid_podcast_feed":
      "The feed is not a valid podcast feed",
    "start.start_by_index.importing_in_progress":
      "Importing in progress... please wait",
    "edit_feed.basic.title": "Basic",
    "edit_feed.basic.show_name": "Show name",
    "edit_feed.basic.show_description": "Show description",
    "edit_feed.basic.image": "Show image",
    "edit_feed.basic.category": "Show category",
    "edit_feed.basic.image.help":
      "Click on the preview to upload the image from your computer or enter the address in the text field.",
    "edit_feed.basic.link": "Link",
    "edit_feed.additional.title": "Additional",
    "edit_feed.additional.language": "Language",
    "edit_feed.additional.copyright": "Copyright",
    "edit_feed.itunes.title": "Itunes specific",
    "edit_feed.itunes.keywords": "Keywords",
    "ui.forms.empty_field.message": "Click here to assign a value",
    "edit_feed.configuration.title": "Configuration",
    "edit_feed.configuration.remotes.title": "Remote configuration",
    "edit_feed.configuration.remotes.description":
      "This section contains the configuration for uploading your assets (images, media files, chapter files and transcriptions) and your xml feed file. The assets can be uploaded to an ftp server or a compatible s3 service like Amazon AWS S3, Google Cloud Storage, Microsoft Azure Blob Storage, DigitalOcean Spaces, Alibaba Cloud OSS (Object Storage Service) and many more",
    "edit_feed.configuration.remotes.category": "Remote destination type",
    "edit_feed.configuration.s3.endpoint": "Endpoint",
    "edit_feed.configuration.s3.region": "Region",
    "edit_feed.configuration.s3.bucket_name": "Bucket",
    "edit_feed.configuration.s3.access_key": "Access key",
    "edit_feed.configuration.s3.secret_key": "Secret key",
    "edit_feed.configuration.s3.http_host": "Public base url",
    "edit_feed.configuration.s3.https": "Https / Http",
    "edit_feed.configuration.s3.path": "Path",
    "edit_feed.configuration.s3.https.info": "Check for enabling https",
    "edit_feed.configuration.ftp.host": "Host",
    "edit_feed.configuration.ftp.port": "Port",
    "edit_feed.configuration.ftp.user": "Username",
    "edit_feed.configuration.ftp.password": "Password",
    "edit_feed.configuration.ftp.path": "Path",
    "edit_feed.configuration.ftp.http_host": "Public base url",
    "edit_feed.configuration.ftp.https": "Https / Http",
    "edit_feed.configuration.ftp.https.info": "Check for enabling https",
    "edit_feed.source-code.title": "Source code",
    "configurations.title": "Fourviere global configurations",

    "configurations.locale.title": "Locale",
    "configurations.locale.description":
      "This section contains the configuration for the locale of your feed. The locale is used to change the application language",
    "configurations.locale.language": "Language",
    "configurations.podcast_index.title": "Podcast index configuration",
    "configurations.podcast_index.description":
      "Podcast Index maintains a large, open directory of podcasts, accessible to anyone. This database is an alternative to more closed systems, offering a broader range of podcast listings without platform-specific restrictions.",
    "configurations.podcast_index.enabled": "Enabled podcast index",
    "configurations.podcast_index.enabled.label":
      "Check to enable the podcast index import feature when creating a new feed",
    "configurations.podcast_index.api_key": "Api key",
    "configurations.podcast_index.api_secret": "Api secret",
  },
} as const;

export default TRANSLATIONS;
