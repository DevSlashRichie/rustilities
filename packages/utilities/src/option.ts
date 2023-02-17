import { Result } from "./result";

export class Option<T> {
  private readonly value?: T;

  private constructor(value?: T) {
    this.value = value;
  }

  public static of<U>(value: U): Option<U> {
    return new Option<U>(value);
  }

  public static empty<U>(): Option<U> {
    return new Option<U>();
  }

  public static Some<U>(value: U): Option<U> {
    return new Option<U>(value);
  }

  public static None<U>(): Option<U> {
    return new Option<U>();
  }

  public isSome(): boolean {
    return typeof this.value !== "undefined";
  }

  public isNone(): boolean {
    return typeof this.value === "undefined";
  }

  public unwrap(): T {
    if (this.isNone()) {
      throw new Error("Cannot unwrap a None value");
    }
    return this.value as T;
  }

  public unwrapOr(defaultValue: T): T {
    if (this.isNone()) {
      return defaultValue;
    }
    return this.value as T;
  }

  public unwrapOrElse(defaultValue: () => T): T {
    if (this.isNone()) {
      return defaultValue();
    }
    return this.value as T;
  }

  public map<U>(mapper: (value: T) => U): Option<U> {
    if (this.isNone()) {
      return Option.empty<U>();
    }
    return Option.of(mapper(this.value as T));
  }

  public mapOr(defaultValue: T, mapper: (value: T) => T): T {
    if (this.isNone()) {
      return defaultValue;
    }
    return mapper(this.value as T);
  }

  public okOr(error: Error): Result<T, Error> {
    if (this.isNone()) {
      return Result.Err(error);
    }

    return Result.Ok(this.value as T);
  }

  public or(defaultValue: Option<T>): Option<T> {
    if (this.isNone()) {
      return defaultValue;
    }
    return this;
  }

  public contains(value: T): boolean {
    if (this.isNone()) {
      return false;
    }
    return this.value === value;
  }

  public static fromNullable<U>(value: U | null | undefined): Option<U> {
    if (value === null || value === undefined) {
      return Option.empty();
    }
    return Option.of(value);
  }
}

export function Some<T>(value: T): Option<T> {
  return Option.Some(value);
}

export function None<T>(): Option<T> {
  return Option.None();
}
