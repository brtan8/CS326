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
      await LoginController.deleteLogin(request, result);  // Changed method to `deleteLogin`
    });

    this.router.patch("/Login", async (req, res) => {
      await LoginController.updatePassword(req, res);
    });


    
  }

  getRouter() {
    return this.router;
  }
}

export default new LoginRoutes().getRouter();