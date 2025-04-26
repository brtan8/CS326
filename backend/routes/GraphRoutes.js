import express from "express";
import GraphController from "../controller/GraphController.js";

class GraphRoutes {
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {

    this.router.get("/Graph", async (request, result) => {
      await GraphController.getAllExpenses(request, result);
    });

    this.router.post("/Graph", async (request, result) => {
      await GraphController.exportChart(request, result);
    });

    this.router.get("/Graph", async (request, result) => {
        await GraphController.downloadFile(request, result);
    });

    //this.router.delete("/Graph", async (request, result) => {
    //    await GraphController.deleteFile(request, result);
    //});
  }

  getRouter() {
    return this.router;
  }
}

export default new GraphRoutes().getRouter();