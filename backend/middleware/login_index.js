import express from "express";
import LoginRoutes from "../routes/LoginRoutes.js";
import cors from 'cors';

class Server {
  constructor() {
    this.app = express();
    this.configureMiddleware();
    this.setupRoutes();
  }

  configureMiddleware() {

    this.app.use(cors());

    this.app.use(express.static("../../front-end"));

    this.app.use(express.json({ limit: "10mb" }));

  }

  setupRoutes() {
    this.app.use("/routes", LoginRoutes);
  }

  start(port = 3000) {
    this.app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  }
}

console.log("Starting server...");
const server = new Server();
server.start(3000);