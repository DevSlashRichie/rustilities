import { EventHandler } from "../src";

class AnnotationsMock {
  @EventHandler({ name: "test", type: "direct" }, "test")
  public testMethod() {
    console.log("test");
  }
}

describe("annotations", () => {
  it("method should have metadata", () => {
    const meta = Reflect.getMetadata(
      "eventhandler:eventhandler",
      AnnotationsMock.prototype,
      "testMethod"
    );
    expect(meta).toBeDefined();
  });
});
