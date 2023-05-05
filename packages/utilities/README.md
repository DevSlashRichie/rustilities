# Utilities

Package with different modules in charge of making your life as developer 
simpler.

## Installation

```bash
npm install @mymetaverse/utilities
```

In order to be able to execute the previous command, you need to be already
signed in into the private github repo.

For more information [here](https://www.notion.so/mymeta/MyMetaverse-Coding-Stanadrds-06c282502729464e99c8faf5b9a7bfe4)


## Simple Usage

For using `Result` you can do the following:

```typescript
import { Ok, Err, Result } from "@mymetaverse/utilities";

const exampleOne: Result<string, Error> = Ok("Hello World");

const exampleTwo: Result<string, Error> = Err(new Error("Something went wrong"));

```

There are additional utilities in case you need more complex usage such as:

```typescript

const fromThrow = Result.fromThrow(() => {
    throw new Error("Something went wrong");
});

const fromAsyncThrow = await Result.fromAsyncThrow(async () => {
    throw new Error("Something went wrong");
});

```

For using `Option` you can do the following:

```typescript
import { Some, None, Option } from "@mymetaverse/utilities";

const exampleOne: Option<string> = Some("Hello World");

const exampleTwo: Option<string> = None;

const fromNullable = Option.fromNullable(null);

```

There's an additional package called "Exception" which is a wrapper for creating
cleaner errors.

This wrapper can be used without to much context our you can extend class 
as follows:

```typescript

import { Exception, None } from "@mymetaverse/utilities";

class NewException extends Exception {
    constructor(message: string) {
        // it takes a message and if there's a parentt error.
        super(message, None);
    }
}

```

To use the simpler way:

```typescript
// takes the same as the super example (string and parent);
const myError = Exception.create("The message", None);

```
