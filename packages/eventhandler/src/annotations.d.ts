import "reflect-metadata";
import { Options } from "amqplib";
export type ExchangeType =
  | "direct"
  | "topic"
  | "headers"
  | "fanout"
  | "match"
  | string;
export interface ExchangeIdentifier {
  name: string;
  type: ExchangeType;
  options?: Options.AssertExchange;
}
export interface QueueIdentifier {
  name: string;
  bindingKey?: string;
  options?: Options.AssertQueue;
}
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
export declare function EventHandler(
  exchange: ExchangeIdentifier,
  queue: QueueIdentifier | string,
  consumerOptions?: ConsumerOptions
): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
