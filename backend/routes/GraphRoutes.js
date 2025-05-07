import express from "express";
import GraphController from "../controller/GraphController.js";

class GraphRoutes {
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {

    this.router.get("/Graph/expenses", async (req, res) => {
        await GraphController.getAllExpenses(req, res);
      });
    
      this.router.post("/Graph/save", async (req, res) => {
        await GraphController.saveChart(req, res);
      });
    
      this.router.get("/Graph/saved", async (req, res) => {
        await GraphController.getSavedCharts(req, res);
      });
    
      this.router.delete("/Graph/delete/:filename", async (req, res) => {
        await GraphController.deleteSavedChart(req, res);
      });
    
      this.router.get("/download/:filename", async (req, res) => {
        await GraphController.downloadFile(req, res);
      });
  }

  getRouter() {
    return this.router;
  }
}

export default new GraphRoutes().getRouter();