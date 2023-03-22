import { MongoClient, Db } from "mongodb";
import { Repo } from "./repo";
import { Logger } from "ddd-scaffold";

export class MongoDBClient {
  private readonly mongoDBClient: MongoClient;
  private _db?: Db;

  public constructor(host: string | MongoClient) {
    if (typeof host === "string") {
      this.mongoDBClient = new MongoClient(host, {
        minPoolSize: 1,
        maxPoolSize: 5,
        retryWrites: true,
        readConcern: {
          level: "majority",
        },
        w: "majority",
      });
    } else {
      this.mongoDBClient = host;
    }
  }

  get db() {
    if (!this._db) throw new Error("MongoDBClient not connected");
    return this._db;
  }

  async connect() {
    await this.mongoDBClient.connect();
    this._db = this.mongoDBClient.db(undefined);
    Logger.info("MongoDB connected");
  }

  async disconnect() {
    await this.mongoDBClient.close();
    Logger.info("MongoDB disconnected");
  }

  initRepo(...repos: Repo<any>[]) {
    for (const repo of repos) {
      repo.connect(this.db);
      Logger.info(`Repo ${repo.name} connected`);
    }
  }
}
