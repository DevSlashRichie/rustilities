import { EventHandler, Registry } from "../src";
import amqp, { ConsumeMessage, Channel } from "amqplib";
import { GenericContainer, StartedTestContainer } from "testcontainers";

class MockListener {
  private _outsider: any;
  constructor(_outsider?: any) {
    this._outsider = _outsider;
  }

  @EventHandler({ type: "fanout", name: "test" }, "test")
  public test(payload: any, msg: ConsumeMessage, ch: Channel) {
    console.log("test has been called");
    if (this._outsider) {
      this._outsider();
    }

    ch.ack(msg);
  }
}

describe("EventRegistry", () => {
  let rabbitLocalHost = "";
  let container: StartedTestContainer;

  beforeAll(async () => {
    jest.setTimeout(30000);
    container = await new GenericContainer("rabbitmq:alpine")
      .withExposedPorts(5672)
      .start();

    rabbitLocalHost = `amqp://${container.getHost()}:${container.getMappedPort(
      5672
    )}`;
  });

  afterAll(async () => {
    await container.stop({});
  });

  it("can instantiate", () => {
    const registry = new Registry();
    expect(registry).toBeInstanceOf(Registry);
  });

  describe("open connection", () => {
    let registry: Registry;
    beforeEach(() => {
      registry = new Registry();
    });

    it("should open a new connection", async () => {
      const res = await registry.openConnection(rabbitLocalHost);
      expect(res).toBeInstanceOf(Function);
    });

    it("callback should be able to close connection", async () => {
      const close = await registry.openConnection(rabbitLocalHost);
      expect(close).toBeInstanceOf(Function);

      const r = await registry.addListener("localhost", new MockListener());

      expect(r.isErr()).toBeTruthy();
    });
  });

  describe("add listener", () => {
    it("should fail if host is not found", async () => {
      const registry = new Registry();
      const res = await registry.addListener("localhost", new MockListener());
      expect(res.isErr()).toBeTruthy();
    });

    it("should not fail with a valid host", async () => {
      const registry = new Registry();
      await registry.openConnection(rabbitLocalHost);
      const res = await registry.addListener(
        rabbitLocalHost,
        new MockListener()
      );
      expect(res.isOk()).toBeTruthy();
    });

    it("will announce the listener about incoming data", async () => {
      const registry = new Registry();
      const listener = new MockListener(() => {
        console.log("super test");
      });
      await registry.openConnection(rabbitLocalHost);
      await registry.addListener(rabbitLocalHost, listener);

      const connection = await amqp.connect(rabbitLocalHost);
      const channel = await connection.createChannel();
      await channel.assertExchange("test", "fanout");

      channel.publish("test", "", Buffer.from("10"));

      await new Promise((resolve) => setTimeout(resolve, 1000));
    });
  });
});
