import { Some, None } from "../src/option";
import { Err, Ok } from "../src/result";

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
  });

  describe("okOr", () => {
    it("when there is some", () => {
      const opt = Some("str");
      expect(opt.okOr(new Error("error"))).toEqual(Ok("str"));
    });

    it("when is empty", () => {
      const opt = None<string>();
      expect(opt.okOr(new Error("error"))).toEqual(Err(new Error("error")));
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
});
