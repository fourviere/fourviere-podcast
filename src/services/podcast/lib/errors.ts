export class InvalidXMLError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "Invalid xml";
  }
}

export class InvalidPodcastFeedError extends Error {
  public validationErrors: unknown;
  constructor(message: string, validationErrors: unknown) {
    super(message);
    this.name = "Invalid xml";
    this.validationErrors = validationErrors;
  }
}
