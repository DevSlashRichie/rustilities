import "reflect-metadata";
import amqp, { Connection } from "amqplib";
import { EventHandlerOptions } from "./annotations";
import { Err, Ok, Result, EmptyElement } from "@mymetaverse/utilities";
import { NotFoundConnectionError } from "./errors";
import { CouldNotParsePayloadError } from "./errors/could-not-parse-payload-error";

type Listener<T extends object> = T;

type ListenerPair = {
  listener: Listener<any>;
  connectionIdentifier: string;
};

export class Registry {
  private readonly connections: Record<string, Connection>;
  private readonly listeners: Set<ListenerPair>;

  constructor() {
    this.connections = {};
    this.listeners = new Set();
  }

  public async openConnection(host: string) {
    console.info(`Opening a new  connection to ${host}`);
    this.connections[host] = await amqp.connect(host);
    return () => {
      this.closeConnection(host);
    };
  }

  public async closeConnection(host: string) {
    console.info(`Closing connection to ${host}`);
    const connection = this.connections[host];
    if (connection) {
      await connection.close();
      delete this.connections[host];
    }
  }

  public async addListener<T extends object>(
    host: string,
    listener: Listener<T>
  ): Promise<Result<EmptyElement, NotFoundConnectionError>> {
    const availableMethods = Object.getOwnPropertyNames(
      Object.getPrototypeOf(listener)
    );
    const realConnection = this.connections[host];

    if (!realConnection) return Err(new NotFoundConnectionError(host));

    const handlers = availableMethods.map(async (method) => {
      const eventHandlerAnnotation: EventHandlerOptions = Reflect.getMetadata(
        "eventhandler:eventhandler",
        listener,
        method
      );

      if (eventHandlerAnnotation) {
        console.debug(`Found event handler annotation in ${method}`);
        const { exchange, queue, consumerOptions, descriptor } =
          eventHandlerAnnotation;

        // create the channel which is multiplexed over the connection
        const channel = await realConnection.createChannel();

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

              descriptor.value.call(listener, payload, msg, channel);
            } catch (err) {
              console.error(
                new CouldNotParsePayloadError(
                  msg?.content.toString(),
                  err instanceof Error ? err : undefined
                )
              );
            }
          },
          consumerOptions?.rabbit
        );
      }
    });

    await Promise.all(handlers);

    this.listeners.add({ listener, connectionIdentifier: host });
    return Ok(async () => {
      await this.removeListener(listener);
    });
  }

  public async removeListener<T extends object>(listener: Listener<T>) {
    this.listeners.forEach((listenerPair) => {
      if (listenerPair.listener === listener) {
        this.closeConnection(listenerPair.connectionIdentifier);
        this.listeners.delete(listenerPair);
      }
    });
  }
}
