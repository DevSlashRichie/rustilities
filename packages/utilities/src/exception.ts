import { Option } from "./option";

export abstract class ExceptionLike extends Error {
  constructor(message: string) {
    super(message);
  }

  public abstract display(): string;

  protected _display(name: string, parent: Option<Error>) {
    const nextMessage = parent
      .map((e) => {
        if (e instanceof ExceptionLike) {
          return e.display();
        } else {
          return `${e.name}: ${e.message}`;
        }
      })
      .unwrapOr("");

    return `${name}: ${this.message} ${nextMessage}`.trim();
  }
}

export class AnonymousException extends ExceptionLike {
  public readonly parent: Option<Error>;
  public readonly errorName: string;

  public constructor(
    errorName: string,
    message: string,
    parent: Option<Error>
  ) {
    super(message);
    this.parent = parent;
    this.errorName = errorName;
  }

  public get name(): string {
    return this.errorName;
  }

  public display(): string {
    return this._display(this.errorName, this.parent);
  }
}

export class Exception extends ExceptionLike {
  public readonly parent: Option<Error>;

  protected constructor(message: string, parent: Option<Error>) {
    super(message);
    this.parent = parent;
  }

  public display(): string {
    const className = this.constructor.name;
    return this._display(className, this.parent);
  }

  public extend(other: Exception): Exception {
    return new Exception(this.message, Option.of(other));
  }

  public static create(message: string, parent: Option<Error>): Exception {
    return new Exception(message, parent);
  }
}
