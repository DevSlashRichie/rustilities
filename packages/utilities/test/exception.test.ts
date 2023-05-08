import { Exception, AnonymousException, ExceptionLike } from "../src";
import { None, Option, Some } from "../src";

describe("Exception", () => {
  it("should be able to create an Err", () => {
    const err = Exception.create("test", None());
    expect(err).not.toBeNull();
    expect(err.message).toBe("test");
  });

  describe("with parent", () => {
    let parent: Exception;
    beforeEach(() => {
      parent = Exception.create("parent", None());
    });

    it("create an Err with a parent", () => {
      const err = Exception.create("test", Option.of(parent));
      expect(err.message).toBe("test");
      expect(err.parent).not.toBeNull();
      expect(err.parent.unwrap()).toBe(parent);
    });

    it("Err with a parent and a message", () => {
      const parent = Exception.create("parent", None());
      const err = Exception.create("test", Option.of(parent));
      expect(err).not.toBeNull();
      expect(err.message).toBe("test");
      expect(err.parent).not.toBeNull();
      expect(err.parent.unwrap()).toBe(parent);
    });

    it("returns complete message", () => {
      const err = Exception.create("test", Option.of(parent));
      expect(err.display()).toBe("Exception: test Exception: parent");
    });

    it("parent is an arbitrary error", () => {
      const parent = new Error("ar");
      const err = Exception.create("test", Option.of(parent));
      expect(err.display()).toBe("Exception: test Error: ar");
    });

    it("create parent with #extend", () => {
      const err = Exception.create("test", None());
      const err2 = err.extend(parent);
      expect(err2.display()).toBe("Exception: test Exception: parent");
    });
  });

  describe("with no parent", () => {
    it("returns complete message", () => {
      const err = Exception.create("test", None());
      expect(err.display()).toBe("Exception: test");
    });

    it("returns complete message with a message", () => {
      const err = Exception.create("test", None());
      expect(err.display()).toBe("Exception: test");
    });
  });
});

describe("AnonymousException", () => {
  it("should be ExceptionLike", () => {
    const err = new AnonymousException("test-name", "test", None());
    expect(err).not.toBeNull();
    expect(err.message).toBe("test");
    expect(err.name).toBe("test-name");
  });

  describe("with parent", () => {
    it("generic-error return complete message", () => {
      const error = new AnonymousException(
        "test-name",
        "test",
        Some(new Error("parent"))
      );
      expect(error.display()).toBe("test-name: test Error: parent");
    });

    it("exception return complete message", () => {
      const parent = new AnonymousException("parent-name", "parent", None());
      const error = new AnonymousException("test-name", "test", Some(parent));
      expect(error.display()).toBe("test-name: test parent-name: parent");
    });
  });

  describe("with no parent", () => {
    let error: ExceptionLike;
    beforeEach(() => {
      error = new AnonymousException("test-name", "test", None());
    });

    it("return complete message", () => {
      expect(error.display()).toBe("test-name: test");
    });
  });
});
