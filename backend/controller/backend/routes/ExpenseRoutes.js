import express from "express";
import ExpenseController from "../controller/ExpenseController.js";

class ExpenseRoutes {
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {

    this.router.get("/Expenses", async (request, result) => {
      await ExpenseController.getAllExpenses(request, result);
    });

    this.router.post("/Expenses", async (request, result) => {
      await ExpenseController.addExpense(request, result);
    });

    this.router.delete("/Expenses", async (request, result) => {
      await ExpenseController.clearExpenses(request, result);
    });
  }

  getRouter() {
    return this.router;
  }
}

export default new ExpenseRoutes().getRouter();