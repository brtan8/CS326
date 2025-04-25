
import ExpenseModel from "../model/ExpenseFactory.js";

class ExpenseController {
  constructor() {
    this.model = ExpenseModel.getModel();
  }

  async getAllExpenses(request, result) {
    const Expenses = await this.model.read();
    result.json(Expenses);
  }

  async addExpense(request, result) {
    try {
      if (!request.body) {
        return result.status(400).json({ error: "error." });
      }

      const expense = await this.model.create(request.body);

      const file = request.body.file
        ? `with file: ${request.body.filename}`
        : "without file";

      return result.status(201).json(expense);
    } catch (error) {
      console.error("Error adding expense:", error);
      return result
        .status(500)
        .json({ error: "Failed to add expense. Please try again." });
    }
  }

  async clearExpenses(request, result) {
    await this.model.delete(request.query);
    result.json(await this.model.read());
  }
}

export default new ExpenseController();
