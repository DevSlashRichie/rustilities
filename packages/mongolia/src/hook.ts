import { Repo } from "./repo";
import { DomainEvents, EntityId, Logger } from "ddd-scaffold";

export class Hook {
  public static connect(repo: Repo<any>) {
    repo.hookEvents((event) => {
      // @ts-ignore
      const _id = event.documentKey?._id;
      if (!_id) {
        Logger.warn("Skipping hook for event without _id", event);
        return;
      }
      const entityId = new EntityId(_id);
      DomainEvents.dispatchEventsForAggregate(entityId);
    });
  }
}
