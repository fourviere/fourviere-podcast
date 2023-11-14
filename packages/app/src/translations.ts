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
    "edit_feed.basic.title": "Basic informations",
    "edit_feed.basic.show_name": "Show name",
    "edit_feed.basic.show_description": "Show description",
    "edit_feed.basic.image": "Show image",
    "edit_feed.basic.category": "Show category",
    "edit_feed.basic.image.help":
      "Click on the preview to upload the image from your computer or enter the address in the text field.",
    "edit_feed.basic.link": "Link",
    "edit_feed.additional.title": "Additional informations",
    "edit_feed.basic.keywords": "Keywords",
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
  fr: {
    "start.create": "Créer un nouveau flux",
    "start.or": "ou",
    "start.import": "ou importer un existant",
    "start.open_file": "en glissant un fichier existant",
    "start.load_from_url": "récupération depuis une adresse distante",
    "start.load_from_podcastindex": "importation depuis podcastindex",
    "start.start_by_url.title":
      "Importer un nouveau flux depuis une adresse distante",
    "start.start_by_url.action": "Importer",
    "start.start_by_url.errors.invalid_xml": "Le flux n'est pas un XML valide",
    "start.start_by_url.errors.invalid_podcast_feed":
      "Le flux n'est pas un flux de podcast valide",
    "start.start_by_url.errors.generic":
      "Erreur lors de la récupération du flux de podcast",
    "start.start_by_url.errors.invalid_url": "L'URL fournie n'est pas valide",
    "start.start_by_index.title":
      "Importer un flux de podcast depuis podcastindex",
    "start.start_by_index.action": "Rechercher",
    "start.start_by_index.errors.generic":
      "Erreur lors de la récupération de l'index de podcast",
    "start.start_by_index.errors.podcast_index_misconfigured":
      "L'index de podcast est mal configuré ou désactivé, veuillez vérifier votre configuration",
    "start.start_by_index.errors.invalid_xml":
      "Le flux n'est pas un XML valide",
    "start.start_by_index.errors.invalid_podcast_feed":
      "Le flux n'est pas un flux de podcast valide",
    "start.start_by_index.importing_in_progress":
      "Importation en cours... veuillez patienter",
    "edit_feed.basic.title": "Informations de base",
    "edit_feed.basic.show_name": "Nom de l'émission",
    "edit_feed.basic.show_description": "Description de l'émission",
    "edit_feed.basic.image": "Image de l'émission",
    "edit_feed.basic.category": "Catégorie de l'émission",
    "edit_feed.basic.image.help":
      "Cliquez sur l'aperçu pour télécharger l'image depuis votre ordinateur ou entrez l'adresse dans le champ de texte.",
    "edit_feed.basic.link": "Lien",
    "edit_feed.additional.title": "Informations supplémentaires",
    "edit_feed.basic.keywords": "Mots-clés",
    "ui.forms.empty_field.message": "Cliquez ici pour attribuer une valeur",
    "edit_feed.configuration.title": "Configuration",
    "edit_feed.configuration.remotes.title": "Configuration à distance",
    "edit_feed.configuration.remotes.description":
      "Cette section contient la configuration pour le téléchargement de vos actifs (images, fichiers médias, fichiers de chapitres et transcriptions) et votre fichier de flux xml. Les actifs peuvent être téléchargés sur un serveur ftp ou un service compatible s3 comme Amazon AWS S3, Google Cloud Storage, Microsoft Azure Blob Storage, DigitalOcean Spaces, Alibaba Cloud OSS (Object Storage Service) et bien d'autres",
    "edit_feed.configuration.remotes.category":
      "Type de destination à distance",
    "edit_feed.configuration.s3.endpoint": "Point de terminaison",
    "edit_feed.configuration.s3.region": "Région",
    "edit_feed.configuration.s3.bucket_name": "Seau",
    "edit_feed.configuration.s3.access_key": "Clé d'accès",
    "edit_feed.configuration.s3.secret_key": "Clé secrète",
    "edit_feed.configuration.s3.http_host": "URL de base publique",
    "edit_feed.configuration.s3.https": "Https / Http",
    "edit_feed.configuration.s3.path": "Chemin",
    "edit_feed.configuration.s3.https.info": "Cocher pour activer https",
    "edit_feed.configuration.ftp.host": "Hôte",
    "edit_feed.configuration.ftp.port": "Port",
    "edit_feed.configuration.ftp.user": "Nom d'utilisateur",
    "edit_feed.configuration.ftp.password": "Mot de passe",
    "edit_feed.configuration.ftp.path": "Chemin",
    "edit_feed.configuration.ftp.http_host": "URL de base publique",
    "edit_feed.configuration.ftp.https": "Https / Http",
    "edit_feed.configuration.ftp.https.info": "Cocher pour activer https",
    "edit_feed.source-code.title": "Code source",
    "configurations.title": "Configurations globales de Fourviere",

    "configurations.locale.title": "Localisation",
    "configurations.locale.description":
      "Cette section contient la configuration pour la localisation de votre flux. La localisation est utilisée pour changer la langue de l'application",
    "configurations.locale.language": "Langue",
    "configurations.podcast_index.title": "Configuration de l'index de podcast",
    "configurations.podcast_index.description":
      "Podcast Index maintient un large répertoire ouvert de podcasts, accessible à tous. Cette base de données est une alternative aux systèmes plus fermés, offrant une gamme plus large de listes de podcasts sans restrictions spécifiques à la plateforme.",
    "configurations.podcast_index.enabled": "Index de podcast activé",
    "configurations.podcast_index.enabled.label":
      "Cocher pour activer la fonction d'importation de l'index de podcast lors de la création d'un nouveau flux",
    "configurations.podcast_index.api_key": "Clé API",
    "configurations.podcast_index.api_secret": "Secret API",
  },
  de: {
    "start.create": "Erstellen Sie einen neuen Feed",
    "start.or": "oder",
    "start.import": "oder importieren Sie einen bestehenden",
    "start.open_file": "durch Ziehen einer vorhandenen Datei",
    "start.load_from_url": "Abrufen von einer Remote-Adresse",
    "start.load_from_podcastindex": "Importieren von podcastindex",
    "start.start_by_url.title":
      "Neuen Feed von einer Remote-Adresse importieren",
    "start.start_by_url.action": "Importieren",
    "start.start_by_url.errors.invalid_xml": "Der Feed ist kein gültiges XML",
    "start.start_by_url.errors.invalid_podcast_feed":
      "Der Feed ist kein gültiger Podcast-Feed",
    "start.start_by_url.errors.generic":
      "Fehler beim Abrufen des Podcast-Feeds",
    "start.start_by_url.errors.invalid_url":
      "Die angegebene URL ist nicht gültig",
    "start.start_by_index.title":
      "Einen Podcast-Feed von podcastindex importieren",
    "start.start_by_index.action": "Suchen",
    "start.start_by_index.errors.generic":
      "Fehler beim Abrufen des Podcast-Index",
    "start.start_by_index.errors.podcast_index_misconfigured":
      "Podcast-Index ist fehlerhaft konfiguriert oder deaktiviert, bitte überprüfen Sie Ihre Konfiguration",
    "start.start_by_index.errors.invalid_xml": "Der Feed ist kein gültiges XML",
    "start.start_by_index.errors.invalid_podcast_feed":
      "Der Feed ist kein gültiger Podcast-Feed",
    "start.start_by_index.importing_in_progress":
      "Import läuft... bitte warten",
    "edit_feed.basic.title": "Grundlegende Informationen",
    "edit_feed.basic.show_name": "Sendungsname",
    "edit_feed.basic.show_description": "Sendungsbeschreibung",
    "edit_feed.basic.image": "Sendungsbild",
    "edit_feed.basic.category": "Sendungskategorie",
    "edit_feed.basic.image.help":
      "Klicken Sie auf die Vorschau, um das Bild von Ihrem Computer hochzuladen, oder geben Sie die Adresse im Textfeld ein.",
    "edit_feed.basic.link": "Link",
    "edit_feed.additional.title": "Zusätzliche Informationen",
    "edit_feed.basic.keywords": "Schlüsselwörter",
    "ui.forms.empty_field.message":
      "Klicken Sie hier, um einen Wert zuzuweisen",
    "edit_feed.configuration.title": "Konfiguration",
    "edit_feed.configuration.remotes.title": "Fernkonfiguration",
    "edit_feed.configuration.remotes.description":
      "Dieser Abschnitt enthält die Konfiguration für das Hochladen Ihrer Assets (Bilder, Mediendateien, Kapiteldateien und Transkriptionen) und Ihrer XML-Feed-Datei. Die Assets können auf einen FTP-Server oder einen kompatiblen S3-Dienst wie Amazon AWS S3, Google Cloud Storage, Microsoft Azure Blob Storage, DigitalOcean Spaces, Alibaba Cloud OSS (Object Storage Service) und viele mehr hochgeladen werden",
    "edit_feed.configuration.remotes.category": "Art des Remote-Ziels",
    "edit_feed.configuration.s3.endpoint": "Endpunkt",
    "edit_feed.configuration.s3.region": "Region",
    "edit_feed.configuration.s3.bucket_name": "Bucket",
    "edit_feed.configuration.s3.access_key": "Zugangsschlüssel",
    "edit_feed.configuration.s3.secret_key": "Geheimschlüssel",
    "edit_feed.configuration.s3.http_host": "Öffentliche Basis-URL",
    "edit_feed.configuration.s3.https": "Https / Http",
    "edit_feed.configuration.s3.path": "Pfad",
    "edit_feed.configuration.s3.https.info":
      "Ankreuzen, um https zu aktivieren",
    "edit_feed.configuration.ftp.host": "Host",
    "edit_feed.configuration.ftp.port": "Port",
    "edit_feed.configuration.ftp.user": "Benutzername",
    "edit_feed.configuration.ftp.password": "Passwort",
    "edit_feed.configuration.ftp.path": "Pfad",
    "edit_feed.configuration.ftp.http_host": "Öffentliche Basis-URL",
    "edit_feed.configuration.ftp.https": "Https / Http",
    "edit_feed.configuration.ftp.https.info":
      "Ankreuzen, um https zu aktivieren",
    "edit_feed.source-code.title": "Quellcode",
    "configurations.title": "Globale Konfigurationen von Fourviere",

    "configurations.locale.title": "Lokalisierung",
    "configurations.locale.description":
      "Dieser Abschnitt enthält die Konfiguration für die Lokalisierung Ihres Feeds. Die Lokalisierung wird verwendet, um die Sprache der Anwendung zu ändern",
    "configurations.locale.language": "Sprache",
    "configurations.podcast_index.title": "Podcast-Index-Konfiguration",
    "configurations.podcast_index.description":
      "Podcast Index unterhält ein großes, offenes Verzeichnis von Podcasts, das für jeden zugänglich ist. Diese Datenbank ist eine Alternative zu geschlosseneren Systemen und bietet eine breitere Palette von Podcast-Auflistungen ohne plattformspezifische Einschränkungen.",
    "configurations.podcast_index.enabled": "Podcast-Index aktiviert",
    "configurations.podcast_index.enabled.label":
      "Ankreuzen, um die Importfunktion des Podcast-Index bei der Erstellung eines neuen Feeds zu aktivieren",
    "configurations.podcast_index.api_key": "API-Schlüssel",
    "configurations.podcast_index.api_secret": "API-Geheimnis",
  },
  it: {
    "start.create": "Crea un nuovo feed",
    "start.or": "o",
    "start.import": "o importa uno esistente",
    "start.open_file": "trascinando un file esistente",
    "start.load_from_url": "recuperando da un indirizzo remoto",
    "start.load_from_podcastindex": "importando da podcastindex",
    "start.start_by_url.title": "Importa nuovo feed da indirizzo remoto",
    "start.start_by_url.action": "Importa",
    "start.start_by_url.errors.invalid_xml": "Il feed non è un XML valido",
    "start.start_by_url.errors.invalid_podcast_feed":
      "Il feed non è un feed podcast valido",
    "start.start_by_url.errors.generic":
      "Errore durante il recupero del feed podcast",
    "start.start_by_url.errors.invalid_url": "L'URL fornito non è valido",
    "start.start_by_index.title": "Importa un feed podcast da podcastindex",
    "start.start_by_index.action": "Cerca",
    "start.start_by_index.errors.generic":
      "Errore durante il recupero dell'indice podcast",
    "start.start_by_index.errors.podcast_index_misconfigured":
      "L'indice podcast è configurato in modo errato o disabilitato, si prega di controllare la configurazione",
    "start.start_by_index.errors.invalid_xml": "Il feed non è un XML valido",
    "start.start_by_index.errors.invalid_podcast_feed":
      "Il feed non è un feed podcast valido",
    "start.start_by_index.importing_in_progress":
      "Importazione in corso... attendere prego",
    "edit_feed.basic.title": "Informazioni di base",
    "edit_feed.basic.show_name": "Nome dello spettacolo",
    "edit_feed.basic.show_description": "Descrizione dello spettacolo",
    "edit_feed.basic.image": "Immagine dello spettacolo",
    "edit_feed.basic.category": "Categoria dello spettacolo",
    "edit_feed.basic.image.help":
      "Clicca sull'anteprima per caricare l'immagine dal tuo computer o inserisci l'indirizzo nel campo di testo.",
    "edit_feed.basic.link": "Link",
    "edit_feed.additional.title": "Informazioni aggiuntive",
    "edit_feed.basic.keywords": "Parole chiave",
    "ui.forms.empty_field.message": "Clicca qui per assegnare un valore",
    "edit_feed.configuration.title": "Configurazione",
    "edit_feed.configuration.remotes.title": "Configurazione remota",
    "edit_feed.configuration.remotes.description":
      "Questa sezione contiene la configurazione per il caricamento delle tue risorse (immagini, file multimediali, file di capitoli e trascrizioni) e il tuo file di feed xml. Le risorse possono essere caricate su un server ftp o un servizio s3 compatibile come Amazon AWS S3, Google Cloud Storage, Microsoft Azure Blob Storage, DigitalOcean Spaces, Alibaba Cloud OSS (Object Storage Service) e molti altri",
    "edit_feed.configuration.remotes.category": "Tipo di destinazione remota",
    "edit_feed.configuration.s3.endpoint": "Endpoint",
    "edit_feed.configuration.s3.region": "Regione",
    "edit_feed.configuration.s3.bucket_name": "Bucket",
    "edit_feed.configuration.s3.access_key": "Chiave di accesso",
    "edit_feed.configuration.s3.secret_key": "Chiave segreta",
    "edit_feed.configuration.s3.http_host": "URL di base pubblico",
    "edit_feed.configuration.s3.https": "Https / Http",
    "edit_feed.configuration.s3.path": "Percorso",
    "edit_feed.configuration.s3.https.info": "Seleziona per abilitare https",
    "edit_feed.configuration.ftp.host": "Host",
    "edit_feed.configuration.ftp.port": "Porta",
    "edit_feed.configuration.ftp.user": "Nome utente",
    "edit_feed.configuration.ftp.password": "Password",
    "edit_feed.configuration.ftp.path": "Percorso",
    "edit_feed.configuration.ftp.http_host": "URL di base pubblico",
    "edit_feed.configuration.ftp.https": "Https / Http",
    "edit_feed.configuration.ftp.https.info": "Seleziona per abilitare https",
    "edit_feed.source-code.title": "Codice sorgente",
    "configurations.title": "Configurazioni globali di Fourviere",

    "configurations.locale.title": "Localizzazione",
    "configurations.locale.description":
      "Questa sezione contiene la configurazione per la localizzazione del tuo feed. La località viene utilizzata per cambiare la lingua dell'applicazione",
    "configurations.locale.language": "Lingua",
    "configurations.podcast_index.title": "Configurazione dell'indice podcast",
    "configurations.podcast_index.description":
      "Podcast Index mantiene un vasto directory aperto di podcast, accessibile a chiunque. Questo database è un'alternativa ai sistemi più chiusi, offrendo una gamma più ampia di elenchi di podcast senza restrizioni specifiche della piattaforma.",
    "configurations.podcast_index.enabled": "Indice podcast abilitato",
    "configurations.podcast_index.enabled.label":
      "Seleziona per abilitare la funzione di importazione dell'indice podcast durante la creazione di un nuovo feed",
    "configurations.podcast_index.api_key": "Chiave API",
    "configurations.podcast_index.api_secret": "Segreto API",
  },
} as const;

export default TRANSLATIONS;
