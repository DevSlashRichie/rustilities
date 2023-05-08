import { Empty, EmptyElement } from "../src/";

describe("Empty", () => {
  it("helper should instance", () => {
    expect(() => Empty()).not.toThrow();
  });

  it("should be empty", () => {
    const empty = Empty();
    expect(empty).toBeInstanceOf(EmptyElement);
  });
});
