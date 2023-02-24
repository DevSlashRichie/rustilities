import { Channel, Options } from "amqplib";
import { WrappedConnection } from "./wrapped-connection";
import Publish = Options.Publish;

interface PublishOptions {
  routingKey?: string;
  options?: Publish;
}

export class ConnectionDispatcher {
  private constructor(
    public readonly channel: Channel,
    public readonly exchange: string
  ) {}

  /**
   * Close the channel
   */
  public async close() {
    await this.channel.close();
  }

  public publishBuffer(value: Buffer, options?: PublishOptions) {
    this.channel.publish(
      this.exchange,
      options?.routingKey || "",
      value,
      options?.options
    );
  }

  /**
   * Publish a string to the exchange
   * @param value String to publish
   * @param options Options for the publish operation
   */
  public publishString(value: string, options?: PublishOptions) {
    this.publishBuffer(Buffer.from(value), options);
  }

  /**
   * Publish an object to the exchange
   * @param value Object to publish
   * @param options Options for the publish operation
   */
  public publishObject<T extends object>(value: T, options?: PublishOptions) {
    this.publishString(JSON.stringify(value), options);
  }

  /**
   * Publish a value to the exchange
   * @param value Value to publish
   * @param options Options for the publish operation
   */
  public publish<T extends object>(value: T, options?: PublishOptions) {
    this.publishString(JSON.stringify(value), options);
  }

  /**
   * Create a new ConnectionDispatcher from a ConnectionWrapper
   * @param connection ConnectionWrapper
   * @param exchange Exchange name
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
