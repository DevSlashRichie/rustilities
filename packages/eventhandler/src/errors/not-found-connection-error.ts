import { Exception } from "utilities/src/exception";
import { None } from "utilities/src/option";

export class NotFoundConnectionError extends Exception {
  constructor(host: string) {
    super(`Connection to ${host} not found.`, None());
  }
}
