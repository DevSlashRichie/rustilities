import { EasyException, ExceptionLike, Some } from "../src";

describe("easy-exception", () => {
  it("should create a correct builder", () => {
    const builder = new EasyException("Test");

    expect(builder).toBeDefined();
    expect(builder).toBeInstanceOf(EasyException);
  });

  it("builder should create a correct exception", () => {
    const builder = new EasyException("Test");
    const exception = builder.simple("Test");

    expect(exception).toBeDefined();
    expect(exception).toBeInstanceOf(ExceptionLike);
  });

  describe("built simple exception", () => {
    let simple: ExceptionLike;
    beforeEach(() => {
      const builder = new EasyException("Test");
      simple = builder.simple("Test");
    });

    it("should have correct name", () => {
      expect(simple.name).toBe("Test");
    });

    it("should have correct message", () => {
      expect(simple.message).toBe("Test");
    });
  });

  describe("built complete exception", () => {
    let complete: ExceptionLike;
    beforeEach(() => {
      const builder = new EasyException("Test");
      complete = builder.complete("Test", Some(new Error("parent error")));
    });

    it("should have correct name", () => {
      expect(complete.name).toBe("Test");
    });

    it("should have correct message", () => {
      expect(complete.message).toBe("Test");
    });
  });
});
