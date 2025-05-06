import express from "express";
import LoginController from "../controller/LoginController.js";

class LoginRoutes {
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {

    this.router.get("/Login", async (request, result) => {
      await LoginController.getAllLogins(request, result);
    });

    this.router.post("/Login", async (request, result) => {
      await LoginController.addLogin(request, result);
    });

    this.router.delete("/Login", async (request, result) => {
      await LoginController.clearLogins(request, result);
    });
    
  }

  getRouter() {
    return this.router;
  }
}

export default new LoginRoutes().getRouter();