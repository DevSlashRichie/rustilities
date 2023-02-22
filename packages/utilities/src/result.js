"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Err = exports.Ok = exports.Result = void 0;
class Result {
  value;
  error;
  constructor(value, error) {
    this.value = value;
    this.error = error;
  }
  static Ok(value) {
    return new Result(value, undefined);
  }
  static Err(error) {
    return new Result(undefined, error);
  }
  isOk() {
    return typeof this.value !== "undefined";
  }
  isErr() {
    return typeof this.error !== "undefined";
  }
  unwrap() {
    if (this.isErr()) {
      throw new Error("Called unwrap on an Err Result", {
        cause: this.error,
      });
    }
    return this.value;
  }
  unwrapOr(defaultValue) {
    if (this.isErr()) {
      return defaultValue;
    }
    return this.value;
  }
  unwrapOrElse(fn) {
    if (this.isErr()) {
      return fn(this.error);
    }
    return this.value;
  }
  contains(value) {
    if (this.isErr()) {
      return false;
    }
    return this.value === value;
  }
  unwrapErr() {
    if (this.isOk()) {
      throw new Error("Called unwrapErr on an Ok Result");
    }
    return this.error;
  }
  map(fn) {
    if (this.isOk()) {
      return Result.Ok(fn(this.value));
    }
    return Result.Err(this.error);
  }
  mapErr(fn) {
    if (this.isErr()) {
      return Result.Err(fn(this.error));
    }
    return Result.Ok(this.value);
  }
}
exports.Result = Result;
function Ok(value) {
  return Result.Ok(value);
}
exports.Ok = Ok;
function Err(error) {
  return Result.Err(error);
}
exports.Err = Err;
