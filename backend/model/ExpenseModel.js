

class _InMemoryExpenseModel {
    static expenseId = 1;
  
    constructor() {
      this.expenses = {};
    }
  
    async create(Expense) {
      this.expenses[_InMemoryExpenseModel.expenseId] = Expense;
      _InMemoryExpenseModel.expenseId++;
      return Expense;
    }
  
    async read(id = null) {
      if (id) {
        return Object.values(this.expenses).find((Expense) => Expense.id === id);
      }
  
      return this.expenses;
    }
  
    async delete(id) {
      delete this.expenses[id.id];
    }
  }
  
const InMemoryExpenseModel = new _InMemoryExpenseModel();

InMemoryExpenseModel.create({ currency: 'USD', amount: 1.99, category: 'Groceries', description: 'Aples' });

export default InMemoryExpenseModel;
