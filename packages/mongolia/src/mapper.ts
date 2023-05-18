import { Entity } from "ddd-scaffold";
import { Result, Errur } from "@mymetaverse/utilities";

export enum MapperErrorKind {
  CouldNotMapToEntity = "CouldNotMapToEntity",
}

export const MapperError = {
  CouldNotMapToEntity: (err: unknown) =>
    Errur.fromErrur({
      kind: MapperErrorKind.CouldNotMapToEntity,
      cause: err,
    }),
};

export abstract class Mapper<T extends Entity<unknown>> {
  public abstract toEntity(raw: Record<string, any>): Result<T, Errur>;
  public abstract toRaw(entity: T): Record<string, any>;
}

export class DefaultMapper<T extends Entity<any>> extends Mapper<T> {
  toEntity(raw: Record<string, any>): Result<T, Errur<string>> {
    throw new Error("Method not available for default mapper.");
  }

  toRaw(entity: T): Record<string, any> {
    return {
      ...entity.props,
      _id: entity.getId(),
    };
  }
}
