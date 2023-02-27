# utilities

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
