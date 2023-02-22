"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Exception = void 0;
const option_1 = require("./option");
class Exception extends Error {
  parent;
  constructor(message, parent) {
    super(message);
    this.parent = parent;
  }
  display() {
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
  extend(other) {
    return new Exception(this.message, option_1.Option.of(other));
  }
  static create(message, parent) {
    return new Exception(message, parent);
  }
}
exports.Exception = Exception;
