import { Errur } from "./error";
import { Result } from "./result";

export type MatchOptionBraces<T, O> = {
  Some: (t: T) => O;
  None: () => O;
};

/**
 * Use this class to create an Option type.
 **/
export class Option<T> {
  private value?: T;

  private constructor(value?: T) {
    this.value = value;
  }

  /**
   * Use this method to create an Option type from a value.
   **/
  public static of<U>(value: U): Option<U> {
    return new Option<U>(value);
  }

  /**
   * Use this method to create an empty Option type.
   **/
  public static empty<U>(): Option<U> {
    return new Option<U>();
  }

  /**
   * Use this method to create an Option type from a value.
   * @returns an Option with a value.
   **/
  public static Some<U>(value: U): Option<U> {
    return new Option<U>(value);
  }

  /**
   * Use this method to create an empty Option type.
   * @returns an empty Option.
   **/
  public static None<U>(): Option<U> {
    return new Option<U>();
  }

  /**
   * Use this method to check if the Option is empty or not.
   * @returns true if the Option is not empty.
   **/
  public isSome(): boolean {
    return typeof this.value !== "undefined";
  }

  /**
   * Use this method to check if the Option is empty or not.
   * @returns true if the Option is empty.
   **/
  public isNone(): boolean {
    return typeof this.value === "undefined";
  }

  /**
   * Use this method to unwrap the value of the Option.
   * @throws an error if the Option is empty.
   * @returns the value of the Option.
   **/
  public unwrap(): T {
    if (this.isNone()) {
      throw new Error("Cannot unwrap a None value");
    }
    return this.value as T;
  }

  /**
   * Use this method to unwrap the value of the Option or return a default value.
   * @returns the value of the Option or the default value.
   **/
  public unwrapOr(defaultValue: T): T {
    if (this.isNone()) {
      return defaultValue;
    }
    return this.value as T;
  }

  /**
   * Use this method to unwrap the value of the Option or
   * return a default value from a function.
   **/
  public unwrapOrElse(defaultValue: () => T): T {
    if (this.isNone()) {
      return defaultValue();
    }
    return this.value as T;
  }

  /**
   * Use this method to modify the value of the Option while using it.
   * @returns a new Option with the new value.
   **/
  public map<U>(mapper: (value: T) => U): Option<U> {
    if (this.isNone()) {
      return Option.empty<U>();
    }
    return Option.of(mapper(this.value as T));
  }

  /**
   * Use this method to modify the value of the Option while using it.
   * In case the Option is empty, it will return the default value.
   *
   * @returns a new Option with the new value.
   **/
  public mapOr<U>(defaultValue: U, mapper: (value: T) => U): U {
    if (this.isNone()) {
      return defaultValue;
    }
    return mapper(this.value as T);
  }

  /**
   * Change the option into a Result type.
   * In case of None, it will return a defined error.
   *
   * @returns a Result type.
   **/
  public okOr(error: Errur): Result<T, Errur> {
    if (this.isNone()) {
      return Result.Err(error);
    }

    return Result.Ok(this.value as T);
  }

  /**
   * If the Option is empty, it will return a desired option.
   *
   * @returns the default Option type.
   **/
  public or(defaultValue: Option<T>): Option<T> {
    if (this.isNone()) {
      return defaultValue;
    }
    return this;
  }

  /**
   * Check if the wrapped value matches the desired value.
   *
   * @returns true if the value matches.
   **/
  public contains(value: T): boolean {
    if (this.isNone()) {
      return false;
    }
    return this.value === value;
  }

  /**
   * This method can handle both Ok and Err values at the same time.
   * @returns the value returned by the matching function.
   **/
  public match<O>(braces: MatchOptionBraces<T, O>): O {
    if (this.isSome()) {
      return braces.Some(this.value as T);
    }

    return braces.None();
  }

  /**
   * Replaces the actual value of the Option with a new one.
   * @returns The old value if present.
   * */
  public replace(value: T): Option<T> {
    const toReturn = this.match({
      Some: (current) => {
        return Option.Some(current);
      },
      None: () => {
        return Option.None();
      },
    }) as Option<T>;

    this.value = value;
    return toReturn;
  }

  /**
   * Will take the value in the option and leave it empty.
   * @returns The value if present.
   *
   */
  public take(): Option<T> {
    const toReturn = this.match({
      Some: (current) => {
        return Option.Some(current);
      },
      None: () => {
        return Option.None();
      },
    }) as Option<T>;

    this.value = undefined;
    return toReturn;
  }

  /**
   * Create a new Option from a possible empty value.
   * @returns a new Option.
   **/
  public static fromNullable<U>(value: U | null | undefined): Option<U> {
    if (value === null || value === undefined) {
      return Option.empty();
    }
    return Option.of(value);
  }
}

/**
 * Use this method to create an Option type from a value.
 * @returns an Option with a value.
 **/
export function Some<T>(value: T): Option<T> {
  return Option.Some(value);
}

/**
 * Use this method to create an empty Option type.
 **/
export function None<T>(): Option<T> {
  return Option.None();
}
