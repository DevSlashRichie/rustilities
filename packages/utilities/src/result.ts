export class Result<T, E extends Error> {
  private readonly value?: T;
  private readonly error?: E;

  private constructor(value: T | undefined, error: E | undefined) {
    this.value = value;
    this.error = error;
  }

  public static Ok<U, O extends Error>(value: U): Result<U, O> {
    return new Result<U, O>(value, undefined);
  }

  public static Err<U, O extends Error>(error: O): Result<U, O> {
    return new Result<U, O>(undefined, error);
  }

  public static fromThrow<U, O extends Error>(f: () => U): Result<U, O> {
    try {
      return Result.Ok(f() as U);
    } catch (e) {
      return Result.Err(e as O);
    }
  }

  public isOk(): boolean {
    return typeof this.value !== "undefined";
  }

  public isErr(): boolean {
    return typeof this.error !== "undefined";
  }

  public unwrap(): T {
    if (this.isErr()) {
      throw new Error("Called unwrap on an Err Result", {
        cause: this.error,
      });
    }
    return this.value as T;
  }

  public unwrapOr(defaultValue: T): T {
    if (this.isErr()) {
      return defaultValue;
    }
    return this.value as T;
  }

  public unwrapOrElse(fn: (error: E) => T): T {
    if (this.isErr()) {
      return fn(this.error as E);
    }
    return this.value as T;
  }

  public contains(value: T): boolean {
    if (this.isErr()) {
      return false;
    }

    return this.value === value;
  }

  public unwrapErr(): E {
    if (this.isOk()) {
      throw new Error("Called unwrapErr on an Ok Result");
    }
    return this.error as E;
  }

  public map<U>(fn: (value: T) => U): Result<U, E> {
    if (this.isOk()) {
      return Result.Ok(fn(this.value as T));
    }
    return Result.Err(this.error as E);
  }

  public mapErr<O extends Error>(fn: (error: E) => O): Result<T, O> {
    if (this.isErr()) {
      return Result.Err(fn(this.error as E));
    }
    return Result.Ok(this.value as T);
  }

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

export function Ok<T, E extends Error>(value: T): Result<T, E> {
  return Result.Ok(value);
}

export function Err<T, E extends Error>(error: E): Result<T, E> {
  return Result.Err(error);
}
