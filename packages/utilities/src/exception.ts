import { Option } from "./option";

/**
 * This interface represents an exception.
 **/
export abstract class ExceptionLike extends Error {
  constructor(message: string) {
    super(message);
  }

  /**
   * Use this method to display the exception in a human readable format.
   * @returns a string
   **/
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

/**
 * Use this class incase you want to create an exception without an name.
 * The name will be passed as a parameter.
 **/
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

/**
 * This class is used to create exceptions.
 * The purpose is to have a more readable and predictable format.
 *
 * You can extends this class from a custom Exception class
 * which can provide more context.
 *
 **/
export class Exception extends ExceptionLike {
  public readonly parent: Option<Error>;

  protected constructor(message: string, parent: Option<Error>) {
    super(message);
    this.parent = parent;
  }

  /**
   * Use this method to display the exception in a human readable format.
   * @returns a string
   **/
  public display(): string {
    const className = this.constructor.name;
    return this._display(className, this.parent);
  }

  /**
   * Use this method to extend an exception with another exception.
   * This means the current exception will have the second as parent.
   *
   * @param other: The new parent exception.
   * @return a new exception cloning the current message with a new parent.
   **/
  public extend(other: Exception): Exception {
    return new Exception(this.message, Option.of(other));
  }

  /**
   * Use this method to create a new simple exception.
   *
   * @param message The message of the exception
   * @param parent In case there's a parent exception.
   * @returns A new exception
   **/
  public static create(message: string, parent: Option<Error>): Exception {
    return new Exception(message, parent);
  }
}
