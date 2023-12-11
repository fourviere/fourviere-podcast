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
    "edit_feed.presentation.title": "Presentation",
    "edit_feed.presentation.title.description":
      "This area will contain the fields necessary for, once completed, having defined the presentation of the podcast.",
    "edit_feed.indexing.title": "Indexing",
    "edit_feed.indexing.title.description":
      "This area will contain the fields necessary for allowing the podcast client and the podcast directories to index the podcast.",
    "edit_feed.channel_field.show_name": "Show name",
    "edit_feed.channel_field.show_description": "Show description",
    "edit_feed.channel_field.image": "Show image",
    "edit_feed.channel_field.category": "Show category",
    "edit_feed.channel_field.image.help":
      "Click on the preview to upload the image from your computer or enter the address in the text field.",
    "edit_feed.channel_field.link": "Link",
    "edit_feed.ownership.title": "Ownership",
    "edit_feed.ownership.title.description":
      "This section contains fields for specifying the ownership details of the podcast. It includes fields for the show owner's name and email.",
    "edit_feed.itunes_presentation.title": "Itunes presentation",
    "edit_feed.itunes_presentation.title.description":
      "Itunes requires custom presentation fields, here you can set them.",
    "edit_feed.itunes_indexing.title": "Itunes indexing",
    "edit_feed.itunes_indexing.title.description":
      "Here you can configure the fields used by itunes for feeding their index.",
    "edit_feed.itunes_ownership.title": "Itunes Ownership",
    "edit_feed.itunes_ownership.title.description":
      "Here you can configure specific ownership info for the itunes directory",
    "edit_feed.channel_field.language": "Language",
    "edit_feed.channel_field.copyright": "Copyright",
    "edit_feed.channel_field.explicit": "Explicit",
    "edit_feed.channel_field.block": "Block",
    "edit_feed.channel_field.complete": "Complete",
    "edit_feed.channel_field.author": "Show Author",
    "edit_feed.channel_field.owner": "Show Owner",
    "edit_feed.channel_field.owner.email": "Show owner email",
    "edit_feed.channel_field.owner.name": "Show owner name",
    "edit_feed.channel_field.new_feed_url": "Redirect to new feed url",
    "edit_feed.channel_field.type": "Show type",
    "edit_feed.channel_field.explicit.note": "Contains explicit content",
    "edit_feed.channel_field.itunes.title": "Itunes specific",
    "edit_feed.channel_field.itunes.keywords": "Keywords",
    "edit_feed.channel_field.itunes.category": "Category",
    "edit_feed.channel_field.itunes.image": "Itunes image",
    "edit_feed.channel_field.itunes.complete": "Itunes complete",
    "edit_feed.channel_field.itunes.complete.description":
      "If you will never publish another episode to your show, use this tag.",
    //-----
    "edit_feed.items_fields.media.title": "Media",
    "edit_feed.items_fields.media.description":
      "This section contains the podcast media file and the title",
    "edit_feed.items.title": "Episodes",
    "edit_feed.items_fields.title": "Title",
    "edit_feed.items_fields.guid": "GUID",
    "edit_feed.items_fields.image": "Episode image",
    "edit_feed.items_fields.link": "Episode page",
    "edit_feed.items_fields.description": "Episode description",
    "edit_feed.items_fields.enclosure_url": "Media file",
    "edit_feed.items_fields.enclosure_url.url": "File url",
    "edit_feed.items_fields.enclosure_url.type": "File type",
    "edit_feed.items_fields.enclosure_url.length": "Length in bytes",
    "edit_feed.items_fields.presentation.title": "Presentation",
    "edit_feed.items_fields.presentation.description":
      "This area will contain the fields necessary for, once completed, having defined the presentation of the episode.",
    "edit_feed.items_fields.itunes.title": "Itunes",
    "edit_feed.items_fields.itunes.description":
      "This area will contain the episode itunes specific fields.",
    "edit_feed.items_fields.duration": "Duration",
    "edit_feed.items_fields.itunes_subtitle": "Subtitle",
    "edit_feed.items_fields.itunes_summary": "Summary",
    //-----

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
