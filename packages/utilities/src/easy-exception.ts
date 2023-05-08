import { AnonymousException, ExceptionLike } from "./exception";
import { None, Option } from "./option";

export class EasyException {
  private readonly errorName: string;

  constructor(errorName: string) {
    this.errorName = errorName;
  }

  public complete(message: string, parent: Option<Error>): ExceptionLike {
    return new AnonymousException(this.errorName, message, parent);
  }

  public simple(message: string): ExceptionLike {
    return this.complete(message, None());
  }
}
