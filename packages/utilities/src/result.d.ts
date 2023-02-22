export declare class Result<T, E extends Error> {
  private readonly value?;
  private readonly error?;
  private constructor();
  static Ok<U, O extends Error>(value: U): Result<U, O>;
  static Err<U, O extends Error>(error: O): Result<U, O>;
  isOk(): boolean;
  isErr(): boolean;
  unwrap(): T;
  unwrapOr(defaultValue: T): T;
  unwrapOrElse(fn: (error: E) => T): T;
  contains(value: T): boolean;
  unwrapErr(): E;
  map<U>(fn: (value: T) => U): Result<U, E>;
  mapErr<O extends Error>(fn: (error: E) => O): Result<T, O>;
}
export declare function Ok<T, E extends Error>(value: T): Result<T, E>;
export declare function Err<T, E extends Error>(error: E): Result<T, E>;
