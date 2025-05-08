import { Sequelize, DataTypes } from "sequelize";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "graph_database.sqlite", // Separate database for graphs
});

const Graph = sequelize.define("Graph", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fileName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

class _SQLiteGraphModel {
  async init() {
    await sequelize.authenticate();
    await sequelize.sync();
  }

  async create(graphData) {
    return await Graph.create(graphData);
  }

  async read(where = {}) {
    return await Graph.findAll({ where });
  }

  async delete(where) {
    return await Graph.destroy({ where });
  }
}

const SQLiteGraphModel = new _SQLiteGraphModel();
export default SQLiteGraphModel;