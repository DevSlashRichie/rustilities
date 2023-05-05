import { Option } from "./option";

/**
 * This class is used to create exceptions.
 * The purpose is to have a more readable and predictable format.
 *
 * You can extends this class from a custom Exception class
 * which can provide more context.
 *
 **/
export class Exception extends Error {
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
