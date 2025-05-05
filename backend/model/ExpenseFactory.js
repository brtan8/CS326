import SQLiteExpenseModel from "./ExpenseModel.js";

class _ModelFactory {
  async getModel(model = "sqlite-fresh") {
    if (model === "sqlite") {
      return SQLiteExpenseModel;
    } else if (model === "sqlite-fresh") {
      await SQLiteExpenseModel.init(true);
      return SQLiteExpenseModel;
    } 
  }
}

const ModelFactory = new _ModelFactory();
export default ModelFactory;
