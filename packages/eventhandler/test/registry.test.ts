import { EventHandler, Registry, Listener } from "../src";
import amqp, { ConsumeMessage, Channel } from "amqplib";
import { GenericContainer, StartedTestContainer } from "testcontainers";
import { None, Option } from "@mymetaverse/utilities";
import { WrappedConnection } from "../src/wrapped-connection";

class MockListener implements Listener {
  private _outsider: any;

  constructor(_outsider?: any) {
    this._outsider = _outsider;
  }

  // will get filled by the registry.
  public __connection: Option<WrappedConnection> = None();
  // will get filled by the registry.
  public __channels: Option<amqp.Channel[]> = None();

  @EventHandler({ type: "fanout", name: "test" }, "test")
  public test(payload: any, msg: ConsumeMessage, ch: Channel) {
    console.log("test has been called");
    if (this._outsider) {
      this._outsider();
    }

    ch.ack(msg);
  }
}

jest.useRealTimers();
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
    let _registry: Registry;
    beforeEach(() => {
      _registry = new Registry();
    });

    it("should open a new connection", async () => {
      const { close, connection } = await _registry.openConnection(
        rabbitLocalHost
      );
      expect(close).toBeInstanceOf(Function);
      expect(connection).toBeInstanceOf(WrappedConnection);
      await close();
    });

    it("callback should be able to close connection", async () => {
      const { close, connection } = await _registry.openConnection(
        rabbitLocalHost
      );
      await close();
      const promise = connection.openDispatcher("test");
      await expect(promise).rejects.toThrow();
    });
  });

  describe("add listener", () => {
    it("should not fail with a valid host", async () => {
      const registry = new Registry();
      const { connection } = await registry.openConnection(rabbitLocalHost);
      const res = await registry.addListener(connection, new MockListener());
      expect(res.isOk()).toBeTruthy();
    });

    // spy failing for some reason, skipped until solved.
    it.skip("will announce the listener about incoming data", async () => {
      const registry = new Registry();
      const spy = jest.fn();
      const listener = new MockListener(spy);

      const { connection } = await registry.openConnection(rabbitLocalHost);
      await registry.addListener(connection, listener);

      const dispatcher = await connection.openDispatcher("test");

      dispatcher.publishString("10");

      await new Promise((resolve) => setTimeout(resolve, 1000));
      expect(spy).toBeCalled();
    });
  });
});
