# utilities

## 1.0.7

### Patch Changes

- 9c8d687: There is now an easy way to create exceptions.
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

## 1.0.6

### Patch Changes

- a538fbf: Result will now include a check so if both value and error are null, it will be concidered true in favor of nullush valid results.

## 1.0.5

### Patch Changes

- 3be247d: added methods to result.ts

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
  const result = Ok("test");
  const result2 = Ok("test");

  result.equals(result2); // true

  const result3 = Ok("test2");

  result.equals(result3); // false
  ```

## 1.0.4

### Patch Changes

- 531765b: mapOr expanded to any return value

  ## Summary

  ```typescript
  // original
  mapOr(value: T, fn: (value: T) => T, defaultValue: T): T
  // new
  mapOr<U>(value: U, fn: (value: T) => U, defaultValue: U): U
  ```

  mapOr originally only worked with the same type as the input value. This change allows you to map to any return type.

## 1.0.3

### Patch Changes

- eb9449b: added bundled dependency of internal globals

## 1.0.2

### Patch Changes

- c9db81a: fixed prefix to import packages internally
- Updated dependencies [c9db81a]
  - @mymetaverse/global@1.0.1

## 1.0.1

### Patch Changes

- b290a3c: Import of internal packages was beign used with the wrong format

## 1.0.0

### Major Changes

- The initial version for the packages has been released, it's ready to be used across the infrastructure.

### Patch Changes

- Updated dependencies
  - global@1.0.0
