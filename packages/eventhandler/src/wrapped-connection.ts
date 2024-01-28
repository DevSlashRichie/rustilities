import { Connection } from "amqplib";
import { ConnectionDispatcher } from "./connection-dispatcher";

export class WrappedConnection {
  private openedDispatchers: Array<ConnectionDispatcher> = [];
  private _closed = false;
  get closed() {
    return this._closed;
  }

  get connection(): Connection {
    return this._connection;
  }

  constructor(private _connection: Connection) {}

  public async updateConnection(connection: Connection) {
    this._connection = connection;
    const channel = await this.connection.createChannel();
    this.openedDispatchers.forEach((it) => it.updateChannel(channel));
  }

  /**
   * Close the connection
   */
  public async close() {
    this._closed = true;
    await this.connection.close();
  }

  /**
   * Open a dispatcher for the given exchange
   * @param exchange The exchange to open a dispatcher for
   */
  public async openDispatcher(exchange: string): Promise<ConnectionDispatcher> {
    const dispatcher = await ConnectionDispatcher.fromConnection(
      this,
      exchange
    );
    this.openedDispatchers.push(dispatcher);
    return dispatcher;
  }
}
