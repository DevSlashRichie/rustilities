import { faker } from "@faker-js/faker";

import { Errur } from "../src";
import { randomFromArray } from "./utils";

enum ErrorKind {
  CLIENT = "CLIENT",
  TRANSIENT = "TRANSIET",
  CRITICAL = "CRITICAL",
  UNKNOWN = "UNKNOWN",
}

const ErrorKindArr = Object.values(ErrorKind);

enum ErrorKind2 {
  SERVER_OFFLINE = "SERVER_OFFLINE",
  SERVER_TIMEOUT = "SERVER_TIMEOUT",
}

const ErrorKind2Arr = Object.values(ErrorKind2);
const AllErrorKindArr = [...ErrorKindArr, ...ErrorKind2Arr];

const createErrorWithDepth = (depth: number, message: string): Errur => {
  if (depth === 0) {
    return Errur.fromErrur({
      kind: randomFromArray(AllErrorKindArr),
      cause: message,
    });
  } else {
    return Errur.fromErrur({
      kind: randomFromArray(AllErrorKindArr),
      cause: createErrorWithDepth(depth - 1, message),
    });
  }
};

describe("Errur", () => {
  describe("with cause as string", () => {
    const err = Errur.fromErrur({
      kind: "errur",
      cause: "message",
    });

    it("is errur", () => {
      expect(Errur.isErrur(err)).toBeTruthy();
    });

    it("display", () => {
      expect(err.display()).toEqual("errur: { message }");
    });

    it("throws if nameFrom is used", () => {
      expect(() => err.display((o) => o)).toThrow(
        "nameFrom is only allowed for Errur with cause as unknown"
      );
    });

    it("and description", () => {
      const err = Errur.fromErrur({
        kind: "errur",
        cause: "message",
        description: "description: %s",
      });

      expect(err.display()).toEqual("errur: { description: message }");
    });
  });

  describe("with cause as error", () => {
    const err = Errur.fromErrur({
      kind: "errur",
      cause: new Error("error"),
    });

    it("is errur", () => {
      expect(Errur.isErrur(err)).toBeTruthy();
    });

    it("display", () => {
      expect(err.display()).toEqual("errur: { Error: { error } }");
    });

    it("throws if nameFrom is used", () => {
      expect(() => err.display((o) => o.name)).toThrow(
        "nameFrom is only allowed for Errur with cause as unknown"
      );
    });

    it("and description", () => {
      const nerr = err.clone({
        description: "description: %s",
      });

      expect(nerr.display()).toEqual(
        "errur: { description: Error: { error } }"
      );
    });
  });

  describe("with cause as interface errur", () => {
    const err = Errur.fromErrur({
      kind: "first",
      cause: {
        kind: "second",
        cause: "message",
      },
    });

    it("is errur", () => {
      expect(Errur.isErrur(err)).toBeTruthy();
    });

    it("display", () => {
      expect(err.display()).toEqual("first: { second: { message } }");
    });

    it("throws if nameFrom is used", () => {
      expect(() => err.display((o) => o.kind)).toThrow(
        "nameFrom is only allowed for Errur with cause as unknown"
      );
    });

    it("and description", () => {
      const nerr = err.clone({
        description: "description: %s",
      });

      expect(nerr.display()).toEqual(
        "first: { description: second: { message } }"
      );
    });
  });

  describe("with cause as errur", () => {
    const err = Errur.fromErrur({
      kind: "first",
      cause: Errur.fromErrur({
        kind: "second",
        cause: "message",
      }),
    });

    it("is errur", () => {
      expect(Errur.isErrur(err)).toBeTruthy();
    });

    it("display", () => {
      expect(err.display()).toEqual("first: { second: { message } }");
    });

    it("throws if nameFrom is used", () => {
      expect(() => err.display((o) => o.kind)).toThrow(
        "nameFrom is only allowed for Errur with cause as unknown"
      );
    });

    it("and description", () => {
      const nerr = err.clone({
        description: "description: %s",
      });

      expect(nerr.display()).toEqual(
        "first: { description: second: { message } }"
      );
    });
  });

  describe("with cause as unknown", () => {
    const err = Errur.fromErrur({
      kind: "first",
      cause: {
        id: "id",
        other: "random",
      },
    });

    it("is errur", () => {
      expect(Errur.isErrur(err)).toBeTruthy();
    });

    describe("display", () => {
      describe("with description", () => {
        const nerr = err.clone({
          description: "description: %s",
        });

        it("simple", () => {
          expect(nerr.display()).toEqual(
            "first: { description: Unknown Error: { { id: 'id', other: 'random' } } }"
          );
        });

        it("with nameFrom", () => {
          expect(nerr.display((o) => o.id)).toEqual(
            "first: { description: id: { { id: 'id', other: 'random' } } }"
          );
        });
      });

      describe("without description", () => {
        it("simple", () => {
          expect(err.display()).toEqual(
            "first: { Unknown Error: { { id: 'id', other: 'random' } } }"
          );
        });

        it("with nameFrom", () => {
          expect(err.display((o) => o.id)).toEqual(
            "first: { id: { { id: 'id', other: 'random' } } }"
          );
        });
      });
    });
  });

  describe("get parent at", () => {
    it("0 returns current cause", () => {
      const errur = Errur.fromErrur({
        kind: ErrorKind.CLIENT,
        cause: "message",
      });

      const parent = errur.getParentAt(0);

      expect(parent.isSome()).toBeTruthy();
      expect(parent.unwrap()).toEqual("message");
    });

    it(">0 returns last parent as string", () => {
      const index = faker.number.int({
        min: 1,
        max: 5,
      });

      const errur = createErrorWithDepth(index, "the message");
      const parent = errur.getParentAt<string>(index);

      expect(parent.isSome()).toBeTruthy();
      expect(parent.unwrap()).toEqual("the message");
    });

    it(">n overflows and returns None", () => {
      const index = faker.number.int({
        min: 1,
        max: 5,
      });

      const errur = createErrorWithDepth(index, "the message");
      const parent = errur.getParentAt(index + 1);

      expect(parent.isNone()).toBeTruthy();
    });

    it("n-1 returns Some(Errur) and last is string", () => {
      const index = faker.number.int({
        min: 1,
        max: 5,
      });

      const errur = createErrorWithDepth(index, "the message");
      const parent = errur.getParentAt<Errur>(index - 1);

      expect(parent.isSome()).toBeTruthy();
      expect(Errur.isErrur(parent.unwrap())).toBeTruthy();

      expect(parent.unwrap()).toBeDefined();
      expect(typeof parent.unwrap().cause === "string").toBeTruthy();
    });
  });

  describe("check in cascade", () => {
    it("valid parent", () => {
      const complexError = Errur.fromErrur({
        kind: ErrorKind.TRANSIENT,
        cause: {
          kind: randomFromArray([
            ErrorKind2.SERVER_OFFLINE,
            ErrorKind2.SERVER_TIMEOUT,
          ]),
          cause: "The server took too long to respond",
        },
      });

      const isErrorKind2 =
        Errur.isErrur(complexError.cause) &&
        Object.values(ErrorKind2).includes(complexError.cause.kind);

      expect(isErrorKind2).toBeTruthy();
    });
  });

  describe("clone", () => {
    it("without override", () => {
      const err = Errur.fromErrur({
        kind: ErrorKind.CLIENT,
        cause: "message",
        description: "description",
      });

      const nerr = err.clone();

      expect(nerr.kind).toEqual(err.kind);
    });

    it("with override", () => {
      const err = Errur.fromErrur({
        kind: ErrorKind.CLIENT,
        cause: "message",
        description: "description",
      });

      const nerr = err.clone({
        kind: ErrorKind.CLIENT,
      });

      expect(nerr.kind).toEqual(ErrorKind.CLIENT);
    });
  });
});
