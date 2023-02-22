import "reflect-metadata";
import { Result } from "utilities/src/result";
import { EmptyElement } from "utilities/src/empty";
import { NotFoundConnectionError } from "./errors";
type Listener<T extends object> = T;
export declare class Registry {
  private readonly connections;
  private readonly listeners;
  constructor();
  openConnection(host: string): Promise<() => void>;
  closeConnection(host: string): Promise<void>;
  addListener<T extends object>(
    host: string,
    listener: Listener<T>
  ): Promise<Result<EmptyElement, NotFoundConnectionError>>;
  removeListener<T extends object>(listener: Listener<T>): Promise<void>;
}
export {};
