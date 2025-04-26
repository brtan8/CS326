class _InMemoryGraphModel {
    constructor() {
        this.expenses = {};
        this.expenseId = 1;
    }
  
    async create(expenseData) {
        const newExpense = { id: this.expenseId++, ...expenseData };
        this.expenses[newExpense.id] = newExpense;
        return newExpense;
    }
  
    async read(id = null) {
        if (id) {
            return this.expenses[id];
        }
        return Object.values(this.expenses);
    }
   }
  
const InMemoryGraphModel = new _InMemoryGraphModel();
// Initial data from GraphData.json
InMemoryGraphModel.create({
    currency: "USD",
    amount: 30.00,
    category: "Work",
    description: "Mowed Lawn",
    time: "4/12/2025",
});
InMemoryGraphModel.create({
    currency: "USD",
    amount: 20.00,
    category: "Food",
    description: "Lunch at cafe",
    time: "4/10/2025",
});
   InMemoryGraphModel.create({
    currency: "USD",
    amount: 100.00,
    category: "Rent",
    description: "Room Rent",
    time: "4/01/2025",
   });
   InMemoryGraphModel.create({
    currency: "USD",
    amount: 15.00,
    category: "Transport",
    description: "Bus pass",
    time: "4/11/2025",
   });
   InMemoryGraphModel.create({
    currency: "USD",
    amount: 60.00,
    category: "Groceries",
    description: "Weekly grocery",
    time: "4/08/2025",
   });
   InMemoryGraphModel.create({
    currency: "USD",
    amount: 35.00,
    category: "Work",
    description: "Yard Cleanup",
    time: "4/05/2025",
   });
   InMemoryGraphModel.create({
    currency: "USD",
    amount: 22.50,
    category: "Food",
    description: "Dinner takeout",
    time: "4/04/2025",
   });
   InMemoryGraphModel.create({
    currency: "USD",
    amount: 18.00,
    category: "Transport",
    description: "Uber ride",
    time: "4/06/2025",
   });
   InMemoryGraphModel.create({
    currency: "USD",
    amount: 40.00,
    category: "Entertainment",
    description: "Movie night",
    time: "4/03/2025",
   });
   InMemoryGraphModel.create({
    currency: "USD",
    amount: 10.00,
    category: "Utilities",
    description: "Internet bill",
    time: "4/02/2025",
   });
    InMemoryGraphModel.create({
    currency: "USD",
    amount: 12.00,
    category: "Utilities",
    description: "Internet bill",
    time: "3/22/2025",
   });
    InMemoryGraphModel.create({
    currency: "USD",
    amount: 12.00,
    category: "Utilities",
    description: "Internet bill",
    time: "3/22/2025",
   });
     InMemoryGraphModel.create({
    currency: "USD",
    amount: 12.00,
    category: "Transport",
    description: "Internet bill",
    time: "3/27/2025",
   });
      InMemoryGraphModel.create({
    currency: "USD",
    amount: 17.00,
    category: "Entertainment",
    description: "Transport",
    time: "3/26/2025",
   });
       InMemoryGraphModel.create({
    currency: "USD",
    amount: 14.00,
    category: "Work",
    description: "Pen",
    time: "3/21/2025",
   });
        InMemoryGraphModel.create({
    currency: "USD",
    amount: 9.00,
    category: "Utilities",
    description: "Solar",
    time: "3/24/2025",
   });
         InMemoryGraphModel.create({
    currency: "USD",
    amount: 2.00,
    category: "Food",
    description: "Water",
    time: "3/23/2025",
   });
          InMemoryGraphModel.create({
    currency: "USD",
    amount: 30.00,
    category: "Work",
    description: "Mowed Lawn",
    time: "4/21/2025",
   });
           InMemoryGraphModel.create({
    currency: "USD",
    amount: 30.00,
    category: "Work",
    description: "Stuff",
    time: "4/24/2025",
   });
            InMemoryGraphModel.create({
    currency: "USD",
    amount: 24.00,
    category: "Entertainment",
    description: "Mowed Lawn",
    time: "4/19/2025",
   });
             InMemoryGraphModel.create({
    currency: "USD",
    amount: 15.00,
    category: "Transport",
    description: "Train",
    time: "4/18/2025",
   });
              InMemoryGraphModel.create({
    currency: "USD",
    amount: 12.00,
    category: "Transport",
    description: "Uber",
    time: "4/23/2025",
   });
  
export default InMemoryGraphModel;
  