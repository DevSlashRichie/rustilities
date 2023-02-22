import { Result } from "./result";
export declare class Option<T> {
  private readonly value?;
  private constructor();
  static of<U>(value: U): Option<U>;
  static empty<U>(): Option<U>;
  static Some<U>(value: U): Option<U>;
  static None<U>(): Option<U>;
  isSome(): boolean;
  isNone(): boolean;
  unwrap(): T;
  unwrapOr(defaultValue: T): T;
  unwrapOrElse(defaultValue: () => T): T;
  map<U>(mapper: (value: T) => U): Option<U>;
  mapOr(defaultValue: T, mapper: (value: T) => T): T;
  okOr(error: Error): Result<T, Error>;
  or(defaultValue: Option<T>): Option<T>;
  contains(value: T): boolean;
  static fromNullable<U>(value: U | null | undefined): Option<U>;
}
export declare function Some<T>(value: T): Option<T>;
export declare function None<T>(): Option<T>;
