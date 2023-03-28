import "reflect-metadata";
import { Options } from "amqplib";
import { ExchangeIdentifier, QueueIdentifier } from "./entities";

export type EventHandlerOptions = {
  exchange: ExchangeIdentifier;
  queue: QueueIdentifier;
  consumerOptions?: ConsumerOptions;
  descriptor: PropertyDescriptor;
};

export interface ConsumerOptions {
  rabbit?: Options.Consume;
  local?: {
    noParse: boolean;
  };
}

export function EventHandler(
  exchange: ExchangeIdentifier,
  queue: QueueIdentifier | string,
  consumerOptions?: ConsumerOptions
) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const normalizedQueue = typeof queue === "string" ? { name: queue } : queue;
    Reflect.defineMetadata(
      "eventhandler:eventhandler",
      { exchange, queue: normalizedQueue, consumerOptions, descriptor },
      target,
      propertyKey
    );
  };
}
