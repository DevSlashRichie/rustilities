import { Exception, None } from "@mymetaverse/utilities";

export class NotFoundConnectionError extends Exception {
  constructor(host: string) {
    super(`Connection to ${host} not found.`, None());
  }
}
