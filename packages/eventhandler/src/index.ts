import { Registry } from "./registry";
import { EventHandler } from "./annotations";
import { ConsumeMessage } from "amqplib";

const registry = new Registry();

const EXCHANGE_PAYMENTS = {
  name: "test-payments",
  type: "direct"
};

class TestListener {
  @EventHandler(EXCHANGE_PAYMENTS, "test-payments")
  public onUserPaymentEvent(msg: any, raw: ConsumeMessage | null) {
    console.log("msg: ", msg);
  }
}

async function start() {
  await registry.openConnection("amqp://localhost");
  const lr = registry.addListener("amqp://localhost", new TestListener());

  if(lr.isErr()) {
    console.error(lr.unwrapErr().display());
  }
}

start().catch(console.error);
