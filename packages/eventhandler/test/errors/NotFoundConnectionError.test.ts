import { NotFoundConnectionError } from "../../src";

describe("NotFoundConnectionError", () => {
  it("is instantiable", () => {
    expect(new NotFoundConnectionError("host")).toBeInstanceOf(
      NotFoundConnectionError
    );
  });

  it("has a valid message", () => {
    expect(new NotFoundConnectionError("amqp://localhost").message).toBe(
      "Connection to amqp://localhost not found."
    );
  });
});
