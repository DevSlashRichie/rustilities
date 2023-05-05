# Mongolia

A simple wrapper around a MongoDB connection.

## Installation

```bash
npm install @mymetaverse/mongolia
```

In order to be able to execute the previous command, you need to be already
signed in into the private github repo.

For more information [here](https://www.notion.so/mymeta/MyMetaverse-Coding-Stanadrds-06c282502729464e99c8faf5b9a7bfe4)

## Simple Usage

To create a new repo with this library you only need extends `Repo<T>` and add
it's generic.

**Example:**

```typescript
import { Repo } from "@mymetaverse/monoglia";

class MyRepo extends Repo<NiceEntity> {
  
  constructor() {
    // (name of the collection, a mapper for the entity)
    super("nice-entity", new NiceEntityMapper());
  } 

  // here you can add custom methods to query or a singleton

  public async get(userId: number) {
    return await this.findAndMap({
      userId,
    });
  }

  private static _instance: LinkingLinkRepo;

  public static getInstance() {
    return this._instance || (this._instance = new this());
  }

}
```

After that you can initialize the repo using a MongoDBClient instance. 

```typescript
import { MongoDBClient } from "@mymetaverse/mongolia";  

const client = new MongoDBClient("you host");
await client.connect();

// here you will register your repos.
client.initRepo(
  MyRepo.getInstance(),
);

// if you want to register any kind of subscription do it like this:

MyRepo.getInstance().hookEvents(docId => {
    DomainEvents.dispatchEventsForAggregate(docId);
});
```
