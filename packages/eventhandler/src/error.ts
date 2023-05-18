import { Errur } from "@mymetaverse/utilities";

export enum EventHandlerErrorKind {
  CouldNotParsePayload = "CouldNotParsePayload",
  NotFoundConnetion = "NotFoundConnetion",
  CouldNotDispatchMessage = "CouldNotDispatchMessage",
}

export const EventHandlerError = {
  CouldNotParsePayload: (message: string, err: unknown) =>
    Errur.fromErrur({
      kind: EventHandlerErrorKind.CouldNotParsePayload,
      cause: err,
      description: `Could not parse payload: ${message}: %s`,
    }),
  NotFoundConnection: (host: string) =>
    Errur.fromErrur({
      kind: EventHandlerErrorKind.NotFoundConnetion,
      cause: `Could not find connection for host: ${host}`,
    }),
  CouldNotDispatchMessage: (err: unknown) =>
    Errur.fromErrur({
      kind: EventHandlerErrorKind.CouldNotDispatchMessage,
      cause: err,
    }),
};
