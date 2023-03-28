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
