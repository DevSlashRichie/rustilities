"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.Registry = void 0;
require("reflect-metadata");
const amqplib_1 = __importDefault(require("amqplib"));
const result_1 = require("utilities/src/result");
const errors_1 = require("./errors");
class Registry {
  connections;
  listeners;
  constructor() {
    this.connections = {};
    this.listeners = new Set();
  }
  async openConnection(host) {
    console.info(`Opening a new  connection to ${host}`);
    this.connections[host] = await amqplib_1.default.connect(host);
    return () => {
      this.closeConnection(host);
    };
  }
  async closeConnection(host) {
    console.info(`Closing connection to ${host}`);
    const connection = this.connections[host];
    if (connection) {
      await connection.close();
      delete this.connections[host];
    }
  }
  async addListener(host, listener) {
    const availableMethods = Object.getOwnPropertyNames(
      Object.getPrototypeOf(listener)
    );
    const realConnection = this.connections[host];
    if (!realConnection)
      return (0, result_1.Err)(new errors_1.NotFoundConnectionError(host));
    const handlers = availableMethods.map(async (method) => {
      const eventHandlerAnnotation = Reflect.getMetadata(
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
            let payload = null;
            if (msg) {
              payload =
                !consumerOptions ||
                !consumerOptions.local ||
                !consumerOptions.local.noParse
                  ? JSON.parse(msg.content.toString())
                  : msg.content;
            }
            descriptor.value.call(listener, payload, msg, channel);
          },
          consumerOptions?.rabbit
        );
      }
    });
    await Promise.all(handlers);
    this.listeners.add({ listener, connectionIdentifier: host });
    return (0, result_1.Ok)(async () => {
      await this.removeListener(listener);
    });
  }
  async removeListener(listener) {
    this.listeners.forEach((listenerPair) => {
      if (listenerPair.listener === listener) {
        this.closeConnection(listenerPair.connectionIdentifier);
        this.listeners.delete(listenerPair);
      }
    });
  }
}
exports.Registry = Registry;
