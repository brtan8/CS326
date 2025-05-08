import express from "express";
import ExpenseRoutes from "../routes/ExpenseRoutes.js";
import LoginRoutes from "../routes/LoginRoutes.js";
import GraphRoutes from "../routes/GraphRoutes.js"; // Import GraphRoutes
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
    this.app.use("/routes", ExpenseRoutes);
    this.app.use("/routes", LoginRoutes);
    this.app.use("/routes", GraphRoutes); // Use GraphRoutes
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
