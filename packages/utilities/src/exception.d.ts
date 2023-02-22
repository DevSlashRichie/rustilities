import { Option } from "./option";
export declare class Exception extends Error {
  readonly parent: Option<Error>;
  protected constructor(message: string, parent: Option<Error>);
  display(): string;
  extend(other: Exception): Exception;
  static create(message: string, parent: Option<Error>): Exception;
}
