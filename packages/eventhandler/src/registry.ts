import "reflect-metadata";
import amqp, { Channel } from "amqplib";
import { EventHandlerOptions } from "./annotations";
import {
  Err,
  Ok,
  Result,
  EmptyElement,
  Empty,
  Some,
  None,
  Option,
  Errur,
} from "@mymetaverse/utilities";
import { EventHandlerError } from "./error";
import { WrappedConnection } from "./wrapped-connection";

/**
 * The listener includes two properties which are filled by the registry.
 * The `__connection` property is the connection where the channels are connection through.
 * The `__channels` property is the channels from where the handlers are bonded.
 *
 * You should initialize them with `None()`, the registry will fill them with the correct values.
 */
export interface Listener {
  // The connection where the channels are connection through.
  __connection: Option<WrappedConnection>;
  // the channels from where the handlers are bonded.
  __channels: Option<Array<Channel>>;
}

export type InnerListener<T extends Listener> = T;

export class Registry {
  private readonly connections: Record<string, WrappedConnection>;
  private readonly listeners: Set<InnerListener<Listener>>;

  constructor() {
    this.connections = {};
    this.listeners = new Set();
  }

  /**
   * Opens a new connection to rabbitmq server.
   * This method will also add it to the pool of available connections.
   * @param host of the underlying server.
   * @returns an object which includes `close` method to later close the connection and `connection` which is the opened connection.
   */
  public async openConnection(host: string) {
    const rawConnection = await this.createRawConnection(host);

    const connection = new WrappedConnection(rawConnection);
    this.connections[host] = connection;
    return {
      close: async () => {
        await rawConnection.close();
      },
      connection,
    };
  }

  private async createRawConnection(host: string): Promise<amqp.Connection> {
    const rawConnection = await amqp.connect(host);

    rawConnection.on("close", () => {
      console.log(`amqp connection ${host} closed!`);
      this.reConnectOnFailure(host);
    });

    return rawConnection;
  }

  private async reConnectOnFailure(host: string) {
    const reconnect = async () => {
      const warppedConnection = this.connections[host];

      // if WrappedConnection is not found, or already closed. will return without retrying to reconnect
      if (!warppedConnection) return;
      if (warppedConnection.closed) return;

      const listeners = [...this.listeners].filter((it) => {
        const con = it.__connection.unwrap();
        return con === warppedConnection;
      });

      console.log(`found ${listeners.length} listeners`);
      const rawConnection = await this.createRawConnection(host);
      warppedConnection.updateConnection(rawConnection);

      await Promise.all(listeners.map((it) => this.removeListener(it)));
      await this.addListeners(warppedConnection, ...listeners);
    };

    const intervalId = setInterval(async () => {
      try {
        console.log(`Reconnecting to ${host}`);
        await reconnect();
        clearInterval(intervalId);
        console.log(`Connection to ${host} has recovered!`);
      } catch (err) {
        console.log(
          `an error occurred while reconnecting back to ${host} - ${err}. Retrying in 10 seconds`
        );
      }
    }, 10000);
  }

  /**
   * Closes a connection to a specific host if exists.
   * This will also remove the connection from the pool.
   * @param host the host of the target connection
   * @returns a `Result<Empty, NotFoundConnectionError>` which states if the connection has been found and closed.
   */
  public async findAndCloseConnection(
    host: string
  ): Promise<Result<EmptyElement, Errur<string>>> {
    const connection = this.connections[host];

    if (!connection) return Err(EventHandlerError.NotFoundConnection(host));

    if (connection) {
      await connection.close();
      delete this.connections[host];
    }

    return Ok(Empty());
  }

  /**
   * Add multiple listeners to a single connection.
   * @param connectionWrapper the connection where to register connections.
   * @param listeners the listeners to be added.
   * @returns the result of the registration of each listener
   */
  public async addListeners<T extends Listener>(
    connectionWrapper: WrappedConnection,
    ...listeners: Array<T>
  ): Promise<Array<Result<EmptyElement, Errur>>> {
    const promises = listeners.map((it) =>
      this.addListener(connectionWrapper, it)
    );
    return await Promise.all(promises);
  }

