import { Some, None, Option, Errur } from "../src";
import { Err, Ok } from "../src";

describe("Option", () => {
  it("creates a success option", () => {
    const option = Some(1);

    expect(option.isSome()).toBe(true);
    expect(option.isNone()).toBe(false);
    expect(option.unwrap()).toBe(1);
  });

  it("creates a failure option", () => {
    const option = None();

    expect(option.isSome()).toBe(false);
    expect(option.isNone()).toBe(true);
    expect(() => option.unwrap()).toThrow();
  });

  describe("from nullable", () => {
    it("creates empty from null", () => {
      const option = Option.fromNullable(null);
      expect(option.isNone()).toBe(true);
    });

    it("creates empty from undefined", () => {
      const option = Option.fromNullable(undefined);
      expect(option.isNone()).toBe(true);
    });

    it("creates some from value", () => {
      const option = Option.fromNullable(1);
      expect(option.isSome()).toBe(true);
      expect(option.unwrap()).toBe(1);
    });
  });

  describe("unwrap", () => {
    it("when there is some", () => {
      const opt = Some("str");
      expect(opt.unwrap()).toBe("str");
    });

    it("throws when is empty", () => {
      const opt = None();
      expect(() => opt.unwrap()).toThrow();
    });
  });

  describe("map", () => {
    it("when there is some", () => {
      const opt = Some("str");
      expect(opt.map((s) => `${s}-3`)).toEqual(Some("str-3"));
    });

    it("when is empty", () => {
      const opt = None<string>();
      expect(opt.map((s) => s.length)).toEqual(None());
    });
  });

  describe("unwrapOr", () => {
    it("when there is some", () => {
      const opt = Some("str");
      expect(opt.unwrapOr("default")).toBe("str");
    });

    it("when is empty", () => {
      const opt = None();
      expect(opt.unwrapOr("default")).toBe("default");
    });
  });

  describe("unwrapOrElse", () => {
    it("when there is some", () => {
      const opt = Some("str");
      expect(opt.unwrapOrElse(() => "default")).toBe("str");
    });

    it("when is empty", () => {
      const opt = None();
      expect(opt.unwrapOrElse(() => "default")).toBe("default");
    });
  });

  describe("mapOr", () => {
    it("when there is some", () => {
      const opt = Some("str");
      expect(opt.mapOr("default", (s) => `${s}-3`)).toBe("str-3");
    });

    it("when is empty", () => {
      const opt = None<string>();
      expect(opt.mapOr("default", (s) => s)).toBe("default");
    });

    describe("but with custom U", () => {
      it("when there is some", () => {
        const opt = Some("str");
        expect(opt.mapOr(0, (s) => s.length)).toBe(3);
      });

      it("when is empty", () => {
        const opt = None<string>();
        expect(opt.mapOr(0, (s) => s.length)).toBe(0);
      });
    });
  });

  describe("okOr", () => {
    it("when there is some", () => {
      const opt = Some("str");
      expect(
        opt.okOr(
          Errur.fromErrur({
            kind: "error",
            cause: "cause",
          })
        )
      ).toEqual(Ok("str"));
    });

    it("when is empty", () => {
      const opt = None<string>();
      expect(
        opt.okOr(
          Errur.fromErrur({
            kind: "error",
            cause: "cause",
          })
        )
      ).toEqual(
        Err(
          Errur.fromErrur({
            kind: "error",
            cause: "cause",
          })
        )
      );
    });
  });

  describe("or", () => {
    it("when there is some", () => {
      const opt = Some("str");
      expect(opt.or(Some("default"))).toEqual(Some("str"));
    });

    it("when is empty", () => {
      const opt = None<string>();
      expect(opt.or(Some("default"))).toEqual(Some("default"));
    });
  });

  describe("contains", () => {
    it("when there is some", () => {
      const opt = Some("str");
      expect(opt.contains("str")).toBe(true);
    });

    it("when is empty", () => {
      const opt = None<string>();
      expect(opt.contains("str")).toBe(false);
    });
  });

  describe("match", () => {
    it("brace Some", () => {
      const result = Some("test");

      const spy = jest.fn((param: string) => param);

      const r = result.match({
        Some: (value) => spy(value),
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
        None: () => "none",
      });

      expect(spy).toBeCalledWith("test");
      expect(r).toBe("test");
    });

    it("brace None", () => {
      const result = None();

      const spy = jest.fn((param: string) => param);

      const r = result.match({
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
        Some: (some) => some,
        None: () => spy("none"),
      });

      expect(spy).toBeCalledWith("none");
      expect(r).toBe("none");
    });
  });
});
