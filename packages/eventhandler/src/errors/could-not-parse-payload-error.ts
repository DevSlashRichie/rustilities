import { Exception, Option } from "@mymetaverse/utilities";

export class CouldNotParsePayloadError extends Exception {
  constructor(raw?: string, err?: Error) {
    super(
      `Could not parse payload${raw ? `: ${raw}` : ""}`,
      Option.fromNullable(err)
    );
  }
}
