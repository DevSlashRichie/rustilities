/**
 * Result is a type that represents either success (Ok) or failure (Err).
 **/
export class Result<T, E extends Error> {
  private readonly value?: T;
  private readonly error?: E;

  // state lock

  private readonly _isOk: boolean;

  private constructor(value: T | undefined, error: E | undefined) {
    this.value = value;
    this.error = error;

    this._isOk = !value && !error ? true : !!value;
  }

  /**
   * This will create a Result with a valid value.
   * @returns the Result.
   **/
  public static Ok<U, O extends Error>(value: U): Result<U, O> {
    return new Result<U, O>(value, undefined);
  }

  /**
   * This will create a Result with an error.
   * @returns the Result.
   **/
  public static Err<U, O extends Error>(error: O): Result<U, O> {
    return new Result<U, O>(undefined, error);
  }

  /**
   * Will create an Errored Result if the function throws an error.
   * Otherwise it will create an Ok Result.
   *
   * @returns the Result.
   **/
  public static fromThrow<U, O extends Error>(f: () => U): Result<U, O> {
    try {
      return Result.Ok(f() as U);
    } catch (e) {
      return Result.Err(e as O);
    }
  }

  /**
   * @returns returns true if the Result is Ok.
   **/
  public isOk(): boolean {
    return this._isOk;
  }

  /**
   * @returns returns false if the Result is Err.
   **/
  public isErr(): boolean {
    return !this._isOk;
  }

  /**
   * Unwraps a result, yielding the content of an Ok.
   * @throws Error if the value is an Err.
   **/
  public unwrap(): T {
    if (this.isErr()) {
      throw new Error("Called unwrap on an Err Result", {
        cause: this.error,
      });
    }
    return this.value as T;
  }

  /**
   * Unwraps a result, otherwise returns defaultValue.
   * @returns the value or defaultValue.
   */
  public unwrapOr(defaultValue: T): T {
    if (this.isErr()) {
      return defaultValue;
    }
    return this.value as T;
  }

  /**
   * Unwraps a result, otherwise returns defaultValue from a function.
   * @returns the value or defaultValue.
   */
  public unwrapOrElse(fn: (error: E) => T): T {
    if (this.isErr()) {
      return fn(this.error as E);
    }
    return this.value as T;
  }

  /**
   * Tries to match the contained value with a provided value.
   * @returns true if the value is Ok and equal to the provided value.
   */
  public contains(value: T): boolean {
    if (this.isErr()) {
      return false;
    }

    return this.value === value;
  }

  /**
   * Unwrap the error.
   * @throws Error if the value is an Ok.
   * @returns the error.
   */
  public unwrapErr(): E {
    if (this.isOk()) {
      throw new Error("Called unwrapErr on an Ok Result");
    }
    return this.error as E;
  }

  /**
   * Use this method to modify the value of the Result while using it.
   * @returns the Result itself with the value possibly mapped.
   **/
  public map<U>(fn: (value: T) => U): Result<U, E> {
    if (this.isOk()) {
      return Result.Ok(fn(this.value as T));
    }
    return Result.Err(this.error as E);
  }

  /**
   * Use this method to modify the error of the Result while using it.
   * @returns the Result itself with the error possibly mapped.
   **/
  public mapErr<O extends Error>(fn: (error: E) => O): Result<T, O> {
    if (this.isErr()) {
      return Result.Err(fn(this.error as E));
    }
    return Result.Ok(this.value as T);
  }

  /**
   * Use this method to modify the error of the Result while using it.
   * @returns the Result itself with the error possibly mapped.
   **/
  public equals<U, O extends Error>(other: Result<U, O>): boolean {
    if (this.isOk() && other.isOk()) {
      return this.value === other.value;
    }
    if (this.isErr() && other.isErr()) {
      return this.error === other.error;
    }
    return false;
  }
}

/**
 * This will create a Result with a valid value.
 * @returns the Result.
 **/
export function Ok<T, E extends Error>(value: T): Result<T, E> {
  return Result.Ok(value);
}

/**
 * This will create a Result with an error.
 * @returns the Result.
 **/
export function Err<T, E extends Error>(error: E): Result<T, E> {
  return Result.Err(error);
}
