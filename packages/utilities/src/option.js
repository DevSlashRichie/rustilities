"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.None = exports.Some = exports.Option = void 0;
const result_1 = require("./result");
class Option {
  value;
  constructor(value) {
    this.value = value;
  }
  static of(value) {
    return new Option(value);
  }
  static empty() {
    return new Option();
  }
  static Some(value) {
    return new Option(value);
  }
  static None() {
    return new Option();
  }
  isSome() {
    return typeof this.value !== "undefined";
  }
  isNone() {
    return typeof this.value === "undefined";
  }
  unwrap() {
    if (this.isNone()) {
      throw new Error("Cannot unwrap a None value");
    }
    return this.value;
  }
  unwrapOr(defaultValue) {
    if (this.isNone()) {
      return defaultValue;
    }
    return this.value;
  }
  unwrapOrElse(defaultValue) {
    if (this.isNone()) {
      return defaultValue();
    }
    return this.value;
  }
  map(mapper) {
    if (this.isNone()) {
      return Option.empty();
    }
    return Option.of(mapper(this.value));
  }
  mapOr(defaultValue, mapper) {
    if (this.isNone()) {
      return defaultValue;
    }
    return mapper(this.value);
  }
  okOr(error) {
    if (this.isNone()) {
      return result_1.Result.Err(error);
    }
    return result_1.Result.Ok(this.value);
  }
  or(defaultValue) {
    if (this.isNone()) {
      return defaultValue;
    }
    return this;
  }
  contains(value) {
    if (this.isNone()) {
      return false;
    }
    return this.value === value;
  }
  static fromNullable(value) {
    if (value === null || value === undefined) {
      return Option.empty();
    }
    return Option.of(value);
  }
}
exports.Option = Option;
function Some(value) {
  return Option.Some(value);
}
exports.Some = Some;
function None() {
  return Option.None();
}
exports.None = None;
