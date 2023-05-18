import { Channel, Options } from "amqplib";
import { ExchangeIdentifier } from "./entities";
import { WrappedConnection } from "./wrapped-connection";

import {
  Result,
  Ok,
  Err,
  Errur,
  EmptyElement,
  Empty,
} from "@mymetaverse/utilities";
import { EventHandlerError } from "./error";

interface PublishOptions {
  routingKey?: string;
  options?: Options.Publish;
}

export class ConnectionDispatcher {
  private constructor(
    public readonly channel: Channel,
    public readonly exchange: string
  ) {}

  /**
   * Assert the creation of the exchange
   */
  public async assert({ type, options }: Omit<ExchangeIdentifier, "name">) {
    await this.channel.assertExchange(this.exchange, type, options);
  }

  /**
   * Close the channel
   */
  public async close() {
    await this.channel.close();
  }

  /**
   * Publish a buffer of bytes to the exchange
   * @param value String to publish
   * @param options Options for the publish operation
   * @return a Result<EmptyElement, CouldNotDispatchException> of the result operation.
   */
  public publishBuffer(
    value: Buffer,
    options?: PublishOptions
  ): Result<EmptyElement, Errur> {
    try {
      this.channel.publish(
        this.exchange,
        options?.routingKey || "",
        value,
        options?.options
      );
    } catch (err) {
      return Err(EventHandlerError.CouldNotDispatchMessage(err));
    }

    return Ok(Empty());
  }

  /**
   * Publish a string to the exchange
   * @param value String to publish
   * @param options Options for the publish operation
   * @return a Result<EmptyElement, CouldNotDispatchException> of the result operation.
   */
  public publishString(
    value: string,
    options?: PublishOptions
  ): Result<EmptyElement, Errur> {
    return this.publishBuffer(Buffer.from(value), options);
  }

  /**
   * Publish an object to the exchange
   * @param value Object to publish
   * @param options Options for the publish operation
   * @return a Result<EmptyElement, CouldNotDispatchException> of the result operation.
   */
  public publishObject<T extends object>(
    value: T,
    options?: PublishOptions
  ): Result<EmptyElement, Errur> {
    return this.publishString(JSON.stringify(value), options);
  }

  /**
   * Publish a value to the exchange
   * @param value Value to publish
   * @param options Options for the publish operation
   * @return a Result<EmptyElement, CouldNotDispatchException> of the result operation.
   */
  public publish<T extends object>(
    value: T,
    options?: PublishOptions
  ): Result<EmptyElement, Errur> {
    return this.publishString(JSON.stringify(value), options);
  }

  /**
   * Create a new ConnectionDispatcher from a ConnectionWrapper
   * @param connection ConnectionWrapper
   * @param exchange Exchange name
   * @return a Result<EmptyElement, CouldNotDispatchException> of the result operation.
   */
  public static async fromConnection(
    connection: WrappedConnection,
    exchange: string
  ) {
    return new ConnectionDispatcher(
      await connection.connection.createChannel(),
      exchange
    );
  }
}
