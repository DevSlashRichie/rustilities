# EventHandler

A package for easy and simple interface with RabbitMQ.

## Installation

```bash
npm install @mymetaverse/eventhandler
```

In order to be able to execute the previous command, you need to be already
signed in into the private github repo.

For more information [here](https://www.notion.so/mymeta/MyMetaverse-Coding-Stanadrds-06c282502729464e99c8faf5b9a7bfe4)

## Usage

### Listening Events

The usage is really simple, just create a new class implementing Listener.

```typescript
import { Listener, EventHandler } from "@mymetaverse/eventhandler";
import { Channel, Message } from 'amqplib';

class MyCustomListener implements Listener {

  constructor() {

  }

  // here the impementation will require you to implement some methods
  // for internal usage.

  public __connection: Option<WrappedConnection> = None();
  public __channels: Option<Channel[]> = None();

  // here you can create methods which will be called by a configuration.

  @EventHandler(
    // EXCHANGE data
    { name: "service.context_x", type: "topic"} },
    // QUEUE data
    { name: "service.context_q", bindingKey: "SOMETHING.COOL" }
  )
  public async exampleListener(
    payload: any,
    raw: Message,
    channel: Channel
  ) {
    // ...
  }

}

```

After you have your Listener created, you need to register it, for that you 
need to first create a Registry:

```typescript
import { Registry } from "@mymetaverse/eventhandler";

const registry = new Registry();
const { connection, close } = await registry.openConnection("amqp://localhost");

```

After that you can now register the listener.
```typescript
await registry.addListener(connection, new MyCustomListener());
```

### Publishing an Event

For publishing events you will need a dispatcher. You can use the register
to create a dispatcher:

```typescript
const dispatcher = await connection.openDispatcher("exchange name");

dispatcher.publishObject({
  example: "example payload"
});
```

With that you can start publishing events, if you want assert the creation of 
the exchange in the publisher you can achieve that by doing the following:

```typescript
await txsc.assert({
    "exchange name",
    type: 'topic',
    options: { durable: true }
});
```


