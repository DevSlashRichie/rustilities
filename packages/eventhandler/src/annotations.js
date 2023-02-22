"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventHandler = void 0;
require("reflect-metadata");
function EventHandler(exchange, queue, consumerOptions) {
  return function (target, propertyKey, descriptor) {
    const normalizedQueue = typeof queue === "string" ? { name: queue } : queue;
    Reflect.defineMetadata(
      "eventhandler:eventhandler",
      { exchange, queue: normalizedQueue, consumerOptions, descriptor },
      target,
      propertyKey
    );
  };
}
exports.EventHandler = EventHandler;
