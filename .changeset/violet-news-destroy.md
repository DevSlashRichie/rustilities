---
"@mymetaverse/utilities": patch
---

Added replace and take to Option

Use replace to replace the value inside an existing Option.
Use take to remove and leave empty the value from an existing Option.

```typescript
const opt = Some("str");
const n = opt.replace("default"); // opt is now Some("default")
```

```typescript
const opt = Some("str");
const n = opt.take(); // opt is now None()
```
