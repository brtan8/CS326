import ModelFactory from "../model/ExpenseFactory.js";

class ExpenseController {
  constructor() {
    ModelFactory.getModel().then((model) => {
      this.model = model;
    });
  }

  async getAllExpenses(req, res) {
    const Expense = await this.model.read();
    res.json({ Expense });
  }

  async addExpense(req, res) {
    try {
      if (!req.body) {
        return res.status(400).json({ error: "Expense description is required." });
      }

      const Expense = await this.model.create(req.body);

      const file = req.body.file
        ? `with file: ${req.body.filename}`
        : "without file";
      console.log(`New Expense: ${Expense.userId} - ${Expense.amount} - ${file}`);

      return res.status(201).json(Expense);
    } catch (error) {
      console.error("Error adding Expense:", error);
      return res
        .status(500)
        .json({ error: "Failed to add Expense. Please try again." });
    }
  }

  async clearExpenses(req, res) {
    await this.model.delete(req.query);
    res.json(await this.model.read());
  }
}

export default new ExpenseController();
