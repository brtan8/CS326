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
});

class _SQLiteExpenseModel {
  constructor() {}

  async init(fresh = false) {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });

    if (fresh) {
      //await this.delete();

      await this.create({
        currency: 'USD',
        amount: 1,
        category: 'Groceries',
        description: 'apples'
      });

      await this.create({
        currency: 'USD',
        amount: 2.00,
        category: 'Groceries',
        description: 'banana'
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
