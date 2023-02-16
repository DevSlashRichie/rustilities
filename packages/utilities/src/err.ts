import { Option } from "./option";

export class Err extends Error {
  public readonly parent: Option<Error>;

  private constructor(message: string, parent: Option<Error>) {
    super(message);
    this.parent = parent;
  }

  public get completeMessage(): string {
    return `${this.name}: ${this.message} ${this.parent
      .map((e) => {
        if (e instanceof Err) {
          return e.completeMessage;
        } else {
          return `${e.name}: ${e.message}`;
        }
      })
      .unwrapOr("")}`.trim();
  }

  public extend(other: Err): Err {
    return new Err(this.message, Option.of(other));
  }

  public static create(message: string, parent: Option<Error>): Err {
    return new Err(message, parent);
  }
}
