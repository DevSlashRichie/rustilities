---
"@mymetaverse/eventhandler": minor
---

EventHandler will now allow to dispatch messages

# Summary

The biggest change of this update is that EventHandler will now allow to dispatch messages.
You can achieve this by first creating a `WrappedConnection` from a registry:

```typescript
const registry = new Registry();
const { connection, close } = await registry.openConnection('amqp://localhost');

const dispatcher = await connection.openDispatcher('my-exchange');
```

Also, the way to addListeners changed because now you need to pass the `WrappedConnection` into the `addListeners` function.
