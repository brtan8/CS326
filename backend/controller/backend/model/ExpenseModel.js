import { Sequelize, DataTypes } from "sequelize";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "database.sqlite",
});

const Expense = sequelize.define("Expense", {
  userId: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  currency: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  date: { // Add the date field
    type: DataTypes.DATE,
    allowNull: true, // Or false if you want to enforce it
  },
});

class _SQLiteExpenseModel {
  constructor() {}

  async init(fresh = false) {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (fresh) {
      //await this.delete();

      await this.create({
        currency: 'USD',
        amount: 1,
        category: 'Groceries',
        description: 'apples',
        date: today
      });

      await this.create({
        currency: 'USD',
        amount: 2.00,
        category: 'Groceries',
        description: 'banana',
        date: yesterday
      });
    }
  }

  async create(expense) {
    return await Expense.create(expense);
  }

  async read(id = null) {
    if (id) {
      return await Expense.findByPk(id);
    }
    return await Expense.findAll();
  }

  async delete(expense) {
    console.log(expense.userId);
    await Expense.destroy({ where: { userId: expense.id } });
    return expense;
  }
}

const SQLiteExpenseModel = new _SQLiteExpenseModel();

export default SQLiteExpenseModel;