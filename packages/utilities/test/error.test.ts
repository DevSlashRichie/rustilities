import { Errur } from "../src";

describe("Errur", () => {
  describe("with content as string", () => {
    const err = Errur.fromErrur({
      kind: "errur",
      content: "message",
    });

    it("is errur", () => {
      expect(Errur.isErrur(err)).toBeTruthy();
    });

    it("display", () => {
      expect(err.display()).toEqual("errur: { message }");
    });

    it("throws if nameFrom is used", () => {
      expect(() => err.display((o) => o)).toThrow(
        "nameFrom is only allowed for Errur with content as unknown"
      );
    });
  });

  describe("with content as error", () => {
    const err = Errur.fromErrur({
      kind: "errur",
      content: "message",
    });

    it("is errur", () => {
      expect(Errur.isErrur(err)).toBeTruthy();
    });

    it("display", () => {
      const err = Errur.fromErrur({
        kind: "errur",
        content: new Error("error"),
      });

      expect(err.display()).toEqual("errur: { Error: { error } }");
    });

    it("throws if nameFrom is used", () => {
      expect(() => err.display((o) => o)).toThrow(
        "nameFrom is only allowed for Errur with content as unknown"
      );
    });
  });

  describe("with content as interface errur", () => {
    const err = Errur.fromErrur({
      kind: "first",
      content: {
        kind: "second",
        content: "message",
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
        "nameFrom is only allowed for Errur with content as unknown"
      );
    });
  });

  describe("with content as errur", () => {
    const err = Errur.fromErrur({
      kind: "first",
      content: Errur.fromErrur({
        kind: "second",
        content: "message",
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
        "nameFrom is only allowed for Errur with content as unknown"
      );
    });
  });

  describe("with content as unknown", () => {
    const err = Errur.fromErrur({
      kind: "first",
      content: {
        id: "id",
        other: "random",
      },
    });

    it("is errur", () => {
      expect(Errur.isErrur(err)).toBeTruthy();
    });

    it("display", () => {
      expect(err.display()).toEqual(
        'first: { Unknown Error: { {"id":"id","other":"random"} } }'
      );
    });

    it("display with nameFrom", () => {
      expect(err.display((o) => o.id)).toEqual(
        'first: { id: { {"id":"id","other":"random"} } }'
      );
    });
  });
});
