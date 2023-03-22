import { Entity } from "ddd-scaffold";
import { Exception, None, Result } from "@mymetaverse/utilities";

export class MapToEntityError extends Exception {
  constructor() {
    super("Could not map to entity.", None());
  }
}

export abstract class Mapper<T extends Entity<unknown>> {
  public abstract toEntity(
    raw: Record<string, any>
  ): Result<T, MapToEntityError>;
  public abstract toRaw(entity: T): Record<string, any>;
}

export class DefaultMapper<T extends Entity<any>> extends Mapper<T> {
  toEntity(raw: Record<string, any>): Result<T, MapToEntityError> {
    throw new Error("Method not available for default mapper.");
  }

  toRaw(entity: T): Record<string, any> {
    return {
      ...entity.props,
      _id: entity.getId(),
    };
  }
}
