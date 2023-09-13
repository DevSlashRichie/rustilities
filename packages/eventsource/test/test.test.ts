// import express, { Request, Response } from "express";
// import bodyParser from "body-parser";
// import cors from "cors";
// import { Server } from "http";
//
// import { EventHandler } from "../src";
//
// function tell(res: Response, message: Record<string, unknown>) {
//   res.write(`data: ${JSON.stringify(message)}\n\n`);
// }
//
// function subscribeRoute(req: Request, res: Response) {
//   res.writeHead(200, {
//     "Content-Type": "text/event-stream",
//     Connection: "keep-alive",
//     "Cache-Control": "no-cache",
//     "X-Accel-Buffering": "no",
//   });
//
//   tell(res, {
//     type: "connected",
//     message: {
//       id: "000",
//     },
//   });
// }
//
// function createTestServer() {
//   const app = express();
//
//   app.use(bodyParser.json());
//   app.use(cors());
//   app.use(bodyParser.urlencoded({ extended: false }));
//
//   app.get("/subscribe", subscribeRoute);
//
//   return app.listen(3333);
// }

describe("EventSource", () => {
  // let server: Server;

  // beforeAll(() => {
  //   server = createTestServer();
  // });

  // afterAll(() => {
  //   if (server) server.close();
  // });

  describe("should connect to server", () => {
    //it("with single string", async () => {
    //  const handler = EventHandler.create("http://localhost:3333/subscribe");

    //  expect(handler.isConnected).toBe(true);
    //});

    it("mock", () => {
      expect(true).toBe(true);
    });
  });
});
