import { CursorMetadata } from "./types";

export interface PaginationNodeProps<T> {
  entities: Array<T>;
  metadata: CursorMetadata;
}

export class PaginationNode<T> {
  private readonly props: PaginationNodeProps<T>;
  constructor(props: PaginationNodeProps<T>) {
    this.props = props;
  }

  get entities(): Array<T> {
    return this.props.entities;
  }

  get metadata(): CursorMetadata {
    return this.props.metadata;
  }

  public filter(filter: (entity: T) => boolean): PaginationNode<T> {
    const entities = this.entities.filter(filter);
    return new PaginationNode({
      entities,
      metadata: this.metadata,
    });
  }

  public map<U>(map: (entity: T) => U): PaginationNode<U> {
    const entities = this.entities.map(map);
    return new PaginationNode({
      entities,
      metadata: this.metadata,
    });
  }
}
