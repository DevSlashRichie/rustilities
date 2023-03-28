---
"@mymetaverse/eventhandler": patch
---

Added a way to assert a dispatcher.

## Usage
Inside the connection dispatcher you'll find
a method called `assert()` with the following
sutrcture:

```typescript
const connectionDispatcher: connectionDispatcher;
await connectionDispatcher.assert({
    name: 'service.context_x',
    type: 'direct',
    options: {
        durable: true
    }
});
```

This attempts to add a way to define in the 
source service the exchange you are willing
to use.
