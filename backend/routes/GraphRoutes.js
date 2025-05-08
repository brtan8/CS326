import express from "express";
import GraphController from "../controller/GraphController.js";

class GraphRoutes {
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post("/Graphs", async (req, res) => {
      await GraphController.saveGraph(req, res);
    });

    this.router.get("/Graphs", async (req, res) => {
      await GraphController.getGraphs(req, res);
    });

    this.router.delete("/Graphs", async (req, res) => {
      await GraphController.deleteGraph(req, res);
    });
  }

  getRouter() {
    return this.router;
  }
}

export default new GraphRoutes().getRouter();