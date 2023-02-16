import { Err } from "../src/err";
import { None, Option } from "../src/option";

describe("Err", () => {
  it("should be able to create an Err", () => {
    const err = Err.create("test", None());
    expect(err).not.toBeNull();
    expect(err.message).toBe("test");
  });

  describe("with parent", () => {
    let parent: Err;
    beforeEach(() => {
      parent = Err.create("parent", None());
    });

    it("create an Err with a parent", () => {
      const err = Err.create("test", Option.of(parent));
      expect(err.message).toBe("test");
      expect(err.parent).not.toBeNull();
      expect(err.parent.unwrap()).toBe(parent);
    });

    it("Err with a parent and a message", () => {
      const parent = Err.create("parent", None());
      const err = Err.create("test", Option.of(parent));
      expect(err).not.toBeNull();
      expect(err.message).toBe("test");
      expect(err.parent).not.toBeNull();
      expect(err.parent.unwrap()).toBe(parent);
    });

    it("returns complete message", () => {
      const err = Err.create("test", Option.of(parent));
      expect(err.completeMessage).toBe("Error: test Error: parent");
    });

    it("parent is an arbitrary error", () => {
      const parent = new Error("ar");
      const err = Err.create("test", Option.of(parent));
      expect(err.completeMessage).toBe("Error: test Error: ar");
    });

    it("create parent with #extend", () => {
      const err = Err.create("test", None());
      const err2 = err.extend(parent);
      expect(err2.completeMessage).toBe("Error: test Error: parent");
    });
  });

  describe("with no parent", () => {
    it("returns complete message", () => {
      const err = Err.create("test", None());
      expect(err.completeMessage).toBe("Error: test");
    });

    it("returns complete message with a message", () => {
      const err = Err.create("test", None());
      expect(err.completeMessage).toBe("Error: test");
    });
  });
});
