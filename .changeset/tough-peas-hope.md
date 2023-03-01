---
"@mymetaverse/utilities": patch
---

added methods to result.ts

Result now includes a way to check equality and a way to create results
from a throwable.


## Creating a Result from a Throwable

```typescript
const result = Result.fromThrow(() => {
  throw new Error("error");
});
```

## Checking equality

Since errors are not comparable it will only work if it's the exact same object.
For comparison would be great to use deep equality checking.

From now, it will work for primitives which is the main purpose of this method.

```typescript
const result = Ok('test');
const result2 = Ok('test');

result.equals(result2); // true

const result3 = Ok('test2');

result.equals(result3); // false
```
