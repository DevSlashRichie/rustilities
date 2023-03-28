import { Connection } from "amqplib";
import { ConnectionDispatcher } from "./connection-dispatcher";

export class WrappedConnection {
  constructor(public readonly connection: Connection) {}

  /**
   * Close the connection
   */
  public async close() {
    await this.connection.close();
  }

  /**
   * Open a dispatcher for the given exchange
   * @param exchange The exchange to open a dispatcher for
   */
  public async openDispatcher(exchange: string): Promise<ConnectionDispatcher> {
    return await ConnectionDispatcher.fromConnection(this, exchange);
  }

  /**
   * Open a dispatcher and assert it's configuration.
   */
  public async assertAndOpenDispatcher(exchange: string, type: string) {
    const d = await ConnectionDispatcher.fromConnection(this, exchange);
    return d;
  }
}
