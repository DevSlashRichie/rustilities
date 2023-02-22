"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundConnectionError = void 0;
const exception_1 = require("utilities/src/exception");
const option_1 = require("utilities/src/option");
class NotFoundConnectionError extends exception_1.Exception {
  constructor(host) {
    super(`Connection to ${host} not found.`, (0, option_1.None)());
  }
}
exports.NotFoundConnectionError = NotFoundConnectionError;
