import InMemoryExpenseModel from "./ExpenseModel.js";

class _ModelFactory {
  getModel() {
    return InMemoryExpenseModel;
  }
}

const ModelFactory = new _ModelFactory();
export default ModelFactory;
