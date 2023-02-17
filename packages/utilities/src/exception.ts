import { Option } from "./option";

export class Exception extends Error {
  public readonly parent: Option<Error>;

  protected constructor(message: string, parent: Option<Error>) {
    super(message);
    this.parent = parent;
  }

  public display(): string {
    const className = this.constructor.name;
    return `${className}: ${this.message} ${this.parent
      .map((e) => {
        if (e instanceof Exception) {
          return e.display();
        } else {
          return `${e.name}: ${e.message}`;
        }
      })
      .unwrapOr("")}`.trim();
  }

  public extend(other: Exception): Exception {
    return new Exception(this.message, Option.of(other));
  }

  public static create(message: string, parent: Option<Error>): Exception {
    return new Exception(message, parent);
  }
}
