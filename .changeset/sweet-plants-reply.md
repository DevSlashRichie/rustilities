---
"@mymetaverse/utilities": patch
---

mapOr expanded to any return value

## Summary

```typescript
// original
mapOr(value: T, fn: (value: T) => T, defaultValue: T): T
// new
mapOr<U>(value: U, fn: (value: T) => U, defaultValue: U): U
```

mapOr originally only worked with the same type as the input value. This change allows you to map to any return type.
