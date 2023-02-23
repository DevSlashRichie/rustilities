---
"@mymetaverse/eventhandler": patch
---

Invalid payloads will now get caught and service won't crash.

If for any reason the publisher decides to send a message not JSON compatible, the handler
will catch and show the error message by instantiating a new event called `CouldNotParsePayloadError`
which will first try to include the erroneous payload and parent error for debug.
