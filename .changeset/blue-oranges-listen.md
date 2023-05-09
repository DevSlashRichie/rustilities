---
"@mymetaverse/utilities": patch
---

There is now an easy way to create exceptions.
The idea of the new `EasyException` is you can call this objects to instance 
a new error.

```typescript
const UserError: Record<string, EasyException> = {
    InvalidName: new EasyException("InvalidName");
};
```

Then, there's two different ways of creating the instance:

```typescript
const simple = UserError.InvalidName.simple("The name is invalid");

const withParent = UserError.InvalidName.complete(
    "The name is invalid", 
    Some(new Error("asd"))
);
```

