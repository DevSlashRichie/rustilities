# eventhandler

## 1.1.2

### Patch Changes

- db0c317: Added a way to assert a dispatcher.

  ## Usage

  Inside the connection dispatcher you'll find
  a method called `assert()` with the following
  sutrcture:

  ```typescript
  const connectionDispatcher: connectionDispatcher;
  await connectionDispatcher.assert({
    name: "service.context_x",
    type: "direct",
    options: {
      durable: true,
    },
  });
  ```

  This attempts to add a way to define in the
  source service the exchange you are willing
  to use.

## 1.1.1

### Patch Changes

- 3be247d: Exported from root WrappedConnection and ConnectionDispatcher
- Updated dependencies [3be247d]
  - @mymetaverse/utilities@1.0.5

## 1.1.0

### Minor Changes

- 531765b: EventHandler will now allow to dispatch messages

  # Summary

  The biggest change of this update is that EventHandler will now allow to dispatch messages.
  You can achieve this by first creating a `WrappedConnection` from a registry:

  ```typescript
  const registry = new Registry();
  const { connection, close } = await registry.openConnection(
    "amqp://localhost"
  );

  const dispatcher = await connection.openDispatcher("my-exchange");
  ```

  Also, the way to addListeners changed because now you need to pass the `WrappedConnection` into the `addListeners` function.

### Patch Changes

- af59aa2: Invalid payloads will now get caught and service won't crash.

  If for any reason the publisher decides to send a message not JSON compatible, the handler
  will catch and show the error message by instantiating a new event called `CouldNotParsePayloadError`
  which will first try to include the erroneous payload and parent error for debug.

- Updated dependencies [531765b]
  - @mymetaverse/utilities@1.0.4

## 1.0.4

### Patch Changes

- bump

## 1.0.3

### Patch Changes

- eb9449b: added bundled dependency of internal globals
- Updated dependencies [eb9449b]
  - @mymetaverse/utilities@1.0.3

## 1.0.2

### Patch Changes

- c9db81a: fixed prefix to import packages internally
- Updated dependencies [c9db81a]
  - @mymetaverse/utilities@1.0.2
  - @mymetaverse/global@1.0.1

## 1.0.1

### Patch Changes

- b290a3c: Import of internal packages was beign used with the wrong format
- Updated dependencies [b290a3c]
  - @mymetaverse/utilities@1.0.1

## 1.0.0

### Major Changes

- The initial version for the packages has been released, it's ready to be used across the infrastructure.

### Patch Changes

- Updated dependencies
  - utilities@1.0.0
