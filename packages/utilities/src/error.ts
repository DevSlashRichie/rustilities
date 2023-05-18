import { Option } from "./option";
import util from "util";

export interface IErrur<K extends string = string, T = unknown> {
  kind: K;
  cause: T;
  description?: string;
}

export class Errur<K extends string = string, T = unknown> {
  private constructor(
    public readonly kind: K,
    public readonly cause: T,
    public readonly description?: string
  ) {}

  public display(nameFrom?: (o: T) => string): string {
    if (
      nameFrom &&
      (typeof this.cause === "string" ||
        Errur.isErrur(this.cause) ||
        this.cause instanceof Error)
    ) {
      throw new Error(
        "nameFrom is only allowed for Errur with cause as unknown"
      );
    }

    let next: string;
    if (typeof this.cause === "string") {
      next = this.cause;
    } else if (Errur.isErrur(this.cause)) {
      next = Errur.fromErrur(this.cause).display();
    } else if (this.cause instanceof Error) {
      next = createDisplayPart(this.cause.name, this.cause.message);
    } else {
      // We use JSON.stringify here because we don't know what the parent is.
      const name = nameFrom ? nameFrom(this.cause) : "Unknown Error";
      next = createDisplayPart(name, util.inspect(this.cause, true, null));
    }

    if (this.description) {
      next = util.format(this.description, next);
    }

    return createDisplayPart(this.kind, next);
  }

  public getParentAt<T = unknown>(index: number): Option<T> {
    if (index > 0) {
      if (Errur.isErrur(this.cause)) {
        return Errur.fromErrur(this.cause).getParentAt(index - 1);
      } else {
        return Option.None();
      }
    } else {
      return Option.Some(this.cause as unknown as T);
    }
  }

  public clone(overrides: Partial<IErrur<K, T>>): Errur<K, T> {
    return new Errur<K, T>(
      overrides.kind ?? this.kind,
      overrides.cause ?? this.cause,
      overrides.description ?? this.description
    );
  }

  public static isErrur(err: unknown): err is IErrur {
    const _err = err as unknown as Partial<IErrur>;
    return (
      !!err &&
      typeof _err.kind === "string" &&
      typeof _err.cause !== "undefined"
    );
  }

  public static fromErrur<C extends string, U>(
    errur: IErrur<C, U> | Errur<C, U>
  ): Errur<C, U> {
    if (errur instanceof Errur) return errur;

    return new Errur<C, U>(errur.kind, errur.cause, errur.description);
  }
}

function createDisplayPart(name: unknown, content: string): string {
  return `${name}: { ${content} }`;
}