  /**
   * Register a single listener into a specific connection.
   * @param connectionWrapper the connection where to register the listener
   * @param listener the listener to be registered.
   * @returns Ok if the connection was successful registered otherwise not found.
   */
  public async addListener<T extends Listener>(
    connectionWrapper: WrappedConnection,
    listener: InnerListener<T>
  ): Promise<Result<EmptyElement, Errur>> {
    const connection = connectionWrapper.connection;

    const availableMethods = Object.getOwnPropertyNames(
      Object.getPrototypeOf(listener)
    );
    const handlers = availableMethods.map<Promise<Option<Channel>>>(
      async (method) => {
        const eventHandlerAnnotation: EventHandlerOptions = Reflect.getMetadata(
          "eventhandler:eventhandler",
          listener,
          method
        );

        if (eventHandlerAnnotation) {
          const { exchange, queue, consumerOptions, descriptor } =
            eventHandlerAnnotation;

          // create the channel which is multiplexed over the connection
          const channel = await connection.createChannel();

          // create or call the target exchange
          await channel.assertExchange(
            exchange.name,
            exchange.type,
            exchange.options
          );

          // create or call the target queue
          const createdQueue = await channel.assertQueue(
            queue.name,
            queue.options
          );

          // connect this channel to the exchange
          await channel.bindQueue(
            createdQueue.queue,
            exchange.name,
            queue.bindingKey ?? ""
          );

          // declare the consumer and start listening in the annotated method
          await channel.consume(
            createdQueue.queue,
            async (msg) => {
              let payload: any | null = null;

              try {
                if (msg) {
                  payload =
                    !consumerOptions ||
                    !consumerOptions.local ||
                    !consumerOptions.local.noParse
                      ? JSON.parse(msg.content.toString())
                      : msg.content;
                }

                listener[descriptor.value.name](payload, msg, channel);
              } catch (err) {
                console.error(
                  EventHandlerError.CouldNotParsePayload(
                    msg?.content.toString() || "null",
                    err
                  ).display()
                );
              }
            },
            consumerOptions?.rabbit
          );

          return Some(channel);
        }

        return None();
      }
    );

    const createdChannels = await Promise.all(handlers);

    // we will inject the connection to the listener just in case we need it later
    listener.__connection = Some(connectionWrapper);
    listener.__channels = Some(
      createdChannels.flatMap((it) => it.mapOr([], (it) => [it]))
    );

    this.listeners.add(listener);
    return Ok(async () => {
      await this.removeListener(listener, false);
    });
  }

  private async closeListenerConnection(listener: Listener) {
    const connection = listener.__connection.map((it) => it.close());

    if (connection.isSome()) await connection.unwrap();

    const closeChannels = listener.__channels.map((it) =>
      it.map((it) => it.close())
    );

    if (closeChannels.isSome()) await Promise.all(closeChannels.unwrap());
  }

  /**
   * Remove a listener from the listening pool.
   * @param listener the listener to be unregistered.
   * @param closeConnection if the connection which this listener is attached, should be also closed.
   */
  public async removeListener<T extends Listener>(
    listener: InnerListener<T>,
    closeConnection = false
  ) {
    const promises = Array.from(this.listeners).map(async (it) => {
      if (it === listener) {
        this.listeners.delete(it);
        if (closeConnection) {
          this.closeListenerConnection(listener);
        }
      }
    });

    await Promise.all(promises);
  }

  /**
   * Close all listeners and their connections.
   **/
  public async closeAllListeners() {
    const promises = Array.from(this.listeners).map(async (it) => {
      await this.closeListenerConnection(it);
    });

    await Promise.all(promises);

    this.listeners.clear();
  }

  /**
   * Close all connections and their listeners but also the opened connections.
   *
   **/
  public async close() {
    await this.closeAllListeners();

    const promises = Object.values(this.connections).map(async (it) => {
      await it.close();
    });

    Promise.all(promises);
  }
}
