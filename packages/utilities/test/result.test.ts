import { Err, Ok, Result } from "../src";

describe("Result", () => {
  describe("should create an Ok Result", () => {
    it("when a no-null value is passed", () => {
      const result = Ok("test");
      expect(result.isOk()).toBe(true);
      expect(result.isErr()).toBe(false);
      expect(result.unwrap()).toBe("test");
    });

    it("when a null value is passed", () => {
      const result = Ok(null);
      expect(result.isOk()).toBe(true);
      expect(result.isErr()).toBe(false);
      expect(result.unwrap()).toBe(null);
    });
  });

  it("should create an Err Result", () => {
    const result = Err(new Error("test"));
    expect(result.isOk()).toBe(false);
    expect(result.isErr()).toBe(true);
    expect(() => result.unwrap()).toThrowError(
      "Called unwrap on an Err Result"
    );
  });

  describe("unwrap", () => {
    it("should unwrap an Ok Result", () => {
      const result = Ok("test");
      expect(result.unwrap()).toBe("test");
    });

    it("should throw an error when unwrapping an Err Result", () => {
      const result = Err(new Error("test"));
      expect(() => result.unwrap()).toThrowError(
        "Called unwrap on an Err Result"
      );
    });
  });

  describe("unwrapOr", () => {
    it("should unwrap an Ok Result", () => {
      const result = Ok("test");
      expect(result.unwrapOr("test2")).toBe("test");
    });

    it("should return the default value when unwrapping an Err Result", () => {
      const result = Err(new Error("test"));
      expect(result.unwrapOr("test2")).toBe("test2");
    });
  });

  describe("contains", () => {
    it("returns true when the value is contained in an Ok Result", () => {
      const result = Ok("test");
      expect(result.contains("test")).toBe(true);
    });

    it("returns false when the value is not contained in an Ok Result", () => {
      const result = Ok("test");
      expect(result.contains("test2")).toBe(false);
    });

    it("returns false when unwrapping an Err Result", () => {
      const result = Err(new Error("test"));
      expect(result.contains("test")).toBe(false);
    });
  });

  describe("unwrapOr", () => {
    it("should throw an error when unwrapping an Ok Result", () => {
      const result = Ok("test");
      expect(() => result.unwrapErr()).toThrowError(
        "Called unwrapErr on an Ok Result"
      );
    });

    it("should unwrap an Err Result", () => {
      const result = Err(new Error("test"));
      expect(result.unwrapErr()).toBeInstanceOf(Error);
    });
  });

  describe("unwrapOrElse", () => {
    it("should unwrap an Ok Result", () => {
      const result = Ok("test");
      expect(result.unwrapOrElse((error) => error.message + "2")).toBe("test");
    });

    it("should return the default value when unwrapping an Err Result", () => {
      const result = Err(new Error("test"));
      expect(result.unwrapOrElse((error) => error.message + "2")).toBe("test2");
    });
  });

  describe("map", () => {
    it("should map an Ok Result", () => {
      const result = Ok("test");
      expect(result.map((value) => value + "2")).toEqual(Ok("test2"));
    });

    it("won't map an Err Result", () => {
      const result = Err(new Error("test"));
      expect(result.map((value) => value + "2")).toEqual(
        Err(new Error("test"))
      );
    });
  });

  describe("mapErr", () => {
    it("won't map an Ok Result", () => {
      const result = Ok("test");
      expect(result.mapErr((value) => new Error(value + "2"))).toEqual(
        Ok("test")
      );
    });

    it("will map an Err Result", () => {
      const result = Err(new Error("test"));
      expect(result.mapErr((value) => new Error(value.message + "2"))).toEqual(
        Err(new Error("test2"))
      );
    });
  });

  describe("from throw", () => {
    it("should return Ok", () => {
      const result = Result.fromThrow(() => "test");
      expect(result).toEqual(Ok("test"));
    });

    it("should return Err", () => {
      const result = Result.fromThrow(() => {
        throw new Error("test");
      });
      expect(result).toEqual(Err(new Error("test")));
    });
  });

  describe("equals", () => {
    it("should return true when both are Ok", () => {
      const result1 = Ok("test");
      const result2 = Ok("test");
      expect(result1.equals(result2)).toBe(true);
    });

    it("should return false when both are Ok but the value is different", () => {
      const result1 = Ok("test");
      const result2 = Ok("test2");
      expect(result1.equals(result2)).toBe(false);
    });

    it("should return true when both are Err", () => {
      const err = new Error("test");
      const result1 = Err(err);
      const result2 = Err(err);
      expect(result1.equals(result2)).toBe(true);
    });

    it("should return false when both are Err but the value is different", () => {
      const result1 = Err(new Error("test"));
      const result2 = Err(new Error("test2"));
      expect(result1.equals(result2)).toBe(false);
    });

    it("should return false when one is Ok and the other is Err", () => {
      const result1 = Ok("test");
      const result2 = Err(new Error("test"));
      expect(result1.equals(result2)).toBe(false);
    });
  });
});
