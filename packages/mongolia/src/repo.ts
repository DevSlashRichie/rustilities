import {
  ChangeStreamDocument,
  Collection,
  Db,
  Filter,
  FindOptions,
  UpdateResult,
  Document,
  ObjectId,
} from "mongodb";
import { DomainEvents, Entity, EntityId } from "ddd-scaffold";
import { Mapper, MapToEntityError } from "./mapper";
import { DefaultMapper } from "./mapper";
import { PaginationNode } from "./pagination";
import { None, Ok, Option, Result } from "@mymetaverse/utilities";

export abstract class Repo<T extends Entity<unknown>> {
  public readonly name: string;
  protected readonly mapper$: Mapper<T>;

  protected collection$?: Collection;

  protected get collection(): Collection {
    if (!this.collection$) throw new Error("Collection is not initialized");
    return this.collection$;
  }

  protected getIdFrom(target: T | EntityId): EntityId {
    return target instanceof Entity ? target.getId() : target;
  }

  public get raw(): Collection {
    return this.collection;
  }

  public get mapper(): Mapper<T> {
    return this.mapper$;
  }

  protected constructor(name: string, mapper?: Mapper<T>) {
    this.name = name;

    if (!mapper) {
      mapper = new DefaultMapper<T>();
    }

    this.mapper$ = mapper;
  }

  public async save(entity: T): Promise<UpdateResult> {
    const raw = this.mapper$.toRaw(entity);
    return await this.collection.updateOne(
      {
        _id: entity.getId() as unknown as ObjectId,
      },
      {
        $set: {
          ...raw,
        },
      },
      {
        upsert: true,
      }
    );
  }

  private map(something: any): Result<Option<T>, MapToEntityError> {
    const entity = this.mapper$.toEntity(something);
    return entity.map((e) => Option.fromNullable(e));
  }

  public async findAndMap(
    filter: Filter<any>,
    options?: FindOptions
  ): Promise<Result<Option<T>, MapToEntityError>> {
    const find = await this.collection.findOne(filter, options);

    if (!find) return Ok(None());

    return this.map(find);
  }

  public async findById(
    _id: EntityId
  ): Promise<Result<Option<T>, MapToEntityError>> {
    return await this.findAndMap({ _id });
  }

  public async findAndDeleteById(
    _id: EntityId
  ): Promise<{ el: Result<Option<T>, MapToEntityError>; emit: () => void }> {
    const find = await this.collection.findOneAndDelete({
      _id: _id as unknown as ObjectId,
    });

    if (!find.ok)
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      return {
        el: Ok(None()),
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        emit: () => {},
      };

    const el = this.map(find.value);

    return {
      el,
      emit: () => {
        if (find.ok && el.map((e) => e.isSome()).unwrapOr(false)) {
          const id = el.unwrap().unwrap().getId();

          DomainEvents.dispatchEventsForAggregate(id);
        }
      },
    };
  }

  protected async findMany(filter: Filter<any>): Promise<T[]> {
    const find = await this.collection.find(filter);
    const entities = await find.toArray();
    const safeEntities: Array<T> = [];

    for (const entity of entities) {
      const _toEntity = this.mapper$.toEntity(entity);
      if (_toEntity.isErr()) {
        continue;
      }
      safeEntities.push(_toEntity.unwrap());
    }

    return safeEntities;
  }

  public async findAll(): Promise<T[]> {
    return await this.findMany({});
  }

  public async findWithCursor(
    limit: number,
    cursor?: string
  ): Promise<PaginationNode<T>> {
    let q = {};

    if (cursor) {
      const decoded = Buffer.from(cursor, "base64").toString("utf-8");
      const id = new EntityId(decoded, true);
      q = {
        _id: {
          $gt: id,
        },
      };
    }

    const find = await this.collection.find(q).limit(limit).toArray();

    const originalSize = find.length;
    const entities = find
      .map((it) => this.map(it))
      .filter((it) => it.isOk() && it.unwrap().isSome())
      .map((it) => it.unwrap().unwrap());

    const nextCursor =
      entities.length > 0
        ? Buffer.from(
            entities[entities.length - 1].getId().toString()
          ).toString("base64")
        : undefined;

    const hasNextPage = originalSize === limit;
    const hasPreviousPage = cursor !== undefined;

    return new PaginationNode<T>({
      entities,
      metadata: {
        nextCursor,
        pageInfo: {
          hasNextPage,
          hasPreviousPage,
        },
      },
    });
  }

  public async deleteById(id: EntityId) {
    return await this.collection.deleteOne({ _id: id as unknown as ObjectId });
  }

  public hookEvents(handler: (event: ChangeStreamDocument<Document>) => void) {
    const stream = this.collection.watch();
    stream.on("change", handler);
  }

  connect(db: Db) {
    if (this.collection$) {
      return;
    }

    const niceName = this.name.endsWith("s") ? this.name : this.name + "s";
    this.collection$ = db.collection(niceName.trim());
  }
}
