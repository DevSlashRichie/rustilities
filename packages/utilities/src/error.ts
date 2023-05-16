export interface IErrur<T = unknown> {
  kind: string;
  content: T;
}

export class Errur<T = unknown> {
  private constructor(
    public readonly kind: string,
    public readonly content: T
  ) {}

  public display(nameFrom?: (o: T) => string): string {
    const throwNameFromNotAllowed = () => {
      if (nameFrom)
        throw new Error(
          "nameFrom is only allowed for Errur with content as unknown"
        );
    };

    let next: string;
    if (typeof this.content === "string") {
      next = this.content;
      throwNameFromNotAllowed();
    } else if (this.content instanceof Errur) {
      next = this.content.display();
      throwNameFromNotAllowed();
    } else if (Errur.isErrur(this.content)) {
      next = Errur.fromErrur(this.content).display();
      throwNameFromNotAllowed();
    } else if (this.content instanceof Error) {
      next = createDisplayPart(this.content.name, this.content.message);
      throwNameFromNotAllowed();
    } else {
      // We use JSON.stringify here because we don't know what the parent is.
      const name = nameFrom ? nameFrom(this.content) : "Unknown Error";
      next = createDisplayPart(name, JSON.stringify(this.content));
    }

    return createDisplayPart(this.kind, next);
  }

  public static isErrur(err: unknown): err is IErrur {
    const _err = err as unknown as Partial<IErrur>;
    return (
      !!err &&
      typeof _err.kind === "string" &&
      typeof _err.content !== "undefined"
    );
  }

  public static fromErrur<U>(errur: IErrur<U>): Errur<U> {
    return new Errur<U>(errur.kind, errur.content);
  }
}

function createDisplayPart(name: string, content: string): string {
  return `${name}: { ${content} }`;
}
