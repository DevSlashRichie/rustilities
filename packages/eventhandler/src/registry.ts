import "reflect-metadata";
import amqp, { Connection } from "amqplib";
import { EventHandlerOptions } from "./annotations";
import { Err, Ok, Result } from "utilities/src/result";
import { Empty, EmptyElement } from "utilities/src/empty";
import { NotFoundConnectionError } from "./errors/NotFoundConnectionError";

type ListenerPair = {
  listener: any;
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
  }

  public addListener(host: string, listener: any) : Result<EmptyElement, NotFoundConnectionError> {
    const availableMethods = Object.getOwnPropertyNames(
      Object.getPrototypeOf(listener)
    );
    const realConnection = this.connections[host];

    if (!realConnection)
      return Err(new NotFoundConnectionError(host));

    availableMethods.map(async (method) => {
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

            if (msg) {
              payload =
                !consumerOptions ||
                !consumerOptions.local ||
                !consumerOptions.local.noParse
                  ? JSON.parse(msg.content.toString())
                  : msg.content;
            }

            descriptor.value.call(listener, payload, msg);
          },
          consumerOptions?.rabbit
        );
      }
    });

    this.listeners.add({ listener, connectionIdentifier: host });
    return Ok(Empty());
  }
}
