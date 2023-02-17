import { Registry } from "./registry";
import { EventHandler } from "./annotations";
import { ConsumeMessage } from "amqplib";

const registry = new Registry();

class TestListener {
  @EventHandler(
    {
      name: "test-payments",
      type: "direct",
    },
    {
      name: "test-payments",
    },
    {
      rabbit: {
        noAck: true,
      },
    }
  )
  public onUserPaymentEvent(msg: any, raw: ConsumeMessage | null) {
    console.log("msg: ", msg);
  }
}

async function start() {
  await registry.openConnection("amqp://localhost");
  registry.addListener("amqp://localhost", new TestListener());
}

start().catch(console.error);
