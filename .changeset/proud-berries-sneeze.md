---
"@mymetaverse/eventhandler": patch
---

Registry now owns a way to complety close all dependencies to it.

Example:


```typescript
const registry = new Registry();

// this will close all available listener but mantain connections open.
await registry.closeAllListeners();

// this will also close the oppened connections.
await registry.close();
```
